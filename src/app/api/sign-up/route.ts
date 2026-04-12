import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/models/user";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { ApiError } from "@/types/ApiError";
import { hashPassword } from "@/lib/bcrypt";
import { createOTP } from "@/lib/otp";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return ApiError.badRequest("All fields are required").toResponse();
        }

        const existingUser = await Usermodel.findOne({ email });

        if (existingUser?.isVerified) {
            return ApiError.conflict(
                "User already exists. Please log in."
            ).toResponse();
        }

        const now = new Date();

        if (existingUser) {
            const lastSent = existingUser.otpLastSentAt;
            const resendCount = existingUser.otpResendCount || 0;

            if (lastSent && now.getTime() - lastSent.getTime() < 60 * 1000) {
                return ApiError.tooManyRequests("Wait before requesting OTP again").toResponse();
            }

            if (resendCount >= 5) {
                return ApiError.tooManyRequests("Max OTP attempts reached").toResponse();
            }
        }

        const hashedPassword = await hashPassword(password);
        const { otp, hashedOTP, otpExpiry } = createOTP();

        if (existingUser) {
            existingUser.name = name;
            existingUser.password = hashedPassword;
            existingUser.otp = hashedOTP;
            existingUser.otpExpiry = otpExpiry;
            existingUser.otpResendCount = (existingUser.otpResendCount || 0) + 1;
            existingUser.otpLastSentAt = now;

            await existingUser.save();
        } else {
            const newUser = new Usermodel({
                name,
                email,
                password: hashedPassword,
                otp: hashedOTP,
                otpExpiry,
                otpResendCount: 1,
                otpLastSentAt: now,
                isVerified: false,
                role: "user",
            });

            await newUser.save();
        }

        const sendEmail = await sendVerificationEmail(name, email, otp);

        if (!sendEmail.success) {
            return ApiError.internal("Failed to send email").toResponse();
        }

        return ApiResponse.ok(undefined, "OTP sent successfully").toResponse();

    } catch (error) {
        console.error(error);
        return ApiError.internal("Something went wrong").toResponse();
    }
}
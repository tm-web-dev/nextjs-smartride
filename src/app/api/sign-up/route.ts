import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/models/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { ApiError } from "@/types/ApiError";
import { hashPassword } from "@/lib/bcrypt";
import { createOTP } from "@/lib/otp";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request:Request){
    await dbConnect();
    try {
        const {name, email, password} = await request.json()

        const existingUserCheck = await Usermodel.findOne({
            email,
        })

        if (existingUserCheck){
            if (existingUserCheck.isVerified) {
                return ApiError.conflict("User with this email already exist. Please log in instead.").toResponse()
            } else {
            const { otp, hashedOTP, otpExpiry } = createOTP()

            existingUserCheck.otp = hashedOTP
            existingUserCheck.otpExpiry = otpExpiry
            await existingUserCheck.save()
            const sendEmail = await sendVerificationEmail(name, email, otp)

            if (!sendEmail.success){
                console.error("Failed to send verification email:", sendEmail);
                return ApiError.internal("Failed to send verification email. Please try again later.").toResponse()
             } else {
                return ApiResponse.ok(null, "User registered successfully. Please check your email for the OTP to verify your account.").toResponse()
             }
            }

        }else {
            const hashedPassword = hashPassword(password)
            const { otp, hashedOTP, otpExpiry } = createOTP()

            const newUser = new Usermodel({
                name,
                email,
                password: hashedPassword,
                otp: hashedOTP,
                otpExpiry,
                isVerified: false,
                role: "user",
            })

            newUser.save()

            const sendEmail = await sendVerificationEmail(name, email, otp)

            if (!sendEmail.success){
                console.error("Failed to send verification email:", sendEmail);
                return ApiError.internal("Failed to send verification email. Please try again later.").toResponse()
             } else {
                return ApiResponse.ok(null, "User registered successfully. Please check your email for the OTP to verify your account.").toResponse()
             }
            }

        }
        
     catch (error) {
        console.error("Error in sign-up route:", error);
        return ApiError.badRequest("An error occurred during sign-up. Please try again later.").toResponse();
    }
}
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Usermodel from "@/models/user";
import { ApiError } from "@/types/ApiError";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, otp } = await request.json();

    const user = await Usermodel.findOne({ email });

    if (!user) {
      return ApiError.notFound("User not found").toResponse();
    }

    if (user.isVerified) {
      return ApiError.badRequest("User already verified").toResponse();
    }


    const isCodeExpired =
      user.otpExpiry && user.otpExpiry < new Date();

    if (isCodeExpired) {
      return ApiError.badRequest("OTP expired").toResponse();
    }


    const hashedIncomingOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const isCodeValid = user.otp === hashedIncomingOTP;

    if (!isCodeValid) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;

  
      if (user.otpAttempts >= 5) {
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.otpAttempts = 0;

        await user.save();

        return ApiError.tooManyRequests(
          "Too many failed attempts, Signup again to request new OTP"
        ).toResponse();
      }

      await user.save();

      return ApiError.badRequest("Invalid OTP").toResponse();
    }

 
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpAttempts = 0;

    await user.save();

    return ApiResponse.created(
      user,
      "Account verified successfully"
    ).toResponse();

  } catch (error) {
    return ApiError.internal("Error verifying user").toResponse();
  }
}
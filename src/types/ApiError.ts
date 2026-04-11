import { NextResponse } from "next/server";

export interface IApiError {
  success: boolean;
  message: string;
  statusCode: number;
  errors?: any[]; // For things like multiple field validation errors
}

export class ApiError implements IApiError {
  public success: boolean = false;

  constructor(
    public statusCode: number,
    public message: string,
    public errors: any[] = []
  ) {}
  toResponse() {
    return NextResponse.json(
      {
        success: this.success,
        message: this.message,
        errors: this.errors,
      },
      { status: this.statusCode } // ✅ uses internal value
    );
  }
  // 400 - Validation errors or missing fields
  static badRequest(message: string = "Bad Request", errors: any[] = []): ApiError {
    return new ApiError(400, message, errors);
  }

  // 401 - Invalid OTP or missing token
  static unauthorized(message: string = "Unauthorized access"): ApiError {
    return new ApiError(401, message);
  }

  // 403 - User is logged in but doesn't have permission (e.g. not an admin)
  static forbidden(message: string = "Permission denied"): ApiError {
    return new ApiError(403, message);
  }

  // 404 - Course or User not found
  static notFound(message: string = "The requested resource was not found"): ApiError {
    return new ApiError(404, message);
  }

  // 429 - Too many requests (Stop users from spamming OTPs)
  static tooManyRequests(message: string = "Too many attempts. Please try again later."): ApiError {
    return new ApiError(429, message);
  }

  // 500 - Database or Server crash
  static internal(message: string = "Internal Server Error", err: any = null): ApiError {
    const errorDetails = err instanceof Error ? [err.message] : [];
    return new ApiError(500, message, errorDetails);
  }

   // 409 - Already exist
  static conflict(message: string = "Already exist"): ApiError {
    return new ApiError(409, message);
  }
}
import { NextResponse } from "next/server";

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
}

export class ApiResponse<T> implements IApiResponse<T> {
  public success: boolean = true;

  constructor(
    public statusCode: number,
    public message: string,
    public data?: T
  ) {}
toResponse() {
    return NextResponse.json(
      {
        success: this.success,
        message: this.message,
        errors: this.data,
      },
      { status: this.statusCode } // ✅ uses internal value
    );
  }
  // Standard 200 OK
  static ok<T>(data: T, message: string = "Success"): ApiResponse<T> {
    return new ApiResponse(200, message, data);
  }

  // Standard 201 Created (Perfect for OTPs and user registration)
  static created<T>(data: T, message: string = "Resource created successfully"): ApiResponse<T> {
    return new ApiResponse(201, message, data);
  }
}
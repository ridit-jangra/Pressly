import { NextRequest, NextResponse } from "next/server";
import { sendOTP } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP required" },
        { status: 400 }
      );
    }

    await sendOTP(email, otp);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API OTP send error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

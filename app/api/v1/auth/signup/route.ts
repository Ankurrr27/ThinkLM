import { NextRequest, NextResponse } from "next/server";
import { signupService } from "@/lib/server/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    const result = await signupService(name, email, password);

    return NextResponse.json(
      { success: true, data: result },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Signup failed" },
      { status: 400 }
    );
  }
}

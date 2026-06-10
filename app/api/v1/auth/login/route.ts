import { NextRequest, NextResponse } from "next/server";
import { loginService } from "@/lib/server/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const result = await loginService(email, password);

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Login failed" },
      { status: 400 }
    );
  }
}

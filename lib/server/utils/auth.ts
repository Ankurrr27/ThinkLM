import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getAuthUserId = (req: NextRequest): string | null => {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    
    if (!process.env.JWT_SECRET) return null;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    return decoded.userId;
  } catch (error) {
    return null;
  }
};

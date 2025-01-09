import dotenv from "dotenv";
dotenv.config();
import JWT, { JwtPayload } from "jsonwebtoken";

const { sign, verify } = JWT;

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
  throw new Error("JWT_SECRET is not defined in the .env file");
}

export function generateToken(payload: Record<string, any>): string {
  if (!secretKey)
    throw new Error("JWT_SECRET is not defined in the .env file");
  return sign(payload, secretKey, { expiresIn: "1h" });
}

export function generateResetToken(payload: Record<string, any>): string {
  if (!secretKey)
    throw new Error("JWT_SECRET is not defined in the .env file");
  return sign(payload, secretKey, { expiresIn: "15m" });
}

export function verifyToken(token: string): JwtPayload | string | null {
  try {
    if (!secretKey)
      throw new Error("JWT_SECRET is not defined in the .env file");
    return verify(token, secretKey);
  } catch (error: any) {
    console.error("Invalid token:", error.message);
    return null;
  }
}

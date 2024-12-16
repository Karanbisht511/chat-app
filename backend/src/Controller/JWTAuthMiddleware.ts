import { verifyToken } from "../Utils/JWTFunctions";
import { NextFunction, Request, Response } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Token missing" });
      return; // Ensure no further execution after sending the response
    }

    const decoded = verifyToken(token);
    req.body.tokenDecoded = decoded; // Attach decoded token to request
    next(); // Pass control to the next middleware or handler
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
    return; // Ensure no further execution after sending the response
  }
};

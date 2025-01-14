"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.generateResetToken = generateResetToken;
exports.verifyToken = verifyToken;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { sign, verify } = jsonwebtoken_1.default;
const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in the .env file");
}
function generateToken(payload) {
    if (!secretKey)
        throw new Error("JWT_SECRET is not defined in the .env file");
    return sign(payload, secretKey, { expiresIn: "1h" });
}
function generateResetToken(payload) {
    if (!secretKey)
        throw new Error("JWT_SECRET is not defined in the .env file");
    return sign(payload, secretKey, { expiresIn: "15m" });
}
function verifyToken(token) {
    try {
        if (!secretKey)
            throw new Error("JWT_SECRET is not defined in the .env file");
        return verify(token, secretKey);
    }
    catch (error) {
        console.error("Invalid token:", error.message);
        return null;
    }
}

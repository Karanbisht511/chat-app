"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const JWTFunctions_1 = require("../Utils/JWTFunctions");
const isAuthenticated = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Token missing" });
            return; // Ensure no further execution after sending the response
        }
        const decoded = (0, JWTFunctions_1.verifyToken)(token);
        req.body.tokenDecoded = decoded; // Attach decoded token to request
        next(); // Pass control to the next middleware or handler
    }
    catch (error) {
        res.status(401).json({ message: "Invalid Token" });
        return; // Ensure no further execution after sending the response
    }
};
exports.isAuthenticated = isAuthenticated;

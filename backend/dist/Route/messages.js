"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWTAuthMiddleware_1 = require("../Controller/JWTAuthMiddleware");
const router = express_1.default.Router();
const messages_1 = require("../Controller/messages");
const user_1 = require("../Controller/user");
router.post("/uploadFile", JWTAuthMiddleware_1.isAuthenticated, messages_1.upload.single("file"), messages_1.uploadFile);
router.get("/download/:fileName", JWTAuthMiddleware_1.isAuthenticated, messages_1.downloadFile);
router.get("/image/:image", JWTAuthMiddleware_1.isAuthenticated, user_1.getImage);
exports.default = router;

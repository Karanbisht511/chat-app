"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWTAuthMiddleware_1 = require("../Controller/JWTAuthMiddleware");
const router = express_1.default.Router();
const friend_1 = require("../Controller/friend");
router.post("/addFriend", JWTAuthMiddleware_1.isAuthenticated, friend_1.addFriend);
router.post("/deleteFriend", JWTAuthMiddleware_1.isAuthenticated, friend_1.deleteFriend);
router.get("/getFriend", JWTAuthMiddleware_1.isAuthenticated, friend_1.getFriend);
exports.default = router;

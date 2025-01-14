"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const JWTAuthMiddleware_1 = require("../Controller/JWTAuthMiddleware");
const router = express_1.default.Router();
const user_1 = require("../Controller/user");
router.post("/login", user_1.login);
router.post("/signup", user_1.signup);
router.get("/logout", user_1.logout);
router.post('/forgotPassword', user_1.forgotPassword);
router.post('/resetPassword', JWTAuthMiddleware_1.isAuthenticated, user_1.resetPassword);
router.get("/dashboard", JWTAuthMiddleware_1.isAuthenticated, user_1.userDashboard);
router.post('/placeMessages', JWTAuthMiddleware_1.isAuthenticated, user_1.placeUnreadMsgs);
router.get('/pushMessages', JWTAuthMiddleware_1.isAuthenticated, user_1.pushUnreadMsgs);
router.post('/getChats', JWTAuthMiddleware_1.isAuthenticated, user_1.getChats);
router.get('/getGroupChats', JWTAuthMiddleware_1.isAuthenticated, user_1.getGroupChats);
module.exports = router;

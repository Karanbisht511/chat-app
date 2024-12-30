import express from "express";
import { isAuthenticated } from '../Controller/JWTAuthMiddleware'
const router = express.Router();

import { login, signup, logout, userDashboard, placeUnreadMsgs, pushUnreadMsgs,getChats,getGroupChats } from "../Controller/user";

router.post("/login", login);
router.post("/signup", signup);
router.get("/logout", logout);
router.get("/dashboard", isAuthenticated, userDashboard);
router.post('/placeMessages', isAuthenticated, placeUnreadMsgs)
router.get('/pushMessages', isAuthenticated, pushUnreadMsgs)
router.post('/getChats',isAuthenticated,getChats)
router.get('/getGroupChats',isAuthenticated,getGroupChats)

export = router;

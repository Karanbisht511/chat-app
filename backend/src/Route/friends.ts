import express from "express";
import { isAuthenticated } from '../Controller/JWTAuthMiddleware'

const router = express.Router();

import { addFriend, deleteFriend, getFriend } from "../Controller/friend";

router.post("/addFriend", isAuthenticated, addFriend);
router.post("/deleteFriend", isAuthenticated, deleteFriend);
router.get("/getFriend", isAuthenticated, getFriend);

export default router;

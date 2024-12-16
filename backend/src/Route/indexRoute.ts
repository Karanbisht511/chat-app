import express from "express";
import userRoute from "./user";
import friendRoute from './friends'
import groupRoute from './group'

const router = express.Router();
console.log("reached here");
router.use("/users", userRoute);
router.use("/friends", friendRoute)
router.use("/group", groupRoute)

export default router;
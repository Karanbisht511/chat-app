import express from "express";
import userRoute from "./user";
import friendRoute from "./friends";
import groupRoute from "./group";
import messageRoute from "./messages";
// import ioHandler from "../socket/handleSocket";

const router = express.Router();
console.log("reached here");
router.use("/users", userRoute);
router.use("/friends", friendRoute);
router.use("/group", groupRoute);
router.use("/messages", messageRoute);
// router.use("/socketio", ioHandler);

export default router;

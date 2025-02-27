"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./user"));
const friends_1 = __importDefault(require("./friends"));
const group_1 = __importDefault(require("./group"));
const messages_1 = __importDefault(require("./messages"));
// import { executeSocket } from "../socket/handleSocket";
const router = express_1.default.Router();
console.log("reached here");
router.use("/users", user_1.default);
router.use("/friends", friends_1.default);
router.use("/group", group_1.default);
router.use("/messages", messages_1.default);
// router.use("/socketio", executeSocket);
exports.default = router;

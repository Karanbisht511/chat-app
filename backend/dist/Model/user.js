"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number, required: true },
    active: { type: Boolean, required: true, default: false },
    groups: { type: Array, required: false },
    profilePic: { type: String, required: false },
});
exports.User = (0, mongoose_1.model)("User", userSchema);

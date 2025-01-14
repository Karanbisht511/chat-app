"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = exports.UserMsg = void 0;
const mongoose_1 = require("mongoose");
const NDmsg = new mongoose_1.Schema({
    sender: { type: String, required: true },
    nonDeliveredMsg: [{ type: String, required: true }]
});
const messagesSchema = new mongoose_1.Schema({
    index: { type: String },
    messageArray: { type: (Array) }
});
const usermsgSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    nonDelMsg: [NDmsg],
});
exports.UserMsg = (0, mongoose_1.model)("userMsg", usermsgSchema);
exports.Messages = (0, mongoose_1.model)('messages', messagesSchema);

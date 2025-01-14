"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Friends = void 0;
const mongoose_1 = require("mongoose");
const friendsSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    friendList: [{ type: String }]
});
exports.Friends = (0, mongoose_1.model)("Friends", friendsSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const mongoose_1 = require("mongoose");
const groupsSchema = new mongoose_1.Schema({
    admin: { type: String, required: true },
    groupName: { type: String, required: true },
    groupParticipants: [{ type: String }]
});
exports.Group = (0, mongoose_1.model)("groups", groupsSchema);

import { Schema, Document, model } from "mongoose";

export interface iGroups extends Document {
    admin: string;
    groupName: string;
    groupParticipants: Array<string>
}

const groupsSchema = new Schema({
    admin: { type: String, required: true },
    groupName: { type: String, required: true },
    groupParticipants: [{ type: String }]
});

export const Group = model<iGroups>("groups", groupsSchema);

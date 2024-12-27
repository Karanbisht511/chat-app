import { Schema, Document, model } from "mongoose";

export interface friends extends Document {
  me: string;
  user: Array<string>
}

const friendsSchema = new Schema({
  username: { type: String, required: true },
  friendList: [{ type: String }]
});

export const Friends = model<friends>("Friends", friendsSchema);
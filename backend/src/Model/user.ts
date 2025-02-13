import { required } from "joi";
import { Schema, Document, model } from "mongoose";

interface iUser extends Document {
  username: string;
  passwordHash: string;
  email: string;
  mobile: Number;
  active: Boolean;
  groups?: Array<string>;
  profilePic?: string;
}

const userSchema = new Schema({
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: Number, required: true },
  active: { type: Boolean, required: true, default: false },
  groups: { type: Array, required: false },
  profilePic: { type: String, required: false },
});

export const User = model<iUser>("User", userSchema);

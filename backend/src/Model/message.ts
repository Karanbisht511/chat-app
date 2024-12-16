import { Schema, Document, model } from "mongoose";

export interface userMsg extends Document {
    username: string;
    nonDelMsg: [{ sender: string, nonDeliveredMsg: Array<string> }]
}

const NDmsg = new Schema({
    sender: { type: String, required: true },
    nonDeliveredMsg: [{ type: String, required: true }]
})

const usermsgSchema = new Schema({
    username: { type: String, required: true },
    nonDelMsg: [NDmsg]
});

export const UserMsg = model<userMsg>("userMsg", usermsgSchema);

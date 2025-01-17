import { Schema, Document, model } from "mongoose";

export interface Message {
  timeStamp: Date;
  msg?: string;
  msgBy?: string;
  isFile?: boolean;
  fileMetaData?:IfileMetaData;
}

export interface IfileMetaData{
    fileName:string;
    fileType:string;
}

export interface IMessages extends Document {
  index: string;
  messageArray: [Message];
}

export interface userMsg extends Document {
  username: string;
  nonDelMsg: [{ sender: string; nonDeliveredMsg: Array<string> }];
}

const NDmsg = new Schema({
  sender: { type: String, required: true },
  nonDeliveredMsg: [{ type: String, required: true }],
});

const messagesSchema = new Schema({
  index: { type: String },
  messageArray: { type: Array<Message> },
});

const usermsgSchema = new Schema({
  username: { type: String, required: true },
  nonDelMsg: [NDmsg],
});

export const UserMsg = model<userMsg>("userMsg", usermsgSchema);
export const Messages = model<IMessages>("messages", messagesSchema);

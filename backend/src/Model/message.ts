import { Schema, Document, model } from "mongoose";

export interface IMessages extends Document {
    index: string,
    messageArray: [{timeStamp: Date,msgs:string}]
}


export interface userMsg extends Document {
    username: string;
    nonDelMsg: [{ sender: string, nonDeliveredMsg: Array<string> }]
}

const NDmsg = new Schema({
    sender: { type: String, required: true },
    nonDeliveredMsg: [{ type: String, required: true }]
})

const messagesSchema = new Schema({
    index:{type:String},
    messageArray:{type:Array<{timestamp:Date,msg:string}>}
})

const usermsgSchema = new Schema({
    username: { type: String, required: true },
    nonDelMsg: [NDmsg],
});

export const UserMsg = model<userMsg>("userMsg", usermsgSchema);
export const Messages= model<IMessages>('messages',messagesSchema)

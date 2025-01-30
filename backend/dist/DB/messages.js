"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMessageToDB = void 0;
const message_1 = require("../Model/message");
const saveMessageToDB = (index, message, sender, isFile, fileMetaData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('index,message,sender ', index, message, sender);
    try {
        const indexExist = yield message_1.Messages.find({ index });
        console.log("indexExist:", indexExist);
        console.log('metadata:', fileMetaData);
        if (indexExist.length === 0 || JSON.stringify(index.length) === '[]') {
            console.log('--index dont exist');
            const saveNew = new message_1.Messages({
                index,
                messageArray: [{ "timeStamp": new Date(), "msg": message, "msgBy": sender, isFile, fileMetaData }]
            });
            saveNew.save();
            return;
        }
        console.log('----indexExist-----');
        yield message_1.Messages.findOneAndUpdate({ index }, { '$push': { 'messageArray': { timeStamp: new Date(), msg: message, msgBy: sender, isFile, fileMetaData } } });
        return;
    }
    catch (error) {
        console.log('error:', error);
    }
});
exports.saveMessageToDB = saveMessageToDB;

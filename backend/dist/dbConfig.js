"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = connectMongo;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const uri = process.env.MONGO_URI;
function connectMongo() {
    try {
        if (!uri)
            throw new Error("mongo uri is not defined in the .env file");
        mongoose_1.default.connect(uri);
        console.log("Mongodb connected");
    }
    catch (error) {
        console.log(error.message);
    }
}

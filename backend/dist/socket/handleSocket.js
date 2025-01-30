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
exports.runSockets = void 0;
const socket_io_1 = require("socket.io");
const index_1 = require("../index");
const user_1 = require("../Model/user");
const message_1 = require("../Model/message");
const messages_1 = require("../DB/messages");
const runSockets = () => {
    try {
        const io = new socket_io_1.Server(index_1.server, {
            cors: {
                origin: "*", // Allow all origins (use '*' for open access or specify specific origins)
                methods: ["GET", "POST"], // Allow only these HTTP methods
                allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
                credentials: true, // Allow credentials (cookies, authorization headers)
            },
        });
        let liveUsers = new Map();
        let currentUser;
        io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("socketId:", socket.id);
            socket.on("chat message", (data) => __awaiter(void 0, void 0, void 0, function* () {
                console.log("---------chat message-----------");
                console.log("liveUsers:", liveUsers);
                const { message, from, toSend, isGroup } = data;
                console.log("chat message listener");
                currentUser = from;
                // console.log("data:", JSON.stringify(data));
                if (isGroup) {
                    console.log("group chat message");
                    io.to(toSend).emit("--receive message--", { message, from });
                }
                else {
                    //    one2one chat
                    console.log("one to one chat message");
                    const receiverSocket = liveUsers.get(toSend);
                    console.log("Receiver socket found:", receiverSocket);
                    if (receiverSocket) {
                        console.log(`Emitting to socket: ${receiverSocket}`);
                        const data = { message, from };
                        console.log("data:", data);
                        io.to(receiverSocket).emit("--receive message--", {
                            message,
                            from,
                        });
                    }
                    else {
                        console.log(`No active socket found for user: ${toSend}`);
                    }
                    yield (0, messages_1.saveMessageToDB)(`${from}to${toSend}`, message, from);
                }
            }));
            socket.on("file transfer", (file_1, _a) => __awaiter(void 0, [file_1, _a], void 0, function* (file, { username, toSend }) {
                console.log("file:", file);
                console.log("current user:", username);
                let from = username;
                let message = file;
                yield (0, messages_1.saveMessageToDB)(`${from}to${toSend}`, message, from);
            }));
            socket.on("When user login", (user) => __awaiter(void 0, void 0, void 0, function* () {
                console.log("----------When user login------");
                console.log("Received username:", user);
                try {
                    // Map the user to their socket ID
                    console.log(`user:socket.id ${user}:${socket.id}`);
                    liveUsers.set(user, socket.id);
                    console.log("liveUsers:", liveUsers);
                    // Validate in DB if the user already exists or fetch active users
                    currentUser = user;
                    // Make the user status active
                    yield user_1.User.findOneAndUpdate({ username: user }, { active: true });
                    //get the active user list
                    const activeUsers = yield user_1.User.find({ active: true });
                    if (activeUsers.length === 0) {
                        console.log("No active users found in the database.");
                    }
                    else {
                        // console.log('Active users:', activeUsers);
                    }
                    // push active users to live users
                    io.emit("active users", activeUsers);
                    const unreadMsgs = yield message_1.UserMsg.findOne({ username: user });
                    // console.log('undelivered messages:', unreadMsgs);
                    io.to(liveUsers.get(user)).emit("undelivered messages", {
                        message: unreadMsgs,
                    });
                }
                catch (error) {
                    console.error("Error during database operation:", error);
                    // Optionally, emit an error to the client
                    io.to(socket.id).emit("error", {
                        message: "Failed to register user. Please try again.",
                    });
                }
            }));
            socket.on("join-room", (room) => {
                socket.join(room);
                console.log(`${socket.id} joined group:${room}`);
            });
            socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
                console.log("--------disconnect event--------");
                try {
                    console.log("current User:", currentUser);
                    if (currentUser) {
                        console.log(yield user_1.User.findOneAndUpdate({ username: currentUser }, { active: false }));
                        console.log("user disconnected");
                        let activeUser = yield user_1.User.find({ active: true });
                        // console.log('active user:', activeUser);
                        io.emit("active users", activeUser);
                    }
                }
                catch (error) {
                    console.error("Error disconnect:", error);
                }
            }));
        }));
    }
    catch (error) {
        console.error("Error adding record:", error);
    }
};
exports.runSockets = runSockets;

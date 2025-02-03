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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupChats = exports.getChats = exports.placeUnreadMsgs = exports.pushUnreadMsgs = exports.userDashboard = exports.resetPassword = exports.forgotPassword = exports.logout = exports.signup = exports.login = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const JWTFunctions_1 = require("../Utils/JWTFunctions");
const user_1 = require("../Model/user");
const friend_1 = require("../Model/friend");
const message_1 = require("../Model/message");
const message_2 = require("../Model/message");
const emailService_1 = require("../Utils/emailService");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("login");
        const { username, password } = req.body;
        console.log("username:", username);
        const result = yield user_1.User.findOne({ username });
        if (!result) {
            res.status(400).json({ message: "Invalid User Credentials!" });
        }
        else if (result) {
            yield user_1.User.findOneAndUpdate({ username }, { active: true });
            console.log(result);
            const { _id } = result;
            const userPayload = { userId: _id };
            const { passwordHash } = result;
            bcryptjs_1.default.compare(password, passwordHash, function (err, isEqual) {
                if (err) {
                    console.log("error:" + err);
                }
                if (isEqual) {
                    const token = (0, JWTFunctions_1.generateToken)(userPayload);
                    // delete result["passwordHash"];
                    res.status(200).json({
                        success: true,
                        isUserAuthenticated: true,
                        username,
                        token,
                        userInfo: {
                            username: result === null || result === void 0 ? void 0 : result.username,
                            mobile: result === null || result === void 0 ? void 0 : result.mobile,
                            email: result === null || result === void 0 ? void 0 : result.email,
                        },
                    });
                }
                else {
                    res.status(400).json({
                        success: true,
                        isUserAuthenticated: false,
                        message: "Invalid User Credentials!",
                    });
                }
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            isUserAuthenticated: false,
            message: "Sorry unable to connect to system!",
        });
    }
});
exports.login = login;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        console.log("signup");
        const { username, password, email, mobile } = req.body;
        const saltRounds = 10;
        const existingUser = yield user_1.User.findOne({ email });
        if (existingUser) {
            console.log("Existing user");
            res.status(400).json({ message: "Email already in use" });
        }
        else {
            bcryptjs_1.default.hash(password, saltRounds, function (err, passwordHash) {
                if (err) {
                    console.log("error:" + err);
                }
                const newUser = new user_1.User({
                    username,
                    passwordHash,
                    email,
                    mobile,
                    groups: [],
                });
                newUser.save();
                res.status(200).send("Signup Successfull");
            });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Some issue occured" + error.message);
    }
});
exports.signup = signup;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: "logout successfully" });
    }
    catch (error) {
        res.status(400).json({ message: `${error.message}` });
    }
});
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email } = req.body;
        //1-> check Validations
        if (!username || !email) {
            res.status(400).json({
                devMessage: "Bad Request",
            });
            return;
        }
        // 2->Check the user details in DB
        const userExist = yield user_1.User.findOne({ username, email });
        console.log("userExist:", userExist);
        if (!userExist) {
            res.status(404).json({ message: "Not Found" });
        }
        //if details are fine
        // 3-> generate a time-bound token and return
        const { _id } = userExist;
        const token = (0, JWTFunctions_1.generateResetToken)({ _id });
        console.log("token:", token);
        //4->Send reset mail
        const clienturl = process.env.clientURL;
        yield (0, emailService_1.send)(email, "reset Password", "Try reset your password", `<h1>reset your password using this link: ${clienturl}resetPassword/${token}</h1>`);
        res.status(200).send({ message: "Reset mail is sent" });
    }
    catch (error) {
        res.status(500).json({
            message: `internal server error: ${error}`,
        });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        console.log("username:password:", username, password);
        //1-> check Validations
        if (!username || !password) {
            res.status(400).json({
                devMessage: "Bad Request",
            });
            return;
        }
        const saltRounds = 10;
        bcryptjs_1.default.hash(password, saltRounds, function (err, passwordHash) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log("error:" + err);
                }
                yield user_1.User.findOneAndUpdate({ username }, { passwordHash: passwordHash });
                res.status(200).send({ message: "Password reset successfully" });
            });
        });
    }
    catch (error) {
        res.status(500).json({
            message: "internal server error",
        });
    }
});
exports.resetPassword = resetPassword;
const userDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.query;
        console.log("username:", username);
        const result = yield friend_1.Friends.findOne({ username: username });
        // console.log('friendList:',result.friendList);
        console.log("results:", result);
        const groups = yield user_1.User.findOne({ username }).select("groups");
        console.log("groups:", groups);
        const users = yield user_1.User.find();
        let activeUser = yield user_1.User.find({ active: true });
        res.status(200).json({
            friendList: result ? result.friendList : [],
            activeUser: activeUser ? activeUser.map((e) => e.username) : [],
            users: users
                ? users.map((e) => {
                    if (e.username !== username)
                        return e.username;
                })
                : [],
            groups: groups ? groups.groups : [],
        });
    }
    catch (error) {
        res.status(500).json({
            message: `${error}`,
        });
    }
});
exports.userDashboard = userDashboard;
const pushUnreadMsgs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.query;
        const unreadMsgs = yield message_1.UserMsg.findOne({ username });
        if (unreadMsgs.nonDelMsg.length < 0) {
            res.status(404).json({
                devMessage: "No-unread messages",
            });
        }
        res.status(200).json({
            messages: unreadMsgs.nonDelMsg,
        });
    }
    catch (error) {
        res.status(500).json({
            message: `${error}`,
        });
    }
});
exports.pushUnreadMsgs = pushUnreadMsgs;
const placeUnreadMsgs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.query;
        const { sender, msg } = req.body;
        const userExist = yield message_1.UserMsg.findOne({ username });
        if (!userExist) {
            const newUser = new message_1.UserMsg({
                username,
                nonDelMsg: {
                    sender,
                    nonDeliveredMsg: [msg],
                },
            });
            newUser.save();
        }
        if (userExist) {
            if (userExist === null || userExist === void 0 ? void 0 : userExist.nonDelMsg.find((e) => e.sender === sender)) {
                console.log("found sender");
                const result = yield message_1.UserMsg.findOneAndUpdate({ username, "nonDelMsg.sender": sender }, { $push: { "nonDelMsg.$.nonDeliveredMsg": msg } });
                console.log("result:", JSON.stringify(result));
            }
            else {
                yield message_1.UserMsg.findOneAndUpdate({ username }, { $push: { nonDelMsg: { sender, nonDeliveredMsg: msg } } });
            }
        }
        res.status(200).json({
            messages: "message placed",
        });
    }
    catch (error) {
        res.status(500).json({
            message: `${error}`,
        });
    }
});
exports.placeUnreadMsgs = placeUnreadMsgs;
const getChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const { username } = req.query;
        const { friend } = req.body;
        console.log("username: ", username);
        if (!username || !friend) {
            res.status(400).json({
                devMessage: "Bad Request",
            });
            return;
        }
        const index1 = `${username}to${friend}`;
        const index2 = `${friend}to${username}`;
        const index1Msgs = yield message_2.Messages.find({ index: index1 }).sort({
            "messageArray.timeStamp": 1,
        });
        const index2Msgs = yield message_2.Messages.find({ index: index2 }).sort({
            "messageArray.timeStamp": 1,
        });
        // console.log(`${index1}:`, JSON.stringify(index1Msgs, null, 2));
        // console.log(`${index2}:`, JSON.stringify(index2Msgs, null, 2));
        let messagess = [];
        // Process index1Msgs
        if (index1Msgs.length > 0 && ((_a = index1Msgs[0].messageArray) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            const msgByMe = index1Msgs[0].messageArray.map((e) => ({
                msg: e.msg,
                timeStamp: e.timeStamp,
                msgBy: username,
                isFile: e.isFile
            }));
            messagess.push(...msgByMe);
        }
        // Process index2Msgs
        if (index2Msgs.length > 0 && ((_b = index2Msgs[0].messageArray) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            const msgByFr = index2Msgs[0].messageArray.map((e) => ({
                msg: e.msg,
                timeStamp: e.timeStamp,
                msgBy: friend,
                isFile: e.isFile
            }));
            messagess.push(...msgByFr);
        }
        // Check if no messages were found
        if ((!index1Msgs.length || !((_d = (_c = index1Msgs[0]) === null || _c === void 0 ? void 0 : _c.messageArray) === null || _d === void 0 ? void 0 : _d.length)) &&
            (!index2Msgs.length || !((_f = (_e = index2Msgs[0]) === null || _e === void 0 ? void 0 : _e.messageArray) === null || _f === void 0 ? void 0 : _f.length))) {
            console.log("no data found");
            res.status(404).json({
                message: "no messages found",
            });
            return;
        }
        // console.log("messages:", JSON.stringify(messagess));
        res.status(200).json({
            messages: messagess.sort((a, b) => {
                const time1 = new Date(a.timeStamp).getTime();
                const time2 = new Date(b.timeStamp).getTime();
                return time1 - time2;
            }),
        });
    }
    catch (error) {
        res.status(500).json({
            message: "internal server error",
        });
    }
});
exports.getChats = getChats;
const getGroupChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log("-----Group chat history-------");
    try {
        const { index } = req.query;
        if (!index) {
            res.status(400).json({
                devMessage: "Bad Request",
            });
            return;
        }
        const indexMsgs = yield message_2.Messages.find({ index }).sort({
            "messageArray.timeStamp": 1,
        });
        // console.log('msgs:', indexMsgs);
        // Check if no messages were found
        if (!indexMsgs.length || !((_b = (_a = indexMsgs[0]) === null || _a === void 0 ? void 0 : _a.messageArray) === null || _b === void 0 ? void 0 : _b.length)) {
            console.log("no data found");
            res.status(404).json({
                message: "no messages found",
            });
            return;
        }
        let messagess = [];
        // Process indexMsgs
        if (indexMsgs.length > 0 && ((_c = indexMsgs[0].messageArray) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            const msg = indexMsgs[0].messageArray.map((e) => ({
                msg: e.msg,
                timeStamp: e.timeStamp,
                msgBy: e.msgBy,
            }));
            messagess.push(...msg);
        }
        console.log("messagess:", JSON.stringify(messagess));
        res.status(200).json({
            messages: messagess,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "internal server error",
        });
    }
});
exports.getGroupChats = getGroupChats;

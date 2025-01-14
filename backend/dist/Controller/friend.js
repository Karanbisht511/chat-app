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
exports.getFriend = exports.deleteFriend = exports.addFriend = void 0;
const friend_1 = require("../Model/friend");
const addFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.query;
        const { frToAdd } = req.body;
        console.log('username:', username);
        console.log('frToAdd:', frToAdd);
        if (!username || !frToAdd) {
            res.status(400).json({
                devMessage: 'Bad Request'
            });
            return;
        }
        const userExist = yield friend_1.Friends.findOne({ username });
        if (userExist) {
            yield friend_1.Friends.findOneAndUpdate({ username: username }, { '$push': { 'friendList': frToAdd } });
        }
        else {
            const addFriend = new friend_1.Friends({ username, friendList: [frToAdd] });
            addFriend.save();
        }
        res.status(200).json({
            message: `${frToAdd} is added to friend list`
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
});
exports.addFriend = addFriend;
const deleteFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.query;
        const { frToDelete } = req.body;
        console.log('username:', username);
        console.log('frToAdd:', frToDelete);
        if (!username || !frToDelete) {
            res.status(400).json({
                devMessage: 'Bad Request'
            });
            return;
        }
        yield friend_1.Friends.findOneAndUpdate({ username: username }, { '$pull': { 'friendList': frToDelete } });
        res.status(200).json({
            message: `${frToDelete} is deleted from friend list`
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
});
exports.deleteFriend = deleteFriend;
const getFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.query;
        console.log('username:', username);
        if (!username) {
            res.status(400).json({
                devMessage: 'Bad Request'
            });
            return;
        }
        const result = yield friend_1.Friends.findOne({ username: username });
        if (result)
            res.status(200).json({
                friendList: result.friendList,
            });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
});
exports.getFriend = getFriend;

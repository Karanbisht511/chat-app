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
exports.groupParticipants = exports.removeParticipant = exports.addParticipant = exports.deleteGroup = exports.createGroup = void 0;
const groups_1 = require("../Model/groups");
const user_1 = require("../Model/user");
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admin, groupName, participants } = req.body;
        console.log(` groupName:${groupName}  admin:${admin} participants:${JSON.stringify(participants)}`);
        if (!admin || !groupName || !participants) {
            res.status(400).json({
                message: 'BadRequest',
            });
            return;
        }
        const groupExist = yield groups_1.Group.findOne({ groupName });
        if (groupExist) {
            res.status(404).json({
                message: 'group already exist. Try different name'
            });
            return;
        }
        const newGroup = new groups_1.Group({ admin, groupName, groupParticipants: participants });
        newGroup.save();
        yield user_1.User.findOneAndUpdate({ username: admin }, { '$push': { groups: groupName } });
        // associate group to all users
        participants.map((e) => __awaiter(void 0, void 0, void 0, function* () {
            yield user_1.User.findOneAndUpdate({ username: e }, { '$push': { groups: groupName } });
        }));
        res.status(200).json({
            message: 'Group Created Successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
});
exports.createGroup = createGroup;
const deleteGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupName } = req.body;
        if (!groupName) {
            res.status(400).json({
                message: 'BadRequest',
            });
            return;
        }
        console.log(`groupName:${groupName}`);
        const groupExist = yield groups_1.Group.findOne({ groupName });
        if (!groupExist) {
            res.status(404).json({
                message: 'Group Not Found'
            });
            return;
        }
        yield groups_1.Group.findOneAndDelete({ groupName });
        res.status(200).json({
            message: 'Group Deleted Successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
});
exports.deleteGroup = deleteGroup;
const addParticipant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupName, partyList } = req.body;
        if (!groupName || !partyList) {
            res.status(400).json({
                message: 'BadRequest',
            });
            return;
        }
        const groupExist = yield groups_1.Group.findOne({ groupName });
        if (!groupExist) {
            res.status(404).json({
                message: 'Group Not Found'
            });
            return;
        }
        yield groups_1.Group.findOneAndUpdate({ groupName }, { '$push': { groupParticipants: partyList } });
        res.status(200).json({
            message: 'Added Participants Successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
});
exports.addParticipant = addParticipant;
const removeParticipant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupName, participant } = req.body;
        console.log('groupname: Participant:', groupName, participant);
        if (!groupName || !participant) {
            res.status(400).json({
                message: 'BadRequest',
            });
            return;
        }
        const groupExist = yield groups_1.Group.findOne({ groupName });
        if (!groupExist) {
            res.status(404).json({
                message: 'Group Not Found'
            });
            return;
        }
        yield groups_1.Group.findOneAndUpdate({ groupName }, { '$pull': { groupParticipants: participant } });
        yield user_1.User.findOneAndUpdate({ username: participant }, { '$pull': { groups: groupName } });
        res.status(200).json({
            message: 'Removed Participants Successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
});
exports.removeParticipant = removeParticipant;
const groupParticipants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupName } = req.query;
        if (!groupName) {
            res.status(400).json({
                message: 'BadRequest',
            });
            return;
        }
        const partyList = yield (yield groups_1.Group.findOne({ groupName }).select('groupParticipants')).groupParticipants;
        console.log("partyList", JSON.stringify(partyList));
        res.status(200).json({
            partyList
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
});
exports.groupParticipants = groupParticipants;

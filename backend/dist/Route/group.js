"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWTAuthMiddleware_1 = require("../Controller/JWTAuthMiddleware");
const router = express_1.default.Router();
const handleGroups_1 = require("../Controller/handleGroups");
router.post("/create", JWTAuthMiddleware_1.isAuthenticated, handleGroups_1.createGroup);
router.delete("/delete", JWTAuthMiddleware_1.isAuthenticated, handleGroups_1.deleteGroup);
router.post("/addParticipant", JWTAuthMiddleware_1.isAuthenticated, handleGroups_1.addParticipant);
router.post("/removeParticipant", JWTAuthMiddleware_1.isAuthenticated, handleGroups_1.removeParticipant);
router.get("/participants", JWTAuthMiddleware_1.isAuthenticated, handleGroups_1.groupParticipants);
exports.default = router;

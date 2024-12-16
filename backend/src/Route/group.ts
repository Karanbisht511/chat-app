import express from "express";
import { isAuthenticated } from '../Controller/JWTAuthMiddleware'

const router = express.Router();

import { createGroup, deleteGroup, addParticipant, removeParticipant,groupParticipants } from "../Controller/handleGroups";

router.post("/create", isAuthenticated, createGroup);
router.delete("/delete", isAuthenticated, deleteGroup);
router.post("/addParticipant", isAuthenticated, addParticipant);
router.delete("/removeParticipant", isAuthenticated, removeParticipant);
router.get("/participants", isAuthenticated, groupParticipants);

export default router;
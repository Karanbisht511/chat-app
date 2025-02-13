import express from "express";
import { isAuthenticated } from "../Controller/JWTAuthMiddleware";

const router = express.Router();

import { uploadFile, upload, downloadFile } from "../Controller/messages";

import { getImage } from "../Controller/user";

router.post("/uploadFile", isAuthenticated, upload.single("file"), uploadFile);
router.get("/download/:fileName", isAuthenticated, downloadFile);
router.get("/image/:image", isAuthenticated, getImage);

export default router;

import express from "express";
import { isAuthenticated } from "../Controller/JWTAuthMiddleware";

const router = express.Router();

import { uploadFile, upload, downloadFile } from "../Controller/messages";

router.post("/uploadFile", isAuthenticated, upload.single("file"), uploadFile);
router.get("/download/:fileName", isAuthenticated, downloadFile);

export default router;

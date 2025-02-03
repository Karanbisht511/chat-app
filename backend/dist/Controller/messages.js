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
exports.downloadFile = exports.uploadFile = exports.upload = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const messages_1 = require("../DB/messages");
// Configure multer to save files
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/";
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir);
        }
        cb(null, uploadDir); // Save to 'uploads/' folder
    },
    filename: (req, file, cb) => {
        console.log("req.body:", req.body);
        cb(null, `${file.originalname}`);
    },
});
exports.upload = (0, multer_1.default)({ storage });
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.file:", req.file);
        console.log("req.body:", req.body);
        const { message, from, toSend, fileName, fileType } = req.body;
        if (!req.file) {
            res.status(400).send("No file uploaded.");
            return;
        }
        yield (0, messages_1.saveMessageToDB)(`${from}to${toSend}`, message, from, true, {
            fileName,
            fileType,
        });
        res.status(200).json({
            fileName,
            message: `File saved successfully`,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "internal server error",
        });
    }
});
exports.uploadFile = uploadFile;
const downloadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileName = req.params.fileName;
        const filePath = path_1.default.join(__dirname, "../../uploads", fileName);
        if (!fs_1.default.existsSync(filePath)) {
            res.status(404).json({ error: "File not found" });
        }
        // Set headers for file download
        res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
        res.setHeader("Content-Type", "application/octet-stream");
        // Create read stream and pipe to response
        const fileStream = fs_1.default.createReadStream(filePath);
        fileStream.pipe(res);
        // res.download(filePath);
        // return;
    }
    catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ message: "Error downloading file" });
    }
});
exports.downloadFile = downloadFile;

import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { saveMessageToDB } from "../DB/messages";

// Configure multer to save files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir); // Save to 'uploads/' folder
  },
  filename: (req, file, cb) => {
    console.log("req.body:", req.body);

    cb(null, `${file.originalname}`);
  },
});
export const upload = multer({ storage });

export const uploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    const { message, from, toSend, fileName, fileType } = req.body;
    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }

    await saveMessageToDB(`${from}to${toSend}`, message, from, true, {
      fileName,
      fileType,
    });

    res.status(200).json({ message: `File saved as ${req.file.filename}` });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, "../../uploads", req.params.fileName);
    if (fs.existsSync(filePath)) {
      res.download(filePath);
      return;
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

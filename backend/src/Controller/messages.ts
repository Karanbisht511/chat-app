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

    res.status(200).json({
      fileName,
      message: `File saved successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, "../../uploads", fileName);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "File not found" });
    }

    // Set headers for file download
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", "application/octet-stream");

    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // res.download(filePath);
    // return;
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Error downloading file" });
  }
};

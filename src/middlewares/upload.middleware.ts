import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import HttpException from "../exceptions/httpException";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const parentPathName = file.fieldname;
      const folderPath = path.join(
        __dirname,
        `../../public/uploads/${parentPathName}`
      );
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      cb(null, `./public/uploads/${parentPathName}`);
    } catch (err) {
      console.log(err);
      cb(new HttpException(500, "Error when storing file"), "/public/uploads/");
    }
  },
  filename: (req, file, cb) => {
    const timestampString = Date.now();
    const ext = path.extname(file.originalname);

    cb(null, `${timestampString}${ext}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = path.extname(file.originalname);
  const validExts = [".png", ".jpg", ".jpeg"];

  if (!validExts.includes(ext))
    cb(new HttpException(401, "Invalid file extension"));
  else cb(null, true);
};

const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 },
});

export default uploadMiddleware;

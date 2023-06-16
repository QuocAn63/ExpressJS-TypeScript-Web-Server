import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import HttpException from '../exceptions/httpException'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const parentPathName = file.fieldname

        cb(null, `./public/uploads/${parentPathName}`)
    },
    filename: (req, file, cb) => {
        const timestampString = Date.now()
        const ext = path.extname(file.originalname)
        
        cb(null, `${timestampString}.${ext}`)
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const ext = path.extname(file.originalname)
    const validExts = [".png", ".jpg", ".jpeg"]

    if(!validExts.includes(ext)) cb(new HttpException(401, "Invalid file extension"))
    else cb(null, true)
}

const UploadMiddleware = multer({storage, fileFilter, limits: {fileSize: 1024*1024}})


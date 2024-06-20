
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
const fileFilter = (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    const allowedExtArr = ['.jpg', '.jpeg', '.png'];
    if (!allowedExtArr.includes(ext)) {
        req.fileValidationError = `Wrong extension type. Accepted file extensions are: ${allowedExtArr.join(', ')}`;
        cb(null, false);
    } else {
        cb(null, true);
    }
};

export const storageConfig = (destination: string) => ({
    storage: diskStorage({
        destination: "uploads/" + destination,
        filename: (req, file, cb) => {
            const fn = `${Date.now()}-${file.originalname}`;
            cb(null, fn);
        },
    }),
    fileFilter: fileFilter,
});
export const deleteFile = (fileName: string) => {
    try {
        if (fs.existsSync(fileName)) {
            fs.unlinkSync(fileName);
        } else {
        }
    } catch (err) {
        console.error(`Error deleting file: ${fileName}`, err);
        throw new Error(`Error deleting file: ${fileName}`);
    }
}
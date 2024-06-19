// storage.config.ts

import { diskStorage } from 'multer';
import { extname } from 'path';

// Hàm để kiểm tra đuôi file cho phép
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

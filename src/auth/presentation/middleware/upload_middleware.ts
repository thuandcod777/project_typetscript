import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const UPLOAD_DIR = 'uploads/contracts/';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // Giới hạn kích thước: 5MB

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 2. Cấu hình vị trí lưu và quy tắc đặt tên file bất trùng lặp (Anti-collision)
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        // Tạo chuỗi ngẫu nhiên kèm timestamp để tránh ghi đè file trùng tên
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        // Giữ lại đuôi file gốc (ví dụ: .jpg, .pdf)
        const fileExtension = path.extname(file.originalname).toLowerCase();

        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
    }
});

// 3. Bộ lọc định dạng file (File Filter) ngăn chặn file độc hại độc lập theo trường
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedImageExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (file.fieldname === 'contract_image') {
        // Kiểm tra cả MimeType và Đuôi file để đảm bảo an toàn thực tế
        const isValidMime = file.mimetype.startsWith('image/');
        const isValidExt = allowedImageExtensions.includes(fileExtension);

        if (isValidMime && isValidExt) {
            cb(null, true);
        } else {
            cb(new Error('Ảnh hợp đồng chỉ chấp nhận định dạng .jpg, .jpeg hoặc .png!'));
        }
    } else if (file.fieldname === 'contract_pdf') {
        const isValidMime = file.mimetype === 'application/pdf';
        const isValidExt = fileExtension === '.pdf';

        if (isValidMime && isValidExt) {
            cb(null, true);
        } else {
            cb(new Error('Tài liệu hợp đồng bắt buộc phải là file định dạng .pdf!'));
        }
    } else {
        cb(null, false);
    }
};
// 4. Khởi tạo cấu hình Multer
const uploadConfig = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE // Bắn lỗi tự động nếu file vượt quá 5MB
    }
});


export const uploadFieldsMiddleware = uploadConfig.fields([
    { name: 'contract_image', maxCount: 1 },
    { name: 'contract_pdf', maxCount: 1 }
]);
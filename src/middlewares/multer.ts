import multer from "multer";
import { ALLOWED_FILE_TYPES } from "../constants";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const mimetype = file.mimetype;

    if (ALLOWED_FILE_TYPES.includes(mimetype)) {
      cb(null, true);
    } else {
      const error = new Error("Invalid file type") as any;
      error.details = {
        originalname: file.originalname,
        mimetype: mimetype,
        allowedTypes: ALLOWED_FILE_TYPES,
      };
      (error as any).statusCode = 400;
      cb(error as any, false);
    }
  },
});

export default upload;

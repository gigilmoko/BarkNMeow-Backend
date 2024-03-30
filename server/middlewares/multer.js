import multer from "multer";

const storage = multer.memoryStorage()

export const singleUpload = multer({
    storage,
}).array("files", 5);
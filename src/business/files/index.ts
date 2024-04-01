import express from "express";
import multer from "multer";

import { uploadImages } from "./upload-images.js";
import { handleErrorFunction } from "../../modules/create-error-function.js";

const fileRouter = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

fileRouter.post("/api/v1/files/upload-images", upload.array("images", 5), handleErrorFunction(uploadImages));

export default fileRouter;

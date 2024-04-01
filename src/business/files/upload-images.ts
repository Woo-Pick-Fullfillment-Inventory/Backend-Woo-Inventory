import { storageRepository } from "../../repository/storage/index.js";

import type {
  Request,
  Response,
} from "express";

export const uploadImages = async (req: Request, res: Response) => {
  if (!req.files) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const urls = await storageRepository.imageBucket.insertImages("1", req.files as Express.Multer.File[], 1);
  return res.status(201).send({
    message: "Images uploaded successfully",
    urls,
  });
};

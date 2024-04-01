import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";

import { insertImagesFactory } from "./image-bucket/add-images.js";
dotenv.config();

if (!process.env["PROJECT_ID"]) {
  throw new Error("PROJECT_ID environment variable is required");
}

const storageClient = new Storage({ projectId: process.env["PROJECT_ID"] });

export const storageRepository = { imageBucket: { insertImages: insertImagesFactory(storageClient) } };
import { Storage } from "@google-cloud/storage";

import { insertImagesFactory } from "./image-bucket/add-images.js";

const storageClient = new Storage({ projectId: process.env["PROJECT_ID"] as string });

export const storageRepository = { imageBucket: { insertImages: insertImagesFactory(storageClient) } };
import type { Storage } from "@google-cloud/storage";

if (!process.env["PRODUCTS_IMAGES_BUCKET"]) {
  throw new Error("PRODUCTS_IMAGES_BUCKET environment variable is required");
}

export const insertImagesFactory = (storageClient: Storage) => {
  return async (
    userId: string,
    files: Express.Multer.File[],
  ): Promise<string[]> => {
    const uploadPromises: Promise<string>[] = [];

    for (const file of files) {
      const uploadPromise = new Promise<string>((resolve, reject) => {
        // eslint-disable-next-line
        const uploadStream = (storageClient as any).bucket(`${process.env["PRODUCTS_IMAGES_BUCKET"]}`).file(
          `users-${userId}-products-images/${file.originalname}`,
        ).createWriteStream({
          predefinedAcl: "publicRead",
          metadata: { contentType: file.mimetype },
        });

        uploadStream.on("error", (err: Error | null) => {
          reject(err);
        });

        uploadStream.on("finish", () => {
          // eslint-disable-next-line
          resolve(`https://storage.googleapis.com/${process.env["PRODUCTS_IMAGES_BUCKET"]}/users-${userId}-products-images/${file.originalname}`);
        });

        uploadStream.end(file.buffer);
      });

      uploadPromises.push(uploadPromise);
    }

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  };
};

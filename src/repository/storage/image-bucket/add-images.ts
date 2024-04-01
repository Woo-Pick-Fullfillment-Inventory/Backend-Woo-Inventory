import type { Storage } from "@google-cloud/storage";

export const insertImagesFactory = (storageClient: Storage) => {
  return async (
    userId: string,
    files: Express.Multer.File[],
    productId: number,
  ): Promise<string[]> => {
    const uploadPromises: Promise<string>[] = [];

    for (const file of files) {
      const uploadPromise = new Promise<string>((resolve, reject) => {
        // eslint-disable-next-line
        const uploadStream = (storageClient as any).bucket("woo-pick-products-images").file(
          `users-${userId}/products-${productId}/${file.originalname}`,
        ).createWriteStream({
          predefinedAcl: "publicRead",
          metadata: { contentType: file.mimetype },
        });

        uploadStream.on("error", (err: Error | null) => {
          reject(err);
        });

        uploadStream.on("finish", () => {
          // eslint-disable-next-line
          resolve(`https://storage.googleapis.com/${(storageClient as any).bucket().name}/users-${userId}/products-${productId}/${file.originalname}`);
        });

        uploadStream.end(file.buffer);
      });

      uploadPromises.push(uploadPromise);
    }

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  };
};

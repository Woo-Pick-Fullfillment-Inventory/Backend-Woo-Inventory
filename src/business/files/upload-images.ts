// import { StatusCodes } from "http-status-codes";

// import { createErrorResponse } from "../../modules/create-error-response.js";
// import logger from "../../modules/create-logger.js";
// import { verifyAuthorizationHeader } from "../../modules/create-verify-authorization-header.js";
// import { firestoreRepository } from "../../repository/firestore/index.js";
import { storageRepository } from "../../repository/storage/index.js";

import type {
  Request,
  Response,
} from "express";

// const SERVICE_ERRORS = {
//   invalidRequestType: {
//     statusCode: StatusCodes.BAD_REQUEST,
//     type: "/files/upload-images",
//     message: "no image sent from client",
//   },
//   requestConflict: {
//     statusCode: StatusCodes.CONFLICT,
//     type: "/files/upload-images",
//     message: "file input type not supported",
//   },
//   notAuthorized: {
//     statusCode: StatusCodes.UNAUTHORIZED,
//     type: "/files/upload-images",
//     message: "not authorized",
//   },
//   resourceNotFound: {
//     statusCode: StatusCodes.NOT_FOUND,
//     type: "/files/upload-images",
//     message: "user not found",
//   },
//   errorUploadingImages: {
//     statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//     type: "/files/upload-images",
//     message: "error uploading images",
//   },
//};

export const uploadImages = async (req: Request, res: Response) => {

  // if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
  //   return createErrorResponse(res, SERVICE_ERRORS.invalidRequestType);
  // }

  // (req.files as Express.Multer.File[]).every((file) => {
  //   const supportedImageTypes = [
  //     "image/webp",
  //     "image/svg+xml",
  //     "image/jpeg",
  //     "image/jpeg",
  //     "image/png",
  //     "image/gif",
  //     // TODO: Add more MIME types as needed
  //   ];

  // if(!supportedImageTypes.includes(file.mimetype)) {
  //     logger.log(
  //       "warn",
  //       `${req.method} ${req.url} - 409 - Conflict ***ERROR*** ${file.filename} file input type not supported ${file.mimetype}`
  //     );
  //     return createErrorResponse(res, SERVICE_ERRORS.requestConflict);
  //   }
  //   return;
  // });

  // const userId = verifyAuthorizationHeader(req.headers["authorization"]);
  // if (!userId) {
  //   logger.log(
  //     "warn",
  //     `${req.method} ${
  //       req.url
  //     } - 400 - Not Authorized ***ERROR*** no decoded token from ${JSON.stringify(
  //       req.headers["authorization"]
  //     )} authorization header`
  //   );
  //   return createErrorResponse(res, SERVICE_ERRORS.notAuthorized);
  // }

  // const userFoundInFirestore =
  //   await firestoreRepository.user.getUserById(userId);
  // if (!userFoundInFirestore) {
  //   logger.log(
  //     "warn",
  //     `${req.method} ${req.url} - 404 - Not Found ***ERROR*** user not found by id ${userId}`
  //   );
  //   return createErrorResponse(res, SERVICE_ERRORS.resourceNotFound);
  // }

  const urls = await storageRepository.imageBucket.insertImages(
    "123",
    req.files as Express.Multer.File[],
  );

  // if (urls.length !== req.files.length) {
  //   logger.log(
  //     "error",
  //     `${req.method} ${req.url} - 500 - Internal Server Error ***Expected*** ${req.files.length} images to be uploaded but only ${urls.length} were uploaded.`
  //   );
  //   return createErrorResponse(res, SERVICE_ERRORS.errorUploadingImages);
  // }

  return res.status(201).send({
    urls,
    total_images: urls.length,
  });
};

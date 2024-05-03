import logger from "../modules/create-logger.js";

const checkEnvVars = () => {
  const requiredVars =
    process.env["NODE_ENV"] === "production"
      ? [
        "SERVICE_PORT",
        "JWT_SECRET",
        "PROJECT_ID",
        "PRODUCTS_IMAGES_BUCKET",
      ]
      : [
        "SERVICE_PORT",
        "WOO_BASE_URL",
        "JWT_SECRET",
        "PROJECT_ID",
        "PRODUCTS_IMAGES_BUCKET",
        "FIRESTORE_EMULATOR_HOST",
        "FIREBASE_STORAGE_EMULATOR_HOST",
      ];

  const missingVars = requiredVars.filter((v) => !process.env[v]);

  if (missingVars.length > 0) {
    logger.log(
      "error",
      `Missing environment variables: ${missingVars.join(", ")}`,
    );
    process.exit(1);
  }
};

export default checkEnvVars;

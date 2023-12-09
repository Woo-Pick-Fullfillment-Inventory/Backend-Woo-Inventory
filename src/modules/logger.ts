import { LoggingWinston } from "@google-cloud/logging-winston";
import winston from "winston";

const loggingWinston = new LoggingWinston({ projectId: process.env["SPANNER_PROJECT_ID"] });

const logger = winston.createLogger({
  level: "info", // Set the logging level to "error"
  format: winston.format.simple(), // Use a simple log format
  transports: [
    new winston.transports.Console(),
    loggingWinston,
  ],
});

export default logger;
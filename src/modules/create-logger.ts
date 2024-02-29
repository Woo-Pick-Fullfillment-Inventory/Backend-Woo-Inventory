import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.printf(
      (info) => `${info.level}: ${info.message}`,
    ),
  ),
  transports: [ new winston.transports.Console() ],
});

export default logger;
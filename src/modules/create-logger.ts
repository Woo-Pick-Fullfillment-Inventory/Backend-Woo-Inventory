import colors from "cli-color";
import dotenv from "dotenv";
import winston from "winston";
dotenv.config();

const logger =
  process.env["NODE_ENV"] !== "production"
    ? winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.printf((info) => {
          const levelColor = (level: string) => {
            switch (level) {
              case "info":
                return colors.cyan(level);
              case "debug":
                return colors.magenta(level);
              case "warn":
                return colors.yellow(level);
              case "error":
                return colors.red.bold(level);
              default:
                return level;
            }
          };

          return `${levelColor(info.level)}: ${info.message}`;
        }),
      ),
      transports: [ new winston.transports.Console() ],
    })
    : winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.printf((info) => `${info.level}: ${info.message}`),
      ),
      transports: [ new winston.transports.Console() ],
    });

export default logger;

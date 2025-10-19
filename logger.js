// logger.js
import fs from "fs";
import path from "path";
import winston from "winston";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Шлях до папки логів
const logDir = path.join(__dirname, "logs");
const logFile = path.join(logDir, "sent.log");

// Якщо нема — створюємо папку і файл
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, "", "utf8");
}

// Конфігурація логера
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    new winston.transports.File({ filename: logFile }),
  ],
});

export default logger;
// routes/adminRoutes.js
import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧱 Простий захист паролем через ?password=
router.get("/admin", (req, res) => {
  const password = req.query.password;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).send("<h3>🚫 Access denied</h3><p>Invalid password.</p>");
  }

  const logPath = path.join(__dirname, "../logs/sent.log");

  // Читаємо лог і форматуємо
  if (!fs.existsSync(logPath)) {
    return res.send("<h3>No logs yet</h3>");
  }

  const logs = fs
    .readFileSync(logPath, "utf8")
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .reverse(); // нові зверху

  const tableRows = logs
    .map((line) => `<tr><td>${line.replace(/\[/g, "<b>[").replace(/\]/g, "]</b>")}</td></tr>`)
    .join("");

  const html = `
    <html>
      <head>
        <title>📬 Email Logs</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f9fafb; padding: 30px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 6px 10px; border-bottom: 1px solid #ddd; font-size: 14px; }
          tr:hover { background: #f1f1f1; }
          .header { margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📬 Sent Email Logs</h1>
          <p>Total: ${logs.length}</p>
        </div>
        <table>${tableRows}</table>
      </body>
    </html>
  `;
  res.send(html);
});

export default router;
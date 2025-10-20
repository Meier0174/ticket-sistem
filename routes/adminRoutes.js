// routes/adminRoutes.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/admin", (req, res) => {
  const password = req.query.p;
  if (password !== process.env.ADMIN_PASS) {
    return res.status(403).send("<h2>🔒 Доступ заборонено</h2>");
  }

  const logPath = path.join(__dirname, "../logs/sent.log");
  if (!fs.existsSync(logPath)) {
    return res.send("<h3>📭 Логи ще не створені.</h3>");
  }

  const lines = fs.readFileSync(logPath, "utf8").trim().split("\n").filter(Boolean);

  // === Підрахунок статистики ===
  const total = lines.length;
  const success = lines.filter(l => l.includes("successfully")).length;
  const failed = total - success;

  // === HTML сторінка ===
  const html = `
  <html>
  <head>
    <title>📊 Ticket Logs</title>
    <meta charset="utf-8" />
    <style>
      body { font-family: Arial; background:#f9f9f9; margin:40px; }
      h2 { color:#333; }
      .stats { margin-bottom:20px; }
      table { border-collapse: collapse; width:100%; background:#fff; }
      th,td { border:1px solid #ddd; padding:8px; text-align:left; }
      th { background:#007bff; color:white; }
      tr:nth-child(even){ background:#f2f2f2; }
      .refresh { margin:15px 0; }
    </style>
  </head>
  <body>
    <h2>📬 Ticket System Logs</h2>
    <div class="stats">
      <b>Всього записів:</b> ${total}<br/>
      <b>Успішних:</b> ${success}<br/>
      <b>Помилок:</b> ${failed}
    </div>
    <button class="refresh" onclick="location.reload()">🔄 Оновити</button>
    <table>
      <tr><th>Логи</th></tr>
      ${lines.map(line => `<tr><td>${line}</td></tr>`).join("")}
    </table>
  </body>
  </html>
  `;

  res.send(html);
});

export default router;
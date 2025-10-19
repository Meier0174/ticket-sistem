import express from "express";
import { sendEmail } from "../services/mailgunService.js";
import logger from "../logger.js";

const router = express.Router();

router.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    if (!to)
      return res
        .status(400)
        .json({ success: false, error: "Email is required" });

    const result = await sendEmail(to, subject, text, html);

    // ✅ Логування успіху
    logger.info(`✅ Email sent to ${to} | Subject: ${subject}`);
    res.json({ success: true, data: result });
  } catch (error) {
    // ❌ Логування помилки
    logger.error(`❌ Failed to send to ${req.body.to} | ${error.message}`);
    res
      .status(500)
      .json({ success: false, error: error.message });
  }
});

export default router;
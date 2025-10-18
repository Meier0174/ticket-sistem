import express from "express";
import { sendEmail } from "../services/mailgunService.js";

const router = express.Router();

router.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    if (!to) return res.status(400).json({ success: false, error: "Email is required" });

    const result = await sendEmail(to, subject, text, html);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error("❌ Email route error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
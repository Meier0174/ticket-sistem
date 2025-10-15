import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const MAILGUN_URL = `https://api.eu.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;

app.post("/send-test", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const form = new URLSearchParams();
    form.append("from", `Support <vip@${MAILGUN_DOMAIN}>`);
    form.append("to", to);
    form.append("subject", subject);
    form.append("text", text);

    const response = await fetch(MAILGUN_URL, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from("api:" + MAILGUN_API_KEY).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });

    const data = await response.text();
    console.log("📨 Mailgun response:", data);

    res.json({ success: response.ok, data });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3001, () => {
  console.log("✅ Test server running at http://localhost:3001");
});
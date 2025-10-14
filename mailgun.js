import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const BASE_URL = process.env.MAILGUN_API_BASE_URL || "https://api.eu.mailgun.net";

export async function sendEmail(to, subject, text) {
  const url = `${BASE_URL}/v3/${DOMAIN}/messages`;

  const params = new URLSearchParams();
  params.append("from", `Crabslots <noreply@${DOMAIN}>`);
  params.append("to", to);
  params.append("subject", subject);
  params.append("text", text);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`api:${API_KEY}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Mailgun response:", errorText);
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log("📨 Mailgun sent:", data);
    return data;
  } catch (error) {
    console.error("❌ Mailgun error:", error);
    throw error;
  }
}
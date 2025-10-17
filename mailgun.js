import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const BASE_URL = process.env.MAILGUN_API_BASE_URL || "https://api.eu.mailgun.net";

/**
 * Відправка листа через Mailgun.
 * Автоматично визначає, що відправляти: text чи html.
 *
 * @param {string} to - email отримувача
 * @param {string} subject - тема листа
 * @param {string} text - текстовий вміст (необов’язковий, якщо є html)
 * @param {string} html - html-вміст (необов’язковий)
 */
export async function sendEmail(to, subject, text, html) {
  const url = `${BASE_URL}/v3/${DOMAIN}/messages`;

  const params = new URLSearchParams();
  params.append("from", `Crabslots <Vip@${DOMAIN}>`);
  params.append("to", to);
  params.append("subject", subject);

  // автоматично підставляємо або text, або html, або обидва
  if (html) {
    params.append("html", html);
  }
  if (text) {
    params.append("text", text);
  }

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
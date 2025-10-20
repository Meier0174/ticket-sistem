import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: "./.env" });

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const BASE_URL = process.env.MAILGUN_API_BASE_URL || "https://api.eu.mailgun.net";

// === Ticket ID Generator ===
const counterPath = path.join(process.cwd(), "ticketCounter.json");

function getNextTicketId() {
  try {
    const data = JSON.parse(fs.readFileSync(counterPath, "utf8"));
    data.lastId += 1;
    fs.writeFileSync(counterPath, JSON.stringify(data));
    return data.lastId;
  } catch (err) {
    console.error("Error reading ticket counter:", err);
    fs.writeFileSync(counterPath, JSON.stringify({ lastId: 1 }));
    return 1;
  }
}

export async function sendEmail(to, subject, text, html) {
  const ticketId = getNextTicketId();
  const finalSubject = `Ticket #${ticketId}: ${subject}`;
  const url = `${BASE_URL}/v3/${DOMAIN}/messages`;

  const params = new URLSearchParams();
  params.append("from", `Crabslots Support <Support@${DOMAIN}>`);
  params.append("to", to);
  params.append("subject", finalSubject);
  if (html) params.append("html", html);
  else params.append("text", text);

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
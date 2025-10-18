const sendBtn = document.getElementById("sendBtn");
const emailInput = document.getElementById("email");
const loader = document.getElementById("loader");
const message = document.getElementById("message");

sendBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage("Enter a valid email address", "error");
    return;
  }

  loader.style.display = "block";
  sendBtn.disabled = true;
  message.style.display = "none";

  try {
    const res = await fetch("/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: "Crabslots: Ihr persönliches Angebot wartet",
        text: ` 
        Guten Tag,

        mein Name ist Sophia Hart vom Team Crabslots.

        Ich wollte Ihnen persönlich schreiben – wir haben für neue Mitglieder ein spezielles Startangebot vorbereitet, das Ihre ersten Schritte angenehmer machen soll.

        Wenn Sie sich anmelden oder Ihr Konto wieder aktivieren, finden Sie dort ein zusätzliches Guthaben für Ihre nächsten Spiele.

        Ich wünsche Ihnen viel Erfolg und Spaß beim Spielen – bei Fragen antworten Sie einfach auf diese Nachricht, ich bin gerne für Sie da.

        Mit freundlichen Grüßen,  
        Sophia Hart  
        Kundendienst | Crabslots
        `,
        html: `
        <p>Guten Tag,</p>

        <p>mein Name ist <strong>Sophia Hart</strong> vom Team Crabslots.</p>

        <p>Ich wollte Ihnen persönlich schreiben – wir haben für neue Mitglieder ein spezielles <strong>Startangebot</strong> vorbereitet, das Ihre ersten Schritte angenehmer machen soll.</p>

        <p>Wenn Sie sich anmelden oder Ihr Konto wieder aktivieren, finden Sie dort ein zusätzliches Guthaben für Ihre nächsten Spiele.</p>

        <p>Ich wünsche Ihnen viel Erfolg und Spaß beim Spielen – bei Fragen antworten Sie einfach auf diese Nachricht, ich bin gerne für Sie da.</p>

        <p>Mit freundlichen Grüßen,<br>
        Sophia Hart<br>
        Kundendienst | Crabslots</p>

        <hr>
        <p style="font-size: 12px; color: #999;">
        Wenn Sie keine weiteren Nachrichten mehr erhalten möchten, können Sie sich hier abmelden.
        </p>

        `,
      }),
    });

    const data = await res.json().catch(() => ({ success: false }));

    if (res.ok && data && data.success) {
      showMessage("✅ Email sent successfully", "success");
      emailInput.value = "";
    } else if (data && data.error) {
      showMessage("❌ Error: " + data.error, "error");
    } else {
      showMessage("❌ Failed to send", "error");
    }
  } catch (err) {
    showMessage("⚠️ Connection error with server", "error");
  }

  loader.style.display = "none";
  sendBtn.disabled = false;
});

function showMessage(text, type) {
  message.textContent = text;
  message.className = `message ${type}`;
  message.style.display = "block";
}
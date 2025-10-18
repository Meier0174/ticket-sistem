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

        Mein Name ist Sophia Hart vom Crabslots VIP-Betreuungsteam.

        Wir haben für Sie ein exklusives Willkommenspaket vorbereitet.

        Ihr VIP-Paket:
        - 300 % Bonus auf Ihre Einzahlungen bis zu € 1000

        So aktivieren Sie Ihr Paket:
        - Melden Sie sich in Ihrem Konto an oder schließen Sie die Registrierung ab.
        - Tätigen Sie eine Einzahlung in der Höhe, die Sie bevorzugen.

        Sobald die Schritte abgeschlossen sind, wird Ihr Bonusguthaben automatisch gutgeschrieben.

        Lassen Sie diese Gelegenheit nicht verstreichen – starten Sie jetzt Ihr Crabslots.

        Jetzt registrieren: https://crabslots.com/

        Sollten Fragen auftauchen, antworten Sie einfach auf diese Nachricht und ich helfe Ihnen gerne weiter.

        Mit freundlichen Grüßen,
        Sophia Hart
        VIP Betreuung,
        Crabslots

`,
        html: `
        <p>Guten Tag,</p>

        <p>Mein Name ist <strong>Sophia Hart</strong> vom Crabslots VIP-Betreuungsteam.</p>

        <p>Wir haben für Sie ein exklusives Willkommenspaket vorbereitet.</p>

        <p><strong>Ihr VIP-Paket:</strong><br>
        - 300 % Bonus auf Ihre Einzahlungen bis zu € 1000</p>

        <p><strong>So aktivieren Sie Ihr Paket:</strong><br>
        - Melden Sie sich in Ihrem Konto an oder schließen Sie die Registrierung ab.<br>
        - Tätigen Sie eine Einzahlung in der Höhe, die Sie bevorzugen.</p>

        <p>Sobald die Schritte abgeschlossen sind, wird Ihr Bonusguthaben automatisch gutgeschrieben.</p>

        <p>Lassen Sie diese Gelegenheit nicht verstreichen – starten Sie jetzt Ihr Crabslots.</p>

        <p>
        <a href="https://crabslots.com/" target="_blank" style="color:#007bff; text-decoration:none;">
        Jetzt registrieren
        </a>
        </p>

        <p>Sollten Fragen auftauchen, antworten Sie einfach auf diese Nachricht und ich helfe Ihnen gerne weiter.</p>

        <p>Mit freundlichen Grüßen,<br>
        <strong>Sophia Hart</strong><br>
        VIP Betreuung,<br>
        Crabslots
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
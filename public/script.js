document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("sendBtn");
  const emailInput = document.getElementById("email");
  const nameInput = document.getElementById("name");
  const loader = document.getElementById("loader");
  const message = document.getElementById("message");

  sendBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const name = nameInput.value.trim();

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
          subject: "Ihr persönliches Angebot wartet",
          text: ` 
        Guten Tag ${name},

        Mein Name ist Sophia Hart vom CrabSlots-Team.

        Ich moechte Ihnen persönlich schreiben. Wir haben ein besonderes Willkommensangebot für neue Mitglieder vorbereitet, um Ihnen den Einstieg so angenehm wie möglich zu machen.

        Wenn Sie möchten, können Sie es sich hier ansehen:
        https://crabslots.com/

        Ich wünsche Ihnen viel Glück und Freude. Wenn Sie Fragen haben, antworten Sie einfach auf diese Nachricht. Ich helfe Ihnen gerne.

        Mit freundlichen Grüßen,
        Sophia Hart
        VIP | Crabslots
        `,
        html: `
        <p>Guten Tag <strong>${name}</strong>, </p>

        <p>Mein Name ist Sophia Hart vom <strong>CrabSlots-Team</strong>.</p>

        <p>Ich moechte Ihnen persönlich schreiben. Wir haben ein besonderes Willkommensangebot für neue Mitglieder vorbereitet, um Ihnen den Einstieg so angenehm wie möglich zu machen.</p>

        <p>Wenn Sie möchten, können Sie es sich hier ansehen:<br>
        <a href="https://go.crabslots.partners/visit/?bta=35185&nci=5344&utm_campaign=m" target="_blank" style="color:#007bff; text-decoration:none;">Mehr Erfahren</a></p>

        <p>Ich wünsche Ihnen viel Glück und Freude. Wenn Sie Fragen haben, antworten Sie einfach auf diese Nachricht. Ich helfe Ihnen gerne.</p>

        <p>Mit freundlichen Grüßen,<br>
        Sophia Hart<br>
        VIP | Crabslots</p>
        `,
      }),
    });


      const data = await res.json().catch(() => ({ success: false }));

      if (res.ok && data && data.success) {
        showMessage("✅ Email sent successfully", "success");
        emailInput.value = "";
        nameInput.value = "";
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
});
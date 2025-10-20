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
          subject: "Your personal offer is ready",
          text: ` 
          Hello ${name},

          I wanted to reach out personally — my name is Sophia Hart from CrabSlots-Team.

          We’ve prepared something small to welcome new members and help to get your first gaming experience comfortably and more enjoyable.

          You can check it here:
          https://crabslots.com/

          If there’s anything you’d like to ask or discuss, just reply to this email.
          I’m always happy to help.

          Best regards,
          Sophia Hart
          VIP | Crabslots
        `,
        html: `
          <p>Hello <strong>${name}</strong>, </p>

          <p>I wanted to reach out personally — my name is Sophia Hart from <strong>CrabSlots-Team</strong>.</p>

          <p>We’ve prepared something small to welcome new members and help to get your first gaming experience comfortably and more enjoyable.</p>

          <p>You can check it here:<br>
          <a href="https://go.crabslots.partners/visit/?bta=35185&nci=5344&utm_campaign=m" target="_blank" style="color:#007bff; text-decoration:none;">Learn More</a></p>

          <p>If there’s anything you’d like to ask or discuss, just reply to this email.</p>
          <p>I’m always happy to help.</p>

          <p>Best regards,<br>
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
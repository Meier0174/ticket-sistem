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
        Hello ,

        My name is Sophia Hart from the Crabslots team.

        I wanted to reach out to you personally — we’ve prepared a special welcome offer for new members to help make your first steps more enjoyable.

        If you're interested, you can check it out here:
        https://crabslots.com/

        Wishing you the best of luck and lots of fun — if you have any questions, just reply to this message. I'm happy to help.

        Best regards,  
        Sophia Hart  
        Customer Support | Crabslots
        `,
        html: `
        <p>Hello, </p>

        <p>My name is <strong>Sophia Hart</strong> from the Crabslots team.</p>

        <p>I wanted to reach out to you personally — we’ve prepared a special <strong>welcome offer</strong> for new members to help make your first steps more enjoyable.</p>

        <p>If you're interested, you can check it out here:<br>
        <a href="https://crabslots.com/vip-welcome" target="_blank" style="color:#007bff; text-decoration:none;">Ling here</a></p>

        <p>Wishing you the best of luck and lots of fun — if you have any questions, just reply to this message. I'm happy to help.</p>

        <p>Best regards,<br>
        Sophia Hart<br>
        Customer Support | Crabslots</p>
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
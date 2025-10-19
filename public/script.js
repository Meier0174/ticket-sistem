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
        Hello,

        My name is Sophia Hart from the support team.

        I wanted to reach out personally — we've prepared something new for former users to help make it easier to get started again.

        If you're interested, you can view it here:
        https://crabslots.com/

        If you have any questions, feel free to reply to this message — I’ll be happy to help.

        Best regards,  
        Sophia Hart  
        Customer Support

`,
        html: `
        <p>Hello,</p>

        <p>My name is <strong>Sophia Hart</strong> from the support team.</p>

        <p>I wanted to reach out personally — we've prepared something new for former users to help make it easier to get started again.</p>

        <p>If you're interested, you can view it here:<br>
        <a href="https://crabslots.com/" target="_blank" style="color:#007bff; text-decoration:none;">Join Now</a></p>

        <p>If you have any questions, feel free to reply to this message — I’ll be happy to help.</p>

        <p>Best regards,<br>
        Sophia Hart<br>
        Customer Support</p>
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
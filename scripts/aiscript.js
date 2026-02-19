async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatLog = document.getElementById("chatLog");
  const message = input.value.trim();
  if (!message) return;

  const userDiv = document.createElement("div");
  userDiv.className = "chat-message user-message";
  userDiv.textContent = message;
  chatLog.appendChild(userDiv);

  input.value = "";

  const aiDiv = document.createElement("div");
  aiDiv.className = "chat-message ai-message";
  aiDiv.textContent = "جاري التفكير...";
  chatLog.appendChild(aiDiv);

  try {
    const response = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: message })
    });

    const data = await response.json();
    aiDiv.textContent = data.response;

  } catch (error) {
    aiDiv.textContent = "فشل الاتصال بالسيرفر يخوي";
    console.error(error);
  }
}

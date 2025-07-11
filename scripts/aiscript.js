function sendMessage()
{
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



  setTimeout(() => {
    aiDiv.textContent = `سؤالك: "${message}" - فشل الإتصال يخوي`;
  }, 1000);
}

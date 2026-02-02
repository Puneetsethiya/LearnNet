// ================= CHATBOT INJECT =================

// Create main container
const chatbotContainer = document.createElement("div");
chatbotContainer.id = "chatbot-container";

chatbotContainer.innerHTML = `
  <button id="chatbot-toggle">💬</button>
  <div id="chatbot-popup">
    <iframe src="chatbot.html"></iframe>
  </div>
`;

// Append to body
document.body.appendChild(chatbotContainer);

// Add CSS
const style = document.createElement("style");
style.innerHTML = `
#chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

#chatbot-toggle {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 24px;
  background: linear-gradient(135deg, #6a00f4, #8e2de2);
  color: white;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

#chatbot-popup {
  position: fixed;
  right: 20px;
  bottom: 90px;

  width: 360px;
  height: 520px;
  border-radius: 18px; 
  display: none;
  background: transparent;
  overflow: hidden;
}

@media (max-width:768px){
  #chatbot-popup{
    width:95vw;
    height:75vh;
    right:50%;
    transform:translateX(50%);
    bottom:80px;
  }
}

#chatbot-popup iframe{
  width:100%;
  height:100% !important; 
  border:none;
  background:transparent;
}

`;
document.head.appendChild(style);

// Toggle open/close
const toggleBtn = chatbotContainer.querySelector("#chatbot-toggle");
const popup = chatbotContainer.querySelector("#chatbot-popup");

toggleBtn.addEventListener("click", () => {
  popup.style.display = popup.style.display === "block" ? "none" : "block";
});

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!chatbotContainer.contains(e.target)) {
    popup.style.display = "none";
  }
});

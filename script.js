let CHAT_DATA = [];

document.addEventListener("DOMContentLoaded", function () {
  loadChat();
});

function loadChat() {
  // Retrieve chat messages from CHAT_DATA
  const chatBox = document.getElementById("chat-box");
  CHAT_DATA.forEach((message) => {
    appendMessage(message.question, "user");
    if (message.answer) {
      appendMessage(message.answer, "bot");
    }
  });
}

async function sendMessage() {
  const inputElement = document.getElementById("message-input");
  const question = inputElement.value.trim();

  if (question === "") return;

  // Get the previous answer
  const previousAnswer = getPreviousAnswer();

  // Store the question in CHAT_DATA
  CHAT_DATA.push({ question, answer: null });

  // If the previous answer is specific, post data with both question and answer
  if (previousAnswer === "I don't know the answer. Can you teach me?") {
    sendToBackend({ question, answer: inputElement.value });
  } else {
    // Otherwise, post only the question
    sendToBackend({ question });
  }

  // Display the question in the chat-box
  appendMessage(question, "user");

  // Clear the input field
  inputElement.value = "";
}
function getPreviousAnswer() {
  // Iterate through CHAT_DATA in reverse order to find the most recent answer
  for (let i = CHAT_DATA.length - 1; i >= 0; i--) {
    const message = CHAT_DATA[i];
    if (message.answer !== null) {
      return message.answer;
    }
  }
  // Return null if no previous answer is found
  return null;
}

async function sendToBackend({ question, answer = null }) {
  try {
    // Post data to the backend
    const response = await fetch("https://chatbot-4f48.onrender.com/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, answer }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    // Display the answer in the chat-box
    appendMessage(data, "bot");

    // Save the question and answer in CHAT_DATA
    saveMessage({ question, answer: data });
  } catch (error) {
    console.error("Error sending data to backend:", error.message);
  }
}

function appendMessage(message, sender) {
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");
  messageElement.className = `${sender}-message`;
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);

  // Scroll to the bottom of the chat-box
  chatBox.scrollTop = chatBox.scrollHeight;
}

function saveMessage(message) {
  // Save the message in CHAT_DATA
  CHAT_DATA.push(message);
}

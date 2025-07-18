const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  appendMessage('bot', 'Gemini is thinking...');
  chatBox.lastChild.classList.add('loading');
  input.value = '';

  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userMessage }),
  })
    .then(response => response.json())
    .then(data => {
      removeLoadingMessage();
      if (data.output) {
        appendMessage('bot', data.output);
      } else {
        appendMessage('bot', 'Error: Could not retrieve a response.');
      }
    })
    .catch(error => {
      removeLoadingMessage();
      appendMessage('bot', 'Error: ' + error.message);
    });
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLoadingMessage() {
  const loadingMessage = document.querySelector('#chat-box .message.bot.loading');
  if (loadingMessage) {
    loadingMessage.remove();
  }
}

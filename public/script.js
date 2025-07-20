// Create animated particles
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = Math.random() * 4 + 4 + 's';
        container.appendChild(particle);
    }
}

// Original JavaScript functionality
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const userMessage = input.value.trim();
    if (!userMessage) return;
    
    appendMessage('user', userMessage);
    appendMessage('bot', 'UntungGPT is thinking...');
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

    if (sender === 'bot') {
        // Parse Markdown to HTML for bot responses
        msg.innerHTML = marked.parse(text);
    } else {
        // Use textContent for user messages to prevent HTML injection
        msg.textContent = text;
    }

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLoadingMessage() {
    const loadingMessage = document.querySelector('#chat-box .message.bot.loading');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

// Initialize particles on load
window.addEventListener('load', createParticles);
let socket = null;
let currentUsername = '';
let selectedAvatar = '🦄';

// When page loads
document.addEventListener('DOMContentLoaded', () => {
  showLoginModal();
  setupEventListeners();
  setupAvatarSelection();
});

// Show login modal
function showLoginModal() {
  document.getElementById('login-modal').style.display = 'flex';
  document.getElementById('username-input').focus();
}

// Hide login modal
function hideLoginModal() {
  document.getElementById('login-modal').style.display = 'none';
}

// Setup event listeners
function setupEventListeners() {
  const messageInput = document.getElementById('message-input');
  const usernameInput = document.getElementById('username-input');
  const joinBtn = document.getElementById('join-btn');
  const sendBtn = document.getElementById('send-btn');
  const emojiBtn = document.getElementById('emoji-btn');

  // Join chat
  joinBtn.addEventListener('click', joinChat);
  document.getElementById('username-input').addEventListener('keypress', e => {
    if (e.key === 'Enter') joinChat();
  });

  // Send message
  sendBtn.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });

  // Emoji picker toggle
  emojiBtn.addEventListener('click', toggleEmojiPicker);

  // Emoji selection
  document.querySelectorAll('.emoji-grid span').forEach(emoji => {
    emoji.addEventListener('click', () => {
      addEmoji(emoji.getAttribute('data-emoji'));
    });
  });

  // Focus out to hide typing indicator
  messageInput.addEventListener('input', () => {
    if (socket) {
      socket.emit('typing-start');
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        socket.emit('typing-stop');
      }, 2000);
    }
  });
  messageInput.addEventListener('blur', () => {
    if (socket) socket.emit('typing-stop');
  });
}

// Avatar selection
function setupAvatarSelection() {
  document.querySelectorAll('.avatar-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      selectedAvatar = option.getAttribute('data-avatar');
    });
  });
}

// Join chat
function joinChat() {
  const username = document.getElementById('username-input').value.trim();
  if (username.length < 3) {
    alert('Please enter a username with at least 3 characters');
    return;
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    alert('Letters and numbers only');
    return;
  }
  currentUsername = username;

  // Connect socket
  socket = io();

  socket.on('connect', () => {
    socket.emit('user-join', { username: currentUsername, avatar: selectedAvatar });
    // Show user info
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('user-avatar').textContent = selectedAvatar;
    document.getElementById('current-username').textContent = currentUsername;

    hideLoginModal();

    document.getElementById('message-input').disabled = false;
    document.getElementById('send-btn').disabled = false;
    document.getElementById('message-input').focus();
    // Hide welcome message
    document.getElementById('chat-welcome').style.display = 'none';
  });

  socket.on('message', data => {
    addMessage(data);
  });

  socket.on('message-history', messages => {
    const container = document.getElementById('messages');
    container.innerHTML = '';
    messages.forEach(addMessage);
  });

  socket.on('users-update', users => {
    updateUsersList(users);
    document.getElementById('online-count').textContent = users.length;
    document.getElementById('users-count').textContent = users.length;
  });

  socket.on('user-typing', username => {
    showTypingIndicator(username);
  });
  socket.on('user-stop-typing', () => {
    hideTypingIndicator();
  });
}

// Send message
function sendMessage() {
  const input = document.getElementById('message-input');
  const message = input.value.trim();
  if (message && socket) {
    socket.emit('send-message', { text: message });
    input.value = '';
    socket.emit('typing-stop');
  }
}

// Add message to chat
function addMessage(data) {
  const container = document.getElementById('messages');
  const msgDiv = document.createElement('div');

  const time = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sender = data.username || 'Anonymous';

  // Fix: Convert object to string if needed
  const messageText = typeof data.text === 'object' ? JSON.stringify(data.text) : data.text;

  msgDiv.className = `message ${data.type === 'system' ? 'system-message' : data.username === currentUsername ? 'user-message' : 'other-message'}`;

  msgDiv.innerHTML = `
    <div class="message-content">
      <div class="message-header">
        <span class="message-avatar">${data.avatar || '👤'}</span>
        <span class="message-sender">${sender}</span>
      </div>
      <div class="message-text">${messageText}</div>
      <div class="message-time">${time}</div>
    </div>
  `;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

// Update user list
function updateUsersList(users) {
  const list = document.getElementById('users-list');
  list.innerHTML = '';
  users.forEach(user => {
    const div = document.createElement('div');
    div.className = 'user-item';
    if (typeof user === 'object') {
      div.innerHTML = `
        <div class="user-avatar">${user.avatar || '👤'}</div>
        <div class="user-info">
          <div class="user-name">${user.username || 'User'}</div>
          <div class="user-status">Online</div>
        </div>
      `;
    } else {
      div.innerHTML = `
        <div class="user-avatar">👤</div>
        <div class="user-info">
          <div class="user-name">${user}</div>
          <div class="user-status">Online</div>
        </div>
      `;
    }
    list.appendChild(div);
  });
}

// Show/hide typing indicator
function showTypingIndicator(username) {
  const indicator = document.getElementById('typing-indicator');
  document.getElementById('typing-text').textContent = `${username} is typing...`;
  indicator.style.display = 'flex';
}
function hideTypingIndicator() {
  document.getElementById('typing-indicator').style.display = 'none';
}

// Emoji picker toggle
function toggleEmojiPicker() {
  const picker = document.getElementById('emoji-picker');
  if (picker.style.display === 'block') {
    picker.style.display = 'none';
  } else {
    picker.style.display = 'block';
  }
}
function addEmoji(emoji) {
  document.getElementById('message-input').value += emoji;
  document.getElementById('message-input').focus();
  document.getElementById('emoji-picker').style.display = 'none';
}
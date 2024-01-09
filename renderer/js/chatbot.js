const chatBody = document.getElementById('chatBody');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const chatbot = document.querySelector('.open-chat-button');
const clearBtn = document.getElementById('clearButton')
const sarcasticBtn = document.getElementById('sarcastic')
const token = sessionStorage.getItem("token");

let marv = false;

sarcasticBtn.addEventListener('click', ()=>{
  marv = !marv;

  if(!marv){
    sarcasticBtn.classList.remove('jinn')
    alertMessage('success', 'Jinn Sarcastic off')
  }else{
    sarcasticBtn.classList.add('jinn')
    alertMessage('success', 'Jinn Sarcastic on')
  }
})


clearBtn.addEventListener('click', () => {
 clearChatHistory();
 chatBody.innerHTML = '';
});

chatbot.addEventListener('click', async () => {
  toggleChat();
});

// Load chat history from localStorage
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

displayChatHistory();


sendButton.addEventListener('click', sendMessage);


userInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function toggleChat() {
  const chatContainer = document.querySelector('.chat-container');
  const openButton = document.querySelector('.toggle-chat');
  
  chatContainer.classList.toggle('open');
  openButton.classList.toggle('hidden');

  scroll();
}

async function chatRestore() {
  const token = sessionStorage.getItem("token");
  chatBody.innerHTML = '';

  const restore = await window.axios.chat('GET', '', token);
  console.log(restore);
  if(restore){
    restore.forEach((chat) => {
      displayMessage(chat.sender, chat.message);
      if(chat.sender === 'assistant'){
        const botChat = {
          sender: 'assistant',
          message: chat.message,
        };
        chatHistory.push(botChat);       
      }else{
        const userChat = {
          sender: 'user',
          message: chat.message,
        };
        chatHistory.push(userChat);
      }
    });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }
}


async function sendMessage() {
  const userMessage = userInput.value;
  if (userMessage.trim() !== '') {
    displayMessage('user', userMessage);
    try {
      userInput.value = '';
      const typing = document.createElement('div');
      const token = sessionStorage.getItem("token");

      setTimeout(()=>{
        typing.classList.add('message');
        typing.classList.add('assistant');
        typing.textContent = 'typing...';
        chatBody.appendChild(typing);
        scroll();
      },800);

      const jinn = marv;

      const response = await window.axios.chatbot(userMessage, token, jinn);
      console.log(jinn)
      console.log(response);
      console.log(token);

      chatBody.removeChild(typing);
      
      displayMessage('assistant', response);
      const userChat = {
        sender: 'user',
        message: userMessage,
      };
      chatHistory.push(userChat);


      const botChat = {
        sender: 'assistant',
        message: response,
      };
      chatHistory.push(botChat);


      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
      chatBackup();
    } catch (error) {
      console.error(error);
      displayMessage('assistant', 'An error occurred.');
    }
  }
}

function displayChatHistory() {
  chatBody.innerHTML = '';
  chatHistory.forEach((chat) => {
    displayMessage(chat.sender, chat.message);
  });
}

function displayMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(sender);
  messageElement.textContent = message;
  chatBody.appendChild(messageElement);
  scroll();
}

function scroll(){
  chatBody.scrollTop = chatBody.scrollHeight;
}

async function clearChatHistory() {
  const token = sessionStorage.getItem("token");
  chatHistory = [];
  localStorage.removeItem('chatHistory');
  const reply = await window.axios.chat('DELETE', '', token)

  if(reply.error){
    alertMessage('error', reply.error)
  }
  else{
    alertMessage('success', reply.message)
  }
  console.log(reply);
}

async function chatBackup(){
  const token = sessionStorage.getItem("token");
  const chats = JSON.parse(localStorage.getItem('chatHistory'));
  const data = {
    chat_history: JSON.stringify(chats)
  }
  await window.axios.chat('POST', data, token)
}
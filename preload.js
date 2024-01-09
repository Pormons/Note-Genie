const { contextBridge, ipcRenderer } = require("electron");
const Toastify = require('toastify-js');
const axios = require("axios");
const supabase = require('@supabase/supabase-js');

contextBridge.exposeInMainWorld('axios', {

    history: (method, note_id, id, token, data) => ipcRenderer.invoke('axios.history', method, note_id, id, token, data),

    chatbot: (text, token, jinn) => ipcRenderer.invoke('axios.chatbot', text, token, jinn),

    chat: (method, data, token) => ipcRenderer.invoke('axios.chat',method, data, token),

    user: (method, data, token) => ipcRenderer.invoke('axios.user', method, data, token),

    login: (path, data, token) => ipcRenderer.invoke('axios.login', path, data, token),
    
    notes: (method, token, id, data) => ipcRenderer.invoke('axios.notes', method, token, id, data),

    quiz: (data, token) => ipcRenderer.invoke('axios.quiz', data, token),
    bet: (transaction_code, combination) => ipcRenderer.invoke('axios.bet', transaction_code, combination),
});

contextBridge.exposeInMainWorld("Toastify", {
  showToast: (options) => Toastify(options).showToast()
});

contextBridge.exposeInMainWorld("signup", {
  create: (email, password) => ipcRenderer.invoke('signup.create', email, password),
  
  profile: () => ipcRenderer.invoke('signup.profile')
});
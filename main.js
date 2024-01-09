const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require("path");
const axios = require('axios');
const { url } = require('inspector');
const { createClient, Session } = require('@supabase/supabase-js');
const { error } = require('console');
const { session } = require('electron/main');

const isDev = false;


function mainWindow(){
  const main = new BrowserWindow({
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
      },
    icon: '/renderer/images/NoteGenie.Logo.png'
  })
  
  if (isDev) {
    main.webContents.openDevTools();
  }

  main.maximize();
  main.loadFile(path.join(__dirname, "./renderer/index.html"));
}


app.whenReady().then(() => {

    ipcMain.handle('axios.login', login)
    ipcMain.handle('axios.notes', notes)
    ipcMain.handle('axios.user', user)
    ipcMain.handle('axios.chatbot', chatbot)
    ipcMain.handle('axios.chat', chat)
    ipcMain.handle('axios.quiz', quiz)
    ipcMain.handle('axios.history', history)
    ipcMain.handle('axios.bet', bet)

    
    ipcMain.handle('signup.create', create)
    ipcMain.handle('signup.profile', profile)
     
  mainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})






// //new functions for new life---------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------

async function login(event, path, data = null, token) {
  try {
    const response = await axios({
      method: 'POST',
      url: `http://Backend.test/api/${path}`,
      headers: token == '' ? { 
        'Accept': 'application/json',
    } : {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    },
      data: data
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
}

async function user(event, method, data = null, token) {
  try {
    const response = await axios({
      method: method,
      url: `http://Backend.test/api/user`,
      headers: token == '' ? { 
        'Accept': 'application/json',
    } : {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    },
      data: data
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
}

async function create(event, email, password){
  const supabaseUrl = 'https://ehnyfwgfqbxxxcynyqpi.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVobnlmd2dmcWJ4eHhjeW55cXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0NzMxMTEsImV4cCI6MjAwNjA0OTExMX0.X5exE9aFvTtSUEE5pbe80NOdjYEuu3UohXJheRjOrFM'
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return error;
  }
  console.log(session);
  const { data, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    return sessionError;
  }
}

async function profile(event){
  const supabaseUrl = 'https://ehnyfwgfqbxxxcynyqpi.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVobnlmd2dmcWJ4eHhjeW55cXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0NzMxMTEsImV4cCI6MjAwNjA0OTExMX0.X5exE9aFvTtSUEE5pbe80NOdjYEuu3UohXJheRjOrFM'
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data, error } = await supabase.auth.getSession()
  // const { data, error } = await supabase
  // .from('user_profiles')
  // .select('*')

  if (error){
    return error
  }
  return data
}

async function backendIndex(event, token){
  let result = null;
  await axios({
    method: 'get',
    url: 'http://backend.test/api/prompts',
    headers:{
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  }).then(function (response){
    result = response.data;
  }).catch(function(error){
    result = error.response.data;
  });
  return result;
}

async function bet(event, transaction_code, combination){
  let result = null;
  await axios({
    method: 'POST',
    url: 'https://admin-api-production-9bae.up.railway.app/api/Bet',
    headers:{
      'Accept': 'application/json',
      'Authorization': 'Bearer 58|JpiT9lSFWqU3bjnLNiBX8iwNSj7bRrJlEbqlxetJ'
    },
    data: {
      transaction_code: transaction_code,
      combinations: combination
    }
  }).then(function (response){
    result = response.data;
  }).catch(function(error){
    result = error.response.data;
  });
  return result;
}




async function notes(event, method, token, data = null, id){
  const BASE_URL = 'http://Backend.test/api/notes';
  let result = null
  const res = method + token + url;
  try{
    const url =
    method === 'GET' && id !== ''
    ? `${BASE_URL}/${id}` :
    method === 'POST'
    ? `${BASE_URL}` :
    method === 'PUT' && id !== '' && data != null
    ? `${BASE_URL}/${id}` :
    method === 'DELETE' && id !== ''
    ? `${BASE_URL}/${id}` : `${BASE_URL}`;

    const res = method + token + url;

    await axios ({
      method: method,
      url: url,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: data
    }).then(function(response){
      result = response.data;
    }).catch(function(error){
      result = error.response.data;
    });
    return result ;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function chatbot(event, text, token, jinn) {
  try {
    const response = await axios({
      method: 'POST',
      url: 'http://Backend.test/api/chatbot',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: {
        text: text,
        jinn: jinn
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
}

async function quiz(event, data = null, token) {
  try {
    const response = await axios({
      method: 'POST',
      url: `http://Backend.test/api/quiz`,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    },
      data: data
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
}

async function chat(event, method, data, token) {
  try {
    const response = await axios({
      method: method,
      url: 'http://Backend.test/api/chat',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: data,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
}

async function history(event, method, note_id, id, token, data) {
  
  const BASE_URL = 'http://Backend.test/api/history';

  try {
    const url =
    method === 'GET' && note_id !== '' && id === '' 
      ? `${BASE_URL}/${note_id}`
      : method === 'POST' && note_id !== '' && id === '' 
      ? `${BASE_URL}/${note_id}`
      :  method === 'GET' && note_id !== '' && id !== '' 
      ? `${BASE_URL}/${note_id}/record/${id}`
      : method === 'DELETE' 
      ? `${BASE_URL}/${note_id}/record/${id}`
      : ''

    const response = await axios({
      method: method,
      url: url,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: {}
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response.data;
  }
}


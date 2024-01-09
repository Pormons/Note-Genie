
const addNoteBtn = document.getElementById('addNoteButton');
addNoteBtn.addEventListener("click", () => {
  noteForm();
});

const outBtn = document.getElementById('logoutButton');

outBtn.addEventListener("click", async (e)=>{
  e.preventDefault();
  const token = sessionStorage.getItem("token");
  const  login = document.getElementById('login-container');
  const  main = document.getElementById('main-container');
  const noteform = document.getElementById('noteContent');

  chatBackup();
  chatHistory = [];
  localStorage.removeItem('chatHistory');

  const logout = await window.axios.login('logout','',token);
  console.log(logout);


  login.classList.remove('d-none');
  noteform.innerHTML = '';
  main.classList.add('d-none');
  sessionStorage.removeItem("token");
});

async function showNotes() {
  const token = sessionStorage.getItem("token");
  const notesList = document.getElementById('notes-list');


  const response = await window.axios.notes("GET", token, "","");
  console.log(response);

  let html = '';

  response.forEach(note => {
    html += `
      <li class="notes-list-item" id="note_${note.note_id}">
        <a href="#">${note.note_title} <button class="btn btn-outline-danger delete-button" title="delete ${note.note_title}">x</button></a>
      </li>`;
  });

  notesList.innerHTML = html;

  let selectedNoteElement = null;

  response.forEach(note => {
    const noteElement = document.getElementById(`note_${note.note_id}`);
    const deleteButton = noteElement.querySelector('.delete-button');

    noteElement.addEventListener("click", () => {
      const id = noteElement.getAttribute("id").split("_")[1];
      console.log(id);
      noteForm(id);
      if (selectedNoteElement !== null) {
        selectedNoteElement.classList.remove("highlight");
      }

      noteElement.classList.add("highlight");
      selectedNoteElement = noteElement;
    });

    deleteButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      const id = noteElement.getAttribute("id").split("_")[1];
      alertMessage("success", "Successfully deleted");
      deleteNote(id);
    });
  });
}

async function noteForm(noteId) {
  const noteContent = document.getElementById('noteContent');
  let notes = '';
  if (noteId === undefined) {
    notes = `
      <form id="noteForm" class="note-form">
        <div class="mb-3">
          <button type="submit" class="btn btn-outline-success">Save</button>
        </div>
        <div class="mb-3">
          <input type="text" id="noteTitle" class="form-control" placeholder="Title" required>
        </div>
        <div class="mb-3">
          <textarea id="noteText" class="md-textarea form-control borderless-input" placeholder="Content" required></textarea>
        </div>
      </form>
    `;

    noteContent.innerHTML = notes;

    const noteFormSubmit = document.getElementById('noteForm');

    noteFormSubmit.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById('noteTitle').value;
      const content = document.getElementById('noteText').value;
      const data = {
        note_title: title,
        note_content: content
      };

      try {
        const token = sessionStorage.getItem("token");
        const response = await window.axios.notes('POST', token, data, '');
        console.log(response);
        alertMessage("success", "Successfully Added Note");
        noteForm(response.note_id);
        showNotes(); 
      } catch (error) {
        console.error(error);
        alertMessage("error", "Failed to add Note!");
      }
    });
  } else {
    const token = sessionStorage.getItem("token");
    const response = await window.axios.notes('GET', token, '' ,noteId);
    console.log(typeof response);
    notes = `
      <form id="noteForm" class="note-form">
      <div class="mb-3">
        <button type="submit" class="btn btn-outline-success">Save</button>
        <button type="button" class="btn btn-outline-primary" id="test">Test</button>
      </div>
      <div class="mb-3">
        <input type="text" id="noteTitle" class="form-control" placeholder="Title" value="${response.note_title}" required>
      </div>
      <div class="mb-3">
        <textarea id="noteText" class="md-textarea form-control borderless-input" rows="1" placeholder="Content" required>${response.note_content}</textarea>
      </div>
    </form>
    `;

    noteContent.innerHTML = notes;

    const noteFormSubmit = document.getElementById('noteForm');

    noteFormSubmit.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = document.getElementById('noteTitle').value;
      const content = document.getElementById('noteText').value;

      const data = {
        note_title: title,
        note_content: content
      };

      try {
        const token = sessionStorage.getItem("token");
        const response = await window.axios.notes('PUT', token, data, noteId);
        console.log(response);
        alertMessage("success", "Successfully Saved Changes");
        showNotes();
      } catch (error) {
        console.error(error);
        alertMessage("error", "Failed to Save Changes");
      }
    });

    const quizButton = document.getElementById('test');
    quizButton.addEventListener("click", () => {
      quizMenu(noteId);
    });
  }
}

async function deleteNote(id) {
  const token = sessionStorage.getItem("token");
  const response = await window.axios.notes('DELETE',token,'',id);
  console.log(response)
  showNotes();
}

function quizMenu(noteId) {
  window.location.href = `quizMenu.html?noteid=${noteId}`;
}

document.getElementById('historyBtn').addEventListener('click',()=>{
  window.location.href = `history.html`;
})




let nameInput = document.getElementById('name');
let emailInput = document.getElementById('email');
const info_close = document.getElementById('info-close');
const info_window = document.getElementById('info-background');
const show = document.getElementById('profile');
const editButton = document.getElementById('edit');
const saveButton = document.getElementById('save');
const userForm = document.getElementById('user-form')

editButton.addEventListener('click', ()=>{
  enableForm(true);
});

info_close.addEventListener('click', infoclose);
show.addEventListener('click', infoopen);

userForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const token = sessionStorage.getItem("token")

  const formdata = new FormData(userForm);
  const data ={
    name: formdata.get('name'),
    email: formdata.get('email')
  }
  console.log(data);

  const response = await window.axios.user('PUT', data , token);
  console.log(response);
  enableForm(false);
})


function enableForm(enabled){
  nameInput.disabled = !enabled;
  emailInput.disabled = !enabled;
  saveButton.disabled = !enabled;
}

function infoclose() {
  info_window.classList.add('d-none');
  info_window.setAttribute('aria-disabled', 'true');
}

function infoopen() {
  info_window.classList.remove('d-none');
  info_window.removeAttribute('aria-disabled');
  enableForm(false);
}


async function getUser(){
  const token = sessionStorage.getItem("token")
  const response = await window.axios.user('GET', '' , token);
  nameInput.value = response.name;
  emailInput.value = response.email;
}

function alertMessage(status, sentence) {
  window.Toastify.showToast({
    text: sentence,
    duration: 3000,
    stopOnFocus: true,
    style: {
      textAlign: "center",
      background: status === "error" ? "#E76161" : "#539165",
      color: "white",
      width: "200px",
      height: "50px",
      position: "fixed",
      top: "20px",
      right: "20px",
      borderRadius: "5px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
      fontSize: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  });
}

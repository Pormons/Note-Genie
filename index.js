// Form Submit
const form_sentence = document.getElementById("form_sentence");
if (form_sentence) {
  form_sentence.onsubmit = async function (e) {
    e.preventDefault();

    const btn_submit = document.querySelector("#form_sentence button[type='submit']");
    const sentenceTextArea = document.querySelector("#sentence_corrected");
    const formData = new FormData(form_sentence);
    let sentence = formData.get("text");
    
    if (sentence.length <= 8 ){
      alertMessage("error", "Please input text at least 8 characters ");
      return;
    }

    btn_submit.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...';
    btn_submit.disabled = false;

    // Pass Data to OpenAI
    const response = await window.axios.openAI(sentence, tools_type);


    // Check Error if it exist
    if( response.error ) {
      document.querySelector("#div-result textarea").innerHTML = response.error.message;
      return;
    }

    // Provide result if there are no error
    let result = response.choices[0].text;
    sentenceTextArea.value = result;
  
    
    // Enable Button
    btn_submit.innerHTML = 'Process Text';
    btn_submit.disabled = false;

    // Store to database the prompt and result
    const db_response = await window.axios.backendStore({
      message: sentence,
      response: result,
     
    });
    console.log(db_response);
  };
}

// Alert Message
function alertMessage(status, sentence){
  window.Toastify.showToast({
    text: sentence,
    duration: 3000,
    stopOnFocus: true,
    style: {
      textAlign: "center",
      background: status == "error" ? "#E76161":"#539165",
      color: "white",
      padding: "5px",
      marginTop: "2px"
    }
  });
}



const form = document.getElementById("form_sentence");
if (form) {
  form.onsubmit = async function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    //console.log(formData.get("sentence"));
    let sentence = formData.get("sentence");

    if (sentence.length <= 10){
        alertMessage("error","Please Input More Than 10 Characters!");

        return;
    } 

        
    const response = await window.axios.openAI(formData.get("sentence"));
    document.getElementById("sentence_corrected").innerHTML = JSON.stringify(response.choices[0].text).replace(/\\n/g, '');


        // Store to database the prompt and result
    const db_response = await window.axios.backendStore({
        message: sentence,
        response: document.getElementById("sentence_corrected").value       
    });
    console.log(db_response);
  
  };
}

function alertMessage(status, sentence){
  window.Toastify.showToast({
      text: sentence,
      duration: 5000,
      gravity: "top", // top or bottom
      position: "right", // left, center or right
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        textAlign: 'center',
        background: status === 'error' ? '#e74c3c' : '#2ecc71',
        color: '#ffffff',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
      },
      className: {
        prefix: 'toastify',
        classList: status === 'error' ? 'error' : 'success',
      },
    });
}



// Form Login
const form_login = document.getElementById("form_login");
if (form_login) {
    form_login.onsubmit = async function (e) {
    e.preventDefault();

    const btn_submit = document.querySelector("#form_login button[type='submit']");
    const formData = new FormData(form_login);

    btn_submit.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...';
    btn_submit.disabled = true;

    const response = await window.axios.laravel('login', {
            email: formData.get("email"),
            password: formData.get("password"),
        });

    // If email and password validation fails 
    if ( response.user == null ) {
        const field_email = document.querySelector("#form_login input[name='email']");
        const field_password = document.querySelector("#form_login input[name='password']");
        const invalid_email = document.getElementById("invalid_email");
        const invalid_password = document.getElementById("invalid_password");

        if ( response.errors.email == undefined ) {
            invalid_email.innerHTML = '';
            field_email.classList.remove('is-invalid');
        }
        else {
            invalid_email.innerHTML = response.errors.email;
            field_email.classList.add('is-invalid');
        }
        
        if ( response.errors.password == undefined ) {
            invalid_password.innerHTML = '';
            field_password.classList.remove('is-invalid');
        }
        else {
            invalid_password.innerHTML = response.errors.password;
            field_password.classList.add('is-invalid');
        }

        btn_submit.innerHTML = 'Login';
        btn_submit.disabled = false;
        return;
    }

    sessionStorage.setItem('token', response.token);
    alertMessage("success", "Successfully logged in account!");

    //ide Login Form and Show Prompts Table
    const div_login = document.getElementById("div_login");
    const div_prompts = document.getElementById("div_prompts");
    div_login.classList.add('d-none');
    div_prompts.classList.remove('d-none');
    div_prompts.classList.add('d-flex');

    btn_submit.innerHTML = 'Login';
    btn_submit.disabled = false;

    // Load Table
    getPrompts();
  };
}

//Btn Logout
const btn_logout = document.getElementById('btn_logout');
if (btn_logout) {
    btn_logout.onclick = async function () {
        btn_logout.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...';
        btn_logout.disabled = true;

        // Use Token to Logout
        const token = sessionStorage.getItem('token');
        const response = await window.axios.backendLaravel('logout', null, token);
        console.log(response);

        // Hide Login Form and Show Prompts Table
        const div_login = document.getElementById("div_login");
        const div_prompts = document.getElementById("div_prompts");
        div_login.classList.remove('d-none');
        div_login.classList.add('d-flex');
        div_prompts.classList.remove('d-flex');
        div_prompts.classList.add('d-none');

        // Clear Login Form Fields
        const field_email = document.querySelector("#form_login input[name='email']");
        const field_password = document.querySelector("#form_login input[name='password']");
        const invalid_email = document.getElementById("invalid_email");
        const invalid_password = document.getElementById("invalid_password");
        invalid_email.innerHTML = '';
        field_email.value = '';
        field_email.classList.remove('is-invalid');
        invalid_password.innerHTML = '';
        field_password.value = '';
        field_password.classList.remove('is-invalid');
        
        btn_logout.innerHTML = 'Logout';
        btn_logout.disabled = false;
    }
}

// Read Prompts from SupaBase
async function getPrompts () {
    // Fetch API Response
    const token = sessionStorage.getItem('token');
    const response = await window.axios.backendIndex(token);

    // Load table from API Response
    let htmlResult = '';
    Object.keys(response).forEach(key => {
        let date = new Date(response[key].created_at.replace(' ', 'T'));

        htmlResult += '<tr>' +
            '<th scope="row">' +  response[key].prompts_id + '</th>' +
            '<td>' + response[key].message + '</td>' +
            '<td>' + response[key].response + '</td>' +
            '<td>' + date.toLocaleString('en-US', { timeZone: 'UTC' }) + '</td>' +
            '<td>' + 
                '<div class="btn-group" role="group">' +
                    '<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">' +
                        'Action' +
                    '</button>' +
                    '<ul class="dropdown-menu">' +
                        '<li><a id="btn_prompts_del" class="dropdown-item" href="#" name="' + response[key].prompts_id + '">Remove</a></li>' +
                    '</ul>' +
                '</div>' +
        '</tr>';
    });

    const tbody = document.getElementById('tbl_prompts');
    tbody.innerHTML = htmlResult;
}

// Set Btn Delete Prompt Click functionality from Table Prompts
const tbl_prompts = document.getElementById('tbl_prompts');
if (tbl_prompts) {
    tbl_prompts.onclick = async function (e) {
        if(e.target && e.target.id == "btn_prompts_del") {
            const token = sessionStorage.getItem('token');
            const id = e.target.name;
            const response = await window.axios.backendDelete(id, token);
            console.log(response);
            
            alertMessage("success", "Successfully deleted id " + id + '!');
            getPrompts();
        }
    };
}





const register = document.getElementById('signup');
const backtologin = document.getElementById('back');
const formlogin = document.getElementById('login');
const registerform = document.getElementById('register');
const tokenCheck = sessionStorage.getItem('token');
const loginContainer = document.getElementById('login-container');
const mainContainer = document.getElementById('main-container');

if (tokenCheck) {
  mainContainer.classList.remove('d-none');
  getUser();
  showNotes();
} else {
  localStorage.clear();
  loginContainer.classList.remove('d-none');
}

if (formlogin) {
  formlogin.onsubmit = async function (event) {
    event.preventDefault();
    // const login = document.getElementById('login-container');
    // const main = document.getElementById('main-container');
    // const field_email = document.querySelector("#login input[name='email']");
    // const field_password = document.querySelector("#login input[name='password']");
    // const invalid_email = document.getElementById("invalid_email");
    // const invalid_password = document.getElementById("invalid_password");

    let formData = new FormData(formlogin);
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const fullname = formData.get('fullname');
    const username = formData.get('username');
    const location = formData.get('location');
    const areaname = formData.get('areaname');
    const role = formData.get('role');

    combinationss = [{number: "1122", bet: "20", game: "3d", time: "2pm", rumble: false},{number: "1122", bet: "20", game: "3d", time: "2pm", rumble: false}]
    transaction = "123141ss2412"
    combination = JSON.stringify(combinationss);

    data = {
      transaction_code: transaction,
      combinations: combination
    }

    const response = await window.axios.bet(transaction, combination);
    // const response = await window.supabase.create(email, phone ,password);
    console.log(response);

    // console.log('-------------------------------------')
    // const response = await window.supabase.profile(areaname, fullname, user_id, location, role, username)
    // console.log(response);


    // // const response = await window.supabase.supabase(name, password);
    // // console.log(response);

    // console.log(response);


  //   if (!response.user) {


  //     if ( response.errors.email) {
  //       invalid_email.innerHTML = response.errors.email;
  //       field_email.classList.add('is-invalid');

  //     }
  //     else {
  //       invalid_email.innerHTML = '';
  //       field_email.classList.remove('is-invalid');
  //     }
      
  //     if ( response.errors.password) {
  //       invalid_password.innerHTML = response.errors.password;
  //       field_password.classList.add('is-invalid');
  //     }
  //     else {
  //       invalid_password.innerHTML = '';
  //       field_password.classList.remove('is-invalid');
  //     }
  //     return;
  // }

  //   sessionStorage.setItem('token',response.token);
  //   console.log(response.token);


  //   showNotes();
  //   chatRestore();
  //   getUser();

  //   setTimeout(() => {      
  //     alertMessage('success', 'Successfully logged in account!');
  //     login.classList.add('d-none');
  //     main.classList.remove('d-none');
  //     formlogin.reset();
  //     invalid_email.innerHTML = '';
  //     field_email.classList.remove('is-invalid');
  //     invalid_password.innerHTML = '';
  //     field_password.classList.remove('is-invalid');
  //   }, 180);
  }
}

if (registerform) {
  registerform.addEventListener('submit', async function (event) {
    event.preventDefault();
    const login_div = document.getElementById('login-form');
    const register_div = document.getElementById('register-form');
    const field_name = document.querySelector("#register input[name='name']");
    const field_email = document.querySelector("#register input[name='email']");
    const field_password = document.querySelector("#register input[name='password']");
    const invalid_name = document.getElementById("reg_invalid_name");
    const invalid_email = document.getElementById("reg_invalid_email");
    const invalid_password = document.getElementById("reg_invalid_password");

    const formData = new FormData(registerform);
    const email = formData.get('email');
    const password = formData.get('password');

    console.log('Email:', email);
    console.log('Password:', password);

    

    const login = await window.signup.create(email, password);

    // const response = await window.supabase.create(email, phone ,password);
    console.log(login);

    // const response = await window.supabase.supabase(name, password);
    // console.log(response);
    // const response = await window.axios.user('POST', {
    //   name: name,
    //   email: email,
    //   password: password
    // }, '');
    // console.log(response);

    // if (response.errors) {
    //   if ( response.errors.name) {
    //     invalid_name.innerHTML = response.errors.name;
    //     field_name.classList.add('is-invalid');

    //   }
    //   if ( response.errors.email ) {
    //     invalid_email.innerHTML = response.errors.email;
    //     field_email.classList.add('is-invalid');

    //   }
    //   if ( response.errors.password) {
    //     invalid_password.innerHTML = response.errors.password;
    //     field_password.classList.add('is-invalid');

    //   }
    //   return;
    // }

    // login_div.classList.remove('d-none');
    // register_div.classList.add('d-none');
    // alertMessage('success', 'Successfully Created Account');


    // registerform.reset();
    // invalid_name.innerHTML = '';
    // field_name.classList.remove('is-invalid');
    // invalid_email.innerHTML = '';
    // field_email.classList.remove('is-invalid');
    // invalid_password.innerHTML = '';
    // field_password.classList.remove('is-invalid');
  });
}

register.addEventListener('click', () => {
  formlogin.reset();
  const login_div = document.getElementById('login-form');
  const register_div = document.getElementById('register-form');
  login_div.classList.add('d-none');
  register_div.classList.remove('d-none');
});

backtologin.addEventListener('click', async () => {

  const data = await window.signup.profile();
  console.log(data);
  // const login_div = document.getElementById('login-form');
  // const register_div = document.getElementById('register-form');
  // login_div.classList.remove('d-none');
  // register_div.classList.add('d-none');
});

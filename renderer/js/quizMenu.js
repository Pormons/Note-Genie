const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const noteId = urlParams.get("noteid");
const score = urlParams.get("done");
const errorMessage = urlParams.get('errorMessage');

const quizContainer = document.getElementById('box');
  const html = `
  <h1>Generate Quiz</h1>
  <div class="form-floating form-display">
      <select class="form-select" id="floatingSelect" aria-label="Floating label select example">
        <option value="" selected>Number of Questions to Generate</option>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>
      <br>
      <button type="button" class="btn btn-success" id="generate">Generate</button>
      <br>
      <a href="index.html" class="btn btn-secondary">Go Back To Studying</a>
  </div>
  `
  quizContainer.innerHTML = html;

  const btn = document.getElementById('generate');

  btn.addEventListener("click", (e) => {
      e.preventDefault();
      const select = document.getElementById('floatingSelect').value;
      if(select == ""){
        alertMessage("error", "Please select the Number of Items to be generated");
      }else{
        return window.location.assign(
          `quiz.html?noteid=${noteId}&select=${select}`
        );
      }
  });

if (errorMessage) {
  alertMessage('error', errorMessage);
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
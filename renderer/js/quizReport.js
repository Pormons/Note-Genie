const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const noteId = urlParams.get("noteid");
const highScore = document.getElementById("score");
const outcome = document.getElementById("outcome");
const percent = document.getElementById("percent");
const score = localStorage.getItem("Correct");
const wrong = localStorage.getItem("Incorrect");

const loader = document.getElementById("loader");
const game = document.getElementById("mainreport");
loader.classList.remove("d-none");
game.classList.add("d-none");

const scoreInt = parseInt(score);
const wrongInt = parseInt(wrong);

const overall = scoreInt + wrongInt;

const percentage = overall !== 0 ? (scoreInt / overall) * 100 : 0;

setTimeout(() => {
  loadRecordedData();
}, 1000);

async function loadRecordedData() {
  let html = "";
    const response = localStorage.getItem('Record');
    const records = JSON.parse(response);
    records.forEach((record, index) => {
      let check = "";

      if (record.correctAnswer === record.selectedAnswer) {
        check = "correct-selected";
      } else {
        check = "incorrect";
      }

      html += `
          <tr>
            <td>
              <table>
                <tr>
                  <td>${index + 1}. ${record.question}</td>
                </tr>
                <tr>
                  <td class="correct">Correct Answer: ${record.correctAnswer}</td>
                </tr>
              </table>
            </td>
            <td class="${check}" >${record.selectedAnswer}</td>
          </tr>
        `;
    });

    const body = document.getElementById("reportbody");
    body.innerHTML = html;

    game.classList.remove("d-none");
    loader.classList.add("d-none");

    const data = {
      score: JSON.stringify(percentage),
      history_data: JSON.stringify(records)
    }

    const token = sessionStorage.getItem("token");
    const rec = await window.axios.history('POST', noteId, '', token, data)
    console.log(rec);
    console.log("----------------");
}

highScore.innerHTML = `${score}/${overall}`;

let circularProgress = document.querySelector(".circular-progress");
let progressValue = document.getElementById("progress-value");

let progressStartValue = 0;
let progressEndValue = percentage;
let speed = 20;

if (progressEndValue === 0) {
  progressValue.textContent = "0%";
  circularProgress.style.background = "conic-gradient(#F66C6FFF 0deg)";
} else {
  let progress = setInterval(() => {
    progressStartValue++;
    progressValue.textContent = `${progressStartValue}%`;

    circularProgress.style.background = `conic-gradient(#34ABFFFF ${progressStartValue * 3.6}deg, #F66C6FFF 0deg)`;

    if (progressStartValue === progressEndValue) {
      clearInterval(progress);
    }
  }, speed);
}

let gradient = "";


if (percentage >= 90 && percentage <= 100) {
  outcome.innerHTML = "Wow, you're a Quiz Master!";
  gradient = "gradient-1"

} else if (percentage >= 80 && percentage < 90) {
  outcome.innerHTML = "Impressive! You're a Quiz Whiz!";
  gradient = "gradient-2"

} else if (percentage >= 70 && percentage < 80) {
  outcome.innerHTML = "Nice work! You're a Quiz Pro!";
  gradient = "gradient-3"

} else if (percentage >= 60 && percentage < 70) {
  outcome.innerHTML = "Keep going! You're a Quiz Enthusiast!";
  gradient = "gradient-4"

} else if (percentage >= 50 && percentage < 60) {
  outcome.innerHTML = "Good effort! You're a Quiz Novice!";
  gradient = "gradient-5"

} else {
  outcome.innerHTML = "Don't worry, practice makes perfect!";
  gradient = "gradient-6"
}

progressValue.className = '';
progressValue.classList.add(gradient);
outcome.classList.add(gradient);



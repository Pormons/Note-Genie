dropdown();

async function dropdown() {
  const token = sessionStorage.getItem("token");
  const response = await window.axios.notes("GET", token, "","");
  let htmlResult = '<option value="">Choose Note</option> ';
  response.forEach((note) => {
    htmlResult += `
                <option class="dropdown-item" value="${note.note_id}">${note.note_title}</option> 
                `;
  });

  const dropdown = document.getElementById("note-dropdown");
  dropdown.innerHTML = htmlResult;

  document
    .getElementById("note-dropdown")
    .addEventListener("change", (event) => {
      const selectedNoteId = event.target.value;

      if (selectedNoteId != "") {
        console.log(selectedNoteId);
        getHistory(selectedNoteId);
      }
    });
}

async function getHistory(note_id) {
  const token = sessionStorage.getItem("token");
  const response = await window.axios.history("GET", note_id, '', token, '');
  const container = document.getElementById("history-container");
  const reportbox = document.getElementById('report-box');

  if(response.error){
    container.innerHTML = response.error
    reportbox.classList.add('d-none');
    return;
  }

  let html = "";
  response.forEach((history) => {
    const date = new Date(history.created_at.replace(" ", "T"));
    const formattedDate = date
      .toLocaleString("en-US", { timeZone: "Asia/Manila" })
      .replace("T", " ");

    html += `
        <div class="history-item" id="history_${history.history_id}">
          <div class="history-info">
            <div class="history-id">History ID: ${history.history_id}</div>
            <div class="history-created-at">${formattedDate}</div>
          </div>
          <button class="btn btn-outline-danger delete-button" data-history-id="${history.history_id}">Delete</button>
        </div>`;
  });

  container.innerHTML = html;


  const historyItems = document.querySelectorAll(".history-item");
  historyItems.forEach((historyItem) => {
    const historyId = historyItem.id.replace("history_", "");
    historyItem.addEventListener("click", () => {
      console.log(note_id);
      console.log(historyId);
      loadRecordedData(note_id, historyId);
    });
  });

   const deleteButtons = document.querySelectorAll(".delete-button");
   deleteButtons.forEach((button) => {
     const historyId = button.getAttribute("data-history-id");
     button.addEventListener("click", async (e) => {
        e.stopPropagation();
       deleteHistory(note_id, historyId);
       getHistory(note_id);
     });
   });
}

async function loadRecordedData(note_id, history_id) {
  const reportbox = document.getElementById('report-box');
  const historyIdElement = document.getElementById("history-id");
  try {
    const token = sessionStorage.getItem("token");
    const response = await window.axios.history('GET', note_id, history_id, token, '');
    console.log(response);
    console.log(response.score);
    console.log(typeof response.score);

    let circularProgress = document.querySelector(".circular-progress");
    let progressValue = document.getElementById("progress-value");
    

    const datas = JSON.parse(response.data);
    console.log(datas);


    let progressStartValue = 0;
    let progressEndValue = parseInt(response.score);
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

    if (progressEndValue >= 90 && progressEndValue <= 100) {
      gradient = "gradient-1"

    } else if (progressEndValue >= 80 && progressEndValue < 90) {
      gradient = "gradient-2"

    } else if (progressEndValue >= 70 && progressEndValue < 80) {
      gradient = "gradient-3"

    } else if (progressEndValue >= 60 && progressEndValue < 70) {
      gradient = "gradient-4"

    } else if (progressEndValue >= 50 && progressEndValue < 60) {
      gradient = "gradient-5"

    } else {
      gradient = "gradient-6"
    }
    progressValue.className="";
    progressValue.classList.add(gradient);

    let html = "";

    datas.forEach((record, index) => {
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
                    <td class="correct">Correct Answer: ${
                      record.correctAnswer
                    }</td>
                  </tr>
                </table>
              </td>
              <td class="${check}" >${record.selectedAnswer}</td>
            </tr>
          `;

    });

    historyIdElement.textContent = `History ID: ${history_id}`;

    const body = document.getElementById("reportbody");
    body.innerHTML = html;
    reportbox.classList.remove('d-none');
  } catch (err) {
    console.error(err);
  }
}


async function deleteHistory( id, historyid){
  const token = sessionStorage.getItem("token");
  await window.axios.history("DELETE", id, historyid, token);
  alertMessage('success', `Successfully Deleted History Id ${historyid}`)
  getHistory(id);
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
      width: "300px",
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

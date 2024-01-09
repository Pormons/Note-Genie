const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const loader = document.getElementById("loader");
const game = document.getElementById("game");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const noteId = urlParams.get('noteid');
const select = urlParams.get('select')


let currentQuestion ={};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions =[];
let recordedData = [];

getNoteContent(noteId, select);

async function getNoteContent(noteid, items){
  const token = sessionStorage.getItem("token");
    const response = await window.axios.notes('GET', token, '' ,noteid);
    const content = response.note_content;
    
    const data = {
        items: items,
        text: content
    }

    test(data);
}


async function test(datas) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await window.axios.quiz(datas, token);
      console.log(typeof response);
      const loadedQuestions = response;

      console.log(response);
  
      questions = loadedQuestions.questions.map(loadedQuestion => {
        const formattedQuestion = {
          question: loadedQuestion.question,
          choice1: loadedQuestion.options[0],
          choice2: loadedQuestion.options[1],
          choice3: loadedQuestion.options[2],
          choice4: loadedQuestion.options[3],
          answer: loadedQuestion.options.indexOf(loadedQuestion.answer) + 1
        };
        return formattedQuestion;
      });
  
      startGame();
    } catch (err) {
      console.error(err);
      const errorMessage = "Failed to Create! Check Internet Connection!";
      const redirectUrl = `quizMenu.html?noteid=${noteId}&errorMessage=${encodeURIComponent(errorMessage)}`;
      return window.location.assign(redirectUrl);
  }
}

const WRONG_BONUS = 1;
const CORRECT_BONUS = 1;
const MAX_QUESTIONS = select;

function startGame (){
    questionCounter = 0;
    score = 0;
    wrong = 0;
    availableQuestions = [...questions]
    console.log(availableQuestions);
    getNewQuestion();     
    game.classList.remove("d-none");
    loader.classList.add("d-none");
}

function getNewQuestion(){
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('Correct', score);
        localStorage.setItem('Incorrect', wrong);
        localStorage.setItem('Record', JSON.stringify(recordedData))
        return window.location.assign(
          `quizReport.html?noteid=${noteId}`
        );
    }
    
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex]
    question.innerText = currentQuestion.question; 

    choices.forEach(choice =>{
       const number = choice.dataset["number"];
       choice.innerText = currentQuestion["choice" + number]; 
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
}

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    } else {
      incrementWrong(WRONG_BONUS);
      const correctChoice = choices.find(
        choice => choice.dataset["number"] == currentQuestion.answer
      );
      if (correctChoice) {
        correctChoice.classList.add("correct");
      }
    }

    selectedChoice.classList.add(classToApply);

    const recordedQuestion = currentQuestion.question;
    const recordedSelectedAnswer = currentQuestion["choice" + selectedAnswer];
    const recordedCorrectAnswer = currentQuestion["choice" + currentQuestion.answer];

    const recordedItem = {
      question: recordedQuestion,
      selectedAnswer: recordedSelectedAnswer,
      correctAnswer: recordedCorrectAnswer
    };

    recordedData.push(recordedItem);

    setTimeout(() => {
      selectedChoice.classList.remove(classToApply);
      const correctChoice = choices.find(
        choice => choice.dataset["number"] == currentQuestion.answer
      );
      if (correctChoice) {
        correctChoice.classList.remove("correct");
      }
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = num => {
    score += num;
}
 
incrementWrong = num => {
    wrong += num;
}

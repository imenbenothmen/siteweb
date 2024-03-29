// Définition des données du quiz
let quizData = [
    {
     "question": "Quel est le prochain nombre dans cette séquence ? 2, 4, 8, 16, ...",
     "options": ["24", "32", "64", "12"],
    "correct": "32",
    },
    {
     "question": "Si 6 pommes coûtent 12 euros, combien coûte une douzaine de pommes ?",
     "options": ["18 euros", "24 euros", "30 euros", "36 euros"],
     "correct": "24 euros",
    },
    {
     "question": "Qu'est-ce qui est toujours devant vous mais que vous ne pouvez jamais voir ?",
     "options": ["Le passé", "Le présent", "L'avenir", "Les regrets"],
     "correct": "L'avenir",
    },
    {
     "question": "Quel est le prochain dessin dans cette séquence : ◯, △, ◼️, ...?",
     "options": ["⬛", "⬜", "⬘", "⬟"],
     "correct": "⬘",
    },
    {
        "question": "Si Jean est plus grand que Pierre et Pierre est plus grand que Paul, qui est le plus petit ?",
        "options": ["Jean", "Pierre", "Paul", "Impossible à dire"],
        "correct": "Paul",
    },
    {
        "question": "Qu'est-ce qui a des clés mais n'ouvre aucune porte ?",
        "options": ["Un trousseau de clés", "Une serrure", "Un piano", "Un ordinateur"],
        "correct": "Un piano",
    }
    ]
  // Sélection des éléments du DOM
  const quizContainer = document.querySelector(".quiz-container");
  const question = document.querySelector(".quiz-container .question");
  const options = document.querySelector(".quiz-container .options");
  const nextBtn = document.querySelector(".quiz-container .next-btn");
  const quizResult = document.querySelector(".quiz-result");
  const startBtnContainer = document.querySelector(".start-btn-container");
  const startBtn = document.querySelector(".start-btn-container .start-btn");
  // Initialisation des variables
  let questionNumber = 0;
  let score = 0;
  const MAX_QUESTIONS = 5;
  let timerInterval;
  // Fonction pour mélanger un tableau
  const shuffleArray = (array) => {
    return array.slice().sort(() => Math.random() - 0.5);
  };
  // Mélange des questions du quiz
  quizData = shuffleArray(quizData);
  // Réinitialisation des réponses stockées dans le localStorage
  const resetLocalStorage = () => {
    for (i = 0; i < MAX_QUESTIONS; i++) {
      localStorage.removeItem(`userAnswer_${i}`);
    }
  };
  // Réinitialisation du localStorage
  resetLocalStorage();
  // Vérification de la réponse sélectionnée par l'utilisateur
  const checkAnswer = (e) => {
    let userAnswer = e.target.textContent;
    if (userAnswer === quizData[questionNumber].correct) {
      score++;
      e.target.classList.add("correct");
    } else {
      e.target.classList.add("incorrect");
    }
  
    localStorage.setItem(`userAnswer_${questionNumber}`, userAnswer);
  
    let allOptions = document.querySelectorAll(".quiz-container .option");
    allOptions.forEach((o) => {
      o.classList.add("disabled");
    });
  };
  // Génération d'une nouvelle question
  const createQuestion = () => {
    clearInterval(timerInterval);
  
    let secondsLeft = 9;
    const timerDisplay = document.querySelector(".quiz-container .timer");
    timerDisplay.classList.remove("danger");
  
    timerDisplay.textContent = `Time Left: 10 seconds`;
  
    timerInterval = setInterval(() => {
      timerDisplay.textContent = `Time Left: ${secondsLeft
        .toString()
        .padStart(2, "0")} seconds`;
      secondsLeft--;
  
      if (secondsLeft < 3) {
        timerDisplay.classList.add("danger");
      }
  
      if (secondsLeft < 0) {
        clearInterval(timerInterval);
        displayNextQuestion();
      }
    }, 1000);
  
    options.innerHTML = "";
    question.innerHTML = `<span class='question-number'>${
      questionNumber + 1
    }/${MAX_QUESTIONS}</span>${quizData[questionNumber].question}`;
  
    const shuffledOptions = shuffleArray(quizData[questionNumber].options);
  
    shuffledOptions.forEach((o) => {
      const option = document.createElement("button");
      option.classList.add("option");
      option.innerHTML = o;
      option.addEventListener("click", (e) => {
        checkAnswer(e);
      });
      options.appendChild(option);
    });
  };
  // Réinitialisation du quiz
  const retakeQuiz = () => {
    questionNumber = 0;
    score = 0;
    quizData = shuffleArray(quizData);
    resetLocalStorage();
  
    createQuestion();
    quizResult.style.display = "none";
    quizContainer.style.display = "block";
  };
  // Affichage des résultats du quiz
  const displayQuizResult = () => {
    quizResult.style.display = "flex";
    quizContainer.style.display = "none";
    quizResult.innerHTML = "";
  
    const resultHeading = document.createElement("h2");
    resultHeading.innerHTML = `You have scored ${score} out of ${MAX_QUESTIONS}.`;
    quizResult.appendChild(resultHeading);
  
    for (let i = 0; i < MAX_QUESTIONS; i++) {
      const resultItem = document.createElement("div");
      resultItem.classList.add("question-container");
  
      const userAnswer = localStorage.getItem(`userAnswer_${i}`);
      const correctAnswer = quizData[i].correct;
  
      let answeredCorrectly = userAnswer === correctAnswer;
  
      if (!answeredCorrectly) {
        resultItem.classList.add("incorrect");
      }
  
      resultItem.innerHTML = `<div class="question">Question ${i + 1}: ${
        quizData[i].question
      }</div>
      <div class="user-answer">Your answer: ${userAnswer || "Not Answered"}</div>
      <div class="correct-answer">Correct answer: ${correctAnswer}</div>`;
  
      quizResult.appendChild(resultItem);
    }
  
    const retakeBtn = document.createElement("button");
    retakeBtn.classList.add("retake-btn");
    retakeBtn.innerHTML = "Retake Quiz";
    retakeBtn.addEventListener("click", retakeQuiz);
    quizResult.appendChild(retakeBtn);
  };
  // Affichage de la prochaine question du quiz
  const displayNextQuestion = () => {
    if (questionNumber >= MAX_QUESTIONS - 1) {
      displayQuizResult();
      return;
    }
  
    questionNumber++;
    createQuestion();
  };
  // Gestionnaire d'événement pour le bouton "suivant"
  nextBtn.addEventListener("click", displayNextQuestion);
  // Gestionnaire d'événement pour le bouton de démarrage
  startBtn.addEventListener("click", () => {
    startBtnContainer.style.display = "none";
    quizContainer.style.display = "block";
    createQuestion();
  });
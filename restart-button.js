/* global AFRAME */

let questionPlane; // Declare questionPlane variable as a global variable
let answerEntities = []; // Array to store answer entities

// Array of questions and related answers about JDM cars
let jdmQuestions = [
  {
    question: "¿Cual es el modelo de Honda conocido como 'Type R'?",
    answers: ["Civic", "Accord", "Fit", "Prelude"],
    correctAnswer: 0
  },
  {
    question: "¿Qué significa 'GT-R' en el Nissan GT-R?",
    answers: ["Grand Touring Race", "Gran Turismo Racer", "Global Tuned Racing", "Great Twin-Revolution"],
    correctAnswer: 1
  },
  {
    question: "¿Cual es el legendario auto de drift de Toyota?",
    answers: ["Supra", "MR2", "GT86", "Soarer"],
    correctAnswer: 2
  },
  {
    question: "¿Que motor se encuentra en el Mazda RX-7 FD?",
    answers: ["2JZ-GTE", "SR20DET", "13B-REW", "RB26DETT"],
    correctAnswer: 2
  },
  {
    question: "¿Cual es el nombre japonés para el Subaru Impreza WRX STI?",
    answers: ["Levorg", "Forester", "Legacy", "Goburiion"],
    correctAnswer: 0
  },
];

// let jdmQuestions = [
//   {
//     question: "¿Cuál es el modelo de Nissan conocido como 'Godzilla'?",
//     answers: ["Skyline GT-R", "Silvia", "180SX", "370Z"],
//     correctAnswer: 0
//   },
//   {
//     question: "¿Qué significa 'AE86' en el Toyota AE86?",
//     answers: ["Advanced Engine 86", "Aero Edition 86", "Artistic Evolution 86", "Corolla Levin/Sprinter Trueno"],
//     correctAnswer: 3
//   },
//   {
//     question: "¿Qué motor es famoso por su sonido distintivo en los autos JDM?",
//     answers: ["VTEC", "SR20DET", "13B-REW", "RB26DETT"],
//     correctAnswer: 2
//   },
//   {
//     question: "¿Cuál es el país de origen de los autos JDM?",
//     answers: ["Estados Unidos", "Japón", "Italia", "Alemania"],
//     correctAnswer: 1
//   },
//   {
//     question: "¿Cuál es el icónico auto de rally de Mitsubishi?",
//     answers: ["Lancer Evolution", "Impreza WRX STI", "Supra", "RX-7"],
//     correctAnswer: 0
//   },
// ];


var current_question = 0;
var lives = 3;
var completado = false;
var lose = false;
let quizActive = false; // Variable para realizar un seguimiento del estado del cuestionario


AFRAME.registerComponent('restart-button', {
  init: function () {
    let sceneEl = document.querySelector('a-scene');
    let el = this.el;

    el.addEventListener('click', function () {
      console.log("restart button was clicked!");
      sceneEl.querySelectorAll('.rotation').forEach(function (element) {
        element.emit('startOrbit');
      });
    });
  }
});

AFRAME.registerComponent('pause-button', {
  init: function () {
    let sceneEl = document.querySelector('a-scene');
    let el = this.el;

    el.addEventListener('click', function () {
      console.log("pause button was clicked!");
      sceneEl.querySelectorAll('.rotation').forEach(function (element) {
        element.emit('pauseOrbit');
      });
    });
  }
});

AFRAME.registerComponent('question-button', {
  init: function () {
    let el = this.el;
    el.addEventListener('click', function () {
      console.log("question button was clicked!");
      if (completado || lose) {
        // If the quiz is already completed or lost, reset the quiz
        resetQuiz();
      }  
      
      // Verificar si ya hay un cuestionario activo
      if (quizActive) {
        return; // Salir de la función si ya hay un cuestionario activo
      }

      // Establecer la variable quizActive en true para indicar que el cuestionario está activo
      quizActive = true;

      // Get the current question from the jdmQuestions array
      let question = jdmQuestions[current_question];

      // Create the question and answer entities
      createQuestionEntities(question);

      // Create the lives entity
      let livesEntity = document.createElement('a-entity');
      livesEntity.setAttribute('id', 'lives-entity'); // Set ID for the lives entity
      livesEntity.setAttribute('geometry', 'primitive: plane; width: 4; height: 2');
      livesEntity.setAttribute('material', 'color: #e63946');
      livesEntity.setAttribute('text', `wrapCount: 10; align: center; value: Lives: ${lives}`);
      livesEntity.setAttribute('position', '8 4 5');
      livesEntity.setAttribute('rotation', '0 -90 0');
      livesEntity.setAttribute('scale', '1 1 1');
      let scene = document.querySelector('a-scene');
      scene.appendChild(livesEntity);
    });

    function createQuestionEntities(question) {
      // Create the question plane entity
      questionPlane = document.createElement('a-entity');
      questionPlane.setAttribute('geometry', 'primitive: plane; width: 4; height: 2');
      questionPlane.setAttribute('material', 'color: #2a9d8f');
      questionPlane.setAttribute('text', `wrapCount: 20; align: center; value: ${question.question}`);
      questionPlane.setAttribute('position', '8 2 5');
      questionPlane.setAttribute('rotation', '0 -90 0');
      let scene = document.querySelector('a-scene');
      scene.appendChild(questionPlane);

      // Create the answer planes
      let answersContainer = document.createElement('a-entity');
      answersContainer.setAttribute('id', 'answers-container'); // Set ID for the container
      answersContainer.setAttribute('position', '8 0.5 5');
      answersContainer.setAttribute('rotation', '0 -90 0');
      scene.appendChild(answersContainer);

      let spacing = -0.8; // Adjust the spacing between answers

      for (let i = 0; i < question.answers.length; i++) {
        let answerPlane = document.createElement('a-entity');
        answerPlane.setAttribute('geometry', 'primitive: plane; width: 4; height: 1');
        answerPlane.setAttribute('material', 'color: #a8dadc');
        answerPlane.setAttribute('text', `wrapCount: 20; align: center; value: ${question.answers[i]}`);
        answerPlane.setAttribute('position', `0 ${i * spacing} 0`);
        answerPlane.setAttribute('class', 'answer-entity');
        answerPlane.addEventListener('click', function () {
          validateAnswer(i);
        });
        answersContainer.appendChild(answerPlane);
        answerEntities.push(answerPlane);
      }
    }

    function deleteQuestionEntities() {
      let scene = document.querySelector('a-scene');
    
      // Remove the question entity
      if (questionPlane && questionPlane.parentNode === scene) {
        scene.removeChild(questionPlane);
      }
    
      // Remove the answer container and its child entities
      let answersContainer = document.querySelector('#answers-container');
      if (answersContainer && answersContainer.parentNode === scene) {
        answerEntities.forEach(function (answerEntity) {
          answersContainer.removeChild(answerEntity);
        });
        scene.removeChild(answersContainer);
      }
    
      answerEntities = [];
    }
    
    
    

    function validateAnswer(selectedIndex) {
      let question = jdmQuestions[current_question];
    
      if (selectedIndex === question.correctAnswer) {
        console.log("Correct answer!");
    
        current_question++;
    
        deleteQuestionEntities();
    
        if (current_question < jdmQuestions.length) {
          let nextQuestion = jdmQuestions[current_question];
          createQuestionEntities(nextQuestion);
        } else {
          console.log("Quiz completed!");
    
          deleteQuestionEntities();
          // Create congratulatory message entity
          let messageEntity = document.createElement('a-entity');
          messageEntity.setAttribute('id', 'final-message'); // Set ID for the container
          messageEntity.setAttribute('geometry', 'primitive: plane; width: 4; height: 2');
          messageEntity.setAttribute('material', 'color: #2a9d8f');
          messageEntity.setAttribute('text', 'wrapCount: 20; align: center; value: Felicidades, completaste el Quiz');
          messageEntity.setAttribute('position', '8 2 5');
          messageEntity.setAttribute('rotation', '0 -90 0');
          let scene = document.querySelector('a-scene');
          scene.appendChild(messageEntity);
          completado = true;
        }
      } else {
        console.log("Wrong answer!");
    
        // Subtract one point from lives
        lives--;
    
        // Update the lives entity
        let livesEntity = document.querySelector('#lives-entity');
        if (livesEntity) {
          livesEntity.setAttribute('text', `wrapCount: 10; align: center; value: Lives: ${lives}`);
        }
    
        if (lives === 0) {
          console.log("You lose!");
    
          deleteQuestionEntities();
          // Create losing message entity
          let messageEntity = document.createElement('a-entity');
          messageEntity.setAttribute('id', 'final-message'); // Set ID for the container
          messageEntity.setAttribute('geometry', 'primitive: plane; width: 4; height: 2');
          messageEntity.setAttribute('material', 'color: #e63946');
          messageEntity.setAttribute('text', 'wrapCount: 20; align: center; value: Has perdido. Intenta de nuevo.');
          messageEntity.setAttribute('position', '8 2 5');
          messageEntity.setAttribute('rotation', '0 -90 0');
          let scene = document.querySelector('a-scene');
          scene.appendChild(messageEntity);
          lose = true;
        }
      }
    }
    
    
    function resetQuiz() {
      // Restablecer las variables y el estado del cuestionario
      current_question = 0;
      lives = 3;
      completado = false;
      lose = false;
      quizActive = false;

      // Eliminar el mensaje final si existe
      let finalMessageEntity = document.querySelector('#final-message');
      if (finalMessageEntity && finalMessageEntity.parentNode) {
        finalMessageEntity.parentNode.removeChild(finalMessageEntity);
      }
    
      // Restablecer el texto de las vidas
      let livesEntity = document.querySelector('#lives-entity');
      if (livesEntity) {
        livesEntity.setAttribute('text', `wrapCount: 10; align: center; value: Lives: ${lives}`);
      }
      console.log("limpio");
    }
    
    
  }
});

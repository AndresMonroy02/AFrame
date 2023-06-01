/* global AFRAME */

let questionPlane; // Declare questionPlane variable as a global variable
let answerEntities = []; // Array to store answer entities

// Array of questions and related answers about JDM cars
let jdmQuestions = [
  {
    question: "¿Qué fabricante de automóviles japonés es conocido por el Skyline GT-R?",
    answers: ["Toyota", "Nissan", "Honda", "Mitsubishi"],
    correctAnswer: 1
  },
  {
    question: "¿Cuál es el icónico motor en el Honda S2000?",
    answers: ["B16", "2JZ", "F20C", "RB26"],
    correctAnswer: 2
  },
  {
    question: "¿A qué modelo pertenece el legendario Toyota AE86?",
    answers: ["Supra", "Civic", "Corolla", "Silvia"],
    correctAnswer: 2
  },
];

var current_question = 0;
var lives = 3;

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
      scene.removeChild(questionPlane);
    
      // Remove the answer container and its child entities
      let answersContainer = document.querySelector('#answers-container');
      if (answersContainer) {
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
        }
        } else {
          console.log("Wrong answer!");
          // Handle incorrect answer logic here
          // Subtract one point from lives
          lives--;
          // Update the lives entity
          let livesEntity = document.querySelector('#lives-entity');
          // if (livesEntity) {
          //   livesEntity.setAttribute('text', `wrapCount: 10; align: center; value: Lives: ${lives}`);
          // }
      }
    }
  }
});

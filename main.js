// Created by Danila Travkov

// handle choosing an answer
const buttonAnswers = document.querySelectorAll("[data-clicked]");
const submitButton = document.querySelector(".button__next");
const submitButtonBefore = window.getComputedStyle(submitButton, '::before');
const counterElement = document.querySelector(".question-number");
let answer;
let prevClicked;

// This is for always getting a new question after each concurrent request to questions.json.
const totalQuestions = 4;
const usedQuestionIds = new Set();
let questionsCounter = 0;
let countCorrectAnswers = 0;

function getRandomUniqueQuestionId(totalQuestions) {
    if (usedQuestionIds.size === totalQuestions) {
      usedQuestionIds.clear(); // Reset the set if all IDs have been used. Remove this later
    }
  
    let randomId;
    do {
      randomId = Math.floor(Math.random() * totalQuestions);
    } while (usedQuestionIds.has(randomId));
  
    usedQuestionIds.add(randomId);
    return randomId;
  }

buttonAnswers.forEach(button => {
    button.addEventListener("click", () => {
        submitButton.classList.remove("button__next_disabled");
        submitButton.classList.add("answer_selected");

        if (prevClicked) 
            prevClicked.dataset.clicked = false;
        
        prevClicked = button;
        button.dataset.clicked = true;
        answer = button.textContent;

        const buttonsWithFalse = document.querySelectorAll('.answer:not([data-clicked="true"])');
        buttonsWithFalse.forEach(button => {
            
        });
    }); 
});

// document.addEventListener("click", (event) => {
//     if (!event.target.closest('.answer')) {
//         submitButton.setAttribute("disabled", true);
//         submitButton.classList.add("button__next_disabled");
//         submitButton.classList.remove("answer_selected");
//     }
// });

submitButton.addEventListener("click", () => {
    if (submitButton.getAttribute("type") === 'text') {
        const answer = document.querySelector(".answer[data-clicked='true']");
        if (answer) {
            if (answer.dataset.isCorrect === "true") {
                answer.classList.add("correct-answer");
            } else {
                answer.classList.add("wrong-answer");
                const correctAnswer = document.querySelector(".answer[data-isCorrect='true']");
                if (correctAnswer) {
                    correctAnswer.classList.add("correct-answer");
                }
            }
            submitButton.setAttribute("type", "submit");
            submitButton.innerHTML = "Next";
        }
    } else if (submitButton.getAttribute("type") === 'submit') {
        const answer = document.querySelector(".answer[data-clicked='true']");
        if (answer) {
            answer.classList.remove("wrong-answer", "correct-answer");
            answer.dataset.clicked = "false";
        }
        console.log("button type submit was pressed")
        handleQuestionSwitch();
    } else {
        console.log("wtf happend to this button")
    }
});

// handle switching between questions
async function handleQuestionSwitch() {
    if (questionsCounter == totalQuestions) {
        // TODO: display results
        console.log("Poll has been completed!")
        return;
    }

    // submitButton.setAttribute("disabled", true);
    console.log(submitButton.getAttribute("disabled"))
    submitButton.setAttribute("type", "text");
    submitButton.innerHTML = "Submit";

    try {
        const randomQuestionId = getRandomUniqueQuestionId(totalQuestions);
        const question = document.querySelector(".question");

        const response = await fetch("psychology.json");
        const data = await response.json();

        question.innerHTML = data[randomQuestionId].question;
        for (let i = 0; i < 4; i++) {
            buttonAnswers[i].innerHTML = data[randomQuestionId].answers[i].answer;
            buttonAnswers[i].dataset.isCorrect = data[randomQuestionId].answers[i].isCorrect;
        };
        questionsCounter++;
        counterElement.innerHTML = `Question ${questionsCounter}`        
    } catch (error) {
        console.log("Error fetching json data: ", error);
    }
};

handleQuestionSwitch();
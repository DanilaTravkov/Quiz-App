// Created by Danila Travkov

// handle choosing an answer
const buttonAnswers = document.querySelectorAll("[data-clicked]");
const submitButton = document.querySelector(".button__next");
const counterElement = document.querySelector(".question-number");
let answer;
let prevClicked;

// This is for always getting a new question after each concurrent request to questions.json.
const totalQuestions = 4;
const usedQuestionIds = new Set();
let questionsCounter = 0;


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

        submitButton.removeAttribute("disabled"); // Remove the disabled attribute
        submitButton.classList.remove("button__next_disabled");

        if (prevClicked) 
            prevClicked.dataset.clicked = false;
        prevClicked = button;
        button.dataset.clicked = true;
        // TODO: something with the selected answers
        answer = button.textContent;
        const buttonsWithFalse = document.querySelectorAll('.answer:not([data-clicked="true"])');
            buttonsWithFalse.forEach(button => {
                // TODO: something with answers which are not selected
        });
    }); 
});

document.addEventListener("click", (event) => {
    if (!event.target.closest('.answer')) {
        submitButton.setAttribute("disabled", true); // Set the disabled attribute
        submitButton.classList.add("button__next_disabled");
    }
});

submitButton.addEventListener("click", () => {
    // TODO: handle when answer is submitted (work with answer variable)
    handleQuestionSwitch();
    
})

// handle switching between questions
async function handleQuestionSwitch() {
    if (questionsCounter == totalQuestions) {
        // TODO: display results
        console.log("Poll has been completed!")
        return;
    }
    try {
        const randomQuestionId = getRandomUniqueQuestionId(totalQuestions);
        // console.log(randomQuestionId);
        const answers = document.querySelectorAll(".answer");
        const question = document.querySelector(".question");

        const response = await fetch("psychology.json");
        const data = await response.json();

        question.innerHTML = data[randomQuestionId].question;
        for (let i = 0; i < 4; i++) {
            answers[i].innerHTML = data[randomQuestionId].answers[i].answer;
        };
        questionsCounter++;
        counterElement.innerHTML = `Question ${questionsCounter}`
        // console.log(randomQuestionId)
    } catch (error) {
        console.log("Error fetching json data: ", error);
    }
};

handleQuestionSwitch();




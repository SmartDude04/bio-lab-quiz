class Question {
    constructor(question, answers, correctAnswer) {
        this.question = question;
        this.answers = answers;
        this.correct = correctAnswer;
    }

    getQuestion() {
        return this.question;
    }

    getAnswers() {
        return this.answers;
    }

    checkAnswer(answer) {
        return this.correct === answer;
    }
}

let doneQuestions = [];
let questions = [];

function gameStart() {
    // Remove the title page
    const titleContainer = document.getElementById("title-container");
    titleContainer.remove();

    // Make the game container visible
    const gameContainer = document.getElementById("game-container");
    gameContainer.style.display = "flex";

    // Set question number in #question-title
    const questionNumber = document.getElementById("question-title");
    questionNumber.innerHTML = "Question 1";

    // Read in the questions and generate them
    generateQuestions().then(() => {
        // Once questions are generated, display one
        displayQuestion();
    });

    // Add button event listeners
    for (let i = 0; i < 4; i++) {
        document.getElementById(`button-${i}`).addEventListener("click", () => {
            checkAnswer(i);
        })
    }
}

async function generateQuestions() {
    // Read the questions from the questions.json file
    let response = await (await fetch("questions.json")).json();

    // Go through the response and push back each object to the questions list
    Object.values(response).forEach(curQuestion => {
        questions.push(new Question(curQuestion.question, curQuestion.answers, curQuestion.correct));
    });
}

function displayQuestion() {
    // Choose a random question from the list, remove it, and add it to the doneQuestions list
    const randQuestion = questions.splice(Math.floor(Math.random() * questions.length), 1)[0];
    doneQuestions.push(randQuestion);

    // Display the question and its answers
    const questionBox = document.getElementById("question");
    questionBox.innerHTML = randQuestion.getQuestion();
    for (let i = 0; i < 4; i++) {
        let curAnswerBox = document.getElementById(`button-${i}`);
        curAnswerBox.innerHTML = randQuestion.getAnswers()[i];
    }
}

function checkAnswer(answer) {
    const curQuestion = doneQuestions[doneQuestions.length - 1];
    if (curQuestion.checkAnswer(answer)) {
        // Answer is correct, display toast indicating correct answer
    } else {
        // Answer is incorrect, display toast indicating wrong answer and what the correct answer is
    }

    // Reset for the next question
    displayQuestion();
}
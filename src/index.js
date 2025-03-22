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
        if (this.correct === answer) {
            correctQuestions++;
            return true;
        }
        return false;
    }
}

let doneQuestions = [];
let questions = [];
let correctQuestions = 0;

function gameStart() {
    // Remove the title page
    const titleContainer = document.getElementById("title-container");
    titleContainer.remove();

    // Make the game container visible
    const gameContainer = document.getElementById("game-container");
    gameContainer.style.display = "flex";


    // Read in the questions and generate them
    generateQuestions().then(() => {
        // Once questions are generated, display one
        displayQuestion();
    });

    // Add button event listeners
    for (let i = 0; i < 4; i++) {
        document.getElementById(`button-${i}`).addEventListener("click", () => {
            checkAnswer(i);
        });
    }

    // Add next question event listener
    document.getElementById("next-question").addEventListener("click", () => {
        // Check if all questions have been used
        if (questions.length === 0) {
            // If all questions have been used, display ending screen
            gameOver();
        } else {
            displayQuestion();
        }
    });

}

async function generateQuestions() {
    // Read the questions from the questions.json file
    let response = await fetch("questions.json");
    let data = await response.json();

    // Go through the response and push back each object to the questions list
    questions = Object.values(data).map( curQuestion =>
        new Question(curQuestion.question, curQuestion.answers, curQuestion.correct)
    );
}

function displayQuestion() {
    // Change part visibility
    const box = document.getElementById("game");
    box.style.display = "flex";
    const toastContainer = document.getElementById("toast-container");
    toastContainer.style.display = "none";

    if (questions.length === 0) {
        return;
    }

    // Choose a random question from the list, remove it, and add it to the doneQuestions list
    const randQuestion = questions.splice(Math.floor(Math.random() * questions.length), 1)[0];
    doneQuestions.push(randQuestion);

    const questionTitle = document.getElementById("question-title");
    questionTitle.innerHTML = `Question ${doneQuestions.length} of ${questions.length + doneQuestions.length}`;

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
    // Remove the question from the screen
    const questionBox = document.getElementById("game");
    questionBox.style.display = "none";

    const toastContainer = document.getElementById("toast-container");
    const correctIncorrect = document.getElementById("correct-incorrect");
    const incorrectDesc = document.getElementById("incorrect-desc");

    const correct = curQuestion.checkAnswer(answer);

    // Check if end screen should be displayed
    if (questions.length === 0) {
        document.getElementById("game-container").style.display = "none";
        gameOver();
        return;
    }

    if (correct) {
        // Answer is correct, display toast indicating correct answer
        incorrectDesc.innerHTML = "";
        correctIncorrect.innerHTML = "Correct!";
    } else {
        // Answer is incorrect, display toast indicating wrong answer and what the correct answer is
        incorrectDesc.innerHTML = `The correct answer is ${curQuestion.getAnswers()[curQuestion.correct]}`;
        correctIncorrect.innerHTML = "Incorrect!";
    }
    toastContainer.style.display = "flex";

}

function gameOver() {
    const endTitle = document.getElementById("end-title");
    const endDesc = document.getElementById("end-desc");

    let robotCorrect = Math.floor(Math.random() * doneQuestions.length);

    if (correctQuestions > robotCorrect) {
        endTitle.innerHTML = "You Beat the Robot!";
        endDesc.innerHTML = `Final Score: ${correctQuestions} - ${robotCorrect}!`;
    } else if (correctQuestions === robotCorrect) {
        endTitle.innerHTML = "It's a Tie!";
        endDesc.innerHTML = `Final Score: ${correctQuestions} - ${robotCorrect}!`;

    } else {
        endTitle.innerHTML = "You Lose!";
        endDesc.innerHTML = `Robot Wins ${correctQuestions} - ${robotCorrect}!`;
    }


    document.getElementById("play-again").addEventListener("click", () => {
        location.reload();
    });

    document.getElementById("end-container").style.display = "flex";
}
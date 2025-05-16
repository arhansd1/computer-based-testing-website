// Variables
const quizContainer = document.getElementById('quiz-container');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');
const resultContainer = document.getElementById('result-container');
const questionNumberSpan = document.getElementById('question-number');
const timeSpan = document.getElementById('time');
const questionNavigation = document.getElementById('question-navigation');
const confirmationModal = document.getElementById('confirmation-modal');
const cancelBtn = document.getElementById('cancel-btn');
const confirmSubmitBtn = document.getElementById('confirm-submit-btn');

let currentPage = 1;
let questionsPerPage = 1; // Display 1 question per page
let questions = []; // Array to store questions from JSON
let selectedAnswers = {}; // Object to store user's selected answers
let intervalId; // Interval ID for the timer

// Get the timer duration from HTML attributes
const timerElement = document.getElementById('timer');
const minutes = parseInt(timerElement.getAttribute('data-minutes'), 10);
const seconds = parseInt(timerElement.getAttribute('data-seconds'), 10);
const totalTime = (minutes * 60) + seconds;

// Function to fetch questions from JSON file
async function fetchQuestions() {
    const response = await fetch('quizquestions.json');
    const data = await response.json();
    return data;
}

// Function to display questions for a specific page
function displayQuestions(page) {
    quizContainer.innerHTML = ''; // Clear previous content

    const startIndex = (page - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const pageQuestions = questions.slice(startIndex, endIndex);

    pageQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const questionNumber = startIndex + index + 1;
        const questionText = document.createElement('p');
        questionText.textContent = `${questionNumber}. ${question.question}`;
        questionDiv.appendChild(questionText);

        const optionLabels = ['A', 'B', 'C', 'D'];
        question.options.forEach((option, optionIndex) => {
            const optionLabel = document.createElement('label');
            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = `question-${question.id}`;
            optionInput.value = option;

            // Check if the option is selected
            if (selectedAnswers[question.id] === option) {
                optionInput.checked = true;
            }

            optionInput.addEventListener('change', () => {
                selectedAnswers[question.id] = option;
                updateQuestionNavigation();
            });
            optionLabel.textContent = `${optionLabels[optionIndex]}. ${option}`;
            optionLabel.prepend(optionInput);
            questionDiv.appendChild(optionLabel);
        });

        quizContainer.appendChild(questionDiv);
    });

    updateNavigationButtons();
    updateQuestionNavigation();
}

// Function to update navigation buttons based on current page
function updateNavigationButtons() {
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === Math.ceil(questions.length / questionsPerPage);
    submitButton.style.display = (currentPage === Math.ceil(questions.length / questionsPerPage)) ? 'inline-block' : 'none';

    const questionNumberText = `Question ${currentPage} of ${questions.length}`;
    questionNumberSpan.textContent = questionNumberText;
}

// Function to update the question navigation squares
function updateQuestionNavigation() {
    questionNavigation.innerHTML = ''; // Clear previous squares

    questions.forEach((question, index) => {
        const questionSquare = document.createElement('div');
        questionSquare.classList.add('question-square');

        if (selectedAnswers[question.id]) {
            questionSquare.classList.add('answered');
        } else {
            questionSquare.classList.add('skipped');
        }

        questionSquare.textContent = index + 1;
        questionSquare.addEventListener('click', () => {
            currentPage = index + 1;
            displayQuestions(currentPage);
        });

        questionNavigation.appendChild(questionSquare);
    });
}

// Timer function
function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    intervalId = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = `${minutes}:${seconds}`;

        if (--timer < 0) {
            clearInterval(intervalId);
            autoSubmitQuiz();
        }
    }, 1000);
}

// Start the timer
startTimer(totalTime, timeSpan);

// Auto-submit function
function autoSubmitQuiz() {
    clearInterval(intervalId); // Stop the timer

    const totalQuestions = questions.length;
    let correctAnswers = 0;

    questions.forEach(question => {
        if (selectedAnswers[question.id] === question.answer) {
            correctAnswers++;
        }
    });

    const score = (correctAnswers / totalQuestions) * 100;
    resultContainer.textContent = `Quiz Submitted! You scored ${score}% (${correctAnswers}/${totalQuestions})`;
    resultContainer.style.display = 'block';

    quizContainer.style.display = 'none';
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
    submitButton.style.display = 'none';
}

// Event listeners for navigation buttons
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayQuestions(currentPage);
    }
});

nextButton.addEventListener('click', () => {
    if (currentPage < Math.ceil(questions.length / questionsPerPage)) {
        currentPage++;
        displayQuestions(currentPage);
    }
});

submitButton.addEventListener('click', () => {
    confirmationModal.style.display = 'block';
});

cancelBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none';
});

confirmSubmitBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none';
    autoSubmitQuiz();
});

// Fetch and display questions
fetchQuestions().then(data => {
    questions = data.questions;
    displayQuestions(currentPage);
});

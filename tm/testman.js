// Function to fetch questions from JSON file
async function fetchQuestions() {
    const response = await fetch('../questions.json');
    const data = await response.json();
    return data;
}

// Sample questions data stored in JSON
let availableQuestions = [];
let selectedQuestions = [];

// Function to display questions in a table
function displayQuestions(questions, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content

    questions.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${containerId}-question-${question.id}`;
        checkbox.value = question.id;

        const label = document.createElement('label');
        label.htmlFor = `${containerId}-question-${question.id}`;
        label.innerText = question.question;

        questionDiv.appendChild(checkbox);
        questionDiv.appendChild(label);
        container.appendChild(questionDiv);
    });
}

// Function to handle shifting questions to the right
function shiftRight() {
    const selectedCheckboxes = document.querySelectorAll('#questions-list input[type="checkbox"]:checked');
    selectedCheckboxes.forEach(checkbox => {
        const questionId = parseInt(checkbox.value);
        const questionIndex = availableQuestions.findIndex(q => q.id === questionId);
        if (questionIndex > -1) {
            selectedQuestions.push(availableQuestions.splice(questionIndex, 1)[0]);
        }
    });
    displayQuestions(availableQuestions, 'questions-list');
    displayQuestions(selectedQuestions, 'selected-questions-list');
}

// Function to handle shifting questions to the left
function shiftLeft() {
    const selectedCheckboxes = document.querySelectorAll('#selected-questions-list input[type="checkbox"]:checked');
    selectedCheckboxes.forEach(checkbox => {
        const questionId = parseInt(checkbox.value);
        const questionIndex = selectedQuestions.findIndex(q => q.id === questionId);
        if (questionIndex > -1) {
            availableQuestions.push(selectedQuestions.splice(questionIndex, 1)[0]);
        }
    });
    displayQuestions(availableQuestions, 'questions-list');
    displayQuestions(selectedQuestions, 'selected-questions-list');
}

// Function to start the test
function startTest() {
    if (selectedQuestions.length === 0) {
        alert('Please select at least one question to start the test.');
        return;
    }

    // Prepare selected questions in the desired format
    const formattedQuestions = selectedQuestions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        answer: q.answer
    }));

    // Example: Store formatted questions in a JSON file (for this mockup, we'll just log it)
    const formattedQuestionsJson = JSON.stringify(formattedQuestions, null, 2);
    console.log('Formatted Questions JSON:', formattedQuestionsJson);

    // Save formatted questions to a file
    const blob = new Blob([formattedQuestionsJson], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'questions1.json';
    link.click();

    // Display the quiz (for this mockup, we'll just alert the selected questions)
    alert('Starting Test with the following questions:\n' + selectedQuestions.map(q => q.question).join('\n'));
}

// Function to handle search by ID
function searchById() {
    const searchInput = document.getElementById('search-input').value;
    const questionId = parseInt(searchInput);

    if (!isNaN(questionId)) {
        const questionsToMove = availableQuestions.filter(q => q.id === questionId);
        availableQuestions = availableQuestions.filter(q => q.id !== questionId);
        availableQuestions.unshift(...questionsToMove);
    }
    displayQuestions(availableQuestions, 'questions-list');
}

// Add event listeners to the buttons
document.getElementById('shift-right-btn').addEventListener('click', shiftRight);
document.getElementById('shift-left-btn').addEventListener('click', shiftLeft);
document.getElementById('start-test-btn').addEventListener('click', startTest);
document.getElementById('search-btn').addEventListener('click', searchById);

// Fetch and display available questions on page load
fetchQuestions().then(questions => {
    availableQuestions = questions;
    displayQuestions(availableQuestions, 'questions-list');
});

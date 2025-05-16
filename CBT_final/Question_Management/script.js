document.addEventListener('DOMContentLoaded', () => {
  const questionsTable = document.getElementById('questionsTable').getElementsByTagName('tbody')[0];
  const questionForm = document.getElementById('questionForm');
  const mccOptionsContainer = document.getElementById('mccOptionsContainer');
  const tfOptionsContainer = document.getElementById('tfOptionsContainer');
  const editModal = document.getElementById('editModal');
  const editQuestionForm = document.getElementById('editQuestionForm');
  const editMccOptionsContainer = document.getElementById('editMccOptionsContainer');
  const editTfOptionsContainer = document.getElementById('editTfOptionsContainer');
  const closeModalButton = document.querySelector('.close');
  
  const typeSelect = document.getElementById('type');
  const editTypeSelect = document.getElementById('editType');

  // Function to fetch questions from server
  async function fetchQuestions() {
    try {
      const response = await fetch('/api/questions');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const questions = await response.json();
      displayQuestions(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }

  // Function to display questions in the table
  function displayQuestions(questions) {
    questionsTable.innerHTML = ''; // Clear existing table rows
    questions.forEach(question => addQuestionToTable(question));
  }

  // Function to add a question to the table
  function addQuestionToTable(question) {
    const row = questionsTable.insertRow();
    row.insertCell(0).innerText = question.id;
    row.insertCell(1).innerText = question.question;
    row.insertCell(2).innerText = question.type;
    row.insertCell(3).innerText = question.options ? question.options.join(', ') : 'N/A';
    row.insertCell(4).innerText = question.correctOption;

    const actionsCell = row.insertCell(5);

    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => openEditModal(question));
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => deleteQuestion(question.id, row));
    actionsCell.appendChild(deleteButton);
  }

  // Event listener for question form submission (Add question)
  questionForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('id').value;
    const question = document.getElementById('question').value;
    const type = document.getElementById('type').value;
    const correctOption = document.getElementById('correctOption').value;
    let options = [];

    if (type === 'mcc') {
      options = Array.from(document.querySelectorAll('.option')).map(input => input.value).filter(option => option.trim() !== '');
    }
    else if (type === 'tf') {
      options = Array.from(document.querySelectorAll('.option')).map(input => input.value).filter(option => option.trim() !== '');
    }

    const newQuestion = { id, question, type, options, correctOption };

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuestion)
      });

      if (!response.ok) {
        throw new Error('Failed to add question');
      }

      addQuestionToTable(newQuestion);
      questionForm.reset();
      mccOptionsContainer.style.display = 'none';
      tfOptionsContainer.style.display = 'none';

    } catch (error) {
      console.error('Error adding question:', error);
    }
  });

  // Event listener for edit form submission (Update question)
  editQuestionForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const updatedQuestion = {
      id: document.getElementById('editId').value,
      question: document.getElementById('editQuestion').value,
      type: document.getElementById('editType').value,
      options: document.getElementById('editType').value === 'mcc' ?
        Array.from(document.querySelectorAll('.editOption')).map(input => input.value).filter(option => option.trim() !== '')
        : [],
      correctOption: document.getElementById('editCorrectOption').value
    };

    try {
      const response = await fetch(`/api/questions/${updatedQuestion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedQuestion)
      });

      if (!response.ok) {
        throw new Error('Failed to update question');
      }

      closeEditModal();
      updateQuestionInTable(updatedQuestion);

    } catch (error) {
      console.error('Error updating question:', error);
    }
  });

  // Function to open edit modal with pre-filled data
  function openEditModal(question) {
    editModal.style.display = 'block';

    document.getElementById('editId').value = question.id;
    document.getElementById('editQuestion').value = question.question;
    document.getElementById('editType').value = question.type;

    if (question.type === 'mcc') {
      editMccOptionsContainer.style.display = 'block';
      editTfOptionsContainer.style.display = 'none';
      const editOptionsInputs = Array.from(document.querySelectorAll('.editOption'));
      question.options.forEach((option, index) => {
        editOptionsInputs[index].value = option;
      });
    } else if (question.type === 'tf') {
      editMccOptionsContainer.style.display = 'none';
      editTfOptionsContainer.style.display = 'block';
      const editOptionsInputs = Array.from(document.querySelectorAll('.editOption'));
      question.options.forEach((option, index) => {
        editOptionsInputs[index].value = option;
      });
    }

    document.getElementById('editCorrectOption').value = question.correctOption;
    document.getElementById('.editOption').value = question.editMccOptionsContainer;
    document.getElementById('.editOption').value = question.editTfOptionsContainer;
  }

  // Function to close edit modal
  function closeEditModal() {
    editModal.style.display = 'none';
  }

  // Add event listener to close modal button
  closeModalButton.addEventListener('click', closeEditModal);

  // Function to update question in the table
  function updateQuestionInTable(question) {
    const rows = questionsTable.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].cells[0].innerText === question.id) {
        rows[i].cells[1].innerText = question.question;
        rows[i].cells[2].innerText = question.type;
        rows[i].cells[3].innerText = question.options ? question.options.join(', ') : 'N/A';
        rows[i].cells[4].innerText = question.correctOption;
        break;
      }
    }
  }

  // Function to delete question
  async function deleteQuestion(id, row) {
    try {
      const response = await fetch(`/api/questions/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      row.remove();

    } catch (error) {
      console.error('Error deleting question:', error);
    }
  }

  // Show or hide options containers based on the selected type
  typeSelect.addEventListener('change', () => {
    if (typeSelect.value === 'mcc') {
      mccOptionsContainer.style.display = 'block';
      tfOptionsContainer.style.display = 'none';
    } else if (typeSelect.value === 'tf') {
      mccOptionsContainer.style.display = 'none';
      tfOptionsContainer.style.display = 'block';
    } else {
      mccOptionsContainer.style.display = 'none';
      tfOptionsContainer.style.display = 'none';
    }
  });

  editTypeSelect.addEventListener('change', () => {
    if (editTypeSelect.value === 'mcc') {
      editMccOptionsContainer.style.display = 'block';
      editTfOptionsContainer.style.display = 'none';
    } else if (editTypeSelect.value === 'tf') {
      editMccOptionsContainer.style.display = 'none';
      editTfOptionsContainer.style.display = 'block';
    } else {
      editMccOptionsContainer.style.display = 'none';
      editTfOptionsContainer.style.display = 'none';
    }
  });

  // Initial fetch of questions when the page loads
  fetchQuestions();
});

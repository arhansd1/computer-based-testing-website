document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayStudents();
});

async function fetchAndDisplayStudents() {
  try {
    const response = await fetch('/api/students');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const students = await response.json();
    displayStudents(students);
  } catch (error) {
    console.error('Error fetching students:', error);
  }
}

function displayStudents(students) {
  const studentsTable = document.getElementById('students-list');
  studentsTable.innerHTML = ''; // Clear previous content
  students.forEach(student => {
    const studentRow = createStudentRow(student);
    studentsTable.appendChild(studentRow);
  });
}

function createStudentRow(student) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${student.id}</td>
    <td>${student.Name}</td>
    <td>${student.branch}</td>
    <td>${student.password}</td>
    <td>
      <button onclick="deleteStudent('${student.id}')">Delete</button>
    </td>
  `;
  return row;
}

function showAddForm() {
  document.getElementById('form-title').innerText = 'Add Student';
  document.getElementById('studentId').value = '';
  document.getElementById('branch').value = '';
  document.getElementById('password').value = '';
  document.getElementById('student-form').style.display = 'block';
}

function hideForm() {
  document.getElementById('student-form').style.display = 'none';
}

document.getElementById('studentForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const formData = new FormData(this);
  const studentId = formData.get('id');
  const student = {
    id: formData.get('ID'),
    Name: formData.get('Name'),
    branch: formData.get('branch'),
    password: formData.get('password')
  };
  try {
    if (studentId) {
      // Update student
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(student)
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } else {
        // Add student
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(student)
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }
      fetchAndDisplayStudents(); // Refresh the student list
      hideForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });
  
  async function deleteStudent(id) {
    try {
      console.log(`Attempting to delete student with ID: ${id}`); // Log the student ID
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(`Student with ID: ${id} deleted successfully`); // Log success message
      fetchAndDisplayStudents();
    } catch (error) {
      console.error(`Error deleting student with ID ${id}:`, error);
    }
  }
  
  
  async function searchStudentById() {
    const id = document.getElementById('search-id').value;
    if (!id) {
      alert('Please enter a student ID');
      return;
    }
    try {
      const response = await fetch('/api/students');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const students = await response.json();
  
      // Find the searched student and move to the top
      const searchedStudentIndex = students.findIndex(student => student.id === id);
      if (searchedStudentIndex !== -1) {
        const [searchedStudent] = students.splice(searchedStudentIndex, 1);
        students.unshift(searchedStudent); // Move the searched student to the top
      } else {
        alert('Student not found');
      }
  
      displayStudents(students);
    } catch (error) {
      console.error(`Error fetching students:`, error);
    }
  }


async function filterStudentsByBranch() {
  const branch = document.getElementById('filter-branch').value;
  if (!branch) {
    alert('Please enter a branch');
    return;
  }
  try {
    const response = await fetch('/api/students');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const students = await response.json();

    // Separate students matching the branch from the rest
    const matchedStudents = students.filter(student => student.branch === branch);
    const otherStudents = students.filter(student => student.branch !== branch);

    // Combine matched students at the top and others below
    const updatedStudentsList = [...matchedStudents, ...otherStudents];

    displayStudents(updatedStudentsList);
  } catch (error) {
    console.error(`Error filtering students by branch ${branch}:`, error);
  }
}

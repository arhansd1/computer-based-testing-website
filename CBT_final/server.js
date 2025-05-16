const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname)));
const jsonFilePath = path.resolve(__dirname, 'students.json');
const jsonFilePath2 = path.resolve(__dirname, 'questions.json');
const jsonfilepath3 = path.resolve(__dirname, 'admins.json');

app.use(bodyParser.json());

// Load students from JSON file
async function loadStudents() {
  try {
    const data = await fs.readFile(jsonFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading students:', error);
    return [];
  }
}

// Save students to JSON file
async function saveStudents(students) {
  try {
    await fs.writeFile(jsonFilePath, JSON.stringify(students, null, 2));
    console.log('Students saved successfully.');
  } catch (error) {
    console.error('Error saving students:', error);
  }
}

// API endpoints

// Get all students or filter by branch
app.get('/api/students', async (req, res) => {
  try {
    const students = await loadStudents();
    const branch = req.query.branch;
    if (branch) {
      const filteredStudents = students.filter(student => student.branch === branch);
      res.json(filteredStudents);
    } else {
      res.json(students);
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get a student by ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const students = await loadStudents();
    const student = students.find(s => s.id === req.params.id);
    if (student) {
      res.json(student);
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new student
app.post('/api/students', async (req, res) => {
  try {
    const students = await loadStudents();
    const newStudent = req.body;
    students.push(newStudent);
    await saveStudents(students);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update a student by ID
app.put('/api/students/:id', async (req, res) => {
  try {
    const students = await loadStudents();
    const index = students.findIndex(s => s.id === req.params.id);
    if (index !== -1) {
      students[index] = { ...students[index], ...req.body };
      await saveStudents(students);
      res.json(students[index]);
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a student by ID
app.delete('/api/students/:id', async (req, res) => {
  try {
    const students = await loadStudents();
    const newStudents = students.filter(s => s.id !== req.params.id);
    await saveStudents(newStudents);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).send('Internal Server Error');
  }
});


async function loadQuestions() {
    try {
      const data = await fs.readFile(jsonFilePath2, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading questions:', error);
      return [];
    }
  }
  
  // Save questions to JSON file
  async function saveQuestions(questions) {
    try {
      await fs.writeFile(jsonFilePath2, JSON.stringify(questions, null, 2));
      console.log('Questions saved successfully.');
    } catch (error) {
      console.error('Error saving questions:', error);
      throw error; // Rethrow the error to propagate it
    }
  }
  
  // API endpoints
  app.get('/api/questions', async (req, res) => {
    try {
      const questions = await loadQuestions();
      res.json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  app.post('/api/questions', async (req, res) => {
    try {
      const questions = await loadQuestions();
      const newQuestion = req.body;
      
      // Example of validation
      if (!isValidQuestion(newQuestion)) {
        return res.status(400).send('Invalid question data');
      }
  
      questions.push(newQuestion);
      await saveQuestions(questions);
      res.status(201).json(newQuestion);
    } catch (error) {
      console.error('Error adding question:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  app.put('/api/questions/:id', async (req, res) => {
    try {
      const questions = await loadQuestions();
      const updatedQuestion = req.body;
      const index = questions.findIndex(q => q.id === updatedQuestion.id);
  
      if (index === -1) {
        return res.status(404).send('Question not found');
      }
  
      questions[index] = updatedQuestion;
      await saveQuestions(questions);
      res.json(updatedQuestion);
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  app.delete('/api/questions/:id', async (req, res) => {
    try {
      const questions = await loadQuestions();
      const id = req.params.id;
      const filteredQuestions = questions.filter(question => question.id !== id);
      await saveQuestions(filteredQuestions);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Endpoint to serve questions.json for viewing
  app.get('/api/view-json', async (req, res) => {
    try {
      const data = await fs.readFile(jsonFilePath2, 'utf8');
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    } catch (error) {
      console.error('Error reading questions.json:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Validate question function (example)
  function isValidQuestion(question) {
    return (
      question.id && typeof question.id === 'string' &&
      question.question && typeof question.question === 'string' &&
      question.type && typeof question.type === 'string' &&
      question.correctOption && typeof question.correctOption === 'string'
      // Add more validation rules as needed
    );
  }
  

// Load admins from JSON file
async function loadadmins() {
  try {
    const data = await fs.readFile(jsonfilepath3, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading admins:', error);
    return [];
  }
}

// Save admins to JSON file
async function saveadmins(admins) {
  try {
    await fs.writeFile(jsonfilepath3, JSON.stringify(admins, null, 2));
    console.log('admins saved successfully.');
  } catch (error) {
    console.error('Error saving admins:', error);
  }
}

// API endpoints

// Get all admins or filter by branch
app.get('/api/admins', async (req, res) => {
  try {
    const admins = await loadadmins();
    const branch = req.query.branch;
    if (branch) {
      const filteredadmins = admins.filter(admin => admin.branch === branch);
      res.json(filteredadmins);
    } else {
      res.json(admins);
    }
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get a admin by ID
app.get('/api/admins/:id', async (req, res) => {
  try {
    const admins = await loadadmins();
    const admin = admins.find(s => s.id === req.params.id);
    if (admin) {
      res.json(admin);
    } else {
      res.status(404).send('Admin not found');
    }
  } catch (error) {
    console.error('Error fetching Admin:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a new admin
app.post('/api/admins', async (req, res) => {
  try {
    const admins = await loadadmins();
    const newadmin = req.body;
    admins.push(newadmin);
    await saveadmins(admins);
    res.status(201).json(newadmin);
  } catch (error) {
    console.error('Error adding Admin:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update a admin by ID
app.put('/api/admins/:id', async (req, res) => {
  try {
    const admins = await loadadmins();
    const index = admins.findIndex(s => s.id === req.params.id);
    if (index !== -1) {
      admins[index] = { ...admins[index], ...req.body };
      await saveadmins(admins);
      res.json(admins[index]);
    } else {
      res.status(404).send('Admin not found');
    }
  } catch (error) {
    console.error('Error updating Admin:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a admin by ID
app.delete('/api/admins/:id', async (req, res) => {
  try {
    const admins = await loadadmins();
    const newadmins = admins.filter(s => s.id !== req.params.id);
    await saveadmins(newadmins);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting Admin:', error);
    res.status(500).send('Internal Server Error');
  }
});


  

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'home.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

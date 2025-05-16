// Array to store user credentials

const users = [
    { username: "selva", password: "123" },
    { username: "rish", password: "123" },
    { username: "nagaraj", password: "123" },
    { username: "user4", password: "password4" },
    { username: "user5", password: "password5" }
  ];
  
  function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Check if the entered username and password match any user in the array
    const user = users.find(u => u.username === username && u.password === password);
  
    if (user) {
      // Redirect to the new webpage
      window.location.href = 'admin-side/admin1.html';
      return false;
    } else {
      alert('Invalid username or password. Please try again.');
      return false;
    }
  }
  
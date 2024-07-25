document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayadmins();
});

async function fetchAndDisplayadmins() {
  try {
    const response = await fetch('/api/admins');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const admins = await response.json();
    displayadmins(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
  }
}

function displayadmins(admins) {
  const adminsTable = document.getElementById('admins-list');
  adminsTable.innerHTML = ''; // Clear previous content
  admins.forEach(admin => {
    const adminRow = createadminRow(admin);
    adminsTable.appendChild(adminRow);
  });
}

function createadminRow(admin) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${admin.id}</td>
    <td>${admin.Name}</td>
    <td>${admin.branch}</td>
    <td>${admin.password}</td>
    <td>
      <button onclick="deleteadmin('${admin.id}')">Delete</button>
    </td>
  `;
  return row;
}

function showAddForm() {
  document.getElementById('form-title').innerText = 'Add Admin';
  document.getElementById('adminId').value = '';
  document.getElementById('password').value = '';
  document.getElementById('admin-form').style.display = 'block';
}



function hideForm() {
  document.getElementById('admin-form').style.display = 'none';
}

document.getElementById('adminForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const formData = new FormData(this);
  const adminId = formData.get('id');
  const admin = {
    id: formData.get('ID'),
    Name: formData.get('Name'),
    password: formData.get('password')
  };
  try {
    if (adminId) {
      // Update admin
      const response = await fetch(`/api/admins/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(admin)
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } else {
        // Add admin
        const response = await fetch('/api/admins', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(admin)
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }
      fetchAndDisplayadmins(); // Refresh the admin list
      hideForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });
  
  async function deleteadmin(id) {
    try {
      console.log(`Attempting to delete Admin with ID: ${id}`); // Log the admin ID
      const response = await fetch(`/api/admins/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(`Admin with ID: ${id} deleted successfully`); // Log success message
      fetchAndDisplayadmins();
    } catch (error) {
      console.error(`Error deleting Admin with ID ${id}:`, error);
    }
  }
  
  
  async function searchadminById() {
    const id = document.getElementById('search-id').value;
    if (!id) {
      alert('Please enter an admin ID');
      return;
    }
    try {
      const response = await fetch('/api/admins');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const admins = await response.json();
  
      // Find the searched admin and move to the top
      const searchedadminIndex = admins.findIndex(admin => admin.id === id);
      if (searchedadminIndex !== -1) {
        const [searchedadmin] = admins.splice(searchedadminIndex, 1);
        admins.unshift(searchedadmin); // Move the searched admin to the top
      } else {
        alert('Admin not found');
      }
  
      displayadmins(admins);
    } catch (error) {
      console.error(`Error fetching admins:`, error);
    }
  }


async function filteradminsByBranch() {
  const branch = document.getElementById('filter-branch').value;
  if (!branch) {
    alert('Please enter a branch');
    return;
  }
  try {
    const response = await fetch('/api/admins');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const admins = await response.json();

    // Separate admins matching the branch from the rest
    const matchedadmins = admins.filter(admin => admin.branch === branch);
    const otheradmins = admins.filter(admin => admin.branch !== branch);

    // Combine matched admins at the top and others below
    const updatedadminsList = [...matchedadmins, ...otheradmins];

    displayadmins(updatedadminsList);
  } catch (error) {
    console.error(`Error filtering admins by branch ${branch}:`, error);
  }
}

let users = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchUsers();
});

async function fetchUsers() {
  try {
    const response = await fetch("/users-data");
    const result = await response.json();

    if (result.success) {
      users = result.data;
      renderUsers();
    } else {
      console.error("Failed to fetch user data:", result.message);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

function addUser() {
  const newUser = {
    id: users.length + 1, // Ensure ID is correctly set
    user_id: users.length + 1,
    firstname: "NewUser",
    email: "newuser@example.com",
    ph_no: "1234567890",
    Designation: "User",
    Manager: "subu",
    status_id: "Active", // Changed to match the status field name
  };
  users.push(newUser);
  renderUsers();
}

function openEditModal(userId) {
  const user = users.find((u) => u.id === parseInt(userId));
  if (!user) {
    console.error(`User with id ${userId} not found`);
    return;
  }

  document.getElementById("editUsername").value = user.firstname;
  document.getElementById("editEmail").value = user.email;
  document.getElementById("editPhone").value = user.ph_no;
  document.getElementById("editDesignation").value = user.Designation;
  document.getElementById("editManager").value = user.Manager;
  document.getElementById("editStatus").value = user.status_id;

  const modal = document.getElementById("editModal");
  modal.style.display = "block";

  const closeButton = document.getElementById("closeModal");
  closeButton.onclick = function () {
    modal.style.display = "none";
  };

  const editForm = document.getElementById("editForm");
  editForm.onsubmit = function (event) {
    event.preventDefault();
    user.firstname = document.getElementById("editUsername").value;
    user.email = document.getElementById("editEmail").value;
    user.ph_no = document.getElementById("editPhone").value;
    user.Designation = document.getElementById("editDesignation").value;
    user.Manager = document.getElementById("editManager").value;
    user.status_id = document.getElementById("editStatus").value;

    modal.style.display = "none";
    renderUsers();
  };
}

document
  .querySelector("#userTable tbody")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("edit-btn")) {
      const userId = event.target.getAttribute("data-id");
      openEditModal(userId);
    } else if (event.target.classList.contains("delete-btn")) {
      const userId = event.target.getAttribute("data-id");
      deleteUser(userId);
    } else if (event.target.classList.contains("save-btn")) {
      const userId = event.target.getAttribute("data-id");
      const user = users.find((u) => u.id === parseInt(userId));
      saveUser(user);
    }
  });

function renderUsers() {
  const tableBody = document.querySelector("#userTable tbody");
  tableBody.innerHTML = "";
  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.user_id}</td>
      <td>${user.firstname}</td>
      <td>${user.email}</td>
      <td>${user.ph_no}</td>
      <td>${user.Designation}</td>
      <td>${user.Manager}</td>
      <td>${user.status_id}</td>
      <td>
        <button class="edit-btn" onclick="editUser" data-id="${user.id}">✎</button>
        <button class="delete-btn" onclick="deleteUser()"data-id="${user.id}">❌</button>
        <button class="save-btn" onclick="saveUsers()" data-id="${user.id}">✅</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function deleteUser(userId) {
  const index = users.findIndex((user) => user.id === parseInt(userId));
  if (index !== -1) {
    users.splice(index, 1);
    renderUsers();
  }
}

// Initial rendering of users
renderUsers();

async function saveUser(user) {
  const response = await fetch("/user-table", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([user]),
  });
  const result = await response.json();
  console.log(result);
}

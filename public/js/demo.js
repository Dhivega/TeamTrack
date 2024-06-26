document.addEventListener("DOMContentLoaded", function () {
  let currentPage = 1;
  let rowsPerPage = document.getElementById("rowsValue").value;
  let usersData = [];
  let userIdToDelete = null; // Store the user ID to delete

  function showAlert(message) {
    document.getElementById("alertMessage").textContent = message;
    $("#alertModal").modal("show");
  }

  function showConfirm(userId) {
    userIdToDelete = userId;
    $("#confirmModal").modal("show");
  }

  function fetchUsers() {
    fetch("/users-data")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        if (data.success) {
          usersData = data.data;
          displayUsers();
          populateManagerDropdown();
          createPagination();
        } else {
          showAlert("Failed to fetch user data");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        showAlert("Error fetching user data");
      });
  }

  function displayUsers() {
    const tbody = document.querySelector("#tab_logic tbody");
    tbody.innerHTML = "";
    const start = (currentPage - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, usersData.length);

    for (let i = start; i < end; i++) {
      const user = usersData[i];
      const row = `<tr>
              <td>${user.user_id}</td>
              <td>${user.name}</td>
              <td>${user.mail}</td>
              <td>${user.password}</td>
              <td>${user.Designation}</td>
              <td>${user.Manager}</td>
              <td>${user.statusName}</td>
              <td>${user.roleName}</td>
              <td>
                  <button class="btn btn-xs btn-info editUser" data-id="${user.user_id}">Edit</button>
                  <button class="btn btn-xs btn-danger deleteUser" data-id="${user.user_id}">Delete</button>
              </td>
          </tr>`;
      tbody.insertAdjacentHTML("beforeend", row);
    }

    updatePagination();
    addEditDeleteEventListeners();
  }

  function populateManagerDropdown() {
    const managerSelect = document.querySelector("#editUserManager");
    managerSelect.innerHTML = "";
    usersData.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.name;
      option.textContent = user.name;
      managerSelect.appendChild(option);
    });
  }

  function updatePagination() {
    const totalPages = Math.ceil(usersData.length / rowsPerPage);
    const paginationLinks = document.getElementById("paginationLinks");
    paginationLinks.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = i;

      // Highlight the current page link
      if (i === currentPage) {
        link.classList.add("active");
      }

      link.addEventListener("click", function (event) {
        event.preventDefault();
        currentPage = i;
        displayUsers();
      });

      paginationLinks.appendChild(link);
    }
  }

  function deleteUser(userId) {
    fetch("/users/" + userId, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          showAlert("User deleted successfully");
          fetchUsers();
        } else {
          showAlert("Failed to delete user");
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        showAlert("Error deleting user");
      });
  }

  function addEditDeleteEventListeners() {
    document.querySelectorAll(".editUser").forEach((button) => {
      button.addEventListener("click", function () {
        const userId = this.dataset.id;
        const user = usersData.find((user) => user.user_id == userId);
        document.querySelector("#editUserId").value = user.user_id;
        document.querySelector("#editUserName").value = user.name;
        document.querySelector("#editUserEmail").value = user.mail;
        document.querySelector("#editUserPwd").value = user.password;
        document.querySelector("#editUserDesignation").value = user.Designation;
        document.querySelector("#editUserManager").value = user.Manager;
        document.querySelector("#editUserStatus").value = user.status;
        document.querySelector("#editUserrole").value = user.role_id;

        $("#editModal").modal("show");
      });
    });

    document.querySelectorAll(".deleteUser").forEach((button) => {
      button.addEventListener("click", function () {
        const userId = this.dataset.id;
        showConfirm(userId); // Show confirmation modal
      });
    });
  }

  fetchUsers();

  document.getElementById("saveChanges").addEventListener("click", function () {
    const formData = {
      user_id: document.querySelector("#editUserId").value,
      name: document.querySelector("#editUserName").value,
      mail: document.querySelector("#editUserEmail").value,
      password: document.querySelector("#editUserPwd").value,
      Designation: document.querySelector("#editUserDesignation").value,
      Manager: document.querySelector("#editUserManager").value,
      status: document.querySelector("#editUserStatus").value,
      role: document.querySelector("#editUserrole").value,
    };

    const isExistingUser = formData.user_id.trim() !== "";
    const url = isExistingUser ? "/users" : "/save";
    fetch(url, {
      method: isExistingUser ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            isExistingUser ? "Failed to update user" : "Failed to add user"
          );
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          showAlert(
            isExistingUser
              ? "User updated successfully"
              : "User added successfully"
          );
          $("#editModal").modal("hide");
          fetchUsers();
        } else {
          showAlert(
            isExistingUser ? "Failed to update user" : "Failed to add user"
          );
        }
      })

      .catch((error) => {
        console.error("Error:", error);
        showAlert("Error performing operation");
      });
  });

  document.getElementById("add_row").addEventListener("click", function () {
    document.querySelector("#editUserId").value = "";
    document.querySelector("#editUserName").value = "";
    document.querySelector("#editUserEmail").value = "";
    document.querySelector("#editUserPwd").value = "";
    document.querySelector("#editUserDesignation").value = "";
    document.querySelector("#editUserManager").value = "";
    document.querySelector("#editUserStatus").value = "";
    document.querySelector("#editUserrole").value = "";

    $("#editModal").modal("show");
  });

  document.querySelector(".btn-filter").addEventListener("click", function () {
    const panel = this.closest(".filterable");
    const filters = panel.querySelectorAll(".filters input");
    const tbody = panel.querySelector(".table tbody");
    if (filters[0].disabled) {
      filters.forEach((filter) => {
        filter.disabled = false;
      });
      filters.forEach((filter) => {
        filter.focus();
      });
    } else {
      filters.forEach((filter) => {
        filter.value = "";
        filter.disabled = true;
      });
      const noResult = tbody.querySelector(".no-result");
      if (noResult) {
        noResult.remove();
      }
      tbody.querySelectorAll("tr").forEach((row) => {
        row.style.display = "";
      });
    }
  });

  document.querySelectorAll(".filterable .filters input").forEach((input) => {
    input.addEventListener("keyup", function (e) {
      if (e.key === "Tab") return;

      const inputContent = input.value.toLowerCase();
      const panel = input.closest(".filterable");
      const columnIndex = Array.from(
        panel.querySelectorAll(".filters th")
      ).indexOf(input.closest("th"));
      const table = panel.querySelector(".table");
      const rows = table.querySelectorAll("tbody tr");

      rows.forEach((row) => {
        const cell = row.querySelectorAll("td")[columnIndex];
        if (
          cell &&
          cell.textContent.toLowerCase().indexOf(inputContent) === -1
        ) {
          row.style.display = "none";
        } else {
          row.style.display = "";
        }
      });

      const noResult = table.querySelector("tbody .no-result");
      if (noResult) {
        noResult.remove();
      }
      if (Array.from(rows).every((row) => row.style.display === "none")) {
        const noResultRow = document.createElement("tr");
        noResultRow.className = "no-result text-center";
        const noResultCell = document.createElement("td");
        noResultCell.colSpan = panel.querySelectorAll(".filters th").length;
        noResultCell.textContent = "No result found";
        noResultRow.appendChild(noResultCell);
        table.querySelector("tbody").appendChild(noResultRow);
      }
    });
  });

  document
    .getElementById("confirmDelete")
    .addEventListener("click", function () {
      if (userIdToDelete) {
        deleteUser(userIdToDelete);
        $("#confirmModal").modal("hide");
      }
    });

  document.getElementById("nextPage").addEventListener("click", function () {
    if (currentPage < Math.ceil(usersData.length / rowsPerPage)) {
      currentPage++;
      displayUsers();
    }
  });

  document.getElementById("prevPage").addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      displayUsers();
    }
  });

  function createPagination() {
    const totalPages = Math.ceil(usersData.length / rowsPerPage);
    const paginationLinks = document.getElementById("paginationLinks");
    paginationLinks.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = i;

      // Highlight the current page link
      if (i === currentPage) {
        link.classList.add("active");
      }

      link.addEventListener("click", function (event) {
        event.preventDefault();
        currentPage = i;
        displayUsers();
      });

      paginationLinks.appendChild(link);
    }

    // Add Previous and Next page buttons
    const prevButton = document.createElement("a");
    prevButton.href = "#";
    prevButton.textContent = "«";
    prevButton.addEventListener("click", function (event) {
      event.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        displayUsers();
      }
    });
    paginationLinks.insertBefore(prevButton, paginationLinks.firstChild);

    const nextButton = document.createElement("a");
    nextButton.href = "#";
    nextButton.textContent = "»";
    nextButton.addEventListener("click", function (event) {
      event.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        displayUsers();
      }
    });
    paginationLinks.appendChild(nextButton);
  }

  // Initialize the page
  fetchUsers();
});

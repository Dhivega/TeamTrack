// document.addEventListener("DOMContentLoaded", function () {
//   let usersData = [];
//   let managersData = [];
//   let userIdToDelete = null; // Store the user ID to delete

//   function showAlert(message) {
//     document.getElementById("alertMessage").textContent = message;
//     $("#alertModal").modal("show");
//   }

//   function showConfirm(userId) {
//     userIdToDelete = userId;
//     $("#confirmModal").modal("show");
//   }

//   function fetchUsers() {
//     Promise.all([fetch("/users-data"), fetch("/managers-data")])
//       .then((responses) => Promise.all(responses.map((res) => res.json())))
//       .then(([usersResponse, managersResponse]) => {
//         if (usersResponse.success) {
//           usersData = usersResponse.data;
//           displayUsers();
//         } else {
//           showAlert("Failed to fetch user data");
//         }

//         if (managersResponse.success) {
//           managersData = managersResponse.data;
//           populateManagerDropdown();
//         } else {
//           showAlert("Failed to fetch manager data");
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         showAlert("Error fetching data");
//       });
//   }

//   function displayUsers() {
//     const tbody = document.querySelector("#tab_logic tbody");
//     tbody.innerHTML = "";

//     usersData.forEach((user) => {
//       const row = `<tr>
//                 <td>${user.user_id}</td>
//                 <td>${user.name}</td>
//                 <td>${user.mail}</td>
//                 <td>${user.password}</td>
//                 <td>${user.Designation || ""}</td>
//                 <td>${user.manager_name || ""}</td>
//                 <td>${user.statusName}</td>
//                 <td>${user.roleName}</td>
//                 <td>
//                     <button class="btn btn-xs btn-info editUser" data-id="${
//                       user.user_id
//                     }">Edit</button>
//                     <button class="btn btn-xs btn-danger deleteUser" data-id="${
//                       user.user_id
//                     }">Delete</button>
//                 </td>
//             </tr>`;
//       tbody.insertAdjacentHTML("beforeend", row);
//     });

//     addEditDeleteEventListeners();
//   }

//   function populateManagerDropdown() {
//     const managerSelect = document.querySelector("#editUserManager");
//     managerSelect.innerHTML = "";
//     managersData.forEach((manager) => {
//       const option = document.createElement("option");
//       option.value = manager.manager_id;
//       option.textContent = manager.manager_name;
//       managerSelect.appendChild(option);
//     });
//   }

//   function deleteUser(userId) {
//     fetch("/users/" + userId, {
//       method: "DELETE",
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to delete user");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         if (data.success) {
//           showAlert("User deleted successfully");
//           fetchUsers();
//         } else {
//           showAlert("Failed to delete user");
//         }
//       })
//       .catch((error) => {
//         console.error("Error deleting user:", error);
//         showAlert("Error deleting user");
//       });
//   }

//   function addEditDeleteEventListeners() {
//     document.querySelectorAll(".editUser").forEach((button) => {
//       button.addEventListener("click", function () {
//         const userId = this.dataset.id;
//         const user = usersData.find((user) => user.user_id == userId);
//         document.querySelector("#editUserId").value = user.user_id;
//         document.querySelector("#editUserName").value = user.name;
//         document.querySelector("#editUserEmail").value = user.mail;
//         document.querySelector("#editUserPwd").value = user.password;
//         document.querySelector("#editUserDesignation").value = user.Designation;
//         document.querySelector("#editUserManager").value = user.manager_id;
//         document.querySelector("#editUserStatus").value = user.status;
//         document.querySelector("#editUserrole").value = user.role_id;

//         $("#editModal").modal("show");
//       });
//     });

//     document.querySelectorAll(".deleteUser").forEach((button) => {
//       button.addEventListener("click", function () {
//         const userId = this.dataset.id;
//         showConfirm(userId); // Show confirmation modal
//       });
//     });
//   }

//   fetchUsers();

//   document.getElementById("saveChanges").addEventListener("click", function () {
//     const formData = {
//       user_id: document.querySelector("#editUserId").value,
//       name: document.querySelector("#editUserName").value,
//       mail: document.querySelector("#editUserEmail").value,
//       password: document.querySelector("#editUserPwd").value,
//       Designation: document.querySelector("#editUserDesignation").value,
//       manager_name: document.querySelector("#editUserManager").value,
//       status: document.querySelector("#editUserStatus").value,
//       role: document.querySelector("#editUserrole").value,
//     };

//     const isExistingUser = formData.user_id.trim() !== "";
//     const url = isExistingUser ? "/users" : "/save";
//     fetch(url, {
//       method: isExistingUser ? "PUT" : "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(
//             isExistingUser ? "Failed to update user" : "Failed to add user"
//           );
//         }
//         return response.json();
//       })
//       .then((data) => {
//         if (data.success) {
//           showAlert(
//             isExistingUser
//               ? "User updated successfully"
//               : "User added successfully"
//           );
//           $("#editModal").modal("hide");
//           fetchUsers();
//         } else {
//           showAlert(
//             isExistingUser ? "Failed to update user" : "Failed to add user"
//           );
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         showAlert("Error performing operation");
//       });
//   });

//   document.getElementById("add_row").addEventListener("click", function () {
//     document.querySelector("#editUserId").value = "";
//     document.querySelector("#editUserName").value = "";
//     document.querySelector("#editUserEmail").value = "";
//     document.querySelector("#editUserPwd").value = "";
//     document.querySelector("#editUserDesignation").value = "";
//     document.querySelector("#editUserManager").value = "";
//     document.querySelector("#editUserStatus").value = "";
//     document.querySelector("#editUserrole").value = "";

//     $("#editModal").modal("show");
//   });

//   document.querySelector(".btn-filter").addEventListener("click", function () {
//     const panel = this.closest(".filterable");
//     const filters = panel.querySelectorAll(".filters input");
//     const tbody = panel.querySelector(".table tbody");
//     if (filters[0].disabled) {
//       filters.forEach((filter) => {
//         filter.disabled = false;
//       });
//       filters.forEach((filter) => {
//         filter.focus();
//       });
//     } else {
//       filters.forEach((filter) => {
//         filter.value = "";
//         filter.disabled = true;
//       });
//       const noResult = tbody.querySelector(".no-result");
//       if (noResult) {
//         noResult.remove();
//       }
//       tbody.querySelectorAll("tr").forEach((row) => {
//         row.style.display = "";
//       });
//     }
//   });

//   document.querySelectorAll(".filterable .filters input").forEach((input) => {
//     input.addEventListener("keyup", function (e) {
//       if (e.key === "Tab") return;

//       const inputContent = input.value.toLowerCase();
//       const panel = input.closest(".filterable");
//       const columnIndex = Array.from(
//         panel.querySelectorAll(".filters th")
//       ).indexOf(input.closest("th"));
//       const table = panel.querySelector(".table");
//       const rows = table.querySelectorAll("tbody tr");

//       rows.forEach((row) => {
//         const cell = row.querySelectorAll("td")[columnIndex];
//         if (
//           cell &&
//           cell.textContent.toLowerCase().indexOf(inputContent) === -1
//         ) {
//           row.style.display = "none";
//         } else {
//           row.style.display = "";
//         }
//       });

//       const noResult = table.querySelector("tbody .no-result");
//       if (noResult) {
//         noResult.remove();
//       }
//       if (Array.from(rows).every((row) => row.style.display === "none")) {
//         const noResultRow = document.createElement("tr");
//         noResultRow.className = "no-result text-center";
//         const noResultCell = document.createElement("td");
//         noResultCell.colSpan = panel.querySelectorAll(".filters th").length;
//         noResultCell.textContent = "No result found";
//         noResultRow.appendChild(noResultCell);
//         table.querySelector("tbody").appendChild(noResultRow);
//       }
//     });
//   });

//   document
//     .getElementById("confirmDelete")
//     .addEventListener("click", function () {
//       if (userIdToDelete) {
//         deleteUser(userIdToDelete);
//         $("#confirmModal").modal("hide");
//       }
//     });

//   // Initialize the page
//   fetchUsers();
// });

document.addEventListener("DOMContentLoaded", function () {
  let usersData = [];
  let managersData = [];
  let userIdToDelete = null; // Store the user ID to delete

  function showAlert(message) {
    alert(message); // Use browser's built-in alert
  }

  function showConfirm(userId) {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      deleteUser(userId);
    }
  }

  function fetchUsers() {
    Promise.all([fetch("/users-data"), fetch("/managers-data")])
      .then((responses) => Promise.all(responses.map((res) => res.json())))
      .then(([usersResponse, managersResponse]) => {
        if (usersResponse.success) {
          usersData = usersResponse.data;
          displayUsers();
        } else {
          showAlert("Failed to fetch user data");
        }

        if (managersResponse.success) {
          managersData = managersResponse.data;
          populateManagerDropdown();
        } else {
          showAlert("Failed to fetch manager data");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        showAlert("Error fetching data");
      });
  }

  function displayUsers() {
    const tbody = document.querySelector("#tab_logic tbody");
    tbody.innerHTML = "";

    usersData.forEach((user) => {
      const row = `<tr>
                <td>${user.user_id}</td>
                <td>${user.name}</td>
                <td>${user.mail}</td>
                <td>${user.password}</td>
                <td>${user.Designation || ""}</td>
                <td>${user.manager_name || ""}</td>
                <td>${user.statusName}</td>
                <td>${user.roleName}</td>
                <td>
                    <button class="btn btn-xs btn-info editUser" data-id="${
                      user.user_id
                    }">Edit</button>
                    <button class="btn btn-xs btn-danger deleteUser" data-id="${
                      user.user_id
                    }">Delete</button>
                </td>
            </tr>`;
      tbody.insertAdjacentHTML("beforeend", row);
    });

    addEditDeleteEventListeners();
  }

  function populateManagerDropdown() {
    const managerSelect = document.querySelector("#editUserManager");
    managerSelect.innerHTML = "";
    managersData.forEach((manager) => {
      const option = document.createElement("option");
      option.value = manager.manager_id;
      option.textContent = manager.manager_name;
      managerSelect.appendChild(option);
    });
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
        document.querySelector("#editUserManager").value = user.manager_id;
        document.querySelector("#editUserStatus").value = user.status;
        document.querySelector("#editUserrole").value = user.role_id;

        $("#editModal").modal("show");
      });
    });

    document.querySelectorAll(".deleteUser").forEach((button) => {
      button.addEventListener("click", function () {
        const userId = this.dataset.id;
        showConfirm(userId); // Show confirmation dialog
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
      manager_name: document.querySelector("#editUserManager").value,
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

  // Initialize the page
  fetchUsers();
});

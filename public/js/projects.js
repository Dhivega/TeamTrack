document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logout-link").addEventListener("click", (event) => {
    event.preventDefault();
    window.localStorage.removeItem("userID");
    window.location.href = event.target.href;
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const addProjectButton = document.getElementById("add_project");
  const saveChangesButton = document.getElementById("saveChanges");
  const editModal = $("#editModal");
  const projectForm = document.getElementById("projectForm");
  let editRow = null;
  let projects = [];
  let currentPage = 1;
  const rowsPerPage = 10;

  function clearForm() {
    projectForm.reset();
  }

  function updateRow(row) {
    row.children[0].textContent =
      document.getElementById("editProjectcode").value;
    row.children[1].textContent = document.getElementById(
      "editProjectdescription"
    ).value;
    row.children[2].textContent = document.getElementById(
      "editProjectsolution"
    ).value;
    row.children[3].textContent = document.getElementById(
      "editProjectactivitytype"
    ).value;
    row.children[4].textContent = document.getElementById(
      "editProjectsubsidiary"
    ).value;
    row.children[5].textContent = document.getElementById(
      "editcomplementarydescription"
    ).value;
    row.children[6].textContent =
      document.getElementById("editProjectManager").value;
  }

  function addNewRow() {
    const newRow = {
      code: document.getElementById("editProjectcode").value,
      Description: document.getElementById("editProjectdescription").value,
      Solution: document.getElementById("editProjectsolution").value,
      Activity_type: document.getElementById("editProjectactivitytype").value,
      subsidiary: document.getElementById("editProjectsubsidiary").value
        .textContent,
      Complementary_desc: document.getElementById(
        "editcomplementarydescription"
      ).value,
      Project_manager: document.getElementById("editProjectManager").value,
      Project_id: editRow ? editRow.dataset.id : projects.length + 1, // Mock ID for new entries
    };
    projects.push(newRow);
    displayProjects();
    fetchProjects();
  }

  function displayProjects() {
    const tbody = document.querySelector("#tab_logic tbody");
    tbody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedProjects = projects.slice(start, end);

    paginatedProjects.forEach((project) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
      <td>${project.code}</td>
      <td>${project.Description}</td>
      <td>${project.Solution}</td>
      <td>${project.Activity_type}</td>
      <td>${project.subsidiary}</td>
      <td>${project.Complementary_desc}</td>
      <td>${project.Project_manager}</td>
      <td>
        <button class="btn btn-xs btn-info editrow">Edit</button>
        <button class="btn btn-xs btn-danger delrow">Delete</button>
      </td>
    `;
      newRow.dataset.id = project.Project_id;
      tbody.appendChild(newRow);
    });

    updatePaginationControls();
  }

  function updatePaginationControls() {
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");

    prevButton.disabled = currentPage === 1;
    nextButton.disabled =
      currentPage === Math.ceil(projects.length / rowsPerPage);
  }

  addProjectButton.addEventListener("click", function () {
    clearForm();
    editRow = null;
    editModal.modal("show");
  });

  saveChangesButton.addEventListener("click", function () {
    const formData = {
      code: document.getElementById("editProjectcode").value,
      Description: document.getElementById("editProjectdescription").value,
      Solution: document.getElementById("editProjectsolution").value,
      Activity_type: document.getElementById("editProjectactivitytype").value,
      subsidiary: document.getElementById("editProjectsubsidiary").value,
      Complementary_desc: document.getElementById(
        "editcomplementarydescription"
      ).value,
      Project_manager: document.getElementById("editProjectManager").value,
      Project_id: editRow ? editRow.dataset.id : null,
    };

    if (editRow) {
      fetch("/update-project", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("updated successfully");
            const index = projects.findIndex(
              (project) => project.Project_id == formData.Project_id
            );
            projects[index] = formData;
            displayProjects();
            fetchProjects();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      fetch("/add-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("project added successfully");
            formData.Project_id = data.Project_id;
            projects.push(formData);
            displayProjects();
            fetchProjects();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    editModal.modal("hide");
  });

  document
    .querySelector("#tab_logic tbody")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("editrow")) {
        editRow = event.target.closest("tr");
        document.getElementById("editProjectcode").value =
          editRow.children[0].textContent;
        document.getElementById("editProjectdescription").value =
          editRow.children[1].textContent;
        document.getElementById("editProjectsolution").value =
          editRow.children[2].textContent;
        document.getElementById("editProjectactivitytype").value =
          editRow.children[3].textContent;
        document.getElementById("editProjectsubsidiary").value =
          editRow.children[4].textContent;
        document.getElementById("editcomplementarydescription").value =
          editRow.children[5].textContent;
        document.getElementById("editProjectManager").value =
          editRow.children[6].textContent;
        editModal.modal("show");
      } else if (event.target.classList.contains("delrow")) {
        const projectId = event.target.closest("tr").dataset.id;
        fetch(`/delete-project/${projectId}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              alert("Project deleted successfully");
              projects = projects.filter(
                (project) => project.Project_id != projectId
              );
              displayProjects();
              fetchProjects();
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });

  document.getElementById("prevPage").addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      displayProjects();
    }
  });

  document.getElementById("nextPage").addEventListener("click", function () {
    if (currentPage < Math.ceil(projects.length / rowsPerPage)) {
      currentPage++;
      displayProjects();
    }
  });

  fetchProjects();

  function fetchProjects() {
    fetch("/projects-data")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          projects = data.data;
          displayProjects();
        } else {
          console.error("Error fetching projects:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }
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
      if (cell && cell.textContent.toLowerCase().indexOf(inputContent) === -1) {
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

document.getElementById("confirmDelete").addEventListener("click", function () {
  if (userIdToDelete) {
    deleteUser(userIdToDelete);
    $("#confirmModal").modal("hide");
  }
});

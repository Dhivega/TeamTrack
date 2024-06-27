document.addEventListener("DOMContentLoaded", function () {
  const addProjectButton = document.getElementById("add_project");
  const saveChangesButton = document.getElementById("saveChanges");
  const editModal = $("#editModal");
  const projectForm = document.getElementById("projectForm");
  let editRow = null;
  let projects = [];
  let managersData = [];
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

  // function addNewRow() {
  //   const newRow = {
  //     code: document.getElementById("editProjectcode").value,
  //     Description: document.getElementById("editProjectdescription").value,
  //     Solution: document.getElementById("editProjectsolution").value,
  //     Activity_type: document.getElementById("editProjectactivitytype").value,
  //     subsidiary: document.getElementById("editProjectsubsidiary").value,
  //     Complementary_desc: document.getElementById(
  //       "editcomplementarydescription"
  //     ).value,
  //     manager_name: document.getElementById("editProjectManager").value,
  //     Project_id: editRow ? editRow.dataset.id : projects.length + 1,
  //   };
  //   projects.push(newRow);
  //   displayProjects();
  //   fetchProjects();
  // }

  function fetchProjects() {
    Promise.all([fetch("/projects-data"), fetch("/managers-data")])
      .then((responses) => Promise.all(responses.map((res) => res.json())))
      .then(([projectsResponse, managersResponse]) => {
        if (projectsResponse.success) {
          projects = projectsResponse.data;
          displayProjects();
        } else {
          showAlert("Failed to fetch project data");
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
        <td>${project.manager_name}</td>
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

  function populateManagerDropdown() {
    const managerSelect = document.querySelector("#editProjectManager");
    managerSelect.innerHTML = "";
    managersData.forEach((manager) => {
      const option = document.createElement("option");
      option.value = manager.manager_id;
      option.textContent = manager.manager_name;
      managerSelect.appendChild(option);
    });
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
      manager_id: document.getElementById("editProjectManager").value,
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
            alert("Updated successfully");
            const index = projects.findIndex(
              (project) => project.Project_id == formData.Project_id
            );
            projects[index] = formData;
            displayProjects();
            fetchProjects();
            populateManagerDropdown();
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
            alert("Project added successfully");
            formData.Project_id = data.Project_id;
            projects.push(formData);
            displayProjects();
            fetchProjects();
            populateManagerDropdown();
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
          editRow.children[6].dataset.manager_id;
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
  populateManagerDropdown();
});

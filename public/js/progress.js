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
  const rowsPerPage = 3;

  function clearForm() {
    projectForm.reset();
  }

  function addNewRow(project) {
    projects.push(project);
    displayProjects();
  }

  addProjectButton.addEventListener("click", function () {
    clearForm();
    editRow = null;
    editModal.modal("show");
  });

  fetchProgress();

  saveChangesButton.addEventListener("click", function () {
    const project = {
      code: document.getElementById("editProjectCode").value,
      Description: document.getElementById("editProjectDescription").value,
      start_date: document.getElementById("editProjectstart_date").value,
      end_date: document.getElementById("editProjectend_date").value,
      actual_step: document.getElementById("editProjectactual_step").value,
      critical: document.getElementById("editProjectCritical").value,
      weather: document.getElementById("editProjectWeather").value,
      past_two_weaks_review: document.getElementById(
        "editProjectpast_two_weaks_review"
      ).value,
      coming_two_weaks_review: document.getElementById(
        "editProjectComingReview"
      ).value,
      major_problem: document.getElementById("editProjectProblems").value,
      Project_id: editRow ? editRow.dataset.id : null,
    };

    if (editRow) {
      const index = projects.findIndex(
        (p) => p.Project_id === project.Project_id
      );
      if (index !== -1) {
        projects[index] = project;
        displayProjects();
        fetchProgress();
      }

      fetch("/update-progress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Progress updated succesfully");
            console.log("Progress updated successfully:", data.message);
          } else {
            console.error("Error updating project:", data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      addNewRow(project);

      fetch("/add-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("Project added successfully:", data.message);
          } else {
            console.error("Error adding project:", data.message);
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
    .addEventListener("click", function (e) {
      if (e.target.classList.contains("editrow")) {
        editRow = e.target.closest("tr");
        const cells = editRow.children;
        document.getElementById("editProjectCode").value = cells[0].textContent;
        document.getElementById("editProjectDescription").value =
          cells[1].textContent;
        document.getElementById("editProjectstart_date").value =
          cells[2].textContent;
        document.getElementById("editProjectend_date").value =
          cells[3].textContent;
        document.getElementById("editProjectactual_step").value =
          cells[4].textContent;
        document.getElementById("editProjectCritical").value =
          cells[5].textContent;
        document.getElementById("editProjectWeather").value =
          cells[6].textContent;
        document.getElementById("editProjectpast_two_weaks_review").value =
          cells[7].textContent;
        document.getElementById("editProjectComingReview").value =
          cells[8].textContent;
        document.getElementById("editProjectProblems").value =
          cells[9].textContent;
        editModal.modal("show");
      } else if (e.target.classList.contains("delrow")) {
        const row = e.target.closest("tr");
        const index = projects.findIndex(
          (p) => p.Project_id === row.dataset.id
        );
        if (index !== -1) {
          projects.splice(index, 1);
          displayProjects();
          fetchProgress();
        }
      }
    });

  document.getElementById("prevPage").addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      displayProjects();
      fetchProgress();
    }
  });

  document.getElementById("nextPage").addEventListener("click", function () {
    if (currentPage * rowsPerPage < projects.length) {
      currentPage++;
      displayProjects();
      fetchProgress();
    }
  });

  function fetchProgress() {
    fetch("/progress-data")
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

  function displayProjects() {
    const tbody = document.querySelector("#tab_logic tbody");
    tbody.innerHTML = "";
    const start = (currentPage - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, projects.length);

    for (let i = start; i < end; i++) {
      const project = projects[i];
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
<td>${project.code}</td>
<td>${project.Description}</td>
<td>${project.start_date}</td>
<td>${project.end_date}</td>
<td>${project.actual_step}</td>
<td>${project.critical}</td>
<td>${project.weather}</td>
<td>${project.past_two_weaks_review}</td>
<td>${project.coming_two_weaks_review}</td>
<td>${project.major_problem}</td>
<td>
  <button class="btn btn-xs btn-info editrow">Edit</button>
</td>
`;
      newRow.dataset.id = project.Project_id;
      tbody.appendChild(newRow);
    }

    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = end >= projects.length;
  }

  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", function () {
      const option = this.textContent.toLowerCase();
      switch (option) {
        case "users":
          window.location.href = "/demo";
          break;
        case "projects":
          window.location.href = "/projects";
          break;
        case "progress":
          window.location.href = "/progress";
          break;
        default:
          break;
      }
    });
  });
});

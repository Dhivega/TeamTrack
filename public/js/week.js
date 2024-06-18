document.addEventListener("DOMContentLoaded", () => {
  console.log("UserID", window.localStorage.getItem("userID"));
  setCurrentMonthAndYear();
  fetchProjects();
  fetchUsers();
  loadReport();
  generateTable();
  document
    .getElementById("add_project")
    .addEventListener("click", addProjectRow);
});

document.getElementById("month").addEventListener("change", generateTable);
document.getElementById("year").addEventListener("change", generateTable);

function generateTable() {
  const month = parseInt(document.getElementById("month").value);
  const year = parseInt(document.getElementById("year").value);
  const tableBody = document.getElementById("tab_logic").querySelector("tbody");
  tableBody.innerHTML = "";

  let firstDay = new Date(year, month - 1, 1);
  let firstMonday = new Date(firstDay);
  firstMonday.setDate(
    firstMonday.getDate() + ((1 + 7 - firstDay.getDay()) % 7)
  );

  let currentMonday = new Date(firstMonday);
  let currentFriday = new Date(currentMonday);
  currentFriday.setDate(currentFriday.getDate() + 4);

  for (let currentWeek = 1; currentWeek <= 5; currentWeek++) {
    let weekFromCell = document.getElementById("week" + currentWeek + "From");
    let weekToCell = document.getElementById("week" + currentWeek + "To");
    let weekCell = document.getElementById("weekcell" + currentWeek);

    weekFromCell.textContent = `${currentMonday.getDate()} ${monthName(
      currentMonday.getMonth()
    )}`;
    weekToCell.textContent = `${currentFriday.getDate()} ${monthName(
      currentFriday.getMonth()
    )}`;
    weekCell.textContent = getWeekNumber(currentMonday);

    currentMonday.setDate(currentMonday.getDate() + 7);
    currentFriday.setDate(currentFriday.getDate() + 7);
  }

  renderUsers();
  loadReport(); // Add this line to fetch and populate the report data for the selected month and year
}

function setCurrentMonthAndYear() {
  const currentDate = new Date();
  document.getElementById("month").value = currentDate.getMonth() + 1;
  document.getElementById("year").value = currentDate.getFullYear();
}

function monthName(monthIndex) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthIndex];
}

function getWeekNumber(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff =
    (date -
      start +
      (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000) /
    86400000;
  return Math.floor((diff + start.getDay() + 1) / 7) + 1;
}

let users = [];

async function fetchUsers() {
  try {
    const response = await fetch("/report-data");
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

function renderUsers() {
  const tableBody = document.getElementById("tab_logic").querySelector("tbody");
  tableBody.innerHTML = ""; // Clear existing rows
  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.code}</td>
      <td>${user.description}</td>
      <td>${user.solution}</td>
      <td>${user.activity_Type}</td>
      <td>${user.subsidiary}</td>
      <td>${user.Complementary_desc}</td>
      <td><input type='number' class='form-control' /></td>
      <td><input type='number' class='form-control' /></td>
      <td><input type='number' class='form-control' /></td>
      <td><input type='number' class='form-control' /></td>
      <td><input type='number' class='form-control' /></td>
    `;
    tableBody.appendChild(row);
  });
}

let projects = [];
async function fetchProjects() {
  try {
    const response = await fetch("/proj-data");
    const result = await response.json();
    if (result.success) {
      projects = result.data;
      renderProjects();
    } else {
      console.error("Failed to fetch project data:", result.message);
    }
  } catch (error) {
    console.error("Error fetching project data:", error);
  }
}

function renderProjects() {
  const tableBody = document.getElementById("tab_logic").querySelector("tbody");
  projects.slice(3).forEach((project, index) => {
    const row = document.createElement("tr");
    row.id = `addr${index}`;
    row.innerHTML = `
      <td></td>
      <td>${project.description}</td>
      <td>${project.solution}</td>
      <td>${project.activity_Type}</td>
      <td>${project.subsidiary}</td>
      <td>${project.Complementary_desc}</td>
      <td>${project.week1}</td>
      <td>${project.week2}</td>
      <td>${project.week3}</td>
      <td>${project.week4}</td>
      <td>${project.week5}</td>
    `;
    tableBody.appendChild(row);
  });
}

function addProjectRow() {
  const tableBody = document.getElementById("tab_logic").querySelector("tbody");

  const existingDescriptions = Array.from(tableBody.querySelectorAll("tr"))
    .map((row) => row.cells[1].textContent)
    .filter((desc) => desc.trim() !== "");

  const availableDescriptions = projects
    .map((project) => project.description)
    .filter((desc) => !existingDescriptions.includes(desc));

  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td></td>
    <td>
      <select class="form-control" onchange="onSelectChange('description', this)">
        <option value=''>Select description</option>
        ${generateOptions(availableDescriptions)}
      </select>
    </td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td><input type="text" name="week1" class="form-control" /></td>
    <td><input type="text" name="week2" class="form-control" /></td>
    <td><input type="text" name="week3" class="form-control" /></td>
    <td><input type="text" name="week4" class="form-control" /></td>
    <td><input type="text" name="week5" class="form-control" /></td>
  `;
  tableBody.appendChild(newRow);
}

function onSelectChange(key, selectElement) {
  const selectedValue = selectElement.value;
  let selectedProject = projects.find(
    (project) => project.description === selectedValue
  );

  if (selectedProject) {
    const row = selectElement.closest("tr");
    row.cells[0].innerText = selectedProject.code;
    row.cells[1].innerText = selectedProject.description;
    row.cells[2].innerText = selectedProject.solution;
    row.cells[3].innerText = selectedProject.activity_Type;
    row.cells[4].innerText = selectedProject.subsidiary;
    row.cells[5].innerText = selectedProject.Complementary_desc;
  }
}

function generateOptions(values) {
  return values
    .map((value) => `<option value="${value}">${value}</option>`)
    .join("");
}

async function saveReport() {
  const year = document.getElementById("year").value;
  const month = document.getElementById("month").value;
  const weekno1 = document.getElementById("weekcell1").textContent;
  const weekno2 = document.getElementById("weekcell2").textContent;
  const weekno3 = document.getElementById("weekcell3").textContent;
  const weekno4 = document.getElementById("weekcell4").textContent;
  const weekno5 = document.getElementById("weekcell5").textContent;

  const table = document.getElementById("tab_logic");
  const reportData = [];
  const rows = table.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    const user_id = window.localStorage.getItem("userID");

    const code = row.cells[0].textContent;
    const description = row.cells[1].textContent;
    const solution = row.cells[2].textContent;
    const activity_Type = row.cells[3].textContent;
    const subsidiary = row.cells[4].textContent;
    const Complementary_desc = row.cells[5].textContent;
    const data1 = row.cells[6].querySelector("input")?.value || "";
    const data2 = row.cells[7].querySelector("input")?.value || "";
    const data3 = row.cells[8].querySelector("input")?.value || "";
    const data4 = row.cells[9].querySelector("input")?.value || "";
    const data5 = row.cells[10].querySelector("input")?.value || "";

    reportData.push({
      user_id,
      code,
      description,
      solution,
      activity_Type,
      subsidiary,
      Complementary_desc,
      data1,
      data2,
      data3,
      data4,
      data5,
    });
  });

  try {
    const response = await fetch("/save-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        year,
        month,
        reportData,
        weekno1,
        weekno2,
        weekno3,
        weekno4,
        weekno5,
      }),
    });
    const result = await response.json();
    if (result.success) {
      alert("Report saved successfully!");
    } else {
      console.error("Failed to save report:", result.message);
    }
  } catch (error) {
    console.error("Error saving report:", error);
  }
}

async function loadReport() {
  const user_id = window.localStorage.getItem("userID");
  const year = document.getElementById("year").value;
  const month = document.getElementById("month").value;

  try {
    const response = await fetch(
      `/get-report?user_id=${user_id}&year=${year}&month=${month}`
    );
    const result = await response.json();
    if (result.success && result.data.length > 0) {
      console.log("result", result);
      populateTable(result.data);
    } else {
      console.log("No data found for this user, month, and year.");
      renderDefaultRows();
    }
  } catch (error) {
    console.error("Error loading report:", error);
    renderDefaultRows();
  }
}

function populateTable(data) {
  const tableBody = document.getElementById("tab_logic").querySelector("tbody");
  tableBody.innerHTML = "";

  data.forEach((rowData) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${rowData.code}</td>
      <td>${rowData.description}</td>
      <td>${rowData.solution}</td>
      <td>${rowData.activity_type}</td>
      <td>${rowData.subsidiary}</td>
      <td>${rowData.Complementary_desc}</td>
      <td><input type="text" name="week1" class="form-control" value="${rowData.data1}" /></td>
      <td><input type="text" name="week2" class="form-control" value="${rowData.data2}" /></td>
      <td><input type="text" name="week3" class="form-control" value="${rowData.data3}" /></td>
      <td><input type="text" name="week4" class="form-control" value="${rowData.data4}" /></td>
      <td><input type="text" name="week5" class="form-control" value="${rowData.data5}" /></td>
    `;
    tableBody.appendChild(newRow);
  });
}
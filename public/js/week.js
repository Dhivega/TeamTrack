document.addEventListener("DOMContentLoaded", () => {
  setCurrentMonthAndYear();
  fetchProjects();
  loadReport();
  generateTable();
  fetchUsers();
  saveReport();
  document
    .getElementById("add_project")
    .addEventListener("click", addProjectRow);
});

document.getElementById("month").addEventListener("change", generateTable);
document.getElementById("year").addEventListener("change", generateTable);

function generateTable() {
  const month = parseInt(document.getElementById("month").value);
  const tableBody = document.getElementById("tab_logic").querySelector("tbody");
  tableBody.innerHTML = ""; // Clear existing rows
  renderUsers();
  console.log("month:" + month);
  const year = parseInt(document.getElementById("year").value);

  let firstDay = new Date(year, month - 1, 1);
  let firstMonday = new Date(firstDay);
  firstMonday.setDate(
    firstMonday.getDate() + ((1 + 7 - firstDay.getDay()) % 7)
  ); // Find the first Monday of the month

  let currentMonday = new Date(firstMonday); // Start from the first Monday
  let currentFriday = new Date(currentMonday);
  currentFriday.setDate(currentFriday.getDate() + 4); // Calculate Friday of the current week

  for (let currentWeek = 1; currentWeek <= 5; currentWeek++) {
    let weekFromCell = document.getElementById("week" + currentWeek + "From");
    let weekToCell = document.getElementById("week" + currentWeek + "To");
    let weekCell = document.getElementById("weekcell" + currentWeek);
    let fromText = "";
    let toText = "";

    // Set the "From" and "To" sub-columns with the starting and ending dates of the week
    fromText =
      currentMonday.getDate() + " " + monthName(currentMonday.getMonth());
    toText =
      currentFriday.getDate() + " " + monthName(currentFriday.getMonth());

    // Update the table cells
    weekFromCell.textContent = fromText;
    weekToCell.textContent = toText;
    weekCell.textContent = getWeekNumber(currentMonday);
    var weekno = weekCell.textContent;
    // var cell = getWeekNumber(currentMonday);
    console.log("weekno:" + weekno);

    // Move to the next week (Monday to Friday)
    currentMonday.setDate(currentMonday.getDate() + 7);
    currentFriday.setDate(currentFriday.getDate() + 7);
  }
}

function setCurrentMonthAndYear() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  console.log("curr:" + currentMonth);
  // JavaScript months are zero-based
  const currentYear = currentDate.getFullYear();

  document.getElementById("month").value = currentMonth;
  document.getElementById("year").value = currentYear;
}

function setCurrentMonth() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  console.log("currentMonth:" + currentMonth); // JavaScript months are zero-based
  document.getElementById("month").value = currentMonth;
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

// get data from project table first 3 rows
let users = [];
async function fetchUsers() {
  try {
    const response = await fetch("/report-data");
    const result = await response.json();
    console.log("res:" + result);
    if (result.success) {
      users = result.data;
      console.log(users);
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
  users.forEach((user, index) => {
    console.log("index:" + index);
    const row = document.createElement("tr");
    // row.id = `addr${index}`;
    row.innerHTML = `
         
          <td id="code">${user.code}</td>
          <td id="description">${user.description}</td>
          <td>${user.solution}</td>
          <td>${user.activity_Type}</td>
          <td>${user.subsidiary}</td>
          <td>${user.complementary_Description}</td>
          <td><input type='number' name='weekcell' placeholder='' id="data1" class='form-control' value=''/></td>
          <td><input type='number' name='weekcell' placeholder='' class='form-control' value=''/></td>
          <td><input type='number' name='weekcell' placeholder='' class='form-control' value=''/></td>
          <td><input type='number' name='weekcell' placeholder='' class='form-control' value=''/></td>
          <td><input type='number' name='weekcell' placeholder='' class='form-control' value=''/></td>
          
        `;
    tableBody.appendChild(row);
    console.log(user.code);
  });
}

// function addLongPressEvent(row) {
//   let pressTimer;

//   row.addEventListener("mousedown", () => {
//     pressTimer = setTimeout(() => {
//       if (confirm("Do you want to delete this row?")) {
//         row.remove();
//       }
//       row.remove();
//     }, 1000); // 1000 milliseconds = 1 second
//   });

//   row.addEventListener("mouseup", () => {
//     clearTimeout(pressTimer);
//   });

//   row.addEventListener("mouseleave", () => {
//     clearTimeout(pressTimer);
//   });
// }

// fetch data from projects except 3 rows for dropdown
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
  // tableBody.innerHTML = ""; // Clear existing rows
  projects.forEach((project, index) => {
    if (index < 3) return; // Skip the first three rows
    const row = document.createElement("tr");
    row.id = `addr${index}`;
    row.innerHTML = `
          <td></td>
          <td>${project.description}</td>
          <td>${project.solution}</td>
          <td>${project.activity_Type}</td>
          <td>${project.subsidiary}</td>
          <td>${project.complementary_Description}</td>
          <td>${project.week1}</td>
          <td>${project.week2}</td>
          <td>${project.week3}</td>
          <td>${project.week4}</td>
          <td>${project.week5}</td>
        `;
    tableBody.appendChild(row);
    // console.log("projects1:" + projects);
  });
}

function addProjectRow() {
  const tableBody = document.getElementById("tab_logic").querySelector("tbody");
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
    <td></td>
    <td>
      <select class="form-control" onchange="onSelectChange('description', this)">
        <option value=''>Select description</option>
        ${generateOptions(projects.map((project) => project.description))}
      </select>
    </td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td><input type="text" name="week1" class="form-control" value="" /></td>
    <td><input type="text" name="week2" class="form-control" value="" /></td>
    <td><input type="text" name="week3" class="form-control" value="" /></td>
    <td><input type="text" name="week4" class="form-control" value="" /></td>
    <td><input type="text" name="week5" class="form-control" value="" /></td>
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
    row.cells[5].innerText = selectedProject.complementary_Description;
  }
}

function generateOptions(values) {
  return values
    .map((value) => `<option value="${value}">${value}</option>`)
    .join("");
}

// save report
async function saveReport() {
  const yearElement = document.getElementById("year");
  const monthElement = document.getElementById("month");
  const weekcell1Element = document.getElementById("weekcell1");
  const weekcell2Element = document.getElementById("weekcell2");
  const weekcell3Element = document.getElementById("weekcell3");
  const weekcell4Element = document.getElementById("weekcell4");
  const weekcell5Element = document.getElementById("weekcell5");

  const year = yearElement.value;
  const month = monthElement.value;
  const weekno1 = weekcell1Element.textContent;
  const weekno2 = weekcell2Element.textContent;
  const weekno3 = weekcell3Element.textContent;
  const weekno4 = weekcell4Element.textContent;
  const weekno5 = weekcell5Element.textContent;

  const table = document.getElementById("tab_logic");
  const reportData = [];
  const rows = table.querySelectorAll("tbody tr");

  rows.forEach((row, index) => {
    const code = row.cells[0].textContent;

    const description = row.cells[1].textContent;
    const solution = row.cells[2].textContent;
    const activity_Type = row.cells[3].textContent;
    const subsidiary = row.cells[4].textContent;
    const complementary_Description = row.cells[5].textContent;
    const data1 = row.cells[6].querySelector("input")?.value || "";
    const data2 = row.cells[7].querySelector("input")?.value || "";
    const data3 = row.cells[8].querySelector("input")?.value || "";
    const data4 = row.cells[9].querySelector("input")?.value || "";
    const data5 = row.cells[10].querySelector("input")?.value || "";

    reportData.push({
      code,
      description,
      solution,
      activity_Type,
      subsidiary,
      complementary_Description,
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
  try {
    const response = await fetch("/get-report");
    const result = await response.json();
    if (result.success) {
      populateTable(result.data);
    } else {
      console.error("Failed to load report:", result.message);
    }
  } catch (error) {
    console.error("Error loading report:", error);
  }
}

function populateTable(data) {
  const tableBody = document.getElementById("tab_logic").querySelector("tbody");
  tableBody.innerHTML = ""; // Clear existing rows

  data.forEach((rowData) => {
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
      <td>${rowData.code}</td>
      <td>${rowData.description}</td>
      <td>${rowData.solution}</td>
      <td>${rowData.activity_Type}</td>
      <td>${rowData.subsidiary}</td>
      <td>${rowData.complementary_Description}</td>
      <td><input type="text" name="week1" class="form-control" value="${rowData.data1}" /></td>
      <td><input type="text" name="week2" class="form-control" value="${rowData.data2}" /></td>
      <td><input type="text" name="week3" class="form-control" value="${rowData.data3}" /></td>
      <td><input type="text" name="week4" class="form-control" value="${rowData.data4}" /></td>
      <td><input type="text" name="week5" class="form-control" value="${rowData.data5}" /></td>
    `;

    tableBody.appendChild(newRow);
  });
}

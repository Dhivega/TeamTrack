async function saveProject(project) {
  try {
    const response = await fetch("/project-table", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    console.log("Project data saved successfully:", result);
  } catch (error) {
    console.error("Error saving project data:", error);
  }
}

function handleSaveClick(event) {
  console.log("Save button clicked"); // Check if the button click event is being triggered

  var button = event.target;
  var row = button.closest("tr");
  console.log("Row:", row); // Check if the correct row is being selected

  var projectData = {
    code: row.cells[0].querySelector("input").value,
    description: row.cells[2].querySelector("input").value,
    manager: row.cells[6].querySelector("input").value,

    solution: row.cells[3].querySelector("select").value,
    activityType: row.cells[4].querySelector("select").value,
    subsidiary: row.cells[5].querySelector("input").value,
  };

  console.log("Project data:", projectData); // Check if the project data is extracted correctly

  saveProject(projectData);
}

// Attach event listeners to save buttons for existing rows
document.querySelectorAll(".saverow").forEach((button) => {
  button.addEventListener("click", handleSaveClick);
});

// Add event listener to dynamically add rows
document.getElementById("addRowBtn1").addEventListener("click", function () {
  var table = document.getElementById("TableBody");
  var newRow = table.insertRow(-1); // -1 to insert at the end

  for (var i = 0; i < 7; i++) {
    var newCell = newRow.insertCell(i);
    var newInput;

    if (i == 3) {
      newInput = document.createElement("select");
      newInput.className = "dropdown";
      var option1 = document.createElement("option");
      option1.value = "WEB";
      option1.textContent = "WEB";
      var option2 = document.createElement("option");
      option2.value = "BI";
      option2.textContent = "BI";
      var option3 = document.createElement("option");
      option3.value = "AIML";
      option3.textContent = "AIML";
      var option4 = document.createElement("option");
      option4.value = "ETL";
      option4.textContent = "ETL";
      newInput.appendChild(option1);
      newInput.appendChild(option2);
      newInput.appendChild(option3);
      newInput.appendChild(option4);
    } else if (i == 4) {
      newInput = document.createElement("select");
      newInput.className = "dropdown";
      var option1 = document.createElement("option");
      option1.value = "Support";
      option1.textContent = "Support";
      var option2 = document.createElement("option");
      option2.value = "Followup";
      option2.textContent = "Followup";
      var option3 = document.createElement("option");
      option3.value = "Miscellaneous";
      option3.textContent = "Miscellaneous";

      newInput.appendChild(option1);
      newInput.appendChild(option2);
      newInput.appendChild(option3);
    } else {
      newInput = document.createElement("input");
      newInput.type = "text";
      newInput.className = "column-input";
      newInput.value = i === 0 ? "DEV.I.0.3" : i === 1 ? "Support✍" : "";
    }

    newCell.appendChild(newInput);
  }

  var delCell = newRow.insertCell(7);
  var delButton = document.createElement("button");
  var saveButton = document.createElement("button");
  delButton.textContent = "❌";
  saveButton.textContent = "✅";
  delButton.className = "delrow";
  saveButton.className = "saverow";
  delCell.appendChild(delButton);
  delCell.appendChild(saveButton);

  delButton.addEventListener("click", function () {
    table.deleteRow(newRow.rowIndex);
  });

  // Add event listener to the new row's save button
  saveButton.addEventListener("click", handleSaveClick);
});

let project = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchproject();
});

async function fetchproject() {
  try {
    const response = await fetch("/project-data");
    const result = await response.json();

    if (result.success) {
      project = result.data;
      saveProject();

      console.log(result);
    } else {
      console.error("Failed to fetch user data:", result.message);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("logIn");
  var submitButton = document.getElementById("btn");

  form.addEventListener("input", function () {
    if (form.checkValidity()) {
      btn.disabled = false;
      btn.enabled = true;
      // submitButton.style.backgroundColor = "green";
    } else {
      btn.disabled = true;
    }
  });
});

document.getElementById("logIn").addEventListener("submit", async (event) => {
  console.log("login");
  event.preventDefault(); // Prevent default form submission

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  console.log("data..", data);

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // .then((response) => response.json())
    // .then((data) => {
    //   console.log("data..", data);
    // });

    const responseData = await response.json();
    console.log("response:" + responseData);
    if (responseData.success) {
      // alert("Login Successful");
      // alert("Welcome");
      window.location.href = "/week";
    } else {
      alert(responseData.message || "Failed to login");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred during login. Please try again.");
  }
});

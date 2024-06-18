document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("logIn");
  var submitButton = document.getElementById("btn");

  form.addEventListener("input", function () {
    if (form.checkValidity()) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  });
});

document.getElementById("logIn").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  console.log("Submitted data:", data);

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log("Response data:", responseData);

    if (response.ok && responseData.success) {
      let userArray = responseData.data;

      if (Array.isArray(userArray) && userArray.length > 0) {
        let user = userArray[0];
        console.log("User data:", user);

        if (user && user.role_id !== undefined) {
          console.log("Role ID:", user.role_id);
          window.localStorage.setItem("userID", user.user_id);

          if (user.role_id === 2) {
            console.log("Redirecting to /week");

            window.location.href = `/week`; //user page
          } else if (user.role_id === 1) {
            console.log("Redirecting to /demo");
            window.location.href = `/demo`; //admin page

          } else {
            console.log("Unknown user role:", user.role_id);
            alert("Unknown user role. Redirecting to unauthorized page.");
            window.location.href = `/unauthorized?user_id=${user.user_id}`;
          }
        } else {
          console.error("Invalid user data:", user);
          alert("Invalid user data received.");
        }
      } else {
        console.error("User data is not an array or is empty:", userArray);
        alert("Invalid user data received.");
      }
    } else {
      console.error("Login failed:", responseData.message || "Unknown error");
      alert(responseData.message || "Failed to login");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred during login. Please try again.");
  }
});

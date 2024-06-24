document
  .getElementById("firstname")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("lastname").focus();
    }
  });
document
  .getElementById("lastname")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("email").focus();
    }
  });
document.getElementById("email").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("Confirm E-mail").focus();
  }
});
document
  .getElementById("Confirm E-mail")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("password").focus();
    }
  });
document
  .getElementById("password")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("Confirm Password").focus();
    }
  });

document
  .getElementById("firstname")
  .addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
      event.preventDefault();
      document.getElementById("lastname").focus();
    }
  });
document
  .getElementById("lastname")
  .addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
      event.preventDefault();
      document.getElementById("email").focus();
    }
  });
document.getElementById("email").addEventListener("keydown", function (event) {
  if (event.key === "Tab") {
    event.preventDefault();
    document.getElementById("Confirm E-mail").focus();
  }
});
document
  .getElementById("Confirm E-mail")
  .addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
      event.preventDefault();
      document.getElementById("password").focus();
    }
  });
document
  .getElementById("password")
  .addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
      event.preventDefault();
      document.getElementById("Confirm Password").focus();
    }
  });

var disableBtn = true;
var enablebtn = false;

var checkPassword = function () {
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("Confirm Password").value;

  if (password === "" && confirmPassword === "") {
    document
      .getElementById("password")
      .classList.remove("matching", "not-matching");
    document
      .getElementById("Confirm Password")
      .classList.remove("matching", "not-matching");
    document.getElementById("message").innerHTML = "";
  } else if (password === confirmPassword) {
    document.getElementById("password").classList.add("matching");
    document.getElementById("password").classList.remove("not-matching");
    document.getElementById("Confirm Password").classList.add("matching");
    document
      .getElementById("Confirm Password")
      .classList.remove("not-matching");
    document.getElementById("message").innerHTML = "";
    document.getElementById("btn").disabled = false;
    disableBtn = false;
  } else {
    document.getElementById("password").classList.add("not-matching");
    document.getElementById("password").classList.remove("matching");
    document.getElementById("Confirm Password").classList.add("not-matching");
    document.getElementById("Confirm Password").classList.remove("matching");
    document.getElementById("message").innerHTML = "";
    document.getElementById("btn").disabled = true;
    disableBtn = true;
  }
};

var checkEmail = function () {
  var email = document.getElementById("email").value;
  var confirmEmail = document.getElementById("Confirm E-mail").value;

  if (email === "" && confirmEmail === "") {
    document
      .getElementById("email")
      .classList.remove("matching", "not-matching");
    document
      .getElementById("Confirm E-mail")
      .classList.remove("matching", "not-matching");
    document.getElementById("message1").innerHTML = "";
  } else if (email === confirmEmail) {
    document.getElementById("email").classList.add("matching");
    document.getElementById("email").classList.remove("not-matching");
    document.getElementById("Confirm E-mail").classList.add("matching");
    document.getElementById("Confirm E-mail").classList.remove("not-matching");
    document.getElementById("message1").innerHTML = "";
    document.getElementById("btn").disabled = false;
    disableBtn = false;
  } else {
    document.getElementById("email").classList.add("not-matching");
    document.getElementById("email").classList.remove("matching");
    document.getElementById("Confirm E-mail").classList.add("not-matching");
    document.getElementById("Confirm E-mail").classList.remove("matching");
    document.getElementById("message1").innerHTML = "";
    document.getElementById("btn").disabled = true;
    disableBtn = true;
  }
};

document.getElementById("password").addEventListener("input", checkPassword);
document
  .getElementById("Confirm Password")
  .addEventListener("input", checkPassword);
document.getElementById("email").addEventListener("input", checkEmail);
document.getElementById("Confirm E-mail").addEventListener("input", checkEmail);

document.getElementById("signUp").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const fname = formData.get("firstname");
  console.log("fname:" + fname);
  const lname = formData.get("lastname");
  const email = formData.get("email");
  const password = formData.get("password");
  const designation = formData.get("designation");
  const address = formData.get("address");

  try {
    const response = await fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname,
        lname,
        email,
        password,
        designation,
        address,
      }),
    });

    const data = await response.json();
    console.log("data:" + data);

    if (response.ok && data.success) {
      alert("User data submitted successfully!");
      window.location.href = "/login";
    } else {
      alert(data.message || "Failed to submit user data!");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

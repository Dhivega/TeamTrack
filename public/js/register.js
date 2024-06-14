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
    if (event.key === "Enter  ") {
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

//  document.getElementById('btn').style.display='none';
var disableBtn = true;
var enablebtn = false;
var checkPassword = function () {
  if (
    document.getElementById("password").value == "" &&
    document.getElementById("Confirm Password").value == ""
  ) {
    document.getElementById("message").style.color = "";
    document.getElementById("message").innerHTML = "";
  }
  if (
    document.getElementById("email").value == " " &&
    document.getElementById("Confirm E-mail").value == ""
  ) {
    document.getElementById("message").style.color = "";
    document.getElementById("message").innerHTML = "";
  }

  if (
    document.getElementById("password").value ==
    document.getElementById("Confirm Password").value
  ) {
    document.getElementById("message").style.color = "green";
    document.getElementById("message").innerHTML = "matching";
    // alert('password matching');
    //document.getElementById('btn').style.display="block";
    document.getElementById("btn").disabled = false;
    disableBtn = false;
    document.getElementById("btn").enabled = true;
    // enablebtn = true;
  } else {
    document.getElementById("message").style.color = "red";
    document.getElementById("message").innerHTML = "not matching";
    // alert('password not matching');
    //document.getElementById('btn').style.display="none";
    document.getElementById("btn").disabled = true;
    disableBtn = true;
  }
};
var checkEmail = function () {
  if (
    document.getElementById("email").value ==
    document.getElementById("Confirm E-mail").value
  ) {
    document.getElementById("message1").style.color = "green";
    document.getElementById("message1").innerHTML = "matching";
    // alert('email match');
    //document.getElementById('btn').style.display="block"
    document.getElementById("btn").disabled = false;
    disableBtn = false;
    document.getElementById("btn").enabled = true;
    // enablebtn = true;
  } else {
    document.getElementById("message1").style.color = "red";
    document.getElementById("message1").innerHTML = "not matching";
    // alert('email not match');
    //document.getElementById('btn').style.display="none"
    document.getElementById("btn").disabled = true;
    disableBtn = true;
  }
};

document.getElementById("signUp").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const fname = formData.get("firstname");
  console.log("fname:" + fname);
  const lname = formData.get("lastname");
  const email = formData.get("email");
  // const phone = formData.get("phone");
  const password = formData.get("password");
  // const confirmPassword = formData.get("confirm pwd");

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

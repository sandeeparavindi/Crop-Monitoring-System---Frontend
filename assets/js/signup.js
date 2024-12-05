let signInURI = "http://localhost:5050/cropMonitoring/api/v0/auth/signin";
let signUpURI = "http://localhost:5050/cropMonitoring/api/v0/auth/signup";
let refreshTokenURI =
  "http://localhost:5050/cropMonitoring/api/v0/auth/refresh";
let token, refreshToken;

function showValidationError(title, text) {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
    footer: '<a href="">Why do I have this issue?</a>',
  });
}

function showPopup(type, title, text, confirmCallback = null) {
  Swal.fire({
    icon: type,
    title: title,
    text: text,
    showCancelButton: !!confirmCallback,
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed && confirmCallback) {
      confirmCallback();
    }
  });
}
// Sign In
$("#signinForm").on("submit", function (e) {
  e.preventDefault();

  const signInData = {
    email: $("#email").val().trim(),
    password: $("#password").val().trim(),
  };

  console.log("Sign-In Data:", signInData);

  $.ajax({
    url: signInURI,
    method: "POST",
    data: JSON.stringify(signInData),
    contentType: "application/json",
    success: function (resp) {
      console.log("Sign-In Response:", resp);

      token = resp.token;
      refreshToken = resp.refreshToken;
      const userRole = resp.role;
      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);

      console.log("Role Stored:", userRole);
      console.log("Token Stored:", localStorage.getItem("token"));
      window.location.href = "pages/dashborad.html";
    },
    error: function (xhr) {
      console.error("Sign-In Error:", xhr.responseText);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Sign-In Failed: Invalid Email or Password",
      });
      return;
    },
  });
});

// Sign Up
$("#signupForm").on("submit", function (e) {
  e.preventDefault();

  const email = $("#email").val().trim();
  const password = $("#password").val().trim();
  const role = $("#role").find("option:selected").val().toUpperCase();

  if (!email) {
    showValidationError("Missing Email", "Email field cannot be empty.");
    return;
  }

  if (!password) {
    showValidationError("Missing Password", "Password field cannot be empty.");
    return;
  }

  if (!role) {
    showValidationError("Missing Role", "Please select a role.");
    return;
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
  if (!emailRegex.test(email)) {
    showValidationError("Invalid Email", "Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    showValidationError("Weak Password", "Password must be at least 6 characters long.");
    return;
  }

  const signUpData = {
    email: email,
    password: password,
    role: role,
  };

  $.ajax({
    url: signUpURI,
    method: "POST",
    data: JSON.stringify(signUpData),
    contentType: "application/json",
    success: function (response) {
      console.log("Sign-Up Successful:", response);
      showPopup(
        "success",
        "Sign-Up Successful",
        "Your account has been created successfully.",
        function () {
          window.location.href = "/index.html"; 
        }
      );
    },
    error: function (xhr) {
      console.error("Sign-Up Error:", xhr.responseText);

      let errorMessage = "Sign-Up Failed!, Email already exists!";
      if (xhr.responseJSON && xhr.responseJSON.message) {
        errorMessage = xhr.responseJSON.message;
      }

      showValidationError("Error", errorMessage);
    },
  });
});

// Get Form Data for Sign In
function getAllSignInDataFromField() {
  return {
    email: $("#email").val(),
    password: $("#password").val(),
  };
}

// Get Form Data for Sign Up
function getAllSignUpDataFromField() {
  return {
    email: $("#email").val(),
    password: $("#password").val(),
    role: $("#role").find("option:selected").val(),
  };
}

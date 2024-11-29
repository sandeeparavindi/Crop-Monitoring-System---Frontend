let signInURI = "http://localhost:5050/cropMonitoring/api/v0/auth/signin";
let signUpURI = "http://localhost:5050/cropMonitoring/api/v0/auth/signup";
let refreshTokenURI =
  "http://localhost:5050/cropMonitoring/api/v0/auth/refresh";
let token, refreshToken;

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

      // Store tokens and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", userRole);

      console.log("Role Stored:", userRole);
      // Verify token storage
      console.log("Token Stored:", localStorage.getItem("token"));
      console.log(
        "Refresh Token Stored:",
        localStorage.getItem("refreshToken")
      );

      // Redirect to the desired page
      window.location.href = "pages/sidebar.html";
    },
    error: function (xhr) {
      console.error("Sign-In Error:", xhr.responseText);
      alert("Sign-In Failed: Invalid Email or Password");
    },
  });
});

// Sign Up
$("#signupForm").on("submit", function (e) {
  e.preventDefault();

  const signUpData = {
    email: $("#email").val().trim(),
    password: $("#password").val().trim(),
    role: $("#role").find("option:selected").val().toUpperCase(),
  };

  console.log("Sign-Up Data:", signUpData);

  $.ajax({
    url: "http://localhost:5050/cropMonitoring/api/v0/auth/signup",
    method: "POST",
    data: JSON.stringify(signUpData),
    contentType: "application/json",
    success: function (response) {
      console.log("Sign-Up Successful:", response);

      // Save tokens to local storage
      localStorage.setItem("token", response.token);
      localStorage.setItem("refreshToken", response.refreshToken);

      // Redirect the user to the sidebar or dashboard
      window.location.href = "/index.html";
    },
    error: function (xhr) {
      // Log the error for debugging
      console.error("Error:", xhr.responseText);
      alert("Sign-Up Failed: " + xhr.responseText);
    },
  });
});

// Utility to Refresh Token
function refreshAuthToken() {
  const currentRefreshToken = localStorage.getItem("refreshToken");

  $.ajax({
    url: refreshTokenURI,
    method: "POST",
    data: JSON.stringify({ refreshToken: currentRefreshToken }),
    contentType: "application/json",
    success: function (resp) {
      // Update tokens
      token = resp.token;
      localStorage.setItem("token", token);
      console.log("Tokens refreshed successfully:", token);
    },
    error: function () {
      console.error("Token refresh failed. Please log in again.");
    },
  });
}

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

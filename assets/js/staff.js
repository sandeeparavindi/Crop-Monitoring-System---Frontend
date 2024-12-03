function isFirstLetterCapitalized(text) {
  return /^[A-Z]/.test(text);
}

function isValidContactNumber(contactNo) {
  return /^[0-9]{10}$/.test(contactNo);
}

function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}

// Validation 
function validateInputsWithPopup() {
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const designationInput = document.getElementById("designation");
  const genderInput = document.getElementById("gender");
  const joinedDateInput = document.getElementById("joinDate");
  const dobInput = document.getElementById("dob");
  const contactNoInput = document.getElementById("contactNo");
  const emailInput = document.getElementById("email");
  const roleInput = document.getElementById("role");
  const address1Input = document.getElementById("address1");
  const address2Input = document.getElementById("address2");
  const address3Input = document.getElementById("address3");
  const address4Input = document.getElementById("address4");
  const address5Input = document.getElementById("address5");

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const designation = designationInput.value.trim();
  const gender = genderInput.value.trim();
  const joinedDate = joinedDateInput.value.trim();
  const dob = dobInput.value.trim();
  const contactNo = contactNoInput.value.trim();
  const email = emailInput.value.trim();
  const role = roleInput.value.trim();
  const address1 = address1Input.value.trim();
  const address2 = address2Input.value.trim();
  const address3 = address3Input.value.trim();
  const address4 = address4Input.value.trim();
  const address5 = address5Input.value.trim();

  if (!firstName || firstName.length < 3 || !isFirstLetterCapitalized(firstName)) {
    showValidationError(
      "Invalid Input",
      "First Name must start with a capital letter and be at least 3 characters long."
    );
    return false;
  }

  if (!lastName || lastName.length < 3 || !isFirstLetterCapitalized(lastName)) {
    showValidationError(
      "Invalid Input",
      "Last Name must start with a capital letter and be at least 3 characters long."
    );
    return false;
  }

  if (!firstName) {
    showValidationError(
      "Invalid Input",
      "Crop First Name cannot be empty."
    );
    return false;
  }

  if (!lastName) {
    showValidationError(
      "Invalid Input",
      "Crop Last Name cannot be empty."
    );
    return false;
  }

  if (!designation) {
    showValidationError("Invalid Input", "Designation cannot be empty.");
    return false;
  }

  if (!gender) {
    showValidationError("Invalid Input", "Gender cannot be empty.");
    return false;
  }

  if (!joinedDate) {
    showValidationError("Invalid Input", "Joined Date cannot be empty.");
    return false;
  }

  if (!dob) {
    showValidationError("Invalid Input", "Date of Birth cannot be empty.");
    return false;
  }

  if (!role) {
    showValidationError("Invalid Input", "Role cannot be empty.");
    return false;
  }

  const addressLines = [address1, address2, address3, address4, address5];
  for (let i = 0; i < addressLines.length; i++) {
    if (addressLines[i] && !isFirstLetterCapitalized(addressLines[i])) {
      showValidationError(
        "Invalid Input",
        `Address Line ${i + 1} must start with a capital letter.`
      );
      return false;
    }
  }

  if (!contactNo || !isValidContactNumber(contactNo)) {
    showValidationError(
      "Invalid Input",
      "Contact Number must be exactly 10 digits."
    );
    return false;
  }

  if (!email || !isValidEmail(email)) {
    showValidationError(
      "Invalid Input",
      "Email must be a valid '@gmail.com' address."
    );
    return false;
  }

  return true;
}

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

function generateStaffId() {
  const prefix = "S-";
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  return prefix + randomCode;
}

function setStaffId() {
  const staffIdInput = document.getElementById("staffId");
  staffIdInput.value = generateStaffId();
}

window.onload = function () {
  setStaffId();
};

//getall
$(document).ready(function () {
  $("#getAllBtn").click(function () {
    window.location.href = "staff-list.html";
  });
});

//get all vehicles
$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "http://localhost:5050/cropMonitoring/api/v1/vehicles/allVehicles",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (data) {
      const vehicleSelect = $("#allocatedVehicles");
      data.forEach((vehicle) => {
        if (
          vehicle.status &&
          (vehicle.status.toLowerCase() === "available")
        ) {
          vehicleSelect.append(
            new Option(
              `${vehicle.vehicleCode} - ${vehicle.vehicleCategory}`,
              vehicle.vehicleCode
            )
          );
        }
      });
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        showPopup(
          "warning",
          "Session Expired",
          "Your session has expired. Please log in again.",
          () => {
            window.location.href = "/index.html";
          }
        );
      } else if (xhr.status === 403) {
        showPopup(
          "error",
          "Permission Denied",
          "You do not have permission to perform this action."
        );
      } else {
        showPopup(
          "error",
          "Error",
          xhr.responseText || "An unexpected error occurred."
        );
      }
    },
  });
});

// Format date
function formatDateForBackend(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Save
$("#saveBtn").on("click", function (event) {
  event.preventDefault();

  if (!validateInputsWithPopup()) {
    return;
  }

  const staffData = {
    id: $("#staffId").val(),
    firstName: $("#firstName").val(),
    lastName: $("#lastName").val(),
    designation: $("#designation").val(),
    gender: $("#gender").val(),
    joinedDate: formatDateForBackend($("#joinDate").val()),
    dob: formatDateForBackend($("#dob").val()),
    contactNo: $("#contactNo").val(),
    email: $("#email").val(),
    addressLine01: $("#address1").val(),
    addressLine02: $("#address2").val(),
    addressLine03: $("#address3").val(),
    addressLine04: $("#address4").val(),
    addressLine05: $("#address5").val(),
    role: $("#role").val(),
    vehicleCode: $("#allocatedVehicles").val(),
  };

  $.ajax({
    url: "http://localhost:5050/cropMonitoring/api/v1/staff",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(staffData),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function () {
      Swal.fire(
        "Save Successfully!",
        "Staff member saved successfully.",
        "success"
      );
      $("#staffForm")[0].reset();
      generateStaffId();
      setStaffId();
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        showPopup(
          "warning",
          "Session Expired",
          "Your session has expired. Please log in again.",
          () => {
            window.location.href = "/index.html";
          }
        );
      } else if (xhr.status === 403) {
        showPopup(
          "error",
          "Permission Denied",
          "You do not have permission to perform this action."
        );
      } else {
        showPopup(
          "error",
          "Error",
          xhr.responseText || "An unexpected error occurred."
        );
      }
    },
  });
});

// Search
function searchStaff() {
  const searchTerm = $("#searchStaff").val().trim();
  if (!searchTerm) {
    showPopup("Warning", "Can not search!", "Please enter a Staff ID or First Name to search.!");
    return;
  }

  $.ajax({
    type: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    url: `http://localhost:5050/cropMonitoring/api/v1/staff?searchTerm=${searchTerm}`,
    success: function (data) {
      if (data && data.length > 0) {
        populateStaffForm(data[0]);
      } else {
        showPopup("warning", "Not Found!", "Please try again.!");
      }
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        showPopup(
          "warning",
          "Session Expired",
          "Your session has expired. Please log in again.",
          () => {
            window.location.href = "/index.html";
          }
        );
      } else if (xhr.status === 403) {
        showPopup(
          "error",
          "Permission Denied",
          "You do not have permission to perform this action."
        );
      } else {
        showPopup(
          "error",
          "Error",
          xhr.responseText || "An unexpected error occurred."
        );
      }
    },
  });
}

$("#searchBtn").click(searchStaff);
$("#searchStaff").keypress(function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    searchStaff();
  }
});

function populateStaffForm(staff) {
  $("#staffId").val(staff.id);
  $("#firstName").val(staff.firstName);
  $("#lastName").val(staff.lastName);
  $("#designation").val(staff.designation);
  $("#gender").val(staff.gender);
  $("#joinDate").val(new Date(staff.joinedDate).toISOString().slice(0, 10));
  $("#dob").val(new Date(staff.dob).toISOString().slice(0, 10));
  $("#contactNo").val(staff.contactNo);
  $("#email").val(staff.email);
  $("#address1").val(staff.addressLine01);
  $("#address2").val(staff.addressLine02);
  $("#address3").val(staff.addressLine03);
  $("#address4").val(staff.addressLine04);
  $("#address5").val(staff.addressLine05);
  $("#role").val(staff.role);
  $("#allocatedVehicles").val(staff.vehicleCode);

  if (staff.vehicleCode === null || staff.vehicleCode.trim() === "") {
    $("#allocatedVehicles").val("not-allocated").change();
  } else {
    $("#allocatedVehicles").val(staff.vehicleCode).change();
  }
}

//clear
function clearForm() {
  $("#staffForm")[0].reset();
  setStaffId();
}

$("#clearBtn").click(clearForm);

//update
$("#updateBtn").on("click", function (event) {
  event.preventDefault();

  if (!validateInputsWithPopup()) {
    return;
  }

  const staffId = $("#staffId").val();
  const staffData = {
    firstName: $("#firstName").val(),
    lastName: $("#lastName").val(),
    designation: $("#designation").val(),
    gender: $("#gender").val(),
    joinedDate: $("#joinDate").val(),
    dob: $("#dob").val(),
    contactNo: $("#contactNo").val(),
    email: $("#email").val(),
    addressLine01: $("#address1").val(),
    addressLine02: $("#address2").val(),
    addressLine03: $("#address3").val(),
    addressLine04: $("#address4").val(),
    addressLine05: $("#address5").val(),
    role: $("#role").val(),
    vehicleCode: $("#allocatedVehicles").val(),
  };

  $.ajax({
    url: `http://localhost:5050/cropMonitoring/api/v1/staff/${staffId}`,
    method: "PATCH",
    contentType: "application/json",
    data: JSON.stringify(staffData),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function () {
      Swal.fire(
        "Update Successfully!",
        "Staff Member has been updated successfully.",
        "success"
      );
      clearForm();
      generateStaffId();
      setStaffId();
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        showPopup(
          "warning",
          "Session Expired",
          "Your session has expired. Please log in again.",
          () => {
            window.location.href = "/index.html";
          }
        );
      } else if (xhr.status === 403) {
        showPopup(
          "error",
          "Permission Denied",
          "You do not have permission to perform this action."
        );
      } else {
        showPopup(
          "error",
          "Error",
          xhr.responseText || "An unexpected error occurred."
        );
      }
    },
  });
});

//delete
$("#deleteBtn").on("click", function (event) {
  event.preventDefault();
  const staffId = $("#staffId").val();

  if (!staffId) {
    showPopup("error", "Invalid Input", "Please select a staff member to delete!.");
    return false;
  }

  showPopup(
    "warning",
    "Confirm Delete",
    "Are you sure you want to delete this Staff Member?",
    () => {
    $.ajax({
      url: `http://localhost:5050/cropMonitoring/api/v1/staff/${staffId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: function () {
        Swal.fire(
          "Delete Successfully!",
          "Staff Member has been deleted successfully.",
          "success"
        );
        $("#staffForm")[0].reset();
        generateStaffId();
        setStaffId();
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          showPopup(
            "warning",
            "Session Expired",
            "Your session has expired. Please log in again.",
            () => {
              window.location.href = "/index.html";
            }
          );
        } else if (xhr.status === 403) {
          showPopup(
            "error",
            "Permission Denied",
            "You do not have permission to perform this action."
          );
        } else {
          showPopup(
            "error",
            "Error",
            xhr.responseText || "An unexpected error occurred."
          );
        }
      },
    });
  });
});

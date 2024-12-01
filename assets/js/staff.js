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
        vehicleSelect.append(
          new Option(
            `${vehicle.vehicleCode} - ${vehicle.vehicleCategory}`,
            vehicle.vehicleCode
          )
        );
      });
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        if (confirm("Session expired. Please log in again.")) {
          window.location.href = "/index.html";
        }
      } else {
        alert(
          "Error load vehicle code: " +
            (xhr.responseText || "An unexpected error occurred.")
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
      alert("Staff member saved successfully.");
      $("#staffForm")[0].reset();
      generateStaffId();
      setStaffId();
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        if (confirm("Session expired. Please log in again.")) {
          window.location.href = "/index.html";
        }
      } else if (xhr.status === 403) {
        alert("You do not have permission to perform this action.");
      } else {
        alert(
          "Error save staff member: " +
            (xhr.responseText || "An unexpected error occurred.")
        );
      }
    },
  });
});

// Search
function searchStaff() {
  const searchTerm = $("#searchStaff").val().trim();
  if (!searchTerm) {
    alert("Please enter a Staff ID or First Name to search.");
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
        alert("No staff member found with the provided ID or First Name.");
      }
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        if (confirm("Session expired. Please log in again.")) {
          window.location.href = "/index.html";
        }
      } else if (xhr.status === 403) {
        alert("You do not have permission to perform this action.");
      } else {
        alert(
          "Error search satff member: " +
            (xhr.responseText || "An unexpected error occurred.")
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
      alert("Staff member updated successfully.");
      clearForm();
      generateStaffId();
      setStaffId();
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        if (confirm("Session expired. Please log in again.")) {
          window.location.href = "/index.html";
        }
      } else if (xhr.status === 403) {
        alert("You do not have permission to perform this action.");
      } else {
        alert(
          "Failed to update staff member: " +
            (xhr.responseText || "An unexpected error occurred.")
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
    alert("Please select a staff member to delete.");
    return;
  }

  if (confirm("Are you sure you want to delete this staff member?")) {
    $.ajax({
      url: `http://localhost:5050/cropMonitoring/api/v1/staff/${staffId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: function () {
        alert("Staff member deleted successfully.");
        $("#staffForm")[0].reset();
        generateStaffId();
        setStaffId();
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          if (confirm("Session expired. Please log in again.")) {
            window.location.href = "/index.html";
          }
        } else if (xhr.status === 403) {
          alert("You do not have permission to perform this action.");
        } else {
          alert(
            "Failed to delete staff member: " +
              (xhr.responseText || "An unexpected error occurred.")
          );
        }
      },
    });
  }
});

function generateEquipmentId() {
  const prefix = "EQ-";
  const randomId = Math.floor(1000 + Math.random() * 9000);
  return prefix + randomId;
}

function setEquipmentId() {
  const equipmentIdInput = document.getElementById("equipmentId");
  equipmentIdInput.value = generateEquipmentId();
}

window.onload = function () {
  setEquipmentId();
  loadFields();
  loadStaffs();
};

function containsNumbers(text) {
  return /\d/.test(text);
}

// validation function
function validateEquipmentInputs() {
  const equipmentName = $("#equipmentName").val().trim();
  const equipmentType = $("#equipmentType").val().trim();
  const equipmentStatus = $("#status").val().trim();

  if (!equipmentName) {
    showValidationError("Invalid Input", "Equipment Name cannot be empty.");
    return false;
  }

  if (equipmentName.length < 3) {
    showValidationError("Invalid Input", "Equipment Name must be at least 3 characters long.");
    return false;
  }

  if (!/^[A-Z]/.test(equipmentName)) {
    showValidationError(
      "Invalid Input",
      "Equipment Name must start with a capital letter."
    );
    return false;
  }

  if (containsNumbers(equipmentName)) {
    showValidationError("Invalid Input", "Equipment Name cannot contain numbers.");
    return false;
  }

  if (!equipmentType) {
    showValidationError("Invalid Input", "Equipment Type cannot be empty.");
    return false;
  }

  if (!equipmentStatus) {
    showValidationError("Invalid Input", "Equipment Status cannot be empty.");
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

function loadFields() {
  fetch("http://localhost:5050/cropMonitoring/api/v1/fields/allFields", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const fieldSelect = document.getElementById("assignedField");
      fieldSelect.innerHTML =
        '<option value="" disabled selected>Select Field</option>';

      data.forEach((field) => {
        const option = document.createElement("option");
        option.value = field.fieldCode;
        option.text = `${field.fieldCode} - ${field.fieldName}`;
        fieldSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error loading fields:", error));
}

function loadStaffs() {
  fetch("http://localhost:5050/cropMonitoring/api/v1/staff/allstaff", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const staffSelect = document.getElementById("assignedStaff");
      staffSelect.innerHTML =
        '<option value="" disabled selected>Select Staff</option>';

      data.forEach((staff) => {
        const option = document.createElement("option");
        option.value = staff.id;
        option.text = `${staff.id} - ${staff.firstName}`;
        staffSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error loading staff members:", error));
}

//save
document.getElementById("saveBtn").addEventListener("click", function (e) {
  e.preventDefault();

  if (!validateEquipmentInputs()) {
    return; 
  }

  const equipmenteData = {
    equipmentId: document.getElementById("equipmentId").value,
    equipmentName: document.getElementById("equipmentName").value,
    equipmentType: document.getElementById("equipmentType").value,
    equipmentStatus: document.getElementById("status").value,
    fieldCode: document.getElementById("assignedField").value,
    id: document.getElementById("assignedStaff").value,
  };

  fetch("http://localhost:5050/cropMonitoring/api/v1/equipment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(equipmenteData),
  })
  .then((response) => {
    if (response.ok) {
      return response.text();
    } else if (response.status === 401) {
      Swal.fire({
        icon: "warning",
        title: "Session Expired",
        text: "Please log in again.",
        confirmButtonText: "Log In",
      }).then(() => {
        window.location.href = "/index.html";
      });
      throw new Error("Unauthorized");
    } else if (response.status === 403) {
      Swal.fire({
        icon: "error",
        title: "Forbidden",
        text: "You do not have permission to perform this action.",
      });
      throw new Error("Forbidden");
    } else {
      return response.text().then((text) => {
        throw new Error(text || "An unexpected error occurred.");
      });
    }
  })
  .then((data) => {
    Swal.fire({
      icon: "success",
      title: "Save Successful",
      text: "Equipment saved successfully!",
    });
    clearForm();
  })
  .catch((error) => {
    console.error("Error:", error);
    if (
      error.message !== "Unauthorized" &&
      error.message !== "Forbidden"
    ) {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: error.message || "An unexpected error occurred.",
      });
    }
  });
});

// Search
function searchEquipment() {
  const searchTerm = $("#searchEquipment").val().trim();
  if (!searchTerm) {
    showValidationError("Invalid Input", "Please enter an Equipment ID or Name to search.");
    return;
  }

  $.ajax({
    type: "GET",
    url: `http://localhost:5050/cropMonitoring/api/v1/equipment?searchTerm=${searchTerm}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (data) {
      if (data && data.length > 0) {
        populateEquipmentForm(data[0]);
        Swal.fire({
          icon: "success",
          title: "Search Successful",
          text: "Equipment found and loaded.",
        });
      } else {
        showValidationError("No Results", "No equipment found with the provided ID or Name.");
      }
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Session Expired",
          text: "Please log in again.",
          confirmButtonText: "Log In",
        }).then(() => {
          window.location.href = "/index.html";
        });
      } else if (xhr.status === 403) {
        showValidationError("Access Denied", "You do not have permission to perform this action.");
      } else {
        Swal.fire({
          icon: "error",
          title: "Search Failed",
          text: `Error: ${xhr.responseText || "An unexpected error occurred."}`,
        });
      }
    },
  });
}

$("#searchBtn").click(searchEquipment);
$("#searchEquipment").keypress(function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    searchEquipment();
  }
});

function populateEquipmentForm(equipment) {
  $("#equipmentId").val(equipment.equipmentId);
  $("#equipmentName").val(equipment.equipmentName);
  $("#equipmentType").val(equipment.equipmentType);
  $("#status").val(equipment.equipmentStatus);
  $("#assignedField").val(equipment.fieldCode);
  $("#assignedStaff").val(equipment.id);
}

//clear
function clearForm() {
  $("#equipmentForm")[0].reset();
  setEquipmentId();
}

$("#clearBtn").click(clearForm);

// Update
$("#updateBtn").on("click", function (event) {
  event.preventDefault();

  const equipmentId = $("#equipmentId").val();

  if (!equipmentId) {
    showValidationError("Invalid Input", "Equipment ID is missing.");
    return;
  }

  const equipmentData = {
    equipmentName: $("#equipmentName").val(),
    equipmentType: $("#equipmentType").val(),
    equipmentStatus: $("#status").val(),
    fieldCode: $("#assignedField").val(),
    id: $("#assignedStaff").val(),
  };

  $.ajax({
    url: `http://localhost:5050/cropMonitoring/api/v1/equipment/${equipmentId}`,
    method: "PATCH",
    contentType: "application/json",
    data: JSON.stringify(equipmentData),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function () {
      Swal.fire({
        icon: "success",
        title: "Update Successful",
        text: "Equipment updated successfully.",
      });
      clearForm();
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Session Expired",
          text: "Please log in again.",
          confirmButtonText: "Log In",
        }).then(() => {
          window.location.href = "/index.html";
        });
      } else if (xhr.status === 403) {
        showValidationError("Access Denied", "You do not have permission to perform this action.");
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: `Error updating equipment: ${xhr.responseText || "An unexpected error occurred."}`,
        });
      }
    },
  });
});


// Delete Equipment
$("#deleteBtn").on("click", function (event) {
  event.preventDefault();
  const equipmentId = $("#equipmentId").val();

  if (!equipmentId) {
    showValidationError("Missing Input", "Please select equipment to delete.");
    return;
  }

  Swal.fire({
    icon: "warning",
    title: "Are you sure?",
    text: "Do you really want to delete this equipment? This action cannot be undone.",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
    $.ajax({
      url: `http://localhost:5050/cropMonitoring/api/v1/equipment/${equipmentId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: function () {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Equipment deleted successfully.",
        });
        clearForm();
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          Swal.fire({
            icon: "warning",
            title: "Session Expired",
            text: "Please log in again.",
            confirmButtonText: "Log In",
          }).then(() => {
            window.location.href = "/index.html";
          });
        } else if (xhr.status === 403) {
          showValidationError("Access Denied", "You do not have permission to perform this action.");
        } else {
          Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: `Error deleting equipment: ${xhr.responseText || "An unexpected error occurred."}`,
          });
        }
      },
    });
  }
});
});

//get all
$(document).ready(function () {
  $("#getAllBtn").click(function () {
    $.ajax({
      url: "http://localhost:5050/cropMonitoring/api/v1/equipment/allEquipment",
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: function (response) {
        sessionStorage.setItem("equipmentData", JSON.stringify(response));
        Swal.fire({
          icon: "success",
          title: "Data Retrieved",
          text: "All equipment details have been loaded successfully.",
          confirmButtonText: "View List",
        }).then(() => {
          window.location.href = "/pages/equipment-list.html";
        });
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          Swal.fire({
            icon: "warning",
            title: "Session Expired",
            text: "Please log in again.",
            confirmButtonText: "Log In",
          }).then(() => {
            window.location.href = "/index.html";
          });
        } else if (xhr.status === 403) {
          showValidationError("Access Denied", "You do not have permission to perform this action.");
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed to Load",
            text: `Error fetching equipment: ${xhr.responseText || "An unexpected error occurred."}`,
          });
        }
      },
    });
  });
});

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
        alert("Session expired. Please log in again.");
        window.location.href = "/index.html";
        return Promise.reject("Unauthorized: Session expired.");
      } else if (response.status === 403) {
        alert("You do not have permission to perform this action.");
        return Promise.reject("Forbidden: Access denied.");
      } else {
        return Promise.reject("Failed to save equipment data.");
      }
    })
    .then((data) => {
      alert("Equipment saved successfully: " + data);
      clearForm();
    })
    .catch((error) => {
      console.error("Error:", error);
      if (
        error !== "Unauthorized: Session expired." &&
        error !== "Forbidden: Access denied."
      ) {
        alert("Error: " + error);
      }
    });
});

// Search
function searchEquipment() {
  const searchTerm = $("#searchEquipment").val().trim();
  if (!searchTerm) {
    alert("Please enter an Equipment ID or Name to search.");
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
      } else {
        alert("No equipment found with the provided ID or Name.");
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
          "Error Search equipment: " +
            (xhr.responseText || "An unexpected error occurred.")
        );
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
      alert("Equipment updated successfully.");
      clearForm();
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
          "Error update equipment: " +
            (xhr.responseText || "An unexpected error occurred.")
        );
      }
    },
  });
});

// Delete Equipment
$("#deleteBtn").on("click", function (event) {
  event.preventDefault();
  const equipmentId = $("#equipmentId").val();

  if (!equipmentId) {
    alert("Please select equipment to delete.");
    return;
  }

  if (confirm("Are you sure you want to delete this equipment?")) {
    $.ajax({
      url: `http://localhost:5050/cropMonitoring/api/v1/equipment/${equipmentId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: function () {
        alert("Equipment deleted successfully.");
        clearForm();
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
            "Error delete equipment: " +
              (xhr.responseText || "An unexpected error occurred.")
          );
        }
      },
    });
  }
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
        window.location.href = "/pages/equipment-list.html";
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
            "Error update equipment: " +
              (xhr.responseText || "An unexpected error occurred.")
          );
        }
      },
    });
  });
});

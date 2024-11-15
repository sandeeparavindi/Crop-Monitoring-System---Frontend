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
  fetch("http://localhost:5050/cropMonitoring/api/v1/fields/allFields")
    .then((response) => response.json())
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
  fetch("http://localhost:5050/cropMonitoring/api/v1/staff/allstaff")
    .then((response) => response.json())
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(equipmenteData),
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error("Failed to save vehicle data.");
      }
    })
    .then((data) => {
      alert("Success save equipment" + data);
      clearForm();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error: " + error.message);
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
    success: function (data) {
      if (data && data.length > 0) {
        populateEquipmentForm(data[0]);
      } else {
        alert("No equipment found with the provided ID or Name.");
      }
    },
    error: function () {
      alert("An error occurred while searching. Please try again.");
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
       success: function () {
          alert("Equipment updated successfully.");
          clearForm(); 
       },
       error: function (xhr) {
          console.error("Error updating equipment:", xhr.responseText);
          alert("Failed to update equipment. Please try again.");
       }
    });
  });

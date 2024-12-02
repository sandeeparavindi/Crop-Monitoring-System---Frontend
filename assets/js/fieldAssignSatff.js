document.getElementById("addAssignment").addEventListener("click", () => {
  modal.style.display = "block";
  modalOverlay.style.display = "block";
  document.getElementById("assignmentDate").value = new Date()
    .toISOString()
    .split("T")[0];
});

document.getElementById("closeModal").addEventListener("click", () => {
  modal.style.display = "none";
  modalOverlay.style.display = "none";
});

const modal = document.getElementById("staffAssignmentModal");
const modalOverlay = document.getElementById("modalOverlay");

document.getElementById("addAssignment").addEventListener("click", () => {
  modal.style.display = "block";
  modalOverlay.style.display = "block";

  document.getElementById("assignmentDate").value = new Date()
    .toISOString()
    .split("T")[0];

  loadStaffToDropdown();
  loadFieldsToDropdown();
});

document.getElementById("closeModal").addEventListener("click", () => {
  modal.style.display = "none";
  modalOverlay.style.display = "none";
});

function loadFieldsToDropdown() {
  $.ajax({
    url: "http://localhost:5050/cropMonitoring/api/v1/fields/allFields",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (fields) {
      $("#field")
        .empty()
        .append('<option value="" disabled selected>Select Field</option>');

      fields.forEach((field) => {
        $("#field").append(
          new Option(
            `${field.fieldCode} - ${field.fieldName}`, // Option text
            field.fieldCode // Option value
          )
        );
      });
    },
    error: function (xhr) {
      console.error("Failed to load fields:", xhr.responseText);
    },
  });
}

// Load all staff into dropdown
function loadStaffToDropdown() {
  $.ajax({
    url: "http://localhost:5050/cropMonitoring/api/v1/staff/allstaff",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (staffList) {
      $("#staff")
        .empty()
        .append(
          '<option value="" disabled selected>Select Staff Member</option>'
        );

      staffList.forEach((staff) => {
        $("#staff").append(
          new Option(
            `${staff.id} - ${staff.firstName}`, 
            staff.id 
          )
        );
      });
    },
    error: function (xhr) {
      console.error("Failed to load staff:", xhr.responseText);
    },
  });
}

//save
$("#saveAssignment").on("click", function () {
  const data = {
    fieldCode: $("#field").val(),
    staffId: $("#staff").val(),
    assignedRole: $("#role").val(),
    assignmentDate: $("#assignmentDate").val(),
  };

  if (
    !data.fieldCode ||
    !data.staffId ||
    !data.assignedRole ||
    !data.assignmentDate
  ) {
    alert("Please fill in all fields before saving.");
    return;
  }
  $.ajax({
    url: "http://localhost:5050/cropMonitoring/api/v1/assignment/save",
    type: "POST",
    contentType: "application/json", 
    data: JSON.stringify(data), 
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, 
    },
    success: function (response) {
      alert("Assignment saved successfully!");

      $("#staffAssignmentModal").hide();
      $("#modalOverlay").hide();

      $("#assignmentStaffForm")[0].reset();

      loadFieldsToDropdown();
      loadStaffToDropdown();
    },
    error: function (xhr) {
      let message =
        xhr.responseJSON?.message || xhr.responseText || "An error occurred.";
      alert(`Error saving assignment: ${message}`);
    },
  });
});

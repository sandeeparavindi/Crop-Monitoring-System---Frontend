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

$(document).ready(function () {
  loadAssignments();
});

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
    loadAssignments();
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
              `${field.fieldCode} - ${field.fieldName}`,
              field.fieldCode 
            )
          );
        });
      },
      error: function (xhr) {
        console.error("Failed to load fields:", xhr.responseText);
      },
    });
  }
  
  function loadStaffToDropdown() {
    $.ajax({
      url: "http://localhost:5050/cropMonitoring/api/v1/staff/allstaff",
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: function (staffList) {
        console.log(staffList);
  
        $("#staff")
          .empty()
          .append(
            '<option value="" disabled selected>Select Staff Member</option>'
          );
  
        staffList.forEach((staff) => {
          $("#staff").append(
            `<option value="${staff.id}" data-role="${staff.role}">
                ${staff.id} - ${staff.firstName}
              </option>`
          );
        });
      },
      error: function (xhr) {
        console.error("Failed to load staff:", xhr.responseText);
      },
    });
  }
  
  $("#staff").on("change", function () {
    const selectedOption = $(this).find(":selected");
    const role = selectedOption.data("role");
  
    if (role) {
      $("#role").val(role);
    } else {
      $("#role").val("");
    }
  });
  
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
      showPopup(
        "warnning",
        "Not Complete",
        "Please fill in all fields before saving."
      );
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
        Swal.fire(
          "Assign Successfully!",
          "Field Assign to staff successfully.",
          "success"
        );
  
        $("#staffAssignmentModal").hide();
        $("#modalOverlay").hide();
  
        $("#assignmentStaffForm")[0].reset();
        loadAssignments();
        loadFieldsToDropdown();
        loadStaffToDropdown();
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

  $("#backBtn").click(function () {
    window.location.href = "/pages/field.html";
  });
 
  //get all
  function loadAssignments() {
    $.ajax({
      url: "http://localhost:5050/cropMonitoring/api/v1/assignment/allassignments",
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: function (assignments) {
        $("#assignmentTableBody").empty();
  
        assignments.forEach((assignment) => {
          $("#assignmentTableBody").append(`
            <tr>
              <td>${assignment.fieldCode}</td>
              <td>${assignment.staffId}</td>
              <td>${assignment.assignedRole}</td>
              <td>${assignment.assignmentDate}</td>
            </tr>
          `);
        });
        if ($.fn.dataTable.isDataTable('#assignmentTable')) {
          $('#assignmentTable').DataTable().clear().destroy();
        }
  
        $('#assignmentTable').DataTable();
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
  
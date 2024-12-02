document.getElementById("addAssignment").addEventListener("click", () => {
    modal.style.display = "block";
    modalOverlay.style.display = "block";
    document.getElementById("assignmentDate").value = new Date()
      .toISOString()
      .split("T")[0];
  });

  $(document).ready(function () {
    loadAssignments();
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
          if (xhr.status === 401) {
            if (confirm("Session expired. Please log in again.")) {
              window.location.href = "/index.html";
            }
          } else if (xhr.status === 403) {
            alert("You do not have permission to perform this action.");
          } else {
            alert(
              "Error add staff membet to field: " +
                (xhr.responseText || "An unexpected error occurred.")
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
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          if (confirm("Session expired. Please log in again.")) {
            window.location.href = "/index.html";
          }
        } else if (xhr.status === 403) {
          alert("You do not have permission to view assignments.");
        } else {
          console.error("Failed to load assignments:", xhr.responseText);
        }
      },
    });
  }
  
const modal = document.getElementById("staffAssignmentModal");
const modalOverlay = document.getElementById("modalOverlay");

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

$(document).ready(() => {
  $("#fieldCode").select2();
  $("#staffId").select2();

  $("#fieldCode").append(new Option("Field A", "A"));
  $("#staffId").append(new Option("John Doe", "101"));
});

document.getElementById("saveAssignment").addEventListener("click", () => {
  const assignment = {
    id: document.getElementById("assignmentId").value || Date.now(),
    fieldCode: document.getElementById("fieldCode").value,
    staffId: document.getElementById("staffId").value,
    assignedRole: document.getElementById("assignedRole").value,
    assignmentDate: document.getElementById("assignmentDate").value,
  };

  const tableBody = document.getElementById("assignmentTableBody");
  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${assignment.id}</td>
        <td>${assignment.fieldCode}</td>
        <td>${assignment.staffId}</td>
        <td>${assignment.assignedRole}</td>
        <td>${assignment.assignmentDate}</td>
      `;
  tableBody.appendChild(row);

  modal.style.display = "none";
  modalOverlay.style.display = "none";
});

document.getElementById("deleteAssignment").addEventListener("click", () => {
  alert("Delete functionality can be implemented here.");
});

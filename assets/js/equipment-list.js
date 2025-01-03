$(document).ready(function () {
  let fieldMap = {};
  let staffMap = {};

  function fetchFields() {
    return fetch("http://localhost:5050/cropMonitoring/api/v1/fields/allFields", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((fields) => {
        fields.forEach((field) => {
          fieldMap[field.fieldCode] = field.fieldName;
        });
      })
      .catch((error) => console.error("Error fetching fields:", error));
  }

  function fetchStaff() {
    return fetch("http://localhost:5050/cropMonitoring/api/v1/staff/allstaff", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((staff) => {
        staff.forEach((person) => {
          staffMap[person.id] = person.firstName;
        });
      })
      .catch((error) => console.error("Error fetching staff:", error));
  }

  function displayEquipment() {
    const equipmentData = JSON.parse(sessionStorage.getItem("equipmentData"));

    if (equipmentData && equipmentData.length > 0) {
      let tableRows = "";

      equipmentData.forEach((equipment, index) => {
        const fieldName = fieldMap[equipment.fieldCode] || "Unknown Field";
        const staffName = staffMap[equipment.id] || "Unknown Staff";

        tableRows += `
            <tr>
              <td>${index + 1}</td>
              <td>${equipment.equipmentId}</td>
              <td>${equipment.equipmentName}</td>
              <td>${equipment.equipmentType}</td>
              <td>${equipment.equipmentStatus}</td>
              <td>${equipment.fieldCode} - ${fieldName}</td>
              <td>${equipment.id} - ${staffName}</td>
            </tr>
          `;
      });

      $("#equipmentDetailsTable tbody").html(tableRows);
      $("#equipmentDetailsTable").DataTable({
        paging: true,
        searching: true,
        ordering: true,
        responsive: true,
      });
    }
  }

  Promise.all([fetchFields(), fetchStaff()]).then(() => {
    displayEquipment();
  });

  // Back button event listener
  $("#backBtn").on("click", function () {
    window.location.href = "equipment.html";
  });
});


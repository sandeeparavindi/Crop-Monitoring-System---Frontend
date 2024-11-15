$(document).ready(function () {
  let vehicleMap = {};

  function fetchVehicles() {
    return fetch(
      "http://localhost:5050/cropMonitoring/api/v1/vehicles/allVehicles"
    )
      .then((response) => response.json())
      .then((vehicles) => {
        console.log("Fetched Vehicles:", vehicles);

        vehicles.forEach((vehicle) => {
          vehicleMap[vehicle.vehicleCode.trim()] = vehicle.vehicleCategory;
        });

        console.log("Vehicle Map:", vehicleMap);
      })
      .catch((error) => console.error("Error fetching vehicles:", error));
  }

  function fetchAndDisplayStaff() {
    $.ajax({
      url: "http://localhost:5050/cropMonitoring/api/v1/staff/allstaff",
      method: "GET",
      success: function (data) {
        console.log("Fetched Staff Data:", data);
        populateStaffTables(data);
      },
      error: function () {
        alert("Failed to load staff details.");
      },
    });
  }

  function populateStaffTables(staffData) {
    const basicDetailsTable = $("#staffBasicDetailsTable");
    const additionalDetailsTable = $("#staffAdditionalDetailsTable");

    basicDetailsTable.empty();
    additionalDetailsTable.empty();

    staffData.forEach((staff, index) => {
      console.log(`Staff ${index + 1}:`, staff);
      console.log(`Staff Vehicle Code: ${staff.vehicleCode}`);

      const vehicleCategory =
        vehicleMap[staff.vehicleCode?.trim()] || "Unknown Category";
      console.log(
        `Mapped Category for ${staff.vehicleCode}: ${vehicleCategory}`
      );

      const basicRow = `
        <tr>
          <td>${index + 1}</td>
          <td>${staff.id}</td>
          <td>${staff.firstName}</td>
          <td>${staff.lastName}</td>
          <td>${staff.designation}</td>
          <td>${staff.gender}</td>
          <td>${new Date(staff.joinedDate).toLocaleDateString()}</td>
          <td>${new Date(staff.dob).toLocaleDateString()}</td>
          <td>${staff.role}</td>
        </tr>`;
      basicDetailsTable.append(basicRow);

      const additionalRow = `
        <tr>
          <td>${index + 1}</td>
          <td>${staff.addressLine01}</td>
          <td>${staff.addressLine02}</td>
          <td>${staff.addressLine03}</td>
          <td>${staff.addressLine04}</td>
          <td>${staff.addressLine05}</td>
          <td>${staff.email}</td>
          <td>${staff.vehicleCode} - ${vehicleCategory}</td>
        </tr>`;
      additionalDetailsTable.append(additionalRow);
    });
  }

  fetchVehicles().then(() => {
    fetchAndDisplayStaff();
  });

  // Back
  $("#backBtn").click(function () {
    window.location.href = "staff.html";
  });
});

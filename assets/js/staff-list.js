$(document).ready(function () {
  let vehicleMap = {};
  let sessionRemovedVehicles = new Set(
    JSON.parse(localStorage.getItem("removedVehicles") || "[]")
  ); 

  function saveRemovedVehiclesToLocalStorage() {
    localStorage.setItem(
      "removedVehicles",
      JSON.stringify(Array.from(sessionRemovedVehicles))
    );
  }

  function fetchVehicles() {
    return fetch(
      "http://localhost:5050/cropMonitoring/api/v1/vehicles/allVehicles",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((vehicles) => {
        vehicleMap = {};
        
        vehicles.forEach((vehicle) => {
          vehicleMap[vehicle.vehicleCode.trim()] = vehicle.vehicleCategory;
        });
      })
      .catch((error) => console.error("Error fetching vehicles:", error));
  }
  

  function fetchAndDisplayStaff() {
    $.ajax({
      url: "http://localhost:5050/cropMonitoring/api/v1/staff/allstaff",
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: function (data) {
        populateStaffTables(data);
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          if (confirm("Session expired. Please log in again.")) {
            window.location.href = "/index.html";
          }
        } else {
          alert(
            "Failed to load staff details: " +
              (xhr.responseText || "An unexpected error occurred.")
          );
        }
      },
    });
  }

  function populateStaffTables(staffData) {
    const basicDetailsTable = $("#staffBasicDetailsTable");
    const additionalDetailsTable = $("#staffAdditionalDetailsTable");

    basicDetailsTable.empty();
    additionalDetailsTable.empty();

    staffData.forEach((staff, index) => {
      const vehicleCategory =
        vehicleMap[staff.vehicleCode?.trim()] || "Unknown Category";

      // Check if the vehicle is removed
      const isVehicleRemoved = sessionRemovedVehicles.has(staff.id);

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
          <td>${staff.contactNo}</td>
          <td>${staff.email}</td>
          <td>${staff.vehicleCode} - ${vehicleCategory}
           ${
             isVehicleRemoved
               ? "Not Allocated"
               : `<button class="btn btn-danger btn-sm float-end ms-2 remove-btn" 
                  data-staff-id="${staff.id}" 
                  data-vehicle-code="${staff.vehicleCode}">
                  Remove
                </button>`
           }
          </td>
        </tr>`;
      additionalDetailsTable.append(additionalRow);
    });

    $(".remove-btn").click(function () {
      const staffId = $(this).data("staff-id");
      const vehicleCode = $(this).data("vehicle-code");
    
      returnVehicle(staffId);
    
      const row = $(this).closest("tr");  
      const vehicleCell = row.find("td").last();  
      vehicleCell.html("Not Allocated");
    
      sessionRemovedVehicles.add(staffId);
      saveRemovedVehiclesToLocalStorage();
    });
    
  }

  function returnVehicle(staffId) {
    const url = `http://localhost:5050/cropMonitoring/api/v1/staff/${staffId}/return-vehicle`;
  
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 204) {
          alert("Vehicle status updated to available.");
  
          sessionRemovedVehicles.add(staffId);
          saveRemovedVehiclesToLocalStorage();
  
          fetchVehicles().then(() => {
            fetchAndDisplayStaff();  
          });
  
          const button = $(`button[data-staff-id="${staffId}"]`);
          const vehicleCell = button.closest("td");
          vehicleCell.html("Not Allocated"); 
        } else if (response.status === 404) {
          alert("Staff or vehicle not found.");
        } else {
          alert(`Unexpected error: ${response.status} ${response.statusText}`);
        }
      })
      .catch((error) => {
        console.error("Error during API call:", error);
        alert("Failed to update vehicle status. Check the console for details.");
      });
  }
  
  fetchVehicles().then(() => {
    fetchAndDisplayStaff();
  });

  $("#backBtn").click(function () {
    window.location.href = "staff.html";
  });
});

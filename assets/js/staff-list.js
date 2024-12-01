// $(document).ready(function () {
//   let vehicleMap = {};

//   function fetchVehicles() {
//     return fetch(
//       "http://localhost:5050/cropMonitoring/api/v1/vehicles/allVehicles",{
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       }
//     )
//       .then((response) => response.json())
//       .then((vehicles) => {
//         console.log("Fetched Vehicles:", vehicles);

//         vehicles.forEach((vehicle) => {
//           vehicleMap[vehicle.vehicleCode.trim()] = vehicle.vehicleCategory;
//         });

//         console.log("Vehicle Map:", vehicleMap);
//       })
//       .catch((error) => console.error("Error fetching vehicles:", error));
//   }

//   function fetchAndDisplayStaff() {
//     $.ajax({
//       url: "http://localhost:5050/cropMonitoring/api/v1/staff/allstaff",
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       success: function (data) {
//         console.log("Fetched Staff Data:", data);
//         populateStaffTables(data);
//       },
//       error: function () {
//         alert("Failed to load staff details.");
//       },
//     });
//   }

//   function populateStaffTables(staffData) {
//     const basicDetailsTable = $("#staffBasicDetailsTable");
//     const additionalDetailsTable = $("#staffAdditionalDetailsTable");

//     basicDetailsTable.empty();
//     additionalDetailsTable.empty();

//     staffData.forEach((staff, index) => {
//       console.log(`Staff ${index + 1}:`, staff);
//       console.log(`Staff Vehicle Code: ${staff.vehicleCode}`);

//       const vehicleCategory =
//         vehicleMap[staff.vehicleCode?.trim()] || "Unknown Category";
//       console.log(
//         `Mapped Category for ${staff.vehicleCode}: ${vehicleCategory}`
//       );

//       const isVehicleReturned = localStorage.getItem(`staff-${staff.id}-vehicle-status`) === "Not Allocated";

//       const basicRow = `
//         <tr>
//           <td>${index + 1}</td>
//           <td>${staff.id}</td>
//           <td>${staff.firstName}</td>
//           <td>${staff.lastName}</td>
//           <td>${staff.designation}</td>
//           <td>${staff.gender}</td>
//           <td>${new Date(staff.joinedDate).toLocaleDateString()}</td>
//           <td>${new Date(staff.dob).toLocaleDateString()}</td>
//           <td>${staff.role}</td>
//         </tr>`;
//       basicDetailsTable.append(basicRow);

//       const additionalRow = `
//         <tr>
//           <td>${index + 1}</td>
//           <td>${staff.addressLine01}</td>
//           <td>${staff.addressLine02}</td>
//           <td>${staff.addressLine03}</td>
//           <td>${staff.addressLine04}</td>
//           <td>${staff.addressLine05}</td>
//           <td>${staff.contactNo}</td>
//           <td>${staff.email}</td>
//           <td>${staff.vehicleCode} - ${vehicleCategory}
//            ${
//              staff.isVehicleReturned
//                ? "Not Allocated" // No button if the vehicle is returned
//                : `<button class="btn btn-danger btn-sm float-end ms-2 remove-btn" 
//               data-staff-id="${staff.id}" 
//               data-vehicle-code="${staff.vehicleCode}">
//               Remove
//             </button>`
//            }
          
//           </td>
//         </tr>`;
//       additionalDetailsTable.append(additionalRow);
//     });

//     // remove vehicle
//     $(".remove-btn").click(function () {
//       const staffId = $(this).data("staff-id");
//       console.log("Removing vehicle for staff ID:", staffId);
//       returnVehicle(staffId);
//     });
//   }

//   // async function returnVehicle(staffId) {
//   //   console.log("Attempting to update vehicle status for staff ID:", staffId);
//   //   const url = `http://localhost:5050/cropMonitoring/api/v1/staff/${staffId}/return-vehicle`;

//   //   try {
//   //     const response = await fetch(url, {
//   //       method: "PATCH",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         Authorization: `Bearer ${localStorage.getItem("token")}`

//   //       },
//   //     });

//   //     if (response.status === 204) {
//   //       alert("Vehicle status updated to available.");
//   //       const button = $(`button[data-staff-id="${staffId}"]`);
//   //       const vehicleCell = button.closest("td");

//   //       vehicleCell.html("Not Allocated");
//   //     } else if (response.status === 404) {
//   //       alert("Staff or vehicle not found.");
//   //     } else {
//   //       alert(`Unexpected error: ${response.status} ${response.statusText}`);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error during API call:", error);
//   //     alert("Failed to update vehicle status. Check the console for details.");
//   //   }
//   // }
//   async function returnVehicle(staffId) {
//     console.log("Attempting to update vehicle status for staff ID:", staffId);
//     const url = `http://localhost:5050/cropMonitoring/api/v1/staff/${staffId}/return-vehicle`;
  
//     try {
//       const response = await fetch(url, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
  
//       if (response.status === 204) {
//         alert("Vehicle status updated to available.");
//         const button = $(`button[data-staff-id="${staffId}"]`);
//         const vehicleCell = button.closest("td");
  
//         // Update local storage
//         localStorage.setItem(`staff-${staffId}-vehicle-status`, "Not Allocated");
  
//         vehicleCell.html("Not Allocated");
//       } else if (response.status === 404) {
//         alert("Staff or vehicle not found.");
//       } else {
//         alert(`Unexpected error: ${response.status} ${response.statusText}`);
//       }
//     } catch (error) {
//       console.error("Error during API call:", error);
//       alert("Failed to update vehicle status. Check the console for details.");
//     }
//   }
  

//   fetchVehicles().then(() => {
//     fetchAndDisplayStaff();
//   });

//   // Back
//   $("#backBtn").click(function () {
//     window.location.href = "staff.html";
//   });
// });


$(document).ready(function () {
  let vehicleMap = {};
  let sessionRemovedVehicles = new Set(
    JSON.parse(localStorage.getItem("removedVehicles") || "[]")
  ); // Persisting removed vehicles across refreshes

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

    // Attach event to Remove buttons
    $(".remove-btn").click(function () {
      const staffId = $(this).data("staff-id");
      returnVehicle(staffId);
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

          // Add staff ID to session tracking set
          sessionRemovedVehicles.add(staffId);
          saveRemovedVehiclesToLocalStorage();

          // Update the table dynamically
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

  // Initialize the page
  fetchVehicles().then(() => {
    fetchAndDisplayStaff();
  });

  // Back button functionality
  $("#backBtn").click(function () {
    window.location.href = "staff.html";
  });
});


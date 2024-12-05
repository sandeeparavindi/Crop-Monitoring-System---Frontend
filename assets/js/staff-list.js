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
        if (!Array.isArray(data)) {
          showValidationError("Staff Error", "Invalid staff data received.");
          return;
        }
        populateStaffTables(data);
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

  function populateStaffTables(staffData) {
    const basicDetailsTable = $("#staffBasicDetailsTable");
    const additionalDetailsTable = $("#staffAdditionalDetailsTable");

    basicDetailsTable.empty();
    additionalDetailsTable.empty();

    staffData.forEach((staff, index) => {
      const vehicleCategory =
        vehicleMap[staff.vehicleCode?.trim()] || "Unknown Category";

      const isVehicleRemoved = sessionRemovedVehicles.has(staff.id);
      const isReturned = !staff.vehicleCode;

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
          <td>${staff.addressLine01 || "N/A"}</td>
          <td>${staff.addressLine02 || "N/A"}</td>
          <td>${staff.addressLine03 || "N/A"}</td>
          <td>${staff.addressLine04 || "N/A"}</td>
          <td>${staff.addressLine05 || "N/A"}</td>
          <td>${staff.contactNo}</td>
          <td>${staff.email}</td>
          <td>
            ${staff.vehicleCode ? `${staff.vehicleCode} - ${vehicleCategory}` : "Not Allocated"}
      ${
        staff.vehicleCode && !isReturned
          ? `<div style="float: right;">
               <button class="btn btn-sm btn-danger return-btn" 
                 data-staff-id="${staff.id}" 
                 data-vehicle-code="${staff.vehicleCode}">
                 Return
               </button>
             </div>`
          : ""
      }
          </td>
        </tr>`;
      additionalDetailsTable.append(additionalRow);
    });

    if ($.fn.DataTable.isDataTable("#basicDetailsTable")) {
      $("#basicDetailsTable").DataTable().destroy();
    }
    $("#basicDetailsTable").DataTable({
      paging: true,
      searching: true,
      ordering: true,
    });

    if ($.fn.DataTable.isDataTable("#additionalDetailsTable")) {
      $("#additionalDetailsTable").DataTable().destroy();
    }
    $("#additionalDetailsTable").DataTable({
      paging: true,
      searching: true,
      ordering: true,
    });

    $(".remove-btn").click(function () {
      const staffId = $(this).data("staff-id");
      returnVehicle(staffId);

      const row = $(this).closest("tr");
      const vehicleCell = row.find("td").last();
      vehicleCell.html("Not Allocated");

      sessionRemovedVehicles.add(staffId);
      saveRemovedVehiclesToLocalStorage();
    });

    $(".return-btn").click(function () {
      const staffId = $(this).data("staff-id");
      const vehicleCode = $(this).data("vehicle-code");

      returnVehicle(staffId);

      const row = $(this).closest("tr");
      const vehicleCell = row.find("td").last();
      vehicleCell.html("Not Allocated");
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
          Swal.fire(
            "Update Successfully!",
            "Vehicle status updated to available.",
            "success"
          );

          sessionRemovedVehicles.add(staffId);
          saveRemovedVehiclesToLocalStorage();

          fetchVehicles().then(() => {
            fetchAndDisplayStaff();
          });

          const button = $(`button[data-staff-id="${staffId}"]`);
          const vehicleCell = button.closest("td");
          vehicleCell.html("Not Allocated");
        } else if (response.status === 404) {
          showPopup(
            "error",
            "Not Found!.",
            "Staff or vehicle not found."
          );
        } else {
          showPopup(
            "error",
            "Error",
            `Unexpected error: ${response.status} ${response.statusText}`
          );
        }
      })
      .catch((error) => {
        console.error("Error during API call:", error);
        showPopup(
          "error",
          "Error",
          "Failed to update vehicle status."
        );
      });
  }

  fetchVehicles().then(() => {
    fetchAndDisplayStaff();
  });
});

$("#backBtn").click(function () {
  window.location.href = "staff.html";
});


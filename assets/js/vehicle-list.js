$(document).ready(function () {
  $.ajax({
    url: "http://localhost:5050/cropMonitoring/api/v1/vehicles/allVehicles",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (vehicles) {
      vehicles.forEach((vehicle, index) => {
        $("#vehicleDetailsTable tbody").append(`
            <tr>
              <th scope="row">${index + 1}</th>
              <td>${vehicle.vehicleCode}</td>
              <td>${vehicle.licensePlateNumber}</td>
              <td>${vehicle.vehicleCategory}</td>
              <td>${vehicle.fuelType}</td>
              <td>${vehicle.status}</td>
              <td>${vehicle.remarks}</td>
            </tr>
          `);
      });
      $("#vehicleDetailsTable").DataTable({
        paging: true,
        searching: true,
        ordering: true,
        responsive: true,
      });
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
      } else {
        showPopup(
          "error",
          "Error",
          xhr.responseText || "An unexpected error occurred."
        );
      }
    },
  });

  //back
  $("#backBtn").click(function () {
    window.location.href = "vehical.html";
  });
});

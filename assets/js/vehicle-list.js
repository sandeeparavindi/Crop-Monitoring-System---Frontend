$(document).ready(function () {
  $.ajax({
    url: "http://localhost:5050/cropMonitoring/api/v1/vehicles/allVehicles",
    method: "GET",
    success: function (vehicles) {
      vehicles.forEach((vehicle, index) => {
        $("#vehicleDetailsTable").append(`
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
    },
    error: function (error) {
      console.error("Error fetching vehicle data:", error);
    },
  });

  //back
  $("#backBtn").click(function () {
    window.location.href = "vehical.html";
  });
});

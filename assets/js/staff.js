function generateStaffId() {
    const prefix = "S-";
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    return prefix + randomCode;
  }
  
  function setStaffId() {
    const staffIdInput = document.getElementById("staffId");
    staffIdInput.value = generateStaffId();
  }
  
  window.onload = function () {
    setStaffId();
  };
  
//getall
$(document).ready(function () {
  $('#getAllBtn').click(function () {
    window.location.href = 'staff-list.html'; 
  });
});
  
//get all vehicles 
$(document).ready(function () {
  $.ajax({
      type: 'GET',
      url: 'http://localhost:5050/cropMonitoring/api/v1/vehicles/allVehicles',
      success: function (data) {
          const vehicleSelect = $('#allocatedVehicles');
          data.forEach(vehicle => {
              vehicleSelect.append(new Option(`${vehicle.vehicleCode} - ${vehicle.vehicleCategory}`, vehicle.vehicleCode));
          });
      },
      error: function () {
          alert('Failed to load vehicles.');
      }
  });
});

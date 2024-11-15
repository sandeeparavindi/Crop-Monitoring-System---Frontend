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

// Format date
function formatDateForBackend(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Save
$("#saveBtn").on("click", function (event) {
  event.preventDefault(); 

  const staffData = {
    id: $("#staffId").val(),
    firstName: $("#firstName").val(),
    lastName: $("#lastName").val(),
    designation: $("#designation").val(),
    gender: $("#gender").val(),
    joinedDate: formatDateForBackend($("#joinDate").val()),
    dob: formatDateForBackend($("#dob").val()),
    contactNo: $("#contactNo").val(),
    email: $("#email").val(),
    addressLine01: $("#address1").val(),
    addressLine02: $("#address2").val(),
    addressLine03: $("#address3").val(),
    addressLine04: $("#address4").val(),
    addressLine05: $("#address5").val(),
    role: $("#role").val(),
    vehicleCode: $("#allocatedVehicles").val() 
  };

  $.ajax({
    url: "http://localhost:5050/cropMonitoring/api/v1/staff", 
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(staffData), 
    success: function () {
      alert("Staff member saved successfully.");
      $("#staffForm")[0].reset();
      generateStaffId(); 
    },
    error: function () {
      alert("Failed to save staff member. Please try again.");
    }
  });
});



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
  
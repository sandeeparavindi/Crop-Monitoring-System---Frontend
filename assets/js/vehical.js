function generateVehicleCode() {
    const prefix = "V-";
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    return prefix + randomCode;
  }
  
  function setVehicleCode() {
    const vehicleCodeInput = document.getElementById("vehicleCode");
    vehicleCodeInput.value = generateVehicleCode();
  }
  
  window.onload = function () {
    setVehicleCode();
  };
  
  document.getElementById("clearBtn").addEventListener("click", function () {
    setVehicleCode();
    document.getElementById("vehicleForm").reset();
  });
  
  document.getElementById("saveBtn").addEventListener("click", function (e) {
    e.preventDefault();
    alert("Save functionality for the vehicle goes here");
  });
  
  document.getElementById("updateBtn").addEventListener("click", function () {
    alert("Update functionality for the vehicle goes here");
  });
  
  document.getElementById("deleteBtn").addEventListener("click", function () {
    alert("Delete functionality for the vehicle goes here");
  });
  
  document.getElementById("getAllBtn").addEventListener("click", function () {
    alert("Fetching all vehicle data functionality goes here");
  });
  
  document.getElementById("searchBtn").addEventListener("click", function () {
    const vehicleCode = document.getElementById("searchVehicle").value;
    alert("Search functionality for vehicle code " + vehicleCode + " goes here");
  });
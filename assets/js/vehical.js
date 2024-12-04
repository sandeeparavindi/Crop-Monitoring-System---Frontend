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

//clear
document.getElementById("clearBtn").addEventListener("click", function (e) {
  e.preventDefault();
  clearForm();
});

function clearForm() {
  document.getElementById("vehicleForm").reset();
  setVehicleCode();
}

function validateLicensePlate(licensePlate) {
  const licensePlatePattern = /^[A-Z]{3}-\d{4}$/;
  return licensePlatePattern.test(licensePlate);
}

function validateVehicleForm() {
  const licensePlate = document.getElementById("licensePlate").value.trim();
  const vehicleCategory = document.getElementById("vehicleCategory").value.trim();
  const fuelType = document.getElementById("fuelType").value.trim();
  const status = document.getElementById("status").value.trim();
  const remarks = document.getElementById("remarks").value.trim();

  if (!licensePlate) {
    showValidationError("Invalid Input", "License Plate Number cannot be empty.");
    return false;
  }

  if (!validateLicensePlate(licensePlate)) {
    showValidationError(
      "Invalid Input",
      "License Plate Number must follow the format ABC-1234 (three capital letters followed by a hyphen and four digits)."
    );
    return false;
  }

  if (!vehicleCategory) {
    showValidationError("Invalid Input", "Vehicle Category cannot be empty.");
    return false;
  }

  if (!fuelType) {
    showValidationError("Invalid Input", "Fuel Type cannot be empty.");
    return false;
  }

  if (!status) {
    showValidationError("Invalid Input", "Status cannot be empty.");
    return false;
  }

  if (!remarks) {
    showValidationError("Invalid Input", "Remarks cannot be empty.");
    return false;
  }

  return true;
}

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

//save
document.getElementById("saveBtn").addEventListener("click", function (e) {
  e.preventDefault();

  if (!validateVehicleForm()) {
    return;
  }

  const vehicleData = {
    vehicleCode: document.getElementById("vehicleCode").value,
    licensePlateNumber: document.getElementById("licensePlate").value,
    vehicleCategory: document.getElementById("vehicleCategory").value,
    fuelType: document.getElementById("fuelType").value,
    status: document.getElementById("status").value,
    remarks: document.getElementById("remarks").value,
  };

  fetch("http://localhost:5050/cropMonitoring/api/v1/vehicles", {
    method: "POST",
    headers: { "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
     },
    body: JSON.stringify(vehicleData),
  })
  .then((response) => {
    if (response.ok) {
      return response.text();
    } else if (response.status === 401) {
      Swal.fire({
        icon: "warning",
        title: "Session Expired",
        text: "Please log in again.",
        confirmButtonText: "Log In",
      }).then(() => {
        window.location.href = "/index.html";
      });
      throw new Error("Unauthorized");
    } else if (response.status === 403) {
      Swal.fire({
        icon: "error",
        title: "Forbidden",
        text: "You do not have permission to perform this action.",
      });
      throw new Error("Forbidden");
    } else {
      return response.text().then((text) => {
        throw new Error(text || "An unexpected error occurred.");
      });
    }
  })
  .then((data) => {
    Swal.fire({
        icon: "success",
        title: "Save Successfully!",
        text: "Vehicle Saved Successfully!.",
      });
  })
  .catch((error) => console.error("Error:", error));
});

//search
document.getElementById("searchBtn").addEventListener("click", function () {
  searchVehicle();
});

document.getElementById("searchInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    searchVehicle();
  }
});

function searchVehicle() {
  const searchTerm = document.getElementById("searchInput").value.trim();

  if (!searchTerm) {
    alert("Please enter a search term.");
    return;
  }

  fetch(`http://localhost:5050/cropMonitoring/api/v1/vehicles?searchTerm=${encodeURIComponent(searchTerm)}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Failed to fetch vehicle data");
//       }
//       return response.json();
//     })
//     .then((vehicleData) => {
//       if (vehicleData && vehicleData.length > 0) {
//         fillVehicleForm(vehicleData[0]);
//       }
//        else {
//         alert("Vehicle not found.");
//       }
//     })
//     .catch((error) => console.error("Error:", error));
// }
.then((response) => {
  if (response.status === 401) {
    if (confirm("Session expired. Please log in again.")) {
      window.location.href = "/index.html";
    }
    throw new Error("Unauthorized");
  } else if (!response.ok) {
    throw new Error("Failed to fetch vehicle data");
  }
  return response.json();
})
.then((vehicleData) => {
  if (vehicleData && vehicleData.length > 0) {
    fillVehicleForm(vehicleData[0]);
  } else {
    alert("Vehicle not found.");
  }
})
.catch((error) => console.error("Error:", error));
}

function fillVehicleForm(vehicle) {
  document.getElementById("vehicleCode").value = vehicle.vehicleCode || "";
  document.getElementById("licensePlate").value = vehicle.licensePlateNumber || "";
  document.getElementById("vehicleCategory").value = vehicle.vehicleCategory || "";
  document.getElementById("fuelType").value = vehicle.fuelType || "";
  document.getElementById("status").value = vehicle.status || "";
  document.getElementById("remarks").value = vehicle.remarks || "";

  if (vehicle.staff && vehicle.staff.length > 0) {
    document.getElementById("staff").value = vehicle.staff[0].staffCode || "";
  } else {
    document.getElementById("staff").value = "";
  }
}


//update
document.getElementById("updateBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const vehicleData = {
    licensePlateNumber: document.getElementById("licensePlate").value,
    vehicleCategory: document.getElementById("vehicleCategory").value,
    fuelType: document.getElementById("fuelType").value,
    status: document.getElementById("status").value,
    remarks: document.getElementById("remarks").value,
  };

  const vehicleCode = document.getElementById("vehicleCode").value;

  fetch(`http://localhost:5050/cropMonitoring/api/v1/vehicles/${vehicleCode}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
     },
    body: JSON.stringify(vehicleData),
  })
  .then((response) => {
    if (response.ok) {
      alert("Vehicle updated successfully!");
      clearForm();
    }
    else if (response.status === 401) {
      if (confirm("Session expired. Please log in again.")) {
        window.location.href = "/index.html";
      }
      throw new Error("Unauthorized");
    } else if (response.status === 403) {
      alert("You do not have permission to perform this action.");
      throw new Error("Forbidden");
    }
     else {
      alert("Failed to update the vehicle.");
    }
  })
  .catch((error) => console.error("Error:", error));
});

//delte
document.getElementById("deleteBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const vehicleCode = document.getElementById("vehicleCode").value;

  fetch(`http://localhost:5050/cropMonitoring/api/v1/vehicles/${vehicleCode}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  .then((response) => {
    if (response.ok) {
      alert("Vehicle deleted successfully!");
      clearForm();
    } else if (response.status === 401) {
      if (confirm("Session expired. Please log in again.")) {
        window.location.href = "/index.html";
      }
      throw new Error("Unauthorized");
    } else if (response.status === 403) {
      alert("You do not have permission to perform this action.");
      throw new Error("Forbidden");
    }
    else {
      alert("Failed to delete the vehicle.");
    }
  })
  .catch((error) => console.error("Error:", error));
});

//get all click
document.getElementById('getAllBtn').addEventListener('click', function () {
  window.location.href = 'vehicle-list.html';
});

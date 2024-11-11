function generateCropCode() {
  const prefix = "C-";
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  return prefix + randomCode;
}

function setCropCode() {
  const cropCodeInput = document.getElementById("cropCode");
  cropCodeInput.value = generateCropCode();
}

window.onload = function () {
  setCropCode();
  loadFields();
};

function previewCropImage() {
  const fileInput = document.getElementById("cropImage");
  const preview = document.getElementById("cropImagePreview");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };

    reader.readAsDataURL(file);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
}

//load all fields for combo-box
function loadFields() {
  fetch("http://localhost:5050/cropMonitoring/api/v1/fields/allFields")
    .then((response) => response.json())
    .then((data) => {
      const fieldSelect = document.getElementById("field");
      fieldSelect.innerHTML =
        '<option value="" disabled selected>Select Field</option>';

      data.forEach((field) => {
        const option = document.createElement("option");
        option.value = field.fieldCode;
        option.text = `${field.fieldCode} - ${field.fieldName}`;
        fieldSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error loading fields:", error));
}

//save
document.getElementById("saveBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("cropCode", document.getElementById("cropCode").value);
  formData.append(
    "cropCommonName",
    document.getElementById("cropCommonName").value
  );
  formData.append(
    "cropScientificName",
    document.getElementById("cropScientificName").value
  );
  formData.append("category", document.getElementById("cropCategory").value);
  formData.append("cropSeason", document.getElementById("cropSeason").value);
  formData.append("cropImage", document.getElementById("cropImage").files[0]);
  formData.append("fieldCode", document.getElementById("field").value);

  fetch("http://localhost:5050/cropMonitoring/api/v1/crops", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Crop saved successfully!");
      clearForm();
    })
    .catch((error) => console.error("Error:", error));
});

document.getElementById("clearBtn").addEventListener("click", clearForm);

function clearForm() {
  document.getElementById("cropForm").reset();
  document.getElementById("cropCode").value = generateCropCode();
  document.getElementById("cropImagePreview").src = "";
  document.getElementById("cropImagePreview").style.display = "none";
}

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

  fetch(`http://localhost:5050/cropMonitoring/api/v1/vehicles?searchTerm=${searchTerm}`)
    .then((response) => response.json())
    .then((vehicleData) => {
      if (vehicleData && vehicleData.length > 0) {
        fillVehicleForm(vehicleData[0]);
      } else {
        alert("Vehicle not found");
      }
    })
    .catch((error) => console.error("Error:", error));
}

function fillVehicleForm(vehicle) {
  document.getElementById("vehicleCode").value = vehicle.vehicleCode;
  document.getElementById("licensePlate").value = vehicle.licensePlateNumber;
  document.getElementById("vehicleCategory").value = vehicle.vehicleCategory;
  document.getElementById("fuelType").value = vehicle.fuelType;
  document.getElementById("status").value = vehicle.status;
  document.getElementById("remarks").value = vehicle.remarks;

  if (vehicle.staff && vehicle.staff.length > 0) {
    document.getElementById("staff").value = vehicle.staff[0].staffCode;
  } else {
    document.getElementById("staff").value = ""; 
  }
}

//delete
document.getElementById("deleteBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const cropCode = document.getElementById("cropCode").value;

  fetch(`http://localhost:5050/cropMonitoring/api/v1/crops/${cropCode}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        alert("Crop deleted successfully!");
        clearForm();
      } else {
        alert("Failed to delete the crop.");
      }
    })
    .catch((error) => console.error("Error:", error));
});

//update
document.getElementById("updateBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const cropCode = document.getElementById("cropCode").value;
  const formData = new FormData();

  formData.append(
    "cropCommonName",
    document.getElementById("cropCommonName").value
  );
  formData.append(
    "cropScientificName",
    document.getElementById("cropScientificName").value
  );
  formData.append("category", document.getElementById("cropCategory").value);
  formData.append("cropSeason", document.getElementById("cropSeason").value);
  formData.append("cropImage", document.getElementById("cropImage").files[0]);
  formData.append("fieldCode", document.getElementById("field").value);

  fetch(`http://localhost:5050/cropMonitoring/api/v1/crops/${cropCode}`, {
    method: "PATCH",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        alert("Crop updated successfully!");
        clearForm();
      } else {
        alert("Failed to update the crop.");
      }
    })
    .catch((error) => console.error("Error:", error));
});

//get all click
$(document).ready(function () {
  $("#getAllBtn").click(function () {
    $.ajax({
      url: 'http://localhost:5050/cropMonitoring/api/v1/crops/allcrops', 
      type: 'GET',
      success: function (crops) {
        localStorage.setItem('cropData', JSON.stringify(crops));
        window.location.href = "/pages/crop-list.html";
      },
      error: function (error) {
        console.error("Error fetching crops: ", error);
      }
    });
  });
});

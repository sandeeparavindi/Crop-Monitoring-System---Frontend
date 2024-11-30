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
  fetch("http://localhost:5050/cropMonitoring/api/v1/fields/allFields", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
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
    .catch((error) => {
      console.error("Error loading fields:", error);
      // alert("Failed to load fields.");
    });
}
// Save Crop
document.getElementById("saveBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const userRole = localStorage.getItem("role");
  if (userRole === "ADMINISTRATIVE") {
    alert("Unauthorized access.");
    return;
  }

  const formData = new FormData();
  formData.append("cropCode", document.getElementById("cropCode").value.trim());
  formData.append(
    "cropCommonName",
    document.getElementById("cropCommonName").value.trim()
  );
  formData.append(
    "cropScientificName",
    document.getElementById("cropScientificName").value.trim()
  );
  formData.append("category", document.getElementById("cropCategory").value);
  formData.append("cropSeason", document.getElementById("cropSeason").value);
  formData.append("cropImage", document.getElementById("cropImage").files[0]);
  formData.append("fieldCode", document.getElementById("field").value);

  fetch("http://localhost:5050/cropMonitoring/api/v1/crops", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  .then((response) => {
    if (response.ok) {
      return response.text();
    } else if (response.status === 401) {
      if (confirm("Session expired. Please log in again.")) {
        window.location.href = "/index.html";
      }
      throw new Error("Unauthorized");
    } else if (response.status === 403) {
      alert("You do not have permission to perform this action.");
      throw new Error("Forbidden");
    } else {
      return response.text().then((text) => {
        throw new Error(text || "An unexpected error occurred.");
      });
    }
  })
  .then((data) => {
    alert(data);
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
document.getElementById("searchBtn").addEventListener("click", searchCrop);
document
  .getElementById("searchInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      searchCrop();
    }
  });

function searchCrop() {
  const searchValue = document.getElementById("searchInput").value;

  fetch(
    `http://localhost:5050/cropMonitoring/api/v1/crops?searchTerm=${searchValue}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  )
    // .then((response) => response.json())
    // .then((data) => {
    //   if (data.length > 0) {
    //     const crop = data[0];
    //     document.getElementById("cropCode").value = crop.cropCode;
    //     document.getElementById("cropCommonName").value = crop.cropCommonName;
    //     document.getElementById("cropScientificName").value =
    //       crop.cropScientificName;
    //     document.getElementById("cropCategory").value = crop.category;
    //     document.getElementById("cropSeason").value = crop.cropSeason;
    //     const fieldSelect = document.getElementById("field");
    //     for (let i = 0; i < fieldSelect.options.length; i++) {
    //       if (fieldSelect.options[i].value === crop.fieldCode) {
    //         fieldSelect.selectedIndex = i;
    //         break;
    //       }
    //     }
     .then((response) => {
      if (response.status === 401) {
        // Session expired, redirect to login page
        alert("Session expired. Please log in again.");
        window.location.href = "index.html";
        return Promise.reject("Session expired.");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const crop = data[0];
        document.getElementById("cropCode").value = crop.cropCode;
        document.getElementById("cropCommonName").value = crop.cropCommonName;
        document.getElementById("cropScientificName").value = crop.cropScientificName;
        document.getElementById("cropCategory").value = crop.category;
        document.getElementById("cropSeason").value = crop.cropSeason;
        
        const fieldSelect = document.getElementById("field");
        for (let i = 0; i < fieldSelect.options.length; i++) {
          if (fieldSelect.options[i].value === crop.fieldCode) {
            fieldSelect.selectedIndex = i;
            break;
          }
        }

        if (crop.cropImage) {
          const cropImagePreview = document.getElementById("cropImagePreview");
          cropImagePreview.src = `data:image/png;base64,${crop.cropImage}`;
          cropImagePreview.style.display = "block";
        } else {
          document.getElementById("cropImagePreview").style.display = "none";
        }
      } else {
        alert("Crop not found.");
      }
    })
    .catch((error) => console.error("Error:", error));
}

//delete
document.getElementById("deleteBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const userRole = localStorage.getItem("role");
  if (userRole === "ADMINISTRATIVE") {
    alert("Unauthorized access.");
    return;
  }
  const cropCode = document.getElementById("cropCode").value;

  fetch(`http://localhost:5050/cropMonitoring/api/v1/crops/${cropCode}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        alert("Crop deleted successfully!");
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
        alert("Failed to delete the crop.");
      }
    })
    .catch((error) => console.error("Error:", error));
});

//update
document.getElementById("updateBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const userRole = localStorage.getItem("role");
  if (userRole === "ADMINISTRATIVE") {
    alert("Unauthorized access.");
    return;
  }

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
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        alert("Crop updated successfully!");
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
        alert("Failed to update the crop.");
      }
    })
    .catch((error) => console.error("Error:", error));
});

//get all click
$(document).ready(function () {
  $("#getAllBtn").click(function () {
    $.ajax({
      url: "http://localhost:5050/cropMonitoring/api/v1/crops/allcrops",
      type: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: function (crops) {
        localStorage.setItem("cropData", JSON.stringify(crops));
        window.location.href = "/pages/crop-list.html";
      },
      error: function (error) {
        console.error("Error fetching crops: ", error);
      },
    });
  });
});

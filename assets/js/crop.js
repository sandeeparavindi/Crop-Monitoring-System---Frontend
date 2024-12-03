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

function isFirstLetterCapitalized(text) {
  return /^[A-Z]/.test(text);
}

// Validation function
function validateInputsWithPopup() {
  const cropCommonNameInput = document.getElementById("cropCommonName");
  const cropScientificNameInput = document.getElementById("cropScientificName");

  const cropCommonName = cropCommonNameInput.value.trim();
  const cropScientificName = cropScientificNameInput.value.trim();
  if (!cropCommonName) {
    showValidationError("Invalid Input", "Crop Common Name cannot be empty.");
    return false;
  }

  if (!isFirstLetterCapitalized(cropCommonName)) {
    showValidationError(
      "Invalid Input",
      "Crop Common Name must start with a capital letter."
    );
    return false;
  }

  if (cropCommonName.length < 3) {
    showValidationError(
      "Invalid Input",
      "Crop Common Name must be at least 3 characters long."
    );
    return false;
  }

  if (!cropScientificName) {
    showValidationError(
      "Invalid Input",
      "Crop Scientific Name cannot be empty."
    );
    return false;
  }

  if (cropScientificName.length < 3) {
    showValidationError(
      "Invalid Input",
      "Crop Scientific Name must be at least 3 characters long."
    );
    return false;
  }

  if (!isFirstLetterCapitalized(cropScientificName)) {
    showValidationError(
      "Invalid Input",
      "Crop Scientific Name must start with a capital letter."
    );
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
    });
}
// Save Crop
document.getElementById("saveBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const userRole = localStorage.getItem("role");
  if (userRole === "ADMINISTRATIVE") {
    Swal.fire({
      icon: "error",
      title: "Unauthorized",
      text: "You do not have permission to perform this action.",
    });
    return;
  }

  if (!validateInputsWithPopup()) {
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
        title: "Saved Successfully!",
        text: "Crop Saved Successfully",
      });
      clearForm();
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
      console.error("Error:", error);
    });
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
    `http://localhost:5050/cropMonitoring/api/v1/crops?searchTerm=${searchValue}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  )
    .then((response) => {
      if (response.status === 401) {
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
        document.getElementById("cropScientificName").value =
          crop.cropScientificName;
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
        Swal.fire({
          icon: "error",
          title: "Not Found!",
          text: "Crop is not Found!",
        });
      }
    })
    .catch((error) => console.error("Error:", error));
}

//delete
document.getElementById("deleteBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const userRole = localStorage.getItem("role");
  if (userRole === "ADMINISTRATIVE") {
    Swal.fire({
      icon: "error",
      title: "Unauthorized",
      text: "You do not have permission to perform this action.",
    });
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
        Swal.fire(
          "Delete Successfully!",
          "Crop has been deleted successfully.",
          "success"
        );
        clearForm();
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
    .catch((error) => console.error("Error:", error));
});

//update
document.getElementById("updateBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const userRole = localStorage.getItem("role");
  if (userRole === "ADMINISTRATIVE") {
    Swal.fire({
      icon: "error",
      title: "Unauthorized",
      text: "You do not have permission to perform this action.",
    });
    return;
  }

  if (!validateInputsWithPopup()) {
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
        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          text: "The crop details have been updated.",
        });
        clearForm();
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
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
      console.error("Error:", error);
    });
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
        if (response.status === 401) {
          Swal.fire({
            icon: "warning",
            title: "Session Expired",
            text: "Please log in again.",
            confirmButtonText: "Log In",
          }).then(() => {
            window.location.href = "/index.html";
          });
        }
        console.error("Error fetching crops: ", error);
      },
    });
  });
});

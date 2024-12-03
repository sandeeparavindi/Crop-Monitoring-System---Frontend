function generateFieldCode() {
  const prefix = "F-";
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  return prefix + randomCode;
}
function setFieldCode() {
  const fieldCodeInput = document.getElementById("fieldCode");
  fieldCodeInput.value = generateFieldCode();
}
window.onload = function () {
  setFieldCode();
};

function previewImage(input, previewElementId) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById(previewElementId);
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

document.getElementById("fieldImage1").addEventListener("change", function () {
  previewImage(this, "previewImage1");
});

document.getElementById("fieldImage2").addEventListener("change", function () {
  previewImage(this, "previewImage2");
});

function isFirstLetterCapitalized(text) {
  return /^[A-Z]/.test(text);
}

// Validation function
function validateInputsWithPopup() {
  const fieldNameInput = document.getElementById("fieldName");
  const fieldLocationInput = document.getElementById("fieldLocation");
  const fieldSizeInput = document.getElementById("fieldSize");
  // const fieldImage1Input = document.getElementById("fieldImage1");
  // const fieldImage2Input = document.getElementById("fieldImage2");

  const fieldName = fieldNameInput.value.trim();
  const fieldLocation = fieldLocationInput.value.trim();
  const fieldSize = fieldSizeInput.value.trim();
  // const fieldImage1 = fieldImage1Input.value.trim();
  // const fieldImage2 = fieldImage2Input.value.trim();

  if (!fieldName) {
    showValidationError("Invalid Input", "Field Name cannot be empty.");
    return false;
  }

  if (!isFirstLetterCapitalized(fieldName)) {
    showValidationError(
      "Invalid Input",
      "Field Name must start with a capital letter."
    );
    return false;
  }

  if (!fieldLocation) {
    showValidationError("Invalid Input", "Field Location cannot be empty.");
    return false;
  }

  if (!fieldSize) {
    showValidationError("Invalid Input", "Field Size cannot be empty.");
    return false;
  }

  // if (!fieldImage1) {
  //   showValidationError("Invalid Input", "Field Image 1 cannot be empty.");
  //   return false;
  // }

  // if (!fieldImage2) {
  //   showValidationError("Invalid Input", "Field Image 2 cannot be empty.");
  //   return false;
  // }

  if (!isFirstLetterCapitalized(fieldLocation)) {
    showValidationError(
      "Invalid Input",
      "Field Location must start with a capital letter."
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

// document.getElementById("fieldName").addEventListener("input", function () {
//   if (!isFirstLetterCapitalized(this.value)) {
//     showValidationError(
//       "Invalid Input",
//       "Field Name must start with a capital letter."
//     );
//     this.value = "";
//   }
// });

// document.getElementById("fieldLocation").addEventListener("input", function () {
//   if (!isFirstLetterCapitalized(this.value)) {
//     showValidationError(
//       "Invalid Input",
//       "Field Location must start with a capital letter."
//     );
//     this.value = "";
//   }
// });

//clear
$("#clearBtn").click(function (e) {
  e.preventDefault();

  $("#fieldCode").val("");
  $("#fieldName").val("");
  $("#fieldLocation").val("");
  $("#fieldSize").val("");

  $("#crops").val(null).trigger("change");
  $("#staff").val("");

  const previewImage1 = document.getElementById("previewImage1");
  const previewImage2 = document.getElementById("previewImage2");

  previewImage1.src = "";
  previewImage1.style.display = "none";

  previewImage2.src = "";
  previewImage2.style.display = "none";

  Swal.fire("Clear Successfully!", "Form Cleared!", "success");
});

//search
$(document).ready(function () {
  function performSearch() {
    const fieldCode = $("#searchField").val();

    if (!fieldCode) {
      showPopup("Warning", "Can not search!", "Please Enter your Field Code!");
      return;
    }

    $.ajax({
      url: `http://localhost:5050/cropMonitoring/api/v1/fields/${fieldCode}`,
      type: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: function (response) {
        $("#fieldCode").val(response.fieldCode);
        $("#fieldName").val(response.fieldName);
        $("#fieldLocation").val(response.fieldLocation);
        $("#fieldSize").val(response.extentSize);

        $("#crops").val(response.crops).trigger("change");
        $("#staff").val(response.staff);

        if (response.fieldImage1) {
          const previewImage1 = document.getElementById("previewImage1");
          previewImage1.src = "data:image/jpeg;base64," + response.fieldImage1;
          previewImage1.style.display = "block";
        }

        if (response.fieldImage2) {
          const previewImage2 = document.getElementById("previewImage2");
          previewImage2.src = "data:image/jpeg;base64," + response.fieldImage2;
          previewImage2.style.display = "block";
        }

        Swal.fire(
          "Field Found!",
          "Field has been search successfully.",
          "success"
        );
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
        } else if (xhr.status === 403) {
          showPopup(
            "error",
            "Permission Denied",
            "You do not have permission to perform this action."
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
  }

  $("#searchBtn").click(function (e) {
    e.preventDefault();
    performSearch();
  });

  $("#searchField").on("keypress", function (e) {
    if (e.which === 13) {
      e.preventDefault();
      performSearch();
    }
  });
});

//crop list
$(document).ready(function () {
  $("#crops").select2({
    placeholder: "Select Crops",
    allowClear: true,
  });

  const cropOptions = [
    { id: "no", text: "Not Allocated" },
    { id: "wheat", text: "Wheat" },
    { id: "rice", text: "Rice" },
    { id: "corn", text: "Corn" },
  ];

  cropOptions.forEach(function (option) {
    let newOption = new Option(option.text, option.id, false, false);
    $("#crops").append(newOption).trigger("change");
  });

  // save
  $("#fieldForm").on("submit", function (e) {
    e.preventDefault();
    if (!validateInputsWithPopup()) {
      return;
    }

    let formData = new FormData(this);
    formData.append("fieldCode", $("#fieldCode").val());
    formData.append("fieldName", $("#fieldName").val());
    formData.append("fieldLocation", $("#fieldLocation").val());
    formData.append("extentSize", $("#fieldSize").val());
    formData.append("fieldImage1", $("#fieldImage1")[0].files[0]);
    formData.append("fieldImage2", $("#fieldImage2")[0].files[0]);

    $.ajax({
      url: "http://localhost:5050/cropMonitoring/api/v1/fields/savefield",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: function (response) {
        Swal.fire(
          "Save Successfully!",
          "Field has been saved successfully.",
          "success"
        );
        $("#fieldForm")[0].reset();
        $("#previewImage1, #previewImage2").attr("src", "").hide();
        setFieldCode();
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
        } else if (xhr.status === 403) {
          showPopup(
            "error",
            "Permission Denied",
            "You do not have permission to perform this action."
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
  });

  //clear
  $("#clearBtn").click(function () {
    $("#fieldForm")[0].reset();
    $("#searchField").val("");
    $("#previewImage1, #previewImage2").attr("src", "").hide();
    setFieldCode();
  });
});

//delete
$("#deleteBtn").click(function (e) {
  e.preventDefault();
  const fieldCode = $("#fieldCode").val();

  if (!fieldCode) {
    showPopup("error", "Invalid Input", "Please select a Field to delete!");
    return false;
  }
  showPopup(
    "warning",
    "Confirm Delete",
    "Are you sure you want to delete this field?",
    () => {
      $.ajax({
        url: `http://localhost:5050/cropMonitoring/api/v1/fields/${fieldCode}`,
        type: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        success: function () {
          Swal.fire(
            "Delete Successfully!",
            "Field has been deleted successfully.",
            "success"
          );
          $("#fieldForm")[0].reset();
          $("#previewImage1, #previewImage2").attr("src", "").hide();
          setFieldCode();
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
          } else if (xhr.status === 403) {
            showPopup(
              "error",
              "Permission Denied",
              "You do not have permission to perform this action."
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
    }
  );
});

//update
$("#updateBtn").click(function (e) {
  e.preventDefault();
  if (!validateInputsWithPopup()) {
    return;
  }
  const formData = new FormData();
  formData.append("fieldCode", $("#fieldCode").val());

  const fieldName = $("#fieldName").val();
  if (fieldName) {
    formData.append("fieldName", fieldName);
  }

  const fieldLocation = $("#fieldLocation").val();
  if (fieldLocation) {
    formData.append("fieldLocation", fieldLocation);
  }

  const extentSize = $("#fieldSize").val();
  if (extentSize) {
    formData.append("extentSize", extentSize);
  }

  const fieldImage1 = $("#fieldImage1")[0].files[0];
  if (fieldImage1) {
    formData.append("fieldImage1", fieldImage1);
  }

  const fieldImage2 = $("#fieldImage2")[0].files[0];
  if (fieldImage2) {
    formData.append("fieldImage2", fieldImage2);
  }

  $.ajax({
    url: `http://localhost:5050/cropMonitoring/api/v1/fields/${$(
      "#fieldCode"
    ).val()}`,
    type: "PATCH",
    data: formData,
    processData: false,
    contentType: false,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function () {
      Swal.fire(
        "Update Successfully!",
        "Field has been updated successfully.",
        "success"
      );
      $("#fieldForm")[0].reset();
      $("#previewImage1, #previewImage2").attr("src", "").hide();
      setFieldCode();
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
      } else if (xhr.status === 403) {
        showPopup(
          "error",
          "Permission Denied",
          "You do not have permission to perform this action."
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
});

//getall
$(document).ready(function () {
  $("#getAllBtn").click(function () {
    window.location.href = "field-list.html";
  });
});

$(document).ready(function () {
  $("#staffAssign").click(function () {
    window.location.href = "fieldAssignStaff.html";
  });
});

//open and close modal
document.getElementById("addStaff").addEventListener("click", function () {
  document.getElementById("modalOverlay").style.display = "block";
  document.getElementById("staffAssignmentModal").style.display = "block";
});

document.getElementById("closeModal").addEventListener("click", function () {
  document.getElementById("modalOverlay").style.display = "none";
  document.getElementById("staffAssignmentModal").style.display = "none";
});

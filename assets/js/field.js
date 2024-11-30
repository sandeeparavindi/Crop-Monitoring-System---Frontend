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

  alert("Form cleared successfully!");
});

//search
$(document).ready(function () {
  // Function to handle the search functionality
  function performSearch() {
    const fieldCode = $("#searchField").val();

    if (!fieldCode) {
      alert("Please enter a Field Code to search.");
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

        alert("Field found and loaded into the form");
      },
      error: function (xhr) {
        console.error("Error:", xhr.responseText);
        alert(
          "Failed to find field: " +
            (xhr.responseText || "Unknown error occurred")
        );
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

    const userRole = localStorage.getItem("role");
    if (userRole === "ADMINISTRATIVE") {
      alert("Unauthorized access.");
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
        alert("Field saved successfully!");
        $("#fieldForm")[0].reset();
        $("#previewImage1, #previewImage2").attr("src", "").hide();
        setFieldCode();
      },
      error: function (xhr) {
        if (xhr.status === 403) {
          alert("Unauthorized access.");
          return;
        }
        alert(
          "Error saving field: " +
            (xhr.responseJSON?.message || xhr.responseText)
        );
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

  const userRole = localStorage.getItem("role");
  if (userRole === "ADMINISTRATIVE") {
    alert("Unauthorized access.");
    return;
  }
  const fieldCode = $("#fieldCode").val();

  if (!fieldCode) {
    alert("Please provide a Field Code to delete.");
    return;
  }

  $.ajax({
    url: `http://localhost:5050/cropMonitoring/api/v1/fields/${fieldCode}`,
    type: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function () {
      alert("Field deleted successfully");
      $("#fieldForm")[0].reset();
      $("#previewImage1, #previewImage2").attr("src", "").hide();
      setFieldCode();
    },
    error: function (xhr) {
      console.error("Error:", xhr.responseText);
      alert(
        "Failed to delete field: " +
          (xhr.responseText || "Unknown error occurred")
      );
    },
  });
});

//update
$("#updateBtn").click(function (e) {
  e.preventDefault();
  const userRole = localStorage.getItem("role");
  if (userRole === "ADMINISTRATIVE" || userRole === "SCIENTIST") {
    alert("Unauthorized access.");
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
      alert("Field updated successfully");
      $("#fieldForm")[0].reset();
      $("#previewImage1, #previewImage2").attr("src", "").hide();
      setFieldCode();
    },
    error: function (xhr) {
      if (xhr.status === 403) {
        alert("Unauthorized access.");
        return;
      }
      alert(
        "Error update field: " + (xhr.responseJSON?.message || xhr.responseText)
      );
    },
  });
});

//getall
$(document).ready(function () {
  $("#getAllBtn").click(function () {
    window.location.href = "field-list.html";
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

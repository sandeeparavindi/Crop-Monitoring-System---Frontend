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

document.getElementById("searchBtn").addEventListener("click", function () {
  const fieldCode = document.getElementById("searchField").value;
  alert("Search functionality for field code " + fieldCode + " goes here");
});

$(document).ready(function () {
  // Initialize Select2 for crops
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

  $(document).ready(function () {
    $("#saveBtn").click(function (e) {
      e.preventDefault();

      const formData = new FormData();
      formData.append("fieldCode", $("#fieldCode").val());
      formData.append("fieldName", $("#fieldName").val());
      formData.append("fieldLocation", $("#fieldLocation").val());
      formData.append("extentSize", $("#fieldSize").val());
      formData.append("fieldImage1", $("#fieldImage1")[0].files[0]);
      formData.append("fieldImage2", $("#fieldImage2")[0].files[0]);

      $.ajax({
        url: "http://localhost:5050/cropMonitoring/api/v1/fields",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          alert("Field saved successfully");
        },
        error: function (xhr, status, error) {
          console.error("Error status:", status);
          console.error("Error:", error);
          console.error("Response:", xhr.responseText);
          alert(
            "Failed to save field: " +
              (xhr.responseText || "Unknown error occurred")
          );
        },
      });
    });
  });

  $("#clearBtn").click(function () {
    $("#fieldForm")[0].reset();
    setFieldCode();
  });
});

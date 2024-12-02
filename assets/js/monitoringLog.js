function generateLogCode() {
  const prefix = "ML-";
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  return prefix + randomCode;
}

function setLogCode() {
  const logCodeInput = document.getElementById("logCode");
  logCodeInput.value = generateLogCode();
}

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

document.getElementById("logImage").addEventListener("change", function () {
  previewImage(this, "previewImage");
});

function clearForm() {
  document.getElementById("monitoringLogForm").reset();
  document.getElementById("previewImage").style.display = "none";
}

document.getElementById("clearBtn").addEventListener("click", clearForm);

// Load all fields for combo-box
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

// Load all crops for combo-box
function loadCrops() {
  fetch("http://localhost:5050/cropMonitoring/api/v1/crops/allcrops", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const cropSelect = document.getElementById("crop");
      cropSelect.innerHTML =
        '<option value="" disabled selected>Select Crop</option>';

      data.forEach((crop) => {
        const option = document.createElement("option");
        option.value = crop.cropCode;
        option.text = `${crop.cropCode} - ${crop.cropCommonName}`;
        cropSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error loading crops:", error);
    });
}

// Load all staff for combo-box
function loadStaff() {
  fetch("http://localhost:5050/cropMonitoring/api/v1/staff/allstaff", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const staffSelect = document.getElementById("staff");
      staffSelect.innerHTML =
        '<option value="" disabled selected>Select Staff Member</option>';

      data.forEach((staff) => {
        const option = document.createElement("option");
        option.value = staff.id;
        option.text = `${staff.id} - ${staff.firstName}`;
        staffSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error loading staff:", error);
    });
}

window.onload = function () {
  setLogCode();
  loadFields();
  loadCrops();
  loadStaff();
};

//save
$("#monitoringLogForm").on("submit", function (e) {
  e.preventDefault();

  let formData = new FormData(this);
  formData.append("logCode", $("#logCode").val());
  formData.append("logDate", $("#logDate").val());
  formData.append("observation", $("#observation").val());
  formData.append("staffId", $("#staff").val());
  formData.append("fieldCode", $("#field").val());
  formData.append("cropCode", $("#crop").val());
  formData.append("logImage", $("#logImage")[0].files[0]);

  $.ajax({
    url: "http://localhost:5050/cropMonitoring/api/v1/monitoringLog",
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      alert("Monitoring Log saved successfully!");
      $("#monitoringLogForm")[0].reset();
      $("#previewImage").attr("src", "").hide();
      setLogCode();
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        if (confirm("Session expired. Please log in again.")) {
          window.location.href = "/index.html";
        }
      } else if (xhr.status === 403) {
        alert("You do not have permission to perform this action.");
      } else {
        alert(
          "Error saving log: " +
            (xhr.responseText || "An unexpected error occurred.")
        );
      }
    },
  });
});

// search
$("#searchBtn").on("click", searchAndFillLogForm);
$("#searchLog").on("keypress", function (e) {
  if (e.which === 13) searchAndFillLogForm();
});

function searchAndFillLogForm() {
  const searchTerm = $("#searchLog").val().trim();
  if (searchTerm === "") {
    alert("Enter a Log Code or Observation.");
    return;
  }

  $.ajax({
    url: `http://localhost:5050/cropMonitoring/api/v1/monitoringLog?searchTerm=${encodeURIComponent(searchTerm)}`,
    type: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (logs) {
      if (logs.length === 0) {
        alert("No matching log found.");
        return;
      }

      const log = logs[0];

      $("#logCode").val(log.log_code);
      $("#logDate").val(log.log_date);
      $("#observation").val(log.observation);
      $("#field").val(log.fieldCode).change();
      $("#crop").val(log.cropCode).change();
      $("#staff").val(log.id).change();

      if (log.log_image) {
        $("#previewImage")
          .attr("src", `data:image/png;base64,${log.log_image}`)
          .show();
      } else {
        $("#previewImage").hide();
      }
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        if (confirm("Session expired. Please log in again.")) {
          window.location.href = "/index.html";
        }
      } else {
        alert(
          "Error retrieving monitoring log: " +
            (xhr.responseText || "An unexpected error occurred.")
        );
      }
    },
  });
}

// Update
$("#updateBtn").on("click", function () {
    const logCode = $("#logCode").val().trim();
  
    if (!logCode) {
      alert("Please search and select a log to update.");
      return;
    }
  
    let formData = new FormData();
    formData.append("logDate", $("#logDate").val());
    formData.append("observation", $("#observation").val());
    formData.append("fieldCode", $("#field").val());
    formData.append("cropCode", $("#crop").val());
    formData.append("staffId", $("#staff").val());
    
    const logImageFile = $("#logImage")[0].files[0];
    if (logImageFile) {
      formData.append("logImage", logImageFile);
    }
  
    $.ajax({
      url: `http://localhost:5050/cropMonitoring/api/v1/monitoringLog/${logCode}`,
      type: "PATCH",
      data: formData,
      contentType: false,
      processData: false,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      success: function () {
        alert("Monitoring log updated successfully!");
        $("#monitoringLogForm")[0].reset();
        $("#previewImage").attr("src", "").hide();
        setLogCode();
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          if (confirm("Session expired. Please log in again.")) {
            window.location.href = "/index.html";
          }
        } else if (xhr.status === 403) {
          alert("You do not have permission to perform this action.");
        } else {
          alert(
            "Error updating monitoring log: " +
              (xhr.responseText || "An unexpected error occurred.")
          );
        }
      },
    });
  });
  
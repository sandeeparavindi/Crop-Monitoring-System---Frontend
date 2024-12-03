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

$(document).ready(function () {
  let fieldMap = {};

  function fetchFields() {
    return fetch("http://localhost:5050/cropMonitoring/api/v1/fields/allFields", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 401) {
        showPopup("error", "Unauthorized Access", "Session expired. Please log in again.", () => {
          window.location.href = "/index.html";
        });
        throw new Error("Unauthorized access");
      } else if (response.status === 403) {
        showPopup("error", "Forbidden Access", "You do not have permission to view these fields.");
        throw new Error("Forbidden access");
      } else {
        return response.text().then((text) => {
          throw new Error(text || "An unexpected error occurred.");
        });
      }
    })
    .then((fields) => {
      fields.forEach((field) => {
        fieldMap[field.fieldCode] = field.fieldName;
      });
    })
    .catch((error) => {
      console.error("Error fetching fields:", error);
      showPopup("error", "Error", error.message);
    });
}

  function displayCrops() {
    const crops = JSON.parse(localStorage.getItem("cropData"));

    if (crops && crops.length > 0) {
      let tableRows = "";

      crops.forEach((crop, index) => {
        const fieldName = fieldMap[crop.fieldCode] || "Unknown Field";

        tableRows += `
          <tr>
            <td>${index + 1}</td>
            <td>${crop.cropCode}</td>
            <td>${crop.cropCommonName}</td>
            <td>${crop.cropScientificName}</td>
            <td>${crop.category}</td>
            <td>${crop.cropSeason}</td>
            <td><img src="data:image/png;base64,${
              crop.cropImage
            }" alt="Crop Image" style="max-height: 50px;"></td>
            <td>${crop.fieldCode} - ${fieldName}</td>
          </tr>
        `;
      });

      $("#cropDetailsTable tbody").html(tableRows);

      // Initialize DataTable
      $("#cropDetailsTable").DataTable({
        paging: true,
        searching: true,
        ordering: true,
        responsive: true,
      });
    }
  }

  fetchFields().then(() => {
    displayCrops();
  });

  $("#backBtn").click(function () {
    window.location.href = "/pages/crop.html";
  });
});

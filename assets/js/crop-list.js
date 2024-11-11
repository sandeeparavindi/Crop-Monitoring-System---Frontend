$(document).ready(function () {
  let fieldMap = {};

  function fetchFields() {
    return fetch("http://localhost:5050/cropMonitoring/api/v1/fields/allFields")
      .then((response) => response.json())
      .then((fields) => {
        fields.forEach((field) => {
          fieldMap[field.fieldCode] = field.fieldName;
        });
      })
      .catch((error) => console.error("Error fetching fields:", error));
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

      $("#cropDetailsTable").html(tableRows);
    }
  }

  fetchFields().then(() => {
    displayCrops();
  });

  $("#backBtn").click(function () {
    window.location.href = "/pages/crop.html";
  });
});

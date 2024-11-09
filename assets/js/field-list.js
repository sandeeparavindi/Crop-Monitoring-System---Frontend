$(document).ready(function () {
  $.ajax({
    url: "http://localhost:5050/cropMonitoring/api/v1/fields/allFields",
    method: "GET",
    success: function (data) {
      data.forEach((field, index) => {
        const fieldImage1 = field.fieldImage1
          ? `<img src="data:image/jpeg;base64,${field.fieldImage1}" alt="Field Image 1" style="width: 50px; height: 50px; object-fit: cover;" />`
          : "No Image";
        const fieldImage2 = field.fieldImage2
          ? `<img src="data:image/jpeg;base64,${field.fieldImage2}" alt="Field Image 2" style="width: 50px; height: 50px; object-fit: cover;" />`
          : "No Image";

        $("#cropDetailsTable").append(`
            <tr>
              <th scope="row">${index + 1}</th>
              <td>${field.fieldCode}</td>
              <td>${field.fieldName}</td>
              <td>${field.fieldLocation}</td>
              <td>${field.extentSize}</td>
              <td>${field.crops}</td>
              <td>${field.staff}</td>
              <td>${fieldImage1} ${fieldImage2}</td> <!-- Images Column -->
            </tr>
          `);
      });
    },
    error: function (error) {
      console.error("Error fetching field data:", error);
    },
  });

  $("#backBtn").click(function () {
    window.location.href = "field.html";
  });
});

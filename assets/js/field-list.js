$(document).ready(function () {
    $.ajax({
      url: "http://localhost:5050/cropMonitoring/api/v1/fields/allFields",
      method: "GET",
      success: function (data) {
        data.forEach((field, index) => {
          $("#cropDetailsTable").append(`
            <tr>
              <th scope="row">${index + 1}</th>
              <td>${field.fieldCode}</td>
              <td>${field.fieldName}</td>
              <td>${field.fieldLocation}</td>
              <td>${field.extentSize}</td>
              <td>${field.crops}</td>
              <td>${field.staff}</td>
            </tr>
          `);
        });
      },
      error: function (error) {
        console.error("Error fetching field data:", error);
        // alert('Could not fetch field details.');
      },
    });

    $("#backBtn").click(function () {
      window.location.href = "field.html";
    });
  });
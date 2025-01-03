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
  $.ajax({
    url: "http://localhost:5050/cropMonitoring/api/v1/fields/allFields",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (data) {
      data.forEach((field, index) => {
        const fieldImage1 = field.fieldImage1
          ? `<img src="data:image/jpeg;base64,${field.fieldImage1}" alt="Field Image 1" style="width: 50px; height: 50px; object-fit: cover;" />`
          : "No Image";
        const fieldImage2 = field.fieldImage2
          ? `<img src="data:image/jpeg;base64,${field.fieldImage2}" alt="Field Image 2" style="width: 50px; height: 50px; object-fit: cover;" />`
          : "No Image";

        $("#cropDetailsTable tbody").append(`
            <tr>
              <th scope="row">${index + 1}</th>
              <td>${field.fieldCode}</td>
              <td>${field.fieldName}</td>
              <td>${field.fieldLocation}</td>
              <td>${field.extentSize}</td>
              <td>${fieldImage1} ${fieldImage2}</td> <!-- Images Column -->
            </tr>
          `);
      });
      $("#cropDetailsTable").DataTable();
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
      } else {
        showPopup(
          "error",
          "Error",
          xhr.responseText || "An unexpected error occurred."
        );
      }
    },
  });

  $("#backBtn").click(function () {
    window.location.href = "field.html";
  });
});

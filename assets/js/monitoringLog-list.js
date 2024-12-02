$(document).ready(function () {
  let fieldMap = {};
  let cropMap = {};
  let staffMap = {};

  function fetchFields() {
    return fetch(
      "http://localhost:5050/cropMonitoring/api/v1/fields/allFields",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          if (confirm("Session expired. Please log in again.")) {
            window.location.href = "/index.html";
          }
          throw new Error("Unauthorized access");
        } else if (response.status === 403) {
          alert("You do not have permission to view these fields.");
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
        alert(error.message);
      });
  }

  function fetchCrops() {
    return fetch("http://localhost:5050/cropMonitoring/api/v1/crops/allcrops", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          if (confirm("Session expired. Please log in again.")) {
            window.location.href = "/index.html";
          }
          throw new Error("Unauthorized access");
        } else if (response.status === 403) {
          alert("You do not have permission to view these crops.");
          throw new Error("Forbidden access");
        } else {
          return response.text().then((text) => {
            throw new Error(text || "An unexpected error occurred.");
          });
        }
      })
      .then((crops) => {
        crops.forEach((crop) => {
          cropMap[crop.cropCode] = crop.cropCommonName;
        });
      })
      .catch((error) => {
        console.error("Error fetching crops:", error);
        alert(error.message);
      });
  }

  function fetchStaff() {
    return fetch("http://localhost:5050/cropMonitoring/api/v1/staff/allstaff", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          if (confirm("Session expired. Please log in again.")) {
            window.location.href = "/index.html";
          }
          throw new Error("Unauthorized access");
        } else if (response.status === 403) {
          alert("You do not have permission to view these staff members.");
          throw new Error("Forbidden access");
        } else {
          return response.text().then((text) => {
            throw new Error(text || "An unexpected error occurred.");
          });
        }
      })
      .then((staff) => {
        staff.forEach((member) => {
          staffMap[member.id] = member.firstName;
        });
      })
      .catch((error) => {
        console.error("Error fetching staff:", error);
        alert(error.message);
      });
  }

  function fetchAndDisplayMonitoringLogs() {
    fetch("http://localhost:5050/cropMonitoring/api/v1/monitoringLog/allLogs", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          if (confirm("Session expired. Please log in again.")) {
            window.location.href = "/index.html";
          }
          throw new Error("Unauthorized access");
        } else if (response.status === 403) {
          alert("You do not have permission to view monitoring logs.");
          throw new Error("Forbidden access");
        } else {
          return response.text().then((text) => {
            throw new Error(text || "An unexpected error occurred.");
          });
        }
      })
      .then((logs) => {
        let rows = "";
        logs.forEach((log, index) => {
          const fieldName = fieldMap[log.fieldCode] || "Unknown Field";
          const cropName = cropMap[log.cropCode] || "Unknown Crop";
          const staffName = staffMap[log.id] || "Unknown Staff";

          const logImageHtml = log.log_image
            ? `<img src="data:image/jpeg;base64,${log.log_image}" alt="Log Image" class="" style="max-width: 90px;">`
            : "No Image";

          rows += `
          <tr>
            <td>${index + 1}</td>
            <td>${log.log_code}</td>
            <td>${log.log_date}</td>
            <td>${fieldName}</td>
            <td>${cropName}</td>
            <td>${staffName}</td>
            <td>${log.observation}</td>
            <td>${logImageHtml}</td>
          </tr>
        `;
        });
        $("#monitoringLogTable").html(rows);
      })
      .catch((error) => {
        console.error("Error fetching monitoring logs:", error);
        alert(error.message);
      });
  }

  Promise.all([fetchFields(), fetchCrops(), fetchStaff()])
    .then(() => {
      fetchAndDisplayMonitoringLogs();
    })
    .catch((error) => {
      console.error("Error initializing page:", error);
      alert(error.message);
    });

  $("#backBtn").click(function () {
    window.location.href = "/pages/monitoringLog.html";
  });
});

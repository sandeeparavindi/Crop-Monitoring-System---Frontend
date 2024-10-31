function generateStaffId() {
    const prefix = "S-";
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    return prefix + randomCode;
  }
  
  function setStaffId() {
    const staffIdInput = document.getElementById("staffId");
    staffIdInput.value = generateStaffId();
  }
  
  window.onload = function () {
    setStaffId();
  };
  
  document.getElementById("clearBtn").addEventListener("click", function () {
    setStaffId();
    document.getElementById("staffForm").reset();
  });
  
  document.getElementById("saveBtn").addEventListener("click", function (e) {
    e.preventDefault();
    alert("Save functionality for the staff goes here");
  });
  
  document.getElementById("updateBtn").addEventListener("click", function () {
    alert("Update functionality for the staff goes here");
  });
  
  document.getElementById("deleteBtn").addEventListener("click", function () {
    alert("Delete functionality for the staff goes here");
  });
  
  // Get all staff
  document.getElementById("getAllBtn").addEventListener("click", function () {
    // const staffTableBody = document.getElementById("staffTableBody");
    // staffTableBody.innerHTML = `
    //   <tr>
    //     <td>S-1001</td><td>John</td><td>Doe</td><td>Manager</td><td>Male</td><td>2023-01-01</td><td>1980-02-15</td><td>1234567890</td><td>john@example.com</td><td>Manager</td><td>Field 1</td><td>Vehicle 1</td>
    //   </tr>
    // `;
  });
  
  document.getElementById("searchBtn").addEventListener("click", function () {
    const staffId = document.getElementById("searchStaff").value;
    alert("Search functionality for staff ID " + staffId + " goes here");
  });
  
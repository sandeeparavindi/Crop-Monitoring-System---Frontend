document.getElementById("saveBtn").addEventListener("click", function (e) {
  e.preventDefault();
  alert("Save functionality goes here");
});

document.getElementById("updateBtn").addEventListener("click", function () {
  alert("Update functionality goes here");
});

document.getElementById("clearBtn").addEventListener("click", function () {
  document.getElementById("fieldForm").reset();
});

document.getElementById("deleteBtn").addEventListener("click", function () {
  alert("Delete functionality goes here");
});

document.getElementById("getAllBtn").addEventListener("click", function () {
  });
  

document.getElementById("searchBtn").addEventListener("click", function () {
  const fieldCode = document.getElementById("searchField").value;
  alert("Search functionality for field code " + fieldCode + " goes here");
});

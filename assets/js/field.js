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

document.getElementById("clearBtn").addEventListener("click", function () {
  setFieldCode();
});

document.getElementById("saveBtn").addEventListener("click", function (e) {
  e.preventDefault();
  alert("Save functionality goes here");
});

document.getElementById("updateBtn").addEventListener("click", function () {
  alert("Update functionality goes here");
});

document.getElementById("deleteBtn").addEventListener("click", function () {
  alert("Delete functionality goes here");
});

document.getElementById("getAllBtn").addEventListener("click", function () {});

document.getElementById("searchBtn").addEventListener("click", function () {
  const fieldCode = document.getElementById("searchField").value;
  alert("Search functionality for field code " + fieldCode + " goes here");
});

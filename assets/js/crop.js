function generateCropCode() {
  const prefix = "C-";
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  return prefix + randomCode;
}

function setCropCode() {
  const cropCodeInput = document.getElementById("cropCode");
  cropCodeInput.value = generateCropCode();
}

window.onload = function () {
  setCropCode();
};

function previewCropImage() {
  const fileInput = document.getElementById("cropImage");
  const preview = document.getElementById("cropImagePreview");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };

    reader.readAsDataURL(file);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
}

document.getElementById("clearBtn").addEventListener("click", function () {
  setCropCode();
  document.getElementById("cropForm").reset();
});

document.getElementById("saveBtn").addEventListener("click", function (e) {
  e.preventDefault();
  alert("Save functionality for the crop goes here");
});

document.getElementById("updateBtn").addEventListener("click", function () {
  alert("Update functionality for the crop goes here");
});

document.getElementById("deleteBtn").addEventListener("click", function () {
  alert("Delete functionality for the crop goes here");
});

// Get all crops
document.getElementById("getAllBtn").addEventListener("click", function () {
  // const cropTableBody = document.getElementById("cropTableBody");
  // cropTableBody.innerHTML = `
  //   <tr>
  //     <td>C-1001</td><td>Rice</td><td>Oryza sativa</td><td>Cereal</td><td>Kharif</td><td>Staff 1</td><td>Requires ample water</td>
  //   </tr>
  //   <tr>
  //     <td>C-1002</td><td>Cowpea</td><td>Vigna unguiculata</td><td>Legume</td><td>Rabi</td><td>Staff 2</td><td>N/A</td>
  //   </tr>
  // `;
});

document.getElementById("searchBtn").addEventListener("click", function () {
  const cropCode = document.getElementById("searchCrop").value;
  alert("Search functionality for crop code " + cropCode + " goes here");
});

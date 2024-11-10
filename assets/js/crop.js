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
  loadFields();
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

function loadFields() {
  fetch('http://localhost:5050/cropMonitoring/api/v1/fields/allFields')
    .then(response => response.json())
    .then(data => {
      const fieldSelect = document.getElementById('field');
      fieldSelect.innerHTML = '<option value="" disabled selected>Select Field</option>';

      data.forEach(field => {
        const option = document.createElement('option');
        option.value = field.fieldCode; 
        option.text = `${field.fieldCode} - ${field.fieldName}`;
        fieldSelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error loading fields:', error));
}

document.getElementById('saveBtn').addEventListener('click', function (e) {
  e.preventDefault(); 

  const formData = new FormData();
  formData.append('cropCode', document.getElementById('cropCode').value);
  formData.append('cropCommonName', document.getElementById('cropCommonName').value);
  formData.append('cropScientificName', document.getElementById('cropScientificName').value);
  formData.append('category', document.getElementById('cropCategory').value);
  formData.append('cropSeason', document.getElementById('cropSeason').value);
  formData.append('cropImage', document.getElementById('cropImage').files[0]);
  formData.append('fieldCode', document.getElementById('field').value);

  fetch('http://localhost:5050/cropMonitoring/api/v1/crops', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    alert('Crop saved successfully!');
    clearForm();
  })
  .catch(error => console.error('Error:', error));
});

document.getElementById('clearBtn').addEventListener('click', clearForm);

function clearForm() {
  document.getElementById('cropForm').reset();
  document.getElementById('cropCode').value = generateCropCode(); // Reset crop code
  document.getElementById('cropImagePreview').src = '';
  document.getElementById('cropImagePreview').style.display = 'none';
}




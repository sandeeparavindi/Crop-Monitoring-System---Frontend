// Function to generate a unique Log Code
function generateLogCode() {
    const prefix = "ML-";
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    return prefix + randomCode;
  }
  
  // Function to set the Log Code on page load
  function setLogCode() {
    const logCodeInput = document.getElementById("logCode");
    logCodeInput.value = generateLogCode();
  }
  
  // Function to preview the image when uploaded
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
  
  // Event listener for image upload
  document.getElementById("logImage").addEventListener("change", function () {
    previewImage(this, "previewImage");
  });
  
  // Set the Log Code when the page loads
  window.onload = function () {
    setLogCode();
  };
  
  // Clear form fields
  function clearForm() {
    document.getElementById("monitoringLogForm").reset();
    document.getElementById("previewImage").style.display = "none";
  }
  
  document.getElementById("clearBtn").addEventListener("click", clearForm);
  
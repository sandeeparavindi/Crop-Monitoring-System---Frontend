function generateEquipmentId() {
    const prefix = "EQ-";
    const randomId = Math.floor(1000 + Math.random() * 9000);
    return prefix + randomId;
}

function setEquipmentId() {
    const equipmentIdInput = document.getElementById("equipmentId");
    equipmentIdInput.value = generateEquipmentId();
}

window.onload = function () {
    setEquipmentId();
    loadFields();
};

function loadFields() {
    fetch("http://localhost:5050/cropMonitoring/api/v1/fields/allFields")
      .then((response) => response.json())
      .then((data) => {
        const fieldSelect = document.getElementById("assignedField");
        fieldSelect.innerHTML =
          '<option value="" disabled selected>Select Field</option>';
  
        data.forEach((field) => {
          const option = document.createElement("option");
          option.value = field.fieldCode;
          option.text = `${field.fieldCode} - ${field.fieldName}`;
          fieldSelect.appendChild(option);
        });
      })
      .catch((error) => console.error("Error loading fields:", error));
  }

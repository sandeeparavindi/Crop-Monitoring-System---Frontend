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
};

document.getElementById("clearBtn").addEventListener("click", function () {
    document.getElementById("equipmentForm").reset();
    setEquipmentId();
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

document.getElementById("searchBtn").addEventListener("click", function () {
    const equipmentId = document.getElementById("searchEquipment").value;
});

document.getElementById("getAllBtn").addEventListener("click", function () {
});

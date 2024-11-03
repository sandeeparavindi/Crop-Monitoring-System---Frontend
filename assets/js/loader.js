document.addEventListener("DOMContentLoaded", function () {
    const loader = document.getElementById("page-loader");
    const mainContent = document.getElementById("main-content");
    setTimeout(() => {
      loader.style.display = "none";
      mainContent.style.display = "block";
    }, 1000);
  });
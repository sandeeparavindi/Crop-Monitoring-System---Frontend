document.addEventListener("DOMContentLoaded", function () {
    fetch("/pages/sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("sidebar-container").innerHTML = data;
            initSidebar();
        });
});

function initSidebar() {
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId);

    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener("click", () => {
        nav.classList.toggle("show");
        toggle.classList.toggle("bx-x");
        bodypd.classList.toggle("body-pd");
        headerpd.classList.toggle("body-pd");
      });
    }
  };

  showNavbar("header-toggle", "nav-bar", "body-pd", "header");

  const linkColor = document.querySelectorAll(".nav_link");
  const currentPage = window.location.pathname.split("/").pop();

  linkColor.forEach((link) => {
    const page = link.getAttribute("data-page");
    if (currentPage.includes(page)) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  linkColor.forEach((link) =>
    link.addEventListener("click", function () {
      linkColor.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    })
  );
}
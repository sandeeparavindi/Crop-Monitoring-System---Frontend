document.addEventListener("DOMContentLoaded", function (event) {
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
  
    function colorLink() {
      if (linkColor) {
        linkColor.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      }
    }
    linkColor.forEach((l) => l.addEventListener("click", colorLink));
  });

document.addEventListener("DOMContentLoaded", function () {
  const signOutLink = document.getElementById("signout-link");

  signOutLink.addEventListener("click", function (event) {
    event.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to sign out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Sign out!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/index.html"; 
      }
    });
  });
});

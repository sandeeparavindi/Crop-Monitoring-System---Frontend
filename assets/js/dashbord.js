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

// navigation page
document.addEventListener("DOMContentLoaded", function () {
  const contentArea = document.getElementById("content-area");
  const fieldLink = document.querySelector('a[href="/pages/field.html"]');
  const vehicalLink = document.querySelector('a[href="/pages/vehical.html"]');

  function loadContent(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        contentArea.innerHTML = xhr.responseText;
        contentArea.scrollTop = 0;

        if (!document.querySelector('script[src="/assets/js/field.js"]')) {
          const fieldScript = document.createElement("script");
          fieldScript.src = "/assets/js/field.js";
          fieldScript.onload = function () {
            if (typeof setFieldCode === "function") setFieldCode();
          };
          document.body.appendChild(fieldScript);
        } else {
          if (typeof setFieldCode === "function") setFieldCode();
        }
      } else {
        contentArea.innerHTML = "<h4>Failed to load content.</h4>";
      }
    };
    xhr.onerror = function () {
      contentArea.innerHTML = "<h4>Error loading content.</h4>";
    };
    xhr.send();
  }

  fieldLink.addEventListener("click", function (e) {
    e.preventDefault();
    loadContent("/pages/field.html");
  });
  vehicalLink.addEventListener("click", function (e) {
    e.preventDefault();
    loadContent("/pages/vehical.html");
  });
});

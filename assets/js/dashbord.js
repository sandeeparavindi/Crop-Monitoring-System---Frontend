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
  const cropLink = document.querySelector('a[href="/pages/crop.html"]');
  const equipmentLink = document.querySelector('a[href="/pages/equipment.html"]');

  function loadContent(url, scriptSrc, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        contentArea.innerHTML = xhr.responseText;
        contentArea.scrollTop = 0;

        // Check if the script is already loaded
        if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
          const script = document.createElement("script");
          script.src = scriptSrc;
          script.onload = function () {
            if (typeof callback === "function") callback();
          };
          document.body.appendChild(script);
        } else {
          if (typeof callback === "function") callback();
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
    loadContent("/pages/field.html", "/assets/js/field.js", setFieldCode);
  });

  vehicalLink.addEventListener("click", function (e) {
    e.preventDefault();
    loadContent("/pages/vehical.html", "/assets/js/vehical.js", () => {
      if (typeof setVehicleCode === "function") {
        setVehicleCode();
      }
    });
  });

  cropLink.addEventListener("click", function (e) {
    e.preventDefault();
    loadContent("/pages/crop.html", "/assets/js/crop.js", setCropCode);
  });

  equipmentLink.addEventListener("click", function (e) {
    e.preventDefault();
    loadContent("/pages/equipment.html", "/assets/js/equipment.js", () => {
      if (typeof setEquipmentId === "function") {
        setEquipmentId();
      } else {
        console.error("setEquipmentId is not defined");
      }
    });
  });
  
});

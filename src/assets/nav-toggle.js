// balasree.com — mobile hamburger toggle for the primary nav.
(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  function close() {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }

  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });

  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) close();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 720) close();
  });
})();

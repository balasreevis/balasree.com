// balasree.com — smooth-scroll for in-page nav links.
(function () {
  "use strict";

  // Matches both "#id" and "/#id" (the latter so the same nav link also
  // works from other pages, where the browser handles the "/#id"
  // navigation itself).
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"], a[href^="/#"]');
    if (!a) return;
    var id = a.getAttribute("href").split("#")[1];
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
  });
})();

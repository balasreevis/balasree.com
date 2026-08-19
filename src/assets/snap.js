// balasree.com — side up/down buttons + in-page nav links.
// Manual scrolling is left untouched; these just smooth-scroll one section.
(function () {
  "use strict";

  var sections = Array.prototype.slice.call(
    document.querySelectorAll(".hero, .section")
  );
  if (!sections.length) return;

  var scroller = document.scrollingElement || document.documentElement;

  // Index of the section nearest the top of the viewport.
  function currentIndex() {
    var pos = scroller.scrollTop;
    var best = 0;
    var bestDist = Infinity;
    for (var i = 0; i < sections.length; i++) {
      var d = Math.abs(sections[i].offsetTop - pos);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  }

  function go(dir) {
    var next = currentIndex() + dir;
    if (next < 0 || next >= sections.length) return;
    window.scrollTo({ top: sections[next].offsetTop, behavior: "smooth" });
  }

  // In-page nav links scroll smoothly to their target. Matches both "#id"
  // and "/#id" (the latter so the same nav link also works from other pages,
  // where the browser handles the "/#id" navigation itself).
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

  // Side up/down buttons advance one section and disable at the ends.
  var navButtons = Array.prototype.slice.call(
    document.querySelectorAll(".snap-btn")
  );
  navButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      go(parseInt(btn.getAttribute("data-dir"), 10));
    });
  });

  function updateNav() {
    var i = currentIndex();
    navButtons.forEach(function (btn) {
      var dir = parseInt(btn.getAttribute("data-dir"), 10);
      var next = i + dir;
      btn.disabled = next < 0 || next >= sections.length;
    });
  }
  window.addEventListener("scroll", updateNav, { passive: true });
  window.addEventListener("resize", updateNav);
  updateNav();
})();

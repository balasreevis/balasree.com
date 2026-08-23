// balasree.com — types out and deletes [data-rotator] word lists in random order, typewriter-style.
(function () {
  "use strict";

  var els = Array.prototype.slice.call(document.querySelectorAll("[data-rotator]"));
  if (!els.length) return;

  var TYPE_MS = 70;
  var DELETE_MS = 45;
  var HOLD_MS = 2000;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  els.forEach(function (el) {
    var items;
    try {
      items = JSON.parse(el.getAttribute("data-items"));
    } catch (e) {
      return;
    }
    if (!Array.isArray(items) || !items.length) return;

    var span = el.querySelector("span");
    if (!span) return;

    if (reduceMotion || items.length < 2) {
      span.textContent = items[0];
      return;
    }

    var order = shuffle(items.slice());
    var i = 0;

    function typeNext() {
      var text = order[i];
      var pos = 0;
      (function type() {
        span.textContent = text.slice(0, pos);
        pos++;
        if (pos <= text.length) {
          setTimeout(type, TYPE_MS);
        } else {
          setTimeout(deleteCurrent, HOLD_MS);
        }
      })();
    }

    function deleteCurrent() {
      var text = order[i];
      var pos = text.length;
      (function del() {
        span.textContent = text.slice(0, pos);
        pos--;
        if (pos >= 0) {
          setTimeout(del, DELETE_MS);
        } else {
          i++;
          if (i >= order.length) {
            i = 0;
            order = shuffle(items.slice());
            // Avoid repeating the item that just finished.
            if (order.length > 1 && order[0] === text) {
              order.push(order.shift());
            }
          }
          setTimeout(typeNext, TYPE_MS);
        }
      })();
    }

    typeNext();
  });
})();

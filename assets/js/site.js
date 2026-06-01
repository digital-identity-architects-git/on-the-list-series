/* Shared site behaviour: mobile nav + the front-page lock */
(function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // The lock in the centre of the hero: animate open, then go to Chapter One
  var lock = document.getElementById('lock');
  var caption = document.getElementById('lock-caption');
  if (lock) {
    lock.addEventListener('click', function () {
      lock.classList.add('is-open');
      if (caption) caption.textContent = 'Unlocked';
      setTimeout(function () {
        window.location.href = '/books/chapter-1.html';
      }, 650);
    });
  }
})();

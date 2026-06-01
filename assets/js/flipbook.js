/* =========================================================
   Minimal vanilla flipbook for the chapter reader.
   Reads chapter text from #chapter-source (hidden), splits it
   into pages that fit the page box, and lets the reader "flip"
   forward/back with a page-turn animation, arrow keys, or swipe.
   ========================================================= */
(function () {
  var stage = document.querySelector('[data-flipbook]');
  if (!stage) return;

  var source = document.getElementById('chapter-source');
  var leftPage = stage.querySelector('.page.left');
  var rightPage = stage.querySelector('.page.right');
  var book = stage.querySelector('.book');
  var spread = stage.querySelector('.spread');
  var prevBtn = stage.querySelector('[data-prev]');
  var nextBtn = stage.querySelector('[data-next]');
  var pageno = stage.querySelector('[data-pageno]');

  var title = source.getAttribute('data-title') || 'Chapter One';
  // Paragraphs -> we paginate by measuring against a hidden page box.
  var paragraphs = Array.prototype.map.call(source.querySelectorAll('p'), function (p) {
    return p.innerHTML;
  });

  var pages = [];        // array of HTML strings, one per physical page
  var index = 0;         // index of the LEFT page currently shown
  var twoUp = window.matchMedia('(min-width: 681px)').matches;

  // ---- Pagination: fill a measuring node until it overflows ----
  function paginate() {
    pages = [];
    var measurer = document.createElement('div');
    measurer.className = 'page';
    measurer.style.position = 'absolute';
    measurer.style.visibility = 'hidden';
    measurer.style.left = '-9999px';
    // match the real page width/height
    var sample = rightPage.getBoundingClientRect();
    measurer.style.width = sample.width + 'px';
    measurer.style.height = sample.height + 'px';
    document.body.appendChild(measurer);

    var queue = paragraphs.slice();
    var first = true;
    var current = '';
    measurer.innerHTML = '';
    if (first) measurer.innerHTML = '<h2>' + title + '</h2>';

    function flush() {
      pages.push((pages.length === 0 ? '<h2>' + title + '</h2>' : '') + current);
      current = '';
      measurer.innerHTML = pages.length === 0 ? '<h2>' + title + '</h2>' : '';
    }

    while (queue.length) {
      var para = '<p>' + queue.shift() + '</p>';
      var test = (pages.length === 0 ? '<h2>' + title + '</h2>' : '') + current + para;
      measurer.innerHTML = test;
      if (measurer.scrollHeight > measurer.clientHeight && current !== '') {
        // overflow: commit current page, start a new one with this para
        pages.push((pages.length === 0 ? '<h2>' + title + '</h2>' : '') + current);
        current = para;
      } else {
        current += para;
      }
    }
    if (current) pages.push((pages.length === 0 ? '<h2>' + title + '</h2>' : '') + current);
    document.body.removeChild(measurer);

    // Keep an even count so the right page always has a partner in two-up mode
    if (twoUp && pages.length % 2 !== 0) pages.push('<p class="muted center">&#10086;</p>');
  }

  function folio(n) {
    return n > 0 && n <= pages.length ? '<span class="folio">' + n + '</span>' : '';
  }

  function render() {
    if (twoUp) {
      leftPage.style.display = '';
      leftPage.innerHTML = (pages[index] || '') + folio(index + 1);
      rightPage.innerHTML = (pages[index + 1] || '<p class="muted center">The End of Chapter One</p>') + folio(index + 2);
      pageno.textContent = 'Pages ' + (index + 1) + '–' + Math.min(index + 2, pages.length) + ' of ' + pages.length;
    } else {
      leftPage.style.display = 'none';
      rightPage.innerHTML = (pages[index] || '<p class="muted center">The End of Chapter One</p>') + folio(index + 1);
      pageno.textContent = 'Page ' + (index + 1) + ' of ' + pages.length;
    }
    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index + (twoUp ? 2 : 1) >= pages.length;
  }

  // ---- Flip animation ----
  function flip(dir) {
    var step = twoUp ? 2 : 1;
    var target = index + dir * step;
    if (target < 0 || target >= pages.length) return;

    var layer = document.createElement('div');
    layer.className = 'flip-layer' + (dir < 0 ? ' back' : '');
    var front = document.createElement('div');
    front.className = 'flip-face';
    var back = document.createElement('div');
    back.className = 'flip-face back';

    if (dir > 0) {
      front.innerHTML = (twoUp ? pages[index + 1] : pages[index]) || '';
      back.innerHTML = (twoUp ? pages[target] : pages[target]) || '';
    } else {
      front.innerHTML = (twoUp ? pages[index] : pages[index]) || '';
      back.innerHTML = (twoUp ? pages[target + 1] : pages[target]) || '';
    }
    layer.appendChild(front);
    layer.appendChild(back);
    book.appendChild(layer);

    // force reflow then animate
    void layer.offsetWidth;
    layer.classList.add('turning');

    layer.addEventListener('transitionend', function () {
      index = target;
      render();
      if (layer.parentNode) layer.parentNode.removeChild(layer);
    }, { once: true });
  }

  // ---- Controls ----
  nextBtn.addEventListener('click', function () { flip(1); });
  prevBtn.addEventListener('click', function () { flip(-1); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') flip(1);
    if (e.key === 'ArrowLeft') flip(-1);
  });

  // touch swipe
  var startX = null;
  book.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  book.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) flip(dx < 0 ? 1 : -1);
    startX = null;
  });

  // ---- Re-paginate on resize (debounced) ----
  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(function () {
      var nowTwoUp = window.matchMedia('(min-width: 681px)').matches;
      twoUp = nowTwoUp;
      paginate();
      if (index >= pages.length) index = Math.max(0, pages.length - 1);
      render();
    }, 200);
  });

  // init
  paginate();
  render();
})();

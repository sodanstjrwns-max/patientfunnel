/* ================================================================
   AURORA-X — Interaction Layer v11.0
   · Scroll progress bar
   · Card spotlight (mouse-tracked radial highlight)
   · Subtle 3D tilt on premium cards
   All effects are pointer-fine only & reduced-motion aware.
   ================================================================ */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(pointer: fine)').matches;

    /* ---------- 1. Scroll progress bar ---------- */
    function initProgress() {
        var bar = document.createElement('div');
        bar.className = 'x-progress';
        bar.setAttribute('aria-hidden', 'true');
        var fill = document.createElement('span');
        fill.className = 'x-progress__fill';
        bar.appendChild(fill);
        document.body.appendChild(bar);

        var ticking = false;
        function update() {
            var doc = document.documentElement;
            var max = doc.scrollHeight - window.innerHeight;
            var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
            fill.style.width = pct.toFixed(2) + '%';
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        update();
    }

    /* ---------- 2. Spotlight + tilt targets ---------- */
    var SPOT_SELECTOR = [
        '.bento-card', '.proof-card', '.question-card', '.learn-item',
        '.target-card', '.ba-slider', '.summary-card', '.journey',
        '.faq-item', '.pain-item'
    ].join(',');

    var TILT_SELECTOR = ['.bento-card', '.proof-card', '.question-card', '.learn-item'].join(',');

    function initSpotlight() {
        var cards = document.querySelectorAll(SPOT_SELECTOR);
        cards.forEach(function (card) {
            card.classList.add('x-spot');
            card.addEventListener('pointermove', function (e) {
                var r = card.getBoundingClientRect();
                card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
                card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
            });
        });
    }

    function initTilt() {
        var cards = document.querySelectorAll(TILT_SELECTOR);
        var MAX = 5; // degrees
        cards.forEach(function (card) {
            card.classList.add('x-tilt');
            var raf = null;
            card.addEventListener('pointermove', function (e) {
                if (raf) return;
                raf = requestAnimationFrame(function () {
                    var r = card.getBoundingClientRect();
                    var px = (e.clientX - r.left) / r.width - 0.5;
                    var py = (e.clientY - r.top) / r.height - 0.5;
                    card.style.transform =
                        'perspective(900px) rotateX(' + (-py * MAX).toFixed(2) + 'deg)' +
                        ' rotateY(' + (px * MAX).toFixed(2) + 'deg) translateY(-2px)';
                    raf = null;
                });
            });
            card.addEventListener('pointerleave', function () {
                card.style.transform = '';
            });
        });
    }

    /* ---------- Boot ---------- */
    function boot() {
        initProgress();
        if (finePointer) {
            initSpotlight();
            if (!reduceMotion) initTilt();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();

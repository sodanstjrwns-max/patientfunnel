/* ============================================================
   Patient Funnel Blog — Listing & Article Engine v1.0
   ============================================================ */
(function () {
    'use strict';
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

    /* ---------- Shared: header scroll & mobile nav ---------- */
    function initHeader() {
        const header = $('#siteHeader');
        if (!header) return;
        const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        const toggle = $('#menuToggle');
        const nav = $('#mainNav');
        const closeBtn = $('#navCloseBtn');
        if (toggle && nav) {
            const setOpen = (open) => {
                nav.classList.toggle('is-open', open);
                toggle.setAttribute('aria-expanded', String(open));
                document.body.style.overflow = open ? 'hidden' : '';
            };
            toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
            closeBtn?.addEventListener('click', () => setOpen(false));
            nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
        }
    }

    /* ---------- Card SVG mini-visual (dynamic vector) ---------- */
    function cardVisualSVG(post, i) {
        const a = post.accent || '#E0B756';
        const id = 'g' + i;
        return `
        <svg viewBox="0 0 400 220" role="img" aria-label="${post.category} 일러스트" preserveAspectRatio="xMidYMid slice">
            <defs>
                <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="${a}" stop-opacity="0.28"/>
                    <stop offset="1" stop-color="${a}" stop-opacity="0.04"/>
                </linearGradient>
            </defs>
            <rect width="400" height="220" fill="url(#${id})"/>
            <g stroke="${a}" stroke-opacity="0.25" fill="none">
                ${[40, 80, 120, 160].map(y => `<path d="M0 ${y + 20} Q 100 ${y - 14}, 200 ${y + 12} T 400 ${y}" />`).join('')}
            </g>
            <circle cx="330" cy="60" r="34" fill="${a}" fill-opacity="0.14" stroke="${a}" stroke-opacity="0.4"/>
            <circle cx="330" cy="60" r="18" fill="${a}" fill-opacity="0.22"/>
            <circle cx="70" cy="160" r="6" fill="${a}" fill-opacity="0.5"/>
            <circle cx="120" cy="130" r="4" fill="${a}" fill-opacity="0.35"/>
        </svg>`;
    }

    /* ---------- Blog listing ---------- */
    function initListing() {
        const grid = $('#blogGrid');
        if (!grid || typeof BLOG_POSTS === 'undefined') return;

        const search = $('#blogSearch');
        const pills = $$('.filter-pill');
        let activeCategory = 'all';

        const fmt = (d) => new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

        const render = (list) => {
            if (!list.length) {
                grid.innerHTML = `<div class="loading-state" style="grid-column:1/-1;"><i class="fas fa-search"></i><p>검색 결과가 없습니다. 다른 키워드로 검색해보세요.</p></div>`;
                return;
            }
            grid.innerHTML = list.map((p, i) => {
                const featured = p.featured && activeCategory === 'all' && !search?.value;
                return `
                <a class="blog-card ${featured ? 'blog-card--featured' : ''}" href="${p.slug}.html">
                    ${featured ? `<div class="blog-card__visual" aria-hidden="true">${cardVisualSVG(p, i)}</div>` : ''}
                    <div class="blog-card__body" style="display:flex;flex-direction:column;min-width:0;">
                        <span class="blog-card__category"><i class="fas ${p.icon}" style="margin-right:0.35em;"></i>${p.category}</span>
                        <h2 class="blog-card__title">${p.title}</h2>
                        <p class="blog-card__excerpt">${p.description}</p>
                        <div class="blog-card__meta">
                            <span><i class="fas fa-calendar"></i>${fmt(p.date)}</span>
                            <span><i class="fas fa-clock"></i>${p.readTime}분 읽기</span>
                        </div>
                    </div>
                    <span class="blog-card__arrow" aria-hidden="true"><i class="fas fa-arrow-up-right-from-square"></i></span>
                </a>`;
            }).join('');
        };

        const filter = () => {
            const q = (search?.value || '').trim().toLowerCase();
            let list = BLOG_POSTS;
            if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
            if (q) list = list.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.keywords.some(k => k.toLowerCase().includes(q))
            );
            render(list);
        };

        search?.addEventListener('input', filter);
        pills.forEach(pill => pill.addEventListener('click', () => {
            pills.forEach(p => { p.classList.remove('active'); p.setAttribute('aria-selected', 'false'); });
            pill.classList.add('active');
            pill.setAttribute('aria-selected', 'true');
            activeCategory = pill.dataset.category;
            filter();
        }));

        render(BLOG_POSTS);
    }

    /* ---------- Article page: reading progress ---------- */
    function initReadingProgress() {
        const bar = $('.reading-progress__bar');
        if (!bar) return;
        const update = () => {
            const h = document.documentElement;
            const max = h.scrollHeight - h.clientHeight;
            bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
        };
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    /* ---------- Article page: TOC generation & scroll-spy ---------- */
    function initTOC() {
        const tocList = $('#tocList');
        const article = $('.prose');
        if (!tocList || !article) return;

        const headings = $$('h2[id]', article);
        if (!headings.length) { $('.article-toc')?.remove(); return; }

        tocList.innerHTML = headings.map(h =>
            `<li><a href="#${h.id}" data-toc="${h.id}">${h.textContent}</a></li>`
        ).join('');

        const links = $$('a[data-toc]', tocList);
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    links.forEach(l => l.classList.toggle('active', l.dataset.toc === e.target.id));
                }
            });
        }, { rootMargin: '-100px 0px -65% 0px' });
        headings.forEach(h => spy.observe(h));
    }

    /* ---------- Article page: related posts ---------- */
    function initRelated() {
        const wrap = $('#relatedPosts');
        if (!wrap || typeof BLOG_POSTS === 'undefined') return;
        const current = document.body.dataset.slug;
        const currentPost = BLOG_POSTS.find(p => p.slug === current);
        if (!currentPost) return;

        const related = BLOG_POSTS
            .filter(p => p.slug !== current)
            .sort((a, b) => {
                const score = (p) => (p.category === currentPost.category ? 10 : 0) +
                    p.keywords.filter(k => currentPost.keywords.includes(k)).length;
                return score(b) - score(a);
            })
            .slice(0, 3);

        const fmt = (d) => new Date(d).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
        wrap.innerHTML = related.map(p => `
            <a class="blog-card" href="${p.slug}.html">
                <span class="blog-card__category"><i class="fas ${p.icon}" style="margin-right:0.35em;"></i>${p.category}</span>
                <h3 class="blog-card__title" style="font-size:1rem;">${p.title}</h3>
                <div class="blog-card__meta"><span><i class="fas fa-calendar"></i>${fmt(p.date)}</span><span><i class="fas fa-clock"></i>${p.readTime}분</span></div>
            </a>
        `).join('');
    }

    /* ---------- Article page: prev/next nav ---------- */
    function initPostNav() {
        const nav = $('#postNav');
        if (!nav || typeof BLOG_POSTS === 'undefined') return;
        const current = document.body.dataset.slug;
        const idx = BLOG_POSTS.findIndex(p => p.slug === current);
        if (idx === -1) return;
        const prev = BLOG_POSTS[idx + 1];
        const next = BLOG_POSTS[idx - 1];
        nav.innerHTML = `
            ${prev ? `<a href="${prev.slug}.html" class="post-nav--prev"><span class="post-nav__label"><i class="fas fa-arrow-left"></i> 이전 글</span><span class="post-nav__title">${prev.title.split(' — ')[0]}</span></a>` : '<span></span>'}
            ${next ? `<a href="${next.slug}.html" class="post-nav--next"><span class="post-nav__label">다음 글 <i class="fas fa-arrow-right"></i></span><span class="post-nav__title">${next.title.split(' — ')[0]}</span></a>` : '<span></span>'}
        `;
    }

    document.addEventListener('DOMContentLoaded', () => {
        initHeader();
        initListing();
        initReadingProgress();
        initTOC();
        initRelated();
        initPostNav();
    });
})();

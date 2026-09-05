/* ============================================================
   Patient Funnel — AURORA Interaction Engine v8.0 (2026)
   ─────────────────────────────────────────────────────────────
   · Scroll Progress · Cursor Glow · Reveal Observer
   · Kinetic Type · Tilt Cards · Magnetic Buttons · Halo Tracking
   · 3D Funnel · BA Slider · Knowledge Hub · YouTube Embed
   · PDF Download Flow · Exit Intent · Stage Counter · Chart
   ============================================================ */

'use strict';

(() => {

const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_TOUCH = window.matchMedia('(hover: none)').matches;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ============================================================
   1. SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
    const bar = $('#scrollProgress');
    if (!bar) return;
    let ticking = false;
    const update = () => {
        const h = document.documentElement;
        const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
        bar.style.width = `${Math.min(100, scrolled * 100)}%`;
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
}

/* ============================================================
   2. HEADER SCROLL STATE
   ============================================================ */
function initHeader() {
    const header = $('#siteHeader');
    if (!header) return;
    let lastY = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 32);
        lastY = y;
    }, { passive: true });
}

/* ============================================================
   3. MOBILE NAV
   ============================================================ */
function initMobileNav() {
    const burger = $('#menuToggle');
    const nav = $('#mainNav');
    const closeBtn = $('#navCloseBtn');
    if (!burger || !nav) return;

    const toggle = (open) => {
        const isOpen = open ?? !nav.classList.contains('is-open');
        nav.classList.toggle('is-open', isOpen);
        burger.classList.toggle('is-open', isOpen);
        burger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    burger.addEventListener('click', () => toggle());
    closeBtn?.addEventListener('click', () => toggle(false));
    $$('.nav-pill', nav).forEach(link => link.addEventListener('click', () => toggle(false)));

    // ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) toggle(false);
    });
}

/* ============================================================
   4. CURSOR GLOW (desktop only)
   ============================================================ */
function initCursorGlow() {
    if (IS_TOUCH || PREFERS_REDUCED) return;
    const glow = $('#cursorGlow');
    if (!glow) return;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let active = false;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!active) {
            active = true;
            glow.style.opacity = '1';
        }
    });
    document.addEventListener('mouseleave', () => {
        active = false;
        glow.style.opacity = '0';
    });

    const animate = () => {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        glow.style.left = `${currentX}px`;
        glow.style.top = `${currentY}px`;
        requestAnimationFrame(animate);
    };
    animate();
}

/* ============================================================
   5. REVEAL ANIMATION (IntersectionObserver)
   ============================================================ */
function initReveal() {
    const els = $$('[data-reveal]');
    if (!els.length || PREFERS_REDUCED) {
        els.forEach(el => el.classList.add('is-visible'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(el => io.observe(el));
}

/* ============================================================
   6. KINETIC TYPOGRAPHY (Hero Title)
   ============================================================ */
function initKineticType() {
    if (PREFERS_REDUCED) return;
    const targets = $$('[data-kinetic]');
    targets.forEach(target => {
        // Split text node into word-spans, preserving <br> and child tags
        const walk = (node) => {
            const children = Array.from(node.childNodes);
            children.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const text = child.textContent;
                    if (!text.trim()) return;
                    const frag = document.createDocumentFragment();
                    text.split(/(\s+)/).forEach(part => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) {
                            frag.appendChild(document.createTextNode(part));
                        } else {
                            const span = document.createElement('span');
                            span.className = 'kinetic-word';
                            span.textContent = part;
                            frag.appendChild(span);
                        }
                    });
                    child.replaceWith(frag);
                } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
                    walk(child);
                }
            });
        };
        walk(target);

        // Apply staggered delays
        $$('.kinetic-word', target).forEach((word, i) => {
            word.style.animationDelay = `${i * 60}ms`;
        });
    });
}

/* ============================================================
   7. NUMBER COUNTERS
   ============================================================ */
function initCounters() {
    const els = $$('[data-count]');
    if (!els.length) return;
    const animateCount = (el) => {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const isDecimal = el.dataset.decimal === 'true';
        const duration = 1600;
        const start = performance.now();

        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = target * eased;
            if (isDecimal) {
                el.textContent = current.toFixed(1) + suffix;
            } else if (target >= 1000) {
                el.textContent = Math.floor(current).toLocaleString() + suffix;
            } else {
                el.textContent = Math.floor(current) + suffix;
            }
            if (progress < 1) requestAnimationFrame(tick);
            else {
                if (isDecimal) el.textContent = target.toFixed(1) + suffix;
                else if (target >= 1000) el.textContent = target.toLocaleString() + suffix;
                else el.textContent = target + suffix;
            }
        };
        requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    els.forEach(el => io.observe(el));
}

/* ============================================================
   8. HALO TRACKING (cards follow cursor)
   ============================================================ */
function initHalo() {
    if (IS_TOUCH || PREFERS_REDUCED) return;
    const cards = $$('.bento-card, .proof-card, .stage-card, .knowledge-card, .question-card, .ba-slider, .video-card, .target-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--halo-x', `${x}%`);
            card.style.setProperty('--halo-y', `${y}%`);
        });
    });
}

/* ============================================================
   9. TILT CARDS (subtle 3D tilt)
   ============================================================ */
function initTilt() {
    if (IS_TOUCH || PREFERS_REDUCED) return;
    const cards = $$('.bento-card, .proof-card--lg, .founder-card');
    cards.forEach(card => {
        let raf = null;
        const handle = (e) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            const rotX = (-dy * 4).toFixed(2);
            const rotY = (dx * 4).toFixed(2);
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                card.style.transform = `translateY(-4px) perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            });
        };
        card.addEventListener('mousemove', handle);
        card.addEventListener('mouseleave', () => {
            if (raf) cancelAnimationFrame(raf);
            card.style.transform = '';
        });
    });
}

/* ============================================================
   10. MAGNETIC BUTTONS
   ============================================================ */
function initMagnetic() {
    if (IS_TOUCH || PREFERS_REDUCED) return;
    const btns = $$('.btn--glow, .header__cta, .floating-cta a');
    btns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const dx = (e.clientX - rect.left - rect.width / 2) * 0.18;
            const dy = (e.clientY - rect.top - rect.height / 2) * 0.18;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

/* ============================================================
   11. 3D FUNNEL TIMELINE
   ============================================================ */
function initFunnelTimeline() {
    const timeline = $('.funnel-timeline');
    const progress = $('.funnel-timeline__progress');
    const steps = $$('.funnel-step');
    const stageCounter = $('#stageCounter');
    const stageNum = $('#stageCounterNum');
    const stageBar = $('#stageCounterProgress');
    if (!timeline || !steps.length) return;

    const updateTimeline = () => {
        const rect = timeline.getBoundingClientRect();
        const winH = window.innerHeight;
        const enterPoint = winH * 0.7;
        const exitPoint = -rect.height * 0.4;
        const total = enterPoint - exitPoint;
        const passed = enterPoint - rect.top;
        const ratio = Math.max(0, Math.min(1, passed / total));
        const activeIdx = Math.min(steps.length - 1, Math.floor(ratio * steps.length));

        if (progress) progress.style.width = `${ratio * 100}%`;
        steps.forEach((s, i) => s.classList.toggle('is-active', i <= activeIdx && ratio > 0));

        // Stage counter
        if (stageCounter) {
            const inView = rect.top < winH && rect.bottom > 0;
            stageCounter.classList.toggle('is-visible', inView && ratio > 0.05);
            if (stageNum) stageNum.textContent = String(activeIdx + 1).padStart(2, '0');
            if (stageBar) stageBar.style.width = `${(activeIdx + 1) * 10}%`;
        }
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { updateTimeline(); ticking = false; });
            ticking = true;
        }
    }, { passive: true });
    updateTimeline();

    // Click to jump to stage card
    steps.forEach((step) => {
        step.addEventListener('click', () => {
            const stage = step.dataset.stage;
            const card = $(`.stage-card[data-stage="${stage}"]`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.setAttribute('aria-expanded', 'true');
                setTimeout(() => card.focus(), 600);
            }
        });
    });
}

/* ============================================================
   12. STAGE CARD ACCORDION
   ============================================================ */
function initStageCards() {
    $$('.stage-card').forEach(card => {
        const toggle = () => {
            const expanded = card.getAttribute('aria-expanded') === 'true';
            card.setAttribute('aria-expanded', String(!expanded));
        };
        card.addEventListener('click', toggle);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    });
}

/* ============================================================
   13. FAQ ACCORDION
   ============================================================ */
function initFAQ() {
    $$('.faq-item__q').forEach(btn => {
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
        });
    });
}

/* ============================================================
   14. BA SLIDER (Before/After drag)
   ============================================================ */
function initBASliders() {
    $$('.ba-slider').forEach(slider => {
        const handle = $('.ba-slider__handle', slider);
        const before = $('.ba-slider__before', slider);
        const track = $('.ba-slider__track', slider);
        if (!handle || !before || !track) return;

        let dragging = false;
        const update = (clientX) => {
            const rect = track.getBoundingClientRect();
            const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
            handle.style.left = `${pct}%`;
            before.style.width = `${pct}%`;
        };

        const onDown = (e) => {
            dragging = true;
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            update(x);
        };
        const onMove = (e) => {
            if (!dragging) return;
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            update(x);
        };
        const onUp = () => dragging = false;

        handle.addEventListener('mousedown', onDown);
        handle.addEventListener('touchstart', onDown, { passive: true });
        track.addEventListener('mousedown', onDown);
        track.addEventListener('touchstart', onDown, { passive: true });
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove, { passive: true });
        document.addEventListener('mouseup', onUp);
        document.addEventListener('touchend', onUp);

        // Keyboard
        handle.addEventListener('keydown', (e) => {
            const current = parseFloat(handle.style.left) || 50;
            let next = current;
            if (e.key === 'ArrowLeft') next = Math.max(5, current - 5);
            if (e.key === 'ArrowRight') next = Math.min(95, current + 5);
            if (next !== current) {
                e.preventDefault();
                handle.style.left = `${next}%`;
                before.style.width = `${next}%`;
            }
        });
    });
}

/* ============================================================
   15. CHART (Revenue comparison)
   ============================================================ */
function initChart() {
    const canvas = $('#revenueChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    // Gradient fills
    const gold = ctx.createLinearGradient(0, 0, 0, 400);
    gold.addColorStop(0, 'rgba(224,183,86,0.9)');
    gold.addColorStop(1, 'rgba(224,183,86,0.3)');
    const rose = ctx.createLinearGradient(0, 0, 0, 400);
    rose.addColorStop(0, 'rgba(251,113,133,0.7)');
    rose.addColorStop(1, 'rgba(251,113,133,0.2)');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['서울 H치과', '서울 C치과', '서울 A치과', '서울 D치과'],
            datasets: [
                { label: '적용 전 (만원)', data: [4522, 4566, 5000, 8000], backgroundColor: rose, borderRadius: 8, borderSkipped: false },
                { label: '적용 후 (만원)', data: [8140, 9791, 13000, 13000], backgroundColor: gold, borderRadius: 8, borderSkipped: false }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: 'rgba(250,250,250,0.72)', font: { family: 'Inter, sans-serif', size: 13 } } },
                tooltip: {
                    backgroundColor: 'rgba(7,7,10,0.95)', titleColor: '#E0B756',
                    bodyColor: '#FAFAFA', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
                    padding: 12, cornerRadius: 8,
                    callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}만원` }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: 'rgba(250,250,250,0.5)', font: { family: 'Inter, sans-serif' }, callback: (v) => v.toLocaleString() + '만' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: 'rgba(250,250,250,0.72)', font: { family: 'Inter, sans-serif', size: 12 } }
                }
            }
        }
    });
}

/* ============================================================
   16. KNOWLEDGE HUB (WP REST + InBlog RSS fallback)
   ============================================================ */
async function initKnowledgeHub() {
    const grid = $('#knowledgeArticles');
    const search = $('#knowledgeSearch');
    const pills = $$('.filter-pill');
    if (!grid) return;

    let articles = [];
    let activeCategory = 'all';

    const render = (list) => {
        if (!list.length) {
            grid.innerHTML = `<div class="loading-state"><i class="fas fa-search"></i><p>검색 결과가 없습니다.</p><a href="blog/" class="btn btn--outline" style="margin-top:1rem;"><i class="fas fa-blog"></i> 블로그 전체 보기</a></div>`;
            return;
        }
        grid.innerHTML = list.slice(0, 9).map(a => `
            <a class="knowledge-card" href="${a.link}"${a.internal ? '' : ' target="_blank" rel="noopener"'}>
                <span class="knowledge-card__category">${a.category}</span>
                <h3 class="knowledge-card__title">${a.title}</h3>
                <p class="knowledge-card__excerpt">${a.excerpt}</p>
                <div class="knowledge-card__meta">
                    <span><i class="fas fa-calendar"></i> ${a.date}</span>
                    <span><i class="fas fa-clock"></i> ${a.readTime || '3분'}</span>
                </div>
            </a>
        `).join('');
    };

    const filter = () => {
        const q = search?.value.trim().toLowerCase() || '';
        let filtered = articles;
        if (activeCategory !== 'all') filtered = filtered.filter(a => a.category === activeCategory);
        if (q) filtered = filtered.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
        render(filtered);
    };

    // 1st priority: internal SEO blog (js/blog-posts.js)
    if (typeof window.BLOG_POSTS !== 'undefined' && window.BLOG_POSTS.length) {
        articles = window.BLOG_POSTS.map(p => ({
            title: p.title,
            excerpt: p.description.slice(0, 120) + '…',
            link: `blog/${p.slug}.html`,
            date: new Date(p.date).toLocaleDateString('ko-KR'),
            category: p.category,
            readTime: p.readTime + '분',
            internal: true
        }));
    }

    // 2nd priority: WordPress REST (if internal registry unavailable)
    if (!articles.length) try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 4000);
        const res = await fetch('/blog/wp-json/wp/v2/posts?per_page=12&_embed', { signal: ctrl.signal });
        clearTimeout(timer);
        if (res.ok) {
            const data = await res.json();
            articles = data.map(p => ({
                title: p.title.rendered.replace(/<[^>]+>/g, ''),
                excerpt: (p.excerpt.rendered || '').replace(/<[^>]+>/g, '').slice(0, 120) + '…',
                link: p.link,
                date: new Date(p.date).toLocaleDateString('ko-KR'),
                category: p._embedded?.['wp:term']?.[0]?.[0]?.name || '병원 경영',
                readTime: Math.ceil((p.content?.rendered?.length || 1000) / 1000) + '분'
            }));
        }
    } catch (_) { /* fallback below */ }

    // Fallback: InBlog RSS via proxy
    if (!articles.length) {
        try {
            const proxy = 'https://api.allorigins.win/get?url=';
            const rss = encodeURIComponent('https://blog.patientfunnel.kr/rss');
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), 4000);
            const res = await fetch(proxy + rss, { signal: ctrl.signal });
            clearTimeout(timer);
            if (res.ok) {
                const data = await res.json();
                const parser = new DOMParser();
                const xml = parser.parseFromString(data.contents, 'text/xml');
                const items = Array.from(xml.querySelectorAll('item'));
                articles = items.slice(0, 12).map(item => ({
                    title: item.querySelector('title')?.textContent || '',
                    excerpt: (item.querySelector('description')?.textContent || '').replace(/<[^>]+>/g, '').slice(0, 120) + '…',
                    link: item.querySelector('link')?.textContent || '#',
                    date: new Date(item.querySelector('pubDate')?.textContent || Date.now()).toLocaleDateString('ko-KR'),
                    category: item.querySelector('category')?.textContent || '병원 경영'
                }));
            }
        } catch (_) { /* show placeholder */ }
    }

    if (!articles.length) {
        grid.innerHTML = `
            <div class="loading-state" style="grid-column:1/-1;">
                <i class="fas fa-blog"></i>
                <p>블로그에서 최신 인사이트를 확인해보세요.</p>
                <div style="display:flex;gap:0.5rem;justify-content:center;margin-top:1rem;flex-wrap:wrap;">
                    <a href="/blog" class="btn btn--glow"><i class="fas fa-blog"></i> WordPress 블로그</a>
                    <a href="https://blog.patientfunnel.kr" target="_blank" rel="noopener" class="btn btn--outline"><i class="fas fa-external-link-alt"></i> 인블로그</a>
                </div>
            </div>`;
        return;
    }

    render(articles);

    search?.addEventListener('input', filter);
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => { p.classList.remove('active'); p.setAttribute('aria-selected', 'false'); });
            pill.classList.add('active');
            pill.setAttribute('aria-selected', 'true');
            activeCategory = pill.dataset.category;
            filter();
        });
    });
}

/* ============================================================
   17. YOUTUBE GRID (proxy RSS + hardcoded fallback)
   ============================================================ */
async function initYouTube() {
    const grid = $('#youtubeVideos');
    if (!grid) return;

    const fallbackVideos = [
        { id: 'pZ8M4WO9hYM', title: '병원 경영, 페이션트 퍼널이 답이다', isShort: false },
        { id: 'aN3KU0_5oXM', title: '환자가 다시 오는 병원의 비밀', isShort: false },
        { id: 'BqRcN5b1zKw', title: '상담 동의율 70% 비결', isShort: true },
        { id: 'kF7g4yV5oQs', title: '신환 유입 3배 늘리는 법', isShort: true },
        { id: 'mP2WqL3jX8E', title: '재방문율 높이는 PRM', isShort: true },
        { id: 'tY8jH6kN2vM', title: '광고비 80% 절감 사례', isShort: true },
        { id: 'rQ9wL4mB7nZ', title: '직원 이직률 낮추는 시스템', isShort: true },
        { id: 'xJ5pV2tH8gK', title: '병원 OS 만들기', isShort: true }
    ];

    const render = (videos) => {
        const normal = videos.filter(v => !v.isShort);
        const shorts = videos.filter(v => v.isShort);
        const html = [...normal, ...shorts].map(v => `
            <div class="yt-card" data-video-id="${v.id}" data-short="${v.isShort}" onclick="playYouTube(this, '${v.id}', ${v.isShort})" role="button" tabindex="0">
                <div class="yt-card__thumb ${v.isShort ? 'yt-card__thumb--short' : ''}">
                    <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="${v.title}" loading="lazy">
                    <span class="yt-card__badge ${v.isShort ? 'yt-card__badge--short' : ''}">${v.isShort ? 'SHORT' : 'VIDEO'}</span>
                    <div class="yt-card__play"><i class="fas fa-play"></i></div>
                </div>
                <div class="yt-card__info">
                    <p class="yt-card__title">${v.title}</p>
                </div>
            </div>
        `).join('');
        grid.innerHTML = html;
    };

    try {
        const proxy = 'https://api.allorigins.win/get?url=';
        const rssUrl = encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=UCv5HqXYWzG874tgaOBpJMVw');
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 3000);
        const res = await fetch(proxy + rssUrl, { signal: ctrl.signal });
        clearTimeout(timer);
        if (res.ok) {
            const data = await res.json();
            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, 'text/xml');
            const entries = Array.from(xml.querySelectorAll('entry')).slice(0, 8);
            if (entries.length) {
                const videos = entries.map(entry => {
                    const id = entry.querySelector('videoId')?.textContent || '';
                    const title = entry.querySelector('title')?.textContent || '';
                    return { id, title, isShort: /short/i.test(title) || title.length < 30 };
                });
                render(videos);
                return;
            }
        }
    } catch (_) { /* fall through */ }

    render(fallbackVideos);
}

window.playYouTube = (el, videoId, isShort) => {
    const thumb = $('.yt-card__thumb', el);
    if (!thumb) return;
    thumb.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="width:100%;height:100%;${isShort ? 'max-height:400px;' : ''}"></iframe>`;
    el.onclick = null;
    if (typeof gtag === 'function') gtag('event', 'video_play', { video_id: videoId });
};

/* ============================================================
   18. VIDEO POSTER (auto-capture frame as poster)
   ============================================================ */
function initVideoPoster() {
    $$('video[data-poster-time]').forEach(video => {
        const time = parseFloat(video.dataset.posterTime) || 3;
        const setPoster = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth || 1280;
                canvas.height = video.videoHeight || 720;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                video.poster = canvas.toDataURL('image/jpeg', 0.8);
            } catch (_) { /* CORS may block */ }
        };
        video.addEventListener('loadedmetadata', () => {
            video.currentTime = Math.min(time, (video.duration || time) - 0.1);
        }, { once: true });
        video.addEventListener('seeked', setPoster, { once: true });
    });
}

/* ============================================================
   19. PDF DOWNLOAD + WEBINAR MODAL
   ============================================================ */
const PDF_URL = '/patient-funnel-guide.pdf';

window.downloadGuide = (source = 'unknown') => {
    // Open PDF in new tab
    window.open(PDF_URL, '_blank', 'noopener');

    // Update counter
    const key = 'pf_download_count';
    const current = parseInt(localStorage.getItem(key) || '12847', 10);
    localStorage.setItem(key, String(current + 1));
    $$('[data-count="12847"]').forEach(el => el.textContent = (current + 1).toLocaleString());

    // Show webinar invite modal
    setTimeout(() => {
        $('#pdfModal')?.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }, 400);

    // Analytics
    if (typeof gtag === 'function') {
        gtag('event', 'guide_download', { source, value: 1 });
    }
    if (typeof amplitude !== 'undefined' && amplitude.track) {
        amplitude.track('guide_download', { source });
    }
};

window.closePDFModal = () => {
    $('#pdfModal')?.classList.remove('is-open');
    document.body.style.overflow = '';
};

/* ============================================================
   20. EXIT INTENT
   ============================================================ */
function initExitIntent() {
    const modal = $('#exitIntentModal');
    if (!modal) return;
    let shown = sessionStorage.getItem('pf_exit_shown') === '1';
    let armed = false;

    setTimeout(() => { armed = true; }, 20000);

    document.addEventListener('mouseout', (e) => {
        if (!armed || shown) return;
        if (e.clientY <= 0 && !e.relatedTarget) {
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            shown = true;
            sessionStorage.setItem('pf_exit_shown', '1');
            if (typeof gtag === 'function') gtag('event', 'exit_intent_shown');
        }
    });
}

window.closeExitIntent = () => {
    $('#exitIntentModal')?.classList.remove('is-open');
    document.body.style.overflow = '';
};

/* ============================================================
   21. FLOATING CTA
   ============================================================ */
function initFloatingCTA() {
    const cta = $('#floatingCta');
    const kakao = $('#floatingKakao');
    if (!cta && !kakao) return;
    const hero = $('#hero');
    if (!hero) return;

    const update = () => {
        const heroBottom = hero.getBoundingClientRect().bottom;
        const visible = heroBottom < 0;
        cta?.classList.toggle('is-visible', visible);
        kakao?.classList.toggle('is-visible', visible);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ============================================================
   22. UPDATE AI-LAST-UPDATED META (auto-refresh)
   ============================================================ */
function initAIMeta() {
    const meta = document.querySelector('meta[name="ai-last-updated"]');
    if (meta) {
        const today = new Date().toISOString().split('T')[0];
        meta.setAttribute('content', today);
    }
}

/* ============================================================
   23. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
function initSmoothScroll() {
    $$('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = $(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: PREFERS_REDUCED ? 'auto' : 'smooth', block: 'start' });
            }
        });
    });
}

/* ============================================================
   INIT ALL
   ============================================================ */
function init() {
    initAIMeta();
    initScrollProgress();
    initHeader();
    initMobileNav();
    initCursorGlow();
    initReveal();
    initKineticType();
    initCounters();
    initHalo();
    initTilt();
    initMagnetic();
    initFunnelTimeline();
    initStageCards();
    initFAQ();
    initBASliders();
    initChart();
    initKnowledgeHub();
    initYouTube();
    initVideoPoster();
    initExitIntent();
    initFloatingCTA();
    initSmoothScroll();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

})();

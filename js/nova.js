/* ================================================================
   PATIENT FUNNEL — LEDGER Engine v13.0 (2026)
   Consolidated interactions for the light editorial rebuild.
   Replaces main.js + aurora-x.js (journey.js remains separate).
   ================================================================ */
'use strict';

(() => {

const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------- Scroll progress + header state ---------- */
function initScrollUI() {
    const bar = $('#scrollProgress');
    const head = $('#siteHeader');
    let ticking = false;
    const update = () => {
        const h = document.documentElement;
        const ratio = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
        if (bar) bar.style.width = `${Math.min(100, ratio * 100)}%`;
        if (head) head.classList.toggle('is-scrolled', h.scrollTop > 24);
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
}

/* ---------- Mobile nav ---------- */
function initMobileNav() {
    const burger = $('#menuToggle');
    const nav = $('#mainNav');
    if (!burger || !nav) return;
    const toggle = (open) => {
        const isOpen = open ?? !nav.classList.contains('is-open');
        nav.classList.toggle('is-open', isOpen);
        burger.classList.toggle('is-open', isOpen);
        burger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle());
    $$('a', nav).forEach(a => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) toggle(false);
    });
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
    const els = $$('[data-reveal]');
    if (!els.length || PREFERS_REDUCED || !('IntersectionObserver' in window)) {
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
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    els.forEach(el => io.observe(el));
}

/* ---------- Counters ---------- */
function initCounters() {
    const els = $$('[data-count]');
    if (!els.length) return;
    const run = (el) => {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const isDecimal = el.dataset.decimal === 'true';
        const dur = 1500;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const cur = target * eased;
            if (isDecimal) el.textContent = cur.toFixed(1) + suffix;
            else if (target >= 1000) el.textContent = Math.floor(cur).toLocaleString() + suffix;
            else el.textContent = Math.floor(cur) + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = (isDecimal ? target.toFixed(1) : target >= 1000 ? target.toLocaleString() : target) + suffix;
        };
        requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    els.forEach(el => io.observe(el));
}

/* ---------- Stage accordion ---------- */
function initStageCards() {
    $$('.stage-card').forEach(card => {
        const toggle = () => {
            card.setAttribute('aria-expanded', String(card.getAttribute('aria-expanded') !== 'true'));
        };
        card.addEventListener('click', toggle);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });
    });
}

/* ---------- FAQ ---------- */
function initFAQ() {
    $$('.faq-item__q').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.setAttribute('aria-expanded', String(btn.getAttribute('aria-expanded') !== 'true'));
        });
    });
}

/* ---------- Before/After sliders ---------- */
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
        const getX = (e) => e.touches ? e.touches[0].clientX : e.clientX;
        const onDown = (e) => { dragging = true; update(getX(e)); };
        track.addEventListener('mousedown', onDown);
        track.addEventListener('touchstart', onDown, { passive: true });
        document.addEventListener('mousemove', (e) => { if (dragging) update(getX(e)); });
        document.addEventListener('touchmove', (e) => { if (dragging) update(getX(e)); }, { passive: true });
        document.addEventListener('mouseup', () => dragging = false);
        document.addEventListener('touchend', () => dragging = false);
        handle.addEventListener('keydown', (e) => {
            const cur = parseFloat(handle.style.left) || 50;
            let next = cur;
            if (e.key === 'ArrowLeft') next = Math.max(5, cur - 5);
            if (e.key === 'ArrowRight') next = Math.min(95, cur + 5);
            if (next !== cur) {
                e.preventDefault();
                handle.style.left = `${next}%`;
                before.style.width = `${next}%`;
            }
        });
    });
}

/* ---------- Revenue chart ---------- */
function initChart() {
    const canvas = $('#revenueChart');
    if (!canvas) return;
    const start = () => {
        if (typeof Chart === 'undefined') { setTimeout(start, 400); return; }
        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['서울 H치과', '서울 C치과', '서울 A치과', '서울 D치과'],
                datasets: [
                    { label: '적용 전 (만원)', data: [4522, 4566, 5000, 8000], backgroundColor: 'rgba(20,18,13,0.25)', borderRadius: 6, borderSkipped: false },
                    { label: '적용 후 (만원)', data: [8140, 9791, 13000, 13000], backgroundColor: '#0E5B43', borderRadius: 6, borderSkipped: false }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: 'rgba(20,18,13,0.7)', font: { family: 'Inter, sans-serif', size: 13 } } },
                    tooltip: {
                        backgroundColor: '#14120D', titleColor: '#F6F3EC', bodyColor: '#F6F3EC',
                        padding: 12, cornerRadius: 8,
                        callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}만원` }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(20,18,13,0.06)' },
                        ticks: { color: 'rgba(20,18,13,0.5)', callback: (v) => v.toLocaleString() + '만' }
                    },
                    x: { grid: { display: false }, ticks: { color: 'rgba(20,18,13,0.7)', font: { size: 12 } } }
                }
            }
        });
    };
    start();
}

/* ---------- Knowledge Hub ---------- */
function initKnowledgeHub() {
    const grid = $('#knowledgeArticles');
    const search = $('#knowledgeSearch');
    const pills = $$('.filter-pill');
    if (!grid) return;

    let articles = [];
    let activeCategory = 'all';

    const render = (list) => {
        if (!list.length) {
            grid.innerHTML = `<div class="loading-state"><i class="fas fa-search"></i><p>검색 결과가 없습니다.</p><a href="blog/" class="btn btn--line">병원 경영 블로그 전체 보기</a></div>`;
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
            </a>`).join('');
    };

    const filter = () => {
        const q = (search?.value || '').trim().toLowerCase();
        let list = articles;
        if (activeCategory !== 'all') list = list.filter(a => a.category === activeCategory);
        if (q) list = list.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
        render(list);
    };

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

    if (!articles.length) {
        grid.innerHTML = `<div class="loading-state"><i class="fas fa-blog"></i><p>블로그에서 최신 인사이트를 확인해보세요.</p><a href="blog/" class="btn btn--line">병원 경영 블로그</a></div>`;
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

/* ---------- YouTube grid ---------- */
async function initYouTube() {
    const grid = $('#youtubeVideos');
    if (!grid) return;

    // 실제 @PATIENTFUNNEL 채널 영상 (채널 페이지에서 검증된 ID)
    const fallbackVideos = [
        { id: 'fZM_Sn5HC7Q', title: '페이션트 퍼널을 아직도 모른다면 보고가세요', isShort: false },
        { id: 'HXt3G3BB84Q', title: '페이션트 퍼널, 무자본 마케팅 그리고 PRM', isShort: false },
        { id: 'Cviwyx8bb_M', title: '환자 없는 시간은 손해가 아닙니다', isShort: false },
        { id: 'cD85OA_reO4', title: '상담 동의율 30% vs 80% — 차이는 딱 하나입니다', isShort: false },
        { id: 'YGoxcP6ZZ_4', title: '단순한 예약은 가짜, 노쇼 0% 만드는 비법', isShort: true },
        { id: 'V7Rdp68lSTA', title: '바빠 죽겠는 병원, 결국 망할 수밖에 없다', isShort: true },
        { id: 'dmcojx2JvVM', title: '노쇼 방지 캠페인이 오히려 독이 되는 이유', isShort: true },
        { id: 'PFu7_1knzjM', title: '의사가 번아웃 오는 이유, 일이 많아서가 아닙니다', isShort: true },
        { id: 'jUAK3VIrkZY', title: '수술은 대신 시켜도 절대 위임 불가능한 3가지', isShort: true },
        { id: 'gFrffbb8JXs', title: '직원 퇴사 막으려면 질문부터 바꾸십시오', isShort: true }
    ];

    const render = (videos) => {
        const normal = videos.filter(v => !v.isShort);
        const shorts = videos.filter(v => v.isShort);
        grid.innerHTML = [...normal, ...shorts].map(v => `
            <div class="yt-card" data-video-id="${v.id}" onclick="playYouTube(this, '${v.id}', ${v.isShort})" role="button" tabindex="0">
                <div class="yt-card__thumb ${v.isShort ? 'yt-card__thumb--short' : ''}">
                    <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="${v.title}" loading="lazy">
                    <span class="yt-card__badge ${v.isShort ? 'yt-card__badge--short' : ''}">${v.isShort ? 'SHORT' : 'VIDEO'}</span>
                    <div class="yt-card__play"><i class="fas fa-play"></i></div>
                </div>
                <p class="yt-card__title">${v.title}</p>
            </div>`).join('');
    };

    // 프록시/RSS 경로는 신뢰 불가(네임스페이스 파싱 실패 시 빈 ID 렌더링) → 검증된 실제 영상만 확정 렌더링
    render(fallbackVideos);
}

window.playYouTube = (el, videoId, isShort) => {
    const thumb = $('.yt-card__thumb', el);
    if (!thumb) return;
    thumb.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="width:100%;height:100%;"></iframe>`;
    el.onclick = null;
    if (typeof gtag === 'function') gtag('event', 'video_play', { video_id: videoId });
};

/* ---------- Video poster capture ---------- */
function initVideoPoster() {
    $$('video[data-poster-time]').forEach(video => {
        const time = parseFloat(video.dataset.posterTime) || 3;
        const setPoster = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth || 1280;
                canvas.height = video.videoHeight || 720;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                video.poster = canvas.toDataURL('image/jpeg', 0.8);
            } catch (_) { /* CORS */ }
        };
        video.addEventListener('loadedmetadata', () => {
            video.currentTime = Math.min(time, (video.duration || time) - 0.1);
        }, { once: true });
        video.addEventListener('seeked', setPoster, { once: true });
    });
}

/* ---------- PDF download flow ---------- */
const PDF_URL = '/patient-funnel-guide.pdf';

window.downloadGuide = (source = 'unknown') => {
    window.open(PDF_URL, '_blank', 'noopener');
    const key = 'pf_download_count';
    const current = parseInt(localStorage.getItem(key) || '12847', 10);
    localStorage.setItem(key, String(current + 1));
    $$('[data-count="12847"]').forEach(el => el.textContent = (current + 1).toLocaleString());
    setTimeout(() => {
        $('#pdfModal')?.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }, 400);
    if (typeof gtag === 'function') gtag('event', 'guide_download', { source, value: 1 });
    if (typeof amplitude !== 'undefined' && amplitude.track) amplitude.track('guide_download', { source });
};

window.closePDFModal = () => {
    $('#pdfModal')?.classList.remove('is-open');
    document.body.style.overflow = '';
};

/* ---------- Exit intent ---------- */
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

/* ---------- Floating CTA ---------- */
function initFloatingCTA() {
    const cta = $('#floatingCta');
    const kakao = $('#floatingKakao');
    const hero = $('#hero');
    if (!hero || (!cta && !kakao)) return;
    const update = () => {
        const visible = hero.getBoundingClientRect().bottom < 0;
        cta?.classList.toggle('is-visible', visible);
        kakao?.classList.toggle('is-visible', visible);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ---------- Smooth anchor scroll ---------- */
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

/* ---------- ai-last-updated meta ---------- */
function initAIMeta() {
    const meta = document.querySelector('meta[name="ai-last-updated"]');
    if (meta) meta.setAttribute('content', new Date().toISOString().split('T')[0]);
}

/* ---------- INIT ---------- */
function init() {
    initAIMeta();
    initScrollUI();
    initMobileNav();
    initReveal();
    initCounters();
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

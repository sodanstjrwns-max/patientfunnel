// Patient Funnel — NOVA Interactive JS v7.1 (2026)
(() => {
    'use strict';

    const throttle = (fn, ms) => { let last = 0; return (...args) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...args); } }; };
    const debounce = (fn, ms) => { let id; return (...args) => { clearTimeout(id); id = setTimeout(() => fn(...args), ms); }; };
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    let blogPosts = [];
    let currentFilter = 'all';
    let currentSearch = '';
    let exitShown = false;

    // ── Analytics Helper (GA4 + Amplitude 동시 전송) ──
    const track = (eventName, params = {}) => {
        try {
            if (typeof gtag === 'function') {
                gtag('event', eventName, params);
            }
            if (typeof amplitude !== 'undefined' && amplitude.track) {
                amplitude.track(eventName, params);
            }
        } catch(e) {}
    };

    // ── 스크롤 깊이 추적 ──
    const initScrollTracking = () => {
        const thresholds = [25, 50, 75, 100];
        const fired = new Set();
        const check = throttle(() => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            if (h <= 0) return;
            const pct = Math.round((window.scrollY / h) * 100);
            thresholds.forEach(t => {
                if (pct >= t && !fired.has(t)) {
                    fired.add(t);
                    track('scroll_depth', { depth: t, depth_label: `${t}%` });
                }
            });
        }, 500);
        window.addEventListener('scroll', check, { passive: true });
    };

    // ── 섹션 체류 시간 추적 ──
    const initSectionTracking = () => {
        const sections = $$('section[id]');
        const sectionTimers = {};
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                if (entry.isIntersecting) {
                    sectionTimers[id] = Date.now();
                    track('section_view', { section: id });
                } else if (sectionTimers[id]) {
                    const duration = Math.round((Date.now() - sectionTimers[id]) / 1000);
                    if (duration >= 3) {
                        track('section_engagement', { section: id, duration_seconds: duration });
                    }
                    delete sectionTimers[id];
                }
            });
        }, { threshold: 0.3 });
        sections.forEach(s => observer.observe(s));
    };

    // ── CTA 클릭 추적 ──
    const initCTATracking = () => {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href*="dentalfunnel.liveklass"]');
            if (link) {
                const section = link.closest('section[id]')?.id || link.closest('[id]')?.id || 'unknown';
                const label = link.textContent.trim().substring(0, 50);
                track('cta_click', {
                    cta_location: section,
                    cta_text: label,
                    cta_url: link.href
                });
            }

            const emailLink = e.target.closest('a[href^="mailto:"]');
            if (emailLink) {
                track('email_click', { email: emailLink.href.replace('mailto:', '') });
            }

            const blogLink = e.target.closest('a[href*="blog.patientfunnel"]');
            if (blogLink) {
                track('blog_click', { url: blogLink.href, title: blogLink.textContent.trim().substring(0, 80) });
            }

            const youtubeLink = e.target.closest('a[href*="youtube.com"]');
            if (youtubeLink) {
                track('youtube_click', { url: youtubeLink.href });
            }
        });
    };

    const initCursorGlow = () => {
        const hero = $('#hero');
        if (!hero) return;
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        hero.appendChild(glow);

        let raf;
        hero.addEventListener('mousemove', (e) => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const rect = hero.getBoundingClientRect();
                glow.style.left = (e.clientX - rect.left) + 'px';
                glow.style.top = (e.clientY - rect.top) + 'px';
                glow.style.opacity = '1';
            });
        });
        hero.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    };

    const initScrollProgress = () => {
        const bar = $('#scrollProgress');
        if (!bar) return;
        const update = throttle(() => {
            const h = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : '0%';
        }, 16);
        window.addEventListener('scroll', update, { passive: true });
    };

    const initHeader = () => {
        const header = $('#siteHeader');
        const cta = $('#floatingCta');
        const toggle = $('#menuToggle');
        const nav = $('#mainNav');
        const navClose = $('#navCloseBtn');

        const onScroll = throttle(() => {
            const y = window.scrollY;
            header?.classList.toggle('scrolled', y > 60);
            cta?.classList.toggle('visible', y > 800);
        }, 50);
        window.addEventListener('scroll', onScroll, { passive: true });

        const closeMenu = () => {
            if (!nav || !toggle) return;
            nav.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        if (toggle && nav) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = nav.classList.contains('active');
                if (isOpen) { closeMenu(); }
                else {
                    nav.classList.add('active');
                    toggle.classList.add('active');
                    toggle.setAttribute('aria-expanded', 'true');
                    document.body.style.overflow = 'hidden';
                }
            });
            if (navClose) navClose.addEventListener('click', (e) => { e.stopPropagation(); closeMenu(); });
            $$('a', nav).forEach(link => link.addEventListener('click', () => closeMenu()));
            nav.addEventListener('click', (e) => { if (e.target === nav) closeMenu(); });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('active')) closeMenu(); });
        }
    };

    const initSmoothScroll = () => {
        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (!href || href === '#' || href.length < 2) return;
                const target = $(href);
                if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
            });
        });
    };

    const initReveal = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
        $$('[data-reveal]').forEach(el => observer.observe(el));

        // Stagger children
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });

        $$('.proof-card, .stage-card, .case-card, .knowledge-card, .learn-item, .question-card, .faq-item').forEach((el, i) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${(i % 4) * 100}ms`;
            staggerObserver.observe(el);
        });
    };

    const initBentoTilt = () => {
        const cards = $$('.bento-card, .proof-card');
        if (!cards.length || window.matchMedia('(max-width: 768px)').matches) return;

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;

                card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                card.style.transition = 'transform 0.1s ease';

                // Spotlight effect
                const spotX = (x / rect.width) * 100;
                const spotY = (y / rect.height) * 100;
                card.style.setProperty('--spot-x', `${spotX}%`);
                card.style.setProperty('--spot-y', `${spotY}%`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
        });
    };

    const initTextSplit = () => {
        const title = $('.hero__title');
        if (!title) return;
        // Delay for staggered entrance
        setTimeout(() => {
            title.classList.add('text-entered');
        }, 300);
    };

    const initCountUp = () => {
        const counters = $$('[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(el => observer.observe(el));
    };

    const animateCount = (el) => {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const isDecimal = el.dataset.decimal === 'true';
        const duration = 1800;
        const start = performance.now();

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
            const current = target * eased;

            if (isDecimal) {
                el.textContent = current.toFixed(1) + suffix;
            } else {
                el.textContent = Math.floor(current).toLocaleString() + suffix;
            }

            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };

    const initMarquee = () => {
        const track = $('.marquee__track');
        if (!track) return;
        // Clone for seamless loop
        const items = track.innerHTML;
        track.innerHTML = items + items;

        // Pause on hover
        const marquee = track.closest('.marquee');
        if (marquee) {
            marquee.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
            marquee.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
        }
    };

    const initMagneticButtons = () => {
        if (window.matchMedia('(max-width: 768px)').matches) return;
        const btns = $$('.btn--glow, .floating-cta a');
        btns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
            btn.addEventListener('mouseenter', () => {
                btn.style.transition = 'transform 0.1s ease';
            });
        });
    };

    const initStageCards = () => {
        const cards = $$('.stage-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const isActive = card.classList.contains('active');
                cards.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-expanded', 'false'); });
                if (!isActive) {
                    card.classList.add('active');
                    card.setAttribute('aria-expanded', 'true');
                }
            });
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
            });
        });
    };

    const initFunnelTimeline = () => {
        const progress = $('.funnel-timeline__progress');
        const steps = $$('.funnel-step');
        if (!progress || !steps.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate progress bar
                    setTimeout(() => { progress.style.width = '100%'; }, 200);
                    // Activate steps sequentially
                    steps.forEach((step, i) => {
                        setTimeout(() => step.classList.add('active'), 300 + i * 120);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(progress.closest('.funnel-timeline'));
    };

    const initStageCounter = () => {
        const counter = $('#stageCounter');
        const numEl = $('#stageCounterNum');
        const progressEl = $('#stageCounterProgress');
        const frameworkSection = $('#framework');
        if (!counter || !numEl || !progressEl || !frameworkSection) return;

        const stageCards = $$('.stage-card');
        if (!stageCards.length) return;

        const update = throttle(() => {
            const fRect = frameworkSection.getBoundingClientRect();
            const inView = fRect.top < window.innerHeight * 0.5 && fRect.bottom > 100;

            counter.classList.toggle('visible', inView);
            if (!inView) return;

            // Find the most visible active stage card
            let currentStage = 1;
            stageCards.forEach((card, i) => {
                const r = card.getBoundingClientRect();
                if (r.top < window.innerHeight * 0.6 && r.bottom > 0) {
                    currentStage = i + 1;
                }
            });

            numEl.textContent = String(currentStage).padStart(2, '0');
            progressEl.style.width = `${(currentStage / 10) * 100}%`;
        }, 80);

        window.addEventListener('scroll', update, { passive: true });
    };

    const initFAQ = () => {
        $$('.faq-item__q').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.faq-item');
                const isActive = item.classList.contains('active');
                $$('.faq-item').forEach(i => { i.classList.remove('active'); i.querySelector('.faq-item__q')?.setAttribute('aria-expanded', 'false'); });
                if (!isActive) {
                    item.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
    };

    // PDF 가이드 URL (교체 필요 시 여기만 수정)
    const PDF_GUIDE_URL = 'https://patientfunnel.kr/patient-funnel-guide.pdf';

    window.openPDFModal = () => {
        const modal = $('#pdfModal');
        if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
        track('webinar_modal_shown', { event_category: 'engagement', trigger: 'post_download' });
    };
    window.closePDFModal = () => {
        const modal = $('#pdfModal');
        if (modal?.classList.contains('active')) { modal.classList.remove('active'); document.body.style.overflow = ''; }
    };
    window.closeExitIntent = () => {
        const modal = $('#exitIntentModal');
        if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
    };
    
    window.downloadGuide = (source = 'unknown') => {
        window.open(PDF_GUIDE_URL, '_blank');
        openPDFModal();

        try {
            let count = parseInt(localStorage.getItem('pf_dl_count') || '12847');
            count++;
            localStorage.setItem('pf_dl_count', count.toString());
        } catch(e) {}

        track('guide_download', {
            event_category: 'conversion',
            source: source,
            value: 1
        });
    };

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closePDFModal(); closeExitIntent(); } });

    const initExitIntent = () => {
        document.addEventListener('mouseout', (e) => {
            if (exitShown || e.clientY > 5) return;
            exitShown = true;
            const modal = $('#exitIntentModal');
            if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
            track('exit_intent_shown', { event_category: 'engagement' });
        });
    };

    const initDownloadStats = () => {
        const countEl = document.querySelector('.ebook-download__stats [data-count]');
        if (countEl) {
            try {
                const stored = localStorage.getItem('pf_dl_count');
                if (stored) countEl.setAttribute('data-count', stored);
            } catch(e) {}
        }
    };

    /* ── 블로그 연동: WP REST API 1순위 → InBlog RSS 2순위 폴백 ── */
    const WP_API = '/blog/wp-json/wp/v2';

    const mapCategoryName = (cats) => {
        if (!cats || !cats.length) return '블로그';
        const name = (cats[0] || '').toLowerCase();
        const map = {
            '환자경험': '환자경험', '환자 경험': '환자경험', 'patient experience': '환자경험',
            '상담': '상담·전환', '전환': '상담·전환', 'consultation': '상담·전환',
            'prm': 'PRM', '환자관계': 'PRM', '관계관리': 'PRM',
            '직원': '직원·조직', '조직': '직원·조직', '팀': '직원·조직',
            '개원': '개원 준비', '개원준비': '개원 준비', 'opening': '개원 준비',
            '마케팅': '병원 마케팅', '광고': '병원 마케팅', 'marketing': '병원 마케팅',
            '경영': '병원 마케팅', '병원경영': '병원 마케팅', '성장': '병원 마케팅'
        };
        for (const [key, val] of Object.entries(map)) {
            if (name.includes(key)) return val;
        }
        return cats[0] || '블로그';
    };

    const fetchBlogPosts = async () => {
        try {
            /* ───── 1순위: WordPress REST API (같은 도메인 = CORS 무관) ───── */
            try {
                const controller = new AbortController();
                const tid = setTimeout(() => controller.abort(), 6000);
                const res = await fetch(`${WP_API}/posts?per_page=20&_embed&status=publish&orderby=date&order=desc`, { signal: controller.signal });
                clearTimeout(tid);

                if (res.ok) {
                    const posts = await res.json();
                    if (posts.length) {
                        /* WP 카테고리 이름 가져오기 (_embed 사용) */
                        blogPosts = posts.map((p, i) => {
                            const catTerms = p._embedded?.['wp:term']?.[0] || [];
                            const catNames = catTerms.map(c => c.name);
                            const featImg = p._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
                            const excerpt = (p.excerpt?.rendered || '').replace(/<[^>]*>/g, '').trim().substring(0, 150);
                            const contentLen = (p.content?.rendered || '').length;
                            return {
                                title: (p.title?.rendered || '').replace(/&amp;/g, '&').replace(/&#8217;/g, "'"),
                                link: p.link || `${location.origin}/blog/?p=${p.id}`,
                                summary: excerpt + (excerpt.length >= 150 ? '...' : ''),
                                category: mapCategoryName(catNames),
                                date: p.date || '',
                                readTime: Math.max(3, Math.ceil(contentLen / 800)),
                                featured: i === 0,
                                image: featImg,
                                source: 'wp'
                            };
                        });
                        renderPosts(blogPosts);
                        return;
                    }
                }
            } catch(e) { /* WP 미설치 또는 네트워크 실패 → 인블로그 폴백 */ }

            /* ───── 2순위 폴백: InBlog RSS (기존 blog.patientfunnel.kr 유지) ───── */
            const rssUrl = 'https://blog.patientfunnel.kr/rss';
            const rssProxies = [
                `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`,
                `https://api.codetabs.com/v1/proxy?quest=${rssUrl}`
            ];
            let xml = null;
            for (const url of rssProxies) {
                try {
                    const controller = new AbortController();
                    const tid = setTimeout(() => controller.abort(), 6000);
                    const r = await fetch(url, { signal: controller.signal, mode: 'cors' }).catch(() => null);
                    clearTimeout(tid);
                    if (r?.ok) {
                        let text = await r.text();
                        if (url.includes('/get?')) { try { text = JSON.parse(text).contents; } catch(e) {} }
                        if (text.includes('<item>')) { xml = text; break; }
                    }
                } catch(e) { continue; }
            }
            if (!xml) throw new Error('All blog fetches failed');

            const doc = new DOMParser().parseFromString(xml, 'text/xml');
            const items = doc.querySelectorAll('item');
            if (!items.length) throw new Error('No RSS items');

            blogPosts = Array.from(items).map((item, i) => {
                const desc = (item.querySelector('description')?.textContent || '').replace(/<[^>]*>/g, '').substring(0, 150) + '...';
                const rawCat = item.querySelector('category')?.textContent || '';
                const enclosure = item.querySelector('enclosure');
                return {
                    title: item.querySelector('title')?.textContent || '',
                    link: item.querySelector('link')?.textContent || '',
                    summary: desc,
                    category: mapCategoryName([rawCat]),
                    date: item.querySelector('pubDate')?.textContent || '',
                    readTime: Math.max(5, Math.ceil((item.querySelector('description')?.textContent || '').length / 500)),
                    featured: i === 0,
                    image: enclosure?.getAttribute('url') || null,
                    source: 'inblog'
                };
            });
            renderPosts(blogPosts);
        } catch (err) {
            console.warn('Blog fetch failed, showing placeholder:', err.message);
            showPlaceholder();
        }
    };

    const showPlaceholder = () => {
        const grid = $('#knowledgeArticles');
        if (!grid) return;
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding: 3rem 1rem;">
                <i class="fas fa-blog" style="font-size:2.5rem; color:var(--gold); margin-bottom:1rem; display:block;"></i>
                <h4 style="margin-bottom:0.5rem;">블로그에서 최신 콘텐츠를 확인하세요</h4>
                <p style="color:var(--text-dark-secondary); margin-bottom:1.5rem;">병원 경영, 환자 경험 설계, 상담 전환율 향상 등<br>실전 노하우를 공유합니다.</p>
                <a href="/blog" class="btn btn--glow" style="margin-right:0.5rem;"><i class="fas fa-blog"></i> 블로그 바로가기</a>
                <a href="https://blog.patientfunnel.kr" target="_blank" rel="noopener" class="btn btn--outline"><i class="fas fa-external-link-alt"></i> 인블로그</a>
            </div>`;
    };

    const renderPosts = (posts) => {
        const grid = $('#knowledgeArticles');
        if (!grid) return;
        let filtered = posts;
        if (currentFilter !== 'all') filtered = filtered.filter(p => p.category === currentFilter);
        if (currentSearch) filtered = filtered.filter(p => (p.title || '').toLowerCase().includes(currentSearch) || (p.summary || '').toLowerCase().includes(currentSearch));

        if (!filtered.length) {
            grid.innerHTML = '<div class="loading-state" style="grid-column:1/-1"><i class="fas fa-search"></i><p>검색 결과가 없습니다.</p></div>';
            return;
        }
        grid.innerHTML = filtered.map((p) => {
            const date = p.date ? new Date(p.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
            const isFeatured = p.featured && currentFilter === 'all' && !currentSearch;
            const imgHtml = p.image ? `<div class="article-thumb"><img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.parentElement.remove()"></div>` : '';
            return `
                <div class="knowledge-card ${isFeatured ? 'featured' : ''} fade-in visible" data-category="${p.category}">
                    ${imgHtml}
                    <span class="article-label">${isFeatured ? 'Featured' : p.category}</span>
                    <h3 class="article-title">${p.title}</h3>
                    <p class="article-summary">${p.summary || ''}</p>
                    <div class="article-meta">
                        ${date ? `<span><i class="fas fa-calendar-alt"></i> ${date}</span>` : ''}
                        <span><i class="fas fa-clock"></i> ${p.readTime}분</span>
                        <span><i class="fas fa-tag"></i> ${p.category}</span>
                    </div>
                    <a href="${p.link}" target="_blank" rel="noopener" class="article-link">자세히 읽기 <i class="fas fa-arrow-right"></i></a>
                </div>`;
        }).join('');
    };

    const initKnowledgeHub = () => {
        $$('.filter-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('.filter-pill').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
                btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
                currentFilter = btn.dataset.category;
                renderPosts(blogPosts);
            });
        });
        const searchInput = $('#knowledgeSearch');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                currentSearch = e.target.value.toLowerCase();
                renderPosts(blogPosts);
            }, 300));
        }
    };

    /* 최신 유튜브 영상 하드코딩 폴백 (CORS 프록시 실패 대비, 2026-04-08 기준) */
    const FALLBACK_VIDEOS = [
        { videoId: 'UayC93sDYqE', title: '병원 매출은 그대로인데 급여만 올려줘야 합니다 — 해법은 하나입니다', isShort: false, views: '70', published: '2026-04-03' },
        { videoId: '4LgI-2gIeBc', title: '옆에 대형 치과 들어왔는데 매출이 반토막 — 어떻게 해야 할까', isShort: false, views: '126', published: '2026-03-21' },
        { videoId: 'KwYXmGVuuSU', title: '직원과 감정 싸움 끝내주는 과학적 방법', isShort: true, views: '1047', published: '2026-04-08' },
        { videoId: 'A5HrZgw5Nfo', title: '원장님 번아웃 오는 진짜 이유는 \'이것\'', isShort: true, views: '1513', published: '2026-04-07' },
        { videoId: 'zr3ANAQbN-4', title: '급여 인상 요구가 무섭게 느껴지는 이유', isShort: true, views: '1179', published: '2026-04-06' },
        { videoId: 'YTB33mHoC9Y', title: '매출은 제자리인데 급여만 올려줘야 할 때', isShort: true, views: '1370', published: '2026-04-04' },
        { videoId: 'vKF_0br1ef4', title: '신환 100명은 같아도 매출은 3배 차이납니다', isShort: true, views: '1833', published: '2026-03-14' },
        { videoId: 'ne_bsWf7zg8', title: '설명이 길어질수록 환자가 도망가는 이유', isShort: true, views: '1707', published: '2026-03-11' }
    ];

    const fetchYouTube = async () => {
        try {
            const channelId = 'UCv5HqXYWzG874tgaOBpJMVw';
            const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
            const proxies = [
                `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`,
                `https://api.codetabs.com/v1/proxy?quest=${rssUrl}`
            ];
            let xml = null;
            for (const url of proxies) {
                try {
                    const controller = new AbortController();
                    const tid = setTimeout(() => controller.abort(), 3000);
                    const r = await fetch(url, { signal: controller.signal, mode: 'cors' }).catch(() => null);
                    clearTimeout(tid);
                    if (r?.ok) {
                        let text = await r.text();
                        if (url.includes('/get?')) { try { text = JSON.parse(text).contents; } catch(e) {} }
                        if (text.includes('<entry>')) { xml = text; break; }
                    }
                } catch(e) { continue; }
            }
            if (!xml) throw new Error('Proxy failed');

            const doc = new DOMParser().parseFromString(xml, 'text/xml');
            const entries = doc.querySelectorAll('entry');
            if (!entries.length) throw new Error('No entries');

            const videos = Array.from(entries).slice(0, 8).map(entry => {
                const videoId = entry.querySelector('videoId')?.textContent || entry.querySelector('id')?.textContent?.split(':').pop() || '';
                const link = entry.querySelector('link')?.getAttribute('href') || '';
                const isShort = link.includes('/shorts/');
                const stats = entry.getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'statistics')[0];
                const views = stats?.getAttribute('views') || '';
                return { title: entry.querySelector('title')?.textContent || '', videoId, isShort, views, published: entry.querySelector('published')?.textContent || '' };
            });
            renderYouTube(videos);
        } catch(e) {
            /* 프록시 실패 시 하드코딩된 최신 영상으로 폴백 */
            console.info('[YT] Proxy unavailable — using cached video list');
            renderYouTube(FALLBACK_VIDEOS);
        }
    };

    const renderYouTube = (videos) => {
        const grid = $('#youtubeVideos');
        if (!grid) return;

        /* 일반 영상을 먼저, Shorts를 뒤에 배치 */
        const sorted = [...videos].sort((a, b) => (a.isShort === b.isShort ? 0 : a.isShort ? 1 : -1));

        grid.innerHTML = sorted.map(v => {
            const isShort = v.isShort;
            const ytLink = isShort ? `https://www.youtube.com/shorts/${v.videoId}` : `https://www.youtube.com/watch?v=${v.videoId}`;
            return `
            <div class="youtube-card fade-in visible ${isShort ? 'youtube-card--short' : ''}" data-video-id="${v.videoId}">
                <div class="thumb" onclick="playYouTube(this, '${v.videoId}', ${isShort})">
                    <img src="https://img.youtube.com/vi/${v.videoId}/${isShort ? 'hqdefault' : 'mqdefault'}.jpg" alt="${v.title}" loading="lazy" width="${isShort ? 180 : 320}" height="${isShort ? 320 : 180}">
                    <div class="play-btn"><i class="fas fa-play"></i></div>
                    ${isShort ? '<span class="yt-badge-short"><i class="fab fa-youtube"></i> Short</span>' : '<span class="yt-badge-duration"><i class="fas fa-play-circle"></i></span>'}
                </div>
                <div class="yt-info">
                    <div class="yt-title">${v.title}</div>
                    <div class="yt-meta">${v.views ? `<i class="fas fa-eye"></i> ${Number(v.views).toLocaleString()}회` : ''}${v.published ? ` · ${new Date(v.published).toLocaleDateString('ko-KR')}` : ''}</div>
                </div>
            </div>`;
        }).join('');
    };

    /* 썸네일 클릭 → iframe 교체 (페이지 로드 시 성능 보호) */
    window.playYouTube = (el, videoId, isShort) => {
        const card = el.closest('.youtube-card');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('title', card.querySelector('.yt-title')?.textContent || '');
        iframe.style.width = '100%';
        iframe.style.aspectRatio = isShort ? '9/16' : '16/9';
        if (isShort) iframe.style.maxHeight = '400px';
        iframe.style.borderRadius = 'var(--radius-lg)';
        el.replaceWith(iframe);
        track('youtube_play', { video_id: videoId, event_category: 'engagement' });
    };

    const showYouTubePlaceholder = () => {
        /* 프록시 완전 실패 시에도 폴백 데이터로 렌더 */
        renderYouTube(FALLBACK_VIDEOS);
    };

    const initChart = () => {
        const canvas = $('#revenueChart');
        if (!canvas || typeof Chart === 'undefined') return;
        new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['서울 H치과', '서울 C치과', '서울 A치과', '서울 D치과'],
                datasets: [
                    { label: 'Before (만원)', data: [4522, 4566, 5000, 8000], backgroundColor: '#3f3f46', borderColor: '#52525b', borderWidth: 1, borderRadius: 6, borderSkipped: 'bottom' },
                    { label: 'After (만원)', data: [8140, 9791, 13000, 13000], backgroundColor: '#D4A843', borderColor: '#A6853D', borderWidth: 1, borderRadius: 6, borderSkipped: 'bottom' }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { font: { family: "'Inter', 'Noto Sans KR', sans-serif", size: 12, weight: 600 }, padding: 16, usePointStyle: true, pointStyle: 'rectRounded' } },
                    tooltip: { backgroundColor: '#18181B', titleFont: { family: "'Inter', sans-serif", size: 12, weight: 700 }, bodyFont: { family: "'Inter', sans-serif", size: 11 }, padding: 12, cornerRadius: 8, callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y?.toLocaleString() || '-'}만원` } }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false }, ticks: { font: { size: 10, weight: 500 }, color: '#9CA3AF', callback: v => v.toLocaleString() + '만원' }, border: { display: false } },
                    x: { grid: { display: false }, ticks: { font: { size: 11, weight: 600 }, color: '#4B5563' }, border: { display: false } }
                },
                animation: { duration: 1400, easing: 'easeOutQuart' }
            }
        });
    };

    const initBASliders = () => {
        const sliders = $$('.ba-slider');
        sliders.forEach(slider => {
            const handle = slider.querySelector('.ba-slider__handle');
            const beforeBar = slider.querySelector('.ba-slider__before');
            const track = slider.querySelector('.ba-slider__track');
            if (!handle || !beforeBar || !track) return;

            const beforeVal = parseFloat(slider.dataset.before) || 0;
            const afterVal = parseFloat(slider.dataset.after) || 1;

            const updateSlider = (pct) => {
                pct = Math.max(5, Math.min(95, pct));
                handle.style.left = pct + '%';
                beforeBar.style.width = pct + '%';
            };

            let dragging = false;

            const startDrag = (e) => {
                e.preventDefault();
                dragging = true;
                handle.style.transition = 'none';
                beforeBar.style.transition = 'none';
                document.body.style.userSelect = 'none';
            };

            const onDrag = (e) => {
                if (!dragging) return;
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const rect = track.getBoundingClientRect();
                const pct = ((clientX - rect.left) / rect.width) * 100;
                updateSlider(pct);
            };

            const endDrag = () => {
                if (!dragging) return;
                dragging = false;
                handle.style.transition = '';
                beforeBar.style.transition = '';
                document.body.style.userSelect = '';
            };

            handle.addEventListener('mousedown', startDrag);
            handle.addEventListener('touchstart', startDrag, { passive: false });
            window.addEventListener('mousemove', onDrag);
            window.addEventListener('touchmove', onDrag, { passive: false });
            window.addEventListener('mouseup', endDrag);
            window.addEventListener('touchend', endDrag);

            // Keyboard support
            handle.addEventListener('keydown', (e) => {
                const step = 2;
                const current = parseFloat(handle.style.left) || 50;
                if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    updateSlider(current - step);
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    updateSlider(current + step);
                }
            });

            // Animate in on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const initialPct = (beforeVal / afterVal) * 100;
                        beforeBar.style.width = '0%';
                        handle.style.left = '0%';
                        setTimeout(() => {
                            beforeBar.style.transition = 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
                            handle.style.transition = 'left 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
                            updateSlider(initialPct);
                        }, 200);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(slider);
        });
    };

    /* 영상의 특정 시간 프레임을 canvas로 캡처하여 poster 이미지 생성 */
    const initVideoPoster = () => {
        $$('video[data-poster-time]').forEach(video => {
            const seekTime = parseFloat(video.dataset.posterTime) || 3;
            const tempVideo = document.createElement('video');
            tempVideo.crossOrigin = 'anonymous';
            tempVideo.preload = 'metadata';
            tempVideo.muted = true;
            tempVideo.playsInline = true;
            const src = video.querySelector('source')?.src?.split('#')[0] || video.src;
            tempVideo.src = src;

            tempVideo.addEventListener('loadeddata', () => {
                tempVideo.currentTime = Math.min(seekTime, tempVideo.duration - 0.5);
            });
            tempVideo.addEventListener('seeked', () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = tempVideo.videoWidth;
                    canvas.height = tempVideo.videoHeight;
                    canvas.getContext('2d').drawImage(tempVideo, 0, 0);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                    if (dataUrl && dataUrl.length > 100) {
                        video.poster = dataUrl;
                    }
                } catch (e) { /* CORS — 무시하고 기본 프레임 표시 */ }
                tempVideo.src = '';
                tempVideo.load();
            });
        });
    };

    const initFirstStageAutoOpen = () => {
        const firstCard = $('.stage-card[data-stage="1"]');
        if (!firstCard) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        firstCard.classList.add('active');
                        firstCard.setAttribute('aria-expanded', 'true');
                    }, 600);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const stagesGrid = firstCard.closest('.stages-grid');
        if (stagesGrid) observer.observe(stagesGrid);
    };

    const init = () => {
        initScrollProgress();
        initHeader();
        initSmoothScroll();
        initReveal();
        initCountUp();
        initMarquee();
        initStageCards();
        initFunnelTimeline();
        initFAQ();
        initDownloadStats();
        initKnowledgeHub();
        initExitIntent();
        initCursorGlow();
        initBentoTilt();
        initTextSplit();
        initMagneticButtons();
        initStageCounter();
        initBASliders();
        initFirstStageAutoOpen();
        initScrollTracking();
        initSectionTracking();
        initCTATracking();

        Promise.allSettled([fetchBlogPosts(), fetchYouTube()]);

        /* 영상 썸네일: 지정된 시간의 프레임을 poster로 설정 */
        initVideoPoster();

        if (typeof Chart !== 'undefined') { initChart(); }
        else { window.addEventListener('load', () => setTimeout(initChart, 100)); }

        // ai-last-updated 자동 갱신
        const aiMeta = document.querySelector('meta[name="ai-last-updated"]');
        if (aiMeta) { aiMeta.setAttribute('content', new Date().toISOString().split('T')[0]); }
    };

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
    else { init(); }
})();

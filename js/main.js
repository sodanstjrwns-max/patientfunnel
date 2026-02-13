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
    };
    window.closePDFModal = () => {
        const modal = $('#pdfModal');
        if (modal?.classList.contains('active')) { modal.classList.remove('active'); document.body.style.overflow = ''; }
    };
    window.closeExitIntent = () => {
        const modal = $('#exitIntentModal');
        if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
    };
    
    window.downloadGuide = () => {
        window.open(PDF_GUIDE_URL, '_blank');
        openPDFModal();

        try {
            let count = parseInt(localStorage.getItem('pf_dl_count') || '12847');
            count++;
            localStorage.setItem('pf_dl_count', count.toString());
        } catch(e) {}

        if (typeof gtag === 'function') {
            gtag('event', 'guide_download', {
                event_category: 'engagement',
                event_label: 'PDF Guide Download',
                value: 1
            });
        }
    };

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closePDFModal(); closeExitIntent(); } });

    const initExitIntent = () => {
        document.addEventListener('mouseout', (e) => {
            if (exitShown || e.clientY > 5) return;
            exitShown = true;
            const modal = $('#exitIntentModal');
            if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
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

    const fetchBlogPosts = async () => {
        try {
            const rssUrl = 'https://blog.patientfunnel.kr/rss';
            const proxies = [
                `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`,
                `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`,
                `https://api.codetabs.com/v1/proxy?quest=${rssUrl}`
            ];
            let xml = null;
            for (const url of proxies) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 8000);
                    const r = await fetch(url, { signal: controller.signal, mode: 'cors' }).catch(() => null);
                    clearTimeout(timeoutId);
                    if (r?.ok) {
                        let text = await r.text();
                        if (url.includes('/get?')) { try { text = JSON.parse(text).contents; } catch(e) {} }
                        if (text.includes('<item>')) { xml = text; break; }
                    }
                } catch { continue; }
            }
            if (!xml) throw new Error('Proxy failed');

            const doc = new DOMParser().parseFromString(xml, 'text/xml');
            const items = doc.querySelectorAll('item');
            if (!items.length) throw new Error('No items');

            const mapCategory = (raw) => {
                if (!raw) return '블로그';
                const lower = raw.toLowerCase();
                const map = {
                    '환자경험': '환자경험', '환자 경험': '환자경험', 'patient experience': '환자경험',
                    '상담': '상담·전환', '전환': '상담·전환', '상담·전환': '상담·전환', '상담전환': '상담·전환', 'consultation': '상담·전환',
                    'prm': 'PRM', '환자관계': 'PRM', '환자 관계': 'PRM', '관계관리': 'PRM',
                    '직원': '직원·조직', '조직': '직원·조직', '직원·조직': '직원·조직', '팀': '직원·조직', 'team': '직원·조직', 'staff': '직원·조직',
                    '개원': '개원 준비', '개원 준비': '개원 준비', 'opening': '개원 준비',
                    '마케팅': '병원 마케팅', '병원 마케팅': '병원 마케팅', '광고': '병원 마케팅', 'marketing': '병원 마케팅',
                    '경영': '병원 마케팅', '병원경영': '병원 마케팅', '성장': '병원 마케팅'
                };
                for (const [key, val] of Object.entries(map)) {
                    if (lower.includes(key.toLowerCase())) return val;
                }
                return raw;
            };

            blogPosts = Array.from(items).map((item, i) => {
                const desc = (item.querySelector('description')?.textContent || '').replace(/<[^>]*>/g, '').substring(0, 150) + '...';
                const rawCategory = item.querySelector('category')?.textContent || '';
                return {
                    title: item.querySelector('title')?.textContent || '',
                    link: item.querySelector('link')?.textContent || '',
                    summary: desc,
                    category: mapCategory(rawCategory),
                    date: item.querySelector('pubDate')?.textContent || '',
                    readTime: Math.max(5, Math.ceil((item.querySelector('description')?.textContent || '').length / 500)),
                    featured: i === 0
                };
            });
            renderPosts(blogPosts);
        } catch { showPlaceholder(); }
    };

    const showPlaceholder = () => {
        const grid = $('#knowledgeArticles');
        if (!grid) return;
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding: 3rem 1rem;">
                <i class="fas fa-blog" style="font-size:2.5rem; color:var(--gold); margin-bottom:1rem; display:block;"></i>
                <h4 style="margin-bottom:0.5rem;">인블로그에서 최신 콘텐츠를 확인하세요</h4>
                <p style="color:var(--text-dark-secondary); margin-bottom:1.5rem;">병원 경영, 환자 경험 설계, 상담 전환율 향상 등<br>실전 노하우를 공유합니다.</p>
                <a href="https://blog.patientfunnel.kr" target="_blank" rel="noopener" class="btn btn--glow"><i class="fas fa-external-link-alt"></i> 인블로그 바로가기</a>
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
            return `
                <div class="knowledge-card ${isFeatured ? 'featured' : ''} fade-in visible" data-category="${p.category}">
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

    const fetchYouTube = async () => {
        try {
            const channelId = 'UCv5HqXYWzG874tgaOBpJMVw';
            const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
            const proxies = [
                `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`,
                `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`
            ];
            let xml = null;
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);
            for (const url of proxies) {
                try {
                    const r = await fetch(url, { signal: controller.signal, mode: 'cors' }).catch(() => null);
                    if (r?.ok) { xml = await r.text(); break; }
                } catch { continue; }
            }
            clearTimeout(timeout);
            if (!xml) throw new Error('Proxy failed');

            const doc = new DOMParser().parseFromString(xml, 'text/xml');
            const entries = doc.querySelectorAll('entry');
            if (!entries.length) throw new Error('No entries');

            const videos = Array.from(entries).slice(0, 6).map(entry => {
                const videoId = entry.querySelector('videoId')?.textContent || entry.querySelector('id')?.textContent?.split(':').pop() || '';
                return { title: entry.querySelector('title')?.textContent || '', videoId, thumb: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, published: entry.querySelector('published')?.textContent || '' };
            });
            renderYouTube(videos);
        } catch { showYouTubePlaceholder(); }
    };

    const renderYouTube = (videos) => {
        const grid = $('#youtubeVideos');
        if (!grid) return;
        grid.innerHTML = videos.map(v => `
            <a href="https://www.youtube.com/watch?v=${v.videoId}" target="_blank" rel="noopener" class="youtube-card fade-in visible">
                <div class="thumb"><img src="${v.thumb}" alt="${v.title}" loading="lazy" width="320" height="180"><div class="play-btn"><i class="fas fa-play-circle"></i></div></div>
                <div class="yt-info"><div class="yt-title">${v.title}</div><div class="yt-meta">${v.published ? new Date(v.published).toLocaleDateString('ko-KR') : ''}</div></div>
            </a>`).join('');
    };

    const showYouTubePlaceholder = () => {
        const grid = $('#youtubeVideos');
        if (!grid) return;
        grid.innerHTML = `<div class="loading-state" style="grid-column:1/-1"><p>YouTube 채널에서 직접 영상을 확인하세요.</p><a href="https://www.youtube.com/channel/UCv5HqXYWzG874tgaOBpJMVw" target="_blank" rel="noopener" class="btn btn--outline" style="margin-top:1rem"><i class="fab fa-youtube"></i> YouTube 채널 바로가기</a></div>`;
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

        Promise.allSettled([fetchBlogPosts(), fetchYouTube()]);

        if (typeof Chart !== 'undefined') { initChart(); }
        else { window.addEventListener('load', () => setTimeout(initChart, 100)); }

        // ai-last-updated 자동 갱신
        const aiMeta = document.querySelector('meta[name="ai-last-updated"]');
        if (aiMeta) { aiMeta.setAttribute('content', new Date().toISOString().split('T')[0]); }
    };

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
    else { init(); }
})();

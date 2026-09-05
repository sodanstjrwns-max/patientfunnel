/* ============================================================
   Patient Journey OS — Interactive 10-Stage Explorer
   Click / keyboard navigation + auto-advance carousel
   ============================================================ */
(function () {
    'use strict';

    var STAGES = [
        { name: '인지', en: 'AWARENESS', color: '#22D3EE',
          desc: '환자가 병원의 존재를 처음 알게 되는 순간입니다. 검색, SNS, 간판, 그리고 가장 강력한 채널인 \'지인의 소개\'까지 — 광고비가 아니라 구조로 발견되는 병원을 만듭니다.',
          lever: '핵심 레버 — 소개 기반 유입 구조 · 광고 의존도 축소' },
        { name: '관심', en: 'INTEREST', color: '#3CB9F0',
          desc: '병원을 알게 된 환자가 블로그, 리뷰, 홈페이지를 살펴보며 \'여기 믿을 만한가?\'를 판단하는 단계입니다. 콘텐츠와 후기가 신뢰의 첫 관문이 됩니다.',
          lever: '핵심 레버 — 신뢰 콘텐츠 · 온라인 평판 관리' },
        { name: '예약', en: 'BOOKING', color: '#5D9DF5',
          desc: '전화 응대 30초가 예약 전환을 결정합니다. 문의가 예약으로, 예약이 실제 방문으로 이어지는 전환 스크립트와 리마인드 시스템을 설계합니다.',
          lever: '핵심 레버 — 전화 응대 스크립트 · 노쇼 방지 시스템' },
        { name: '방문', en: 'VISIT', color: '#7F82F8',
          desc: '병원 문을 여는 순간부터 환자 경험이 시작됩니다. 첫인사, 동선, 안내 — 첫 7초의 인상이 이후 모든 진료의 신뢰 기반을 만듭니다.',
          lever: '핵심 레버 — 첫인상 MOT 설계 · 웰컴 프로세스' },
        { name: '대기', en: 'WAITING', color: '#A78BFA',
          desc: '대기 시간은 버리는 시간이 아니라 신뢰를 쌓는 시간입니다. 대기 경험을 설계하면 같은 10분도 \'배려받은 10분\'이 됩니다.',
          lever: '핵심 레버 — 대기 경험 설계 · 사전 정보 제공' },
        { name: '진단', en: 'DIAGNOSIS', color: '#C084FC',
          desc: '환자가 자신의 상태를 정확히 이해할 때 치료 결정이 쉬워집니다. 눈에 보이는 설명과 데이터 기반 진단이 상담 동의율의 토대가 됩니다.',
          lever: '핵심 레버 — 시각화 설명 · 서울대병원 수준 진단 시스템' },
        { name: '상담', en: 'CONSULTATION', color: '#E879A9',
          desc: '설득이 아니라 이해를 돕는 상담. 환자의 상황과 우선순위에 맞춘 상담 설계로 강요 없는 동의를 만들어냅니다.',
          lever: '핵심 레버 — 상담 프로세스 표준화 · 동의율 개선' },
        { name: '진료', en: 'TREATMENT', color: '#FB7185',
          desc: '진료의 질은 기본, 진료 중 경험은 차별화 포인트입니다. 통증·불안 관리와 진행 상황 공유가 \'잘하는 병원\'을 \'다시 오고 싶은 병원\'으로 바꿉니다.',
          lever: '핵심 레버 — 진료 중 커뮤니케이션 · 감염관리 신뢰' },
        { name: '관리', en: 'FOLLOW-UP', color: '#F2B488',
          desc: '진료가 끝난 후가 진짜 시작입니다. 사후 케어 연락, 리콜 시스템, 정기검진 설계로 환자가 \'관리받고 있다\'고 느끼게 만듭니다.',
          lever: '핵심 레버 — PRM · 리콜 시스템 · 재방문율 상승' },
        { name: '소개', en: 'REFERRAL', color: '#F5D98C',
          desc: '팬이 된 환자는 가족과 지인을 데려옵니다. 소개가 자연스럽게 일어나는 구조를 만들면, 광고 없이도 신환이 늘어나는 선순환이 완성됩니다.',
          lever: '핵심 레버 — 소개 환자 2배 · 광고비 의존 탈출' }
    ];

    var AUTO_MS = 5000;

    function init() {
        var rail = document.getElementById('journeyRail');
        var detail = document.getElementById('journeyDetail');
        if (!rail || !detail) return;

        var nodes = rail.querySelectorAll('.journey-node');
        var trackFill = document.getElementById('journeyTrackFill');
        var elNum = document.getElementById('jdNum');
        var elName = document.getElementById('jdName');
        var elEn = document.getElementById('jdEn');
        var elDesc = document.getElementById('jdDesc');
        var elLever = document.getElementById('jdLever');
        var elProgress = document.getElementById('jdProgress');

        var current = 0;
        var timer = null;
        var paused = false;
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function render(idx) {
            var s = STAGES[idx];
            current = idx;

            nodes.forEach(function (btn, i) {
                btn.classList.toggle('is-active', i === idx);
                btn.classList.toggle('is-passed', i < idx);
                btn.setAttribute('aria-pressed', i === idx ? 'true' : 'false');
            });

            if (trackFill) trackFill.style.width = (idx === 0 ? 5 : (idx / 9) * 100) + '%';

            detail.style.setProperty('--jd-color', s.color);
            elNum.textContent = (idx + 1 < 10 ? '0' : '') + (idx + 1);
            elName.textContent = s.name;
            elEn.textContent = s.en;
            elDesc.textContent = s.desc;
            elLever.querySelector('span').textContent = s.lever;

            // swap animation
            detail.classList.remove('is-switching');
            void detail.offsetWidth;
            detail.classList.add('is-switching');

            // progress bar restart
            if (elProgress) {
                elProgress.classList.remove('is-running');
                void elProgress.offsetWidth;
                if (!paused && !reduceMotion) {
                    elProgress.style.setProperty('--jd-dur', AUTO_MS + 'ms');
                    elProgress.classList.add('is-running');
                }
            }
        }

        function next() { render((current + 1) % STAGES.length); }

        function startAuto() {
            if (reduceMotion) return;
            stopAuto();
            timer = setInterval(function () { if (!paused) next(); }, AUTO_MS);
        }
        function stopAuto() {
            if (timer) { clearInterval(timer); timer = null; }
        }

        nodes.forEach(function (btn) {
            btn.addEventListener('click', function () {
                render(parseInt(btn.dataset.stage, 10) || 0);
                startAuto(); // reset the clock after manual interaction
            });
        });

        // Pause on hover/focus so users can read
        var root = document.getElementById('journey-explorer');
        if (root) {
            root.addEventListener('mouseenter', function () {
                paused = true;
                if (elProgress) elProgress.classList.remove('is-running');
            });
            root.addEventListener('mouseleave', function () {
                paused = false;
                render(current);
            });
        }

        // Pause when tab hidden (battery friendly)
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stopAuto(); else startAuto();
        });

        render(0);
        startAuto();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

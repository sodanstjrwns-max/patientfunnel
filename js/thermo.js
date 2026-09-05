/* ================================================================
   PATIENT FUNNEL — "마음의 온도" THERMO Engine v1.0 (2026)
   ----------------------------------------------------------------
   퍼널 컨셉 × 마음의 온도:
   환자가 퍼널을 따라 내려갈수록(페이지 스크롤) 마음의 온도는
   36.5° → 99.9°로 데워지고, 페이지의 하루는 아침 → 밤으로 깊어집니다.
   - 스크롤 비율에 따라 <html data-phase="0~4"> 토글 (thermo.css가 착색)
   - 좌하단 온도 게이지 실시간 갱신
   ================================================================ */
'use strict';

(() => {

const PHASES = [
    { at: 0.00, name: '첫 만남' },   // 아침 종이빛 — 인지·관심
    { at: 0.18, name: '관심' },      // 오후 — 예약·방문
    { at: 0.40, name: '신뢰' },      // 노을 — 진단·상담·스토리
    { at: 0.62, name: '확신' },      // 황혼 — 진료·사례·웨비나
    { at: 0.82, name: '팬이 되다' }  // 밤 — 관리·소개·FAQ·컨택
];

const TEMP_MIN = 36.5;
const TEMP_MAX = 99.9;

// 게이지 색: 서늘한 그린 → 앰버 → 웜 레드
const HUES = ['#0E5B43', '#8A7A22', '#C99A2E', '#CE6E2B', '#C4502F'];

function init() {
    const root = document.documentElement;
    const gauge = document.getElementById('thermoGauge');
    const valueEl = document.getElementById('thermoValue');
    const barEl = document.getElementById('thermoBarFill');
    const phaseEl = document.getElementById('thermoPhase');

    let currentPhase = -1;
    let ticking = false;

    const update = () => {
        ticking = false;
        const h = root;
        const max = Math.max(1, h.scrollHeight - h.clientHeight);
        const ratio = Math.min(1, Math.max(0, h.scrollTop / max));

        // 1) phase 산출
        let phase = 0;
        for (let i = PHASES.length - 1; i >= 0; i--) {
            if (ratio >= PHASES[i].at) { phase = i; break; }
        }
        if (phase !== currentPhase) {
            currentPhase = phase;
            root.setAttribute('data-phase', String(phase));
            if (phaseEl) phaseEl.textContent = PHASES[phase].name;
            if (gauge) gauge.style.setProperty('--thermo-hue', HUES[phase]);
        }

        // 2) 온도 값
        const temp = TEMP_MIN + (TEMP_MAX - TEMP_MIN) * ratio;
        if (valueEl) valueEl.textContent = temp.toFixed(1) + '°';
        if (barEl) barEl.style.width = (ratio * 100).toFixed(1) + '%';

        // 3) 게이지 노출 (히어로 상단 5% 이후)
        if (gauge) gauge.classList.toggle('is-visible', ratio > 0.03);
    };

    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

})();

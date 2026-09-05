/* ============================================================
   Column Publish Gate — 발행일 기반 자동 노출
   ------------------------------------------------------------
   data-publish="YYYY-MM-DD" 속성이 붙은 요소를 검사해,
   발행일이 아직 오지 않은(미래) 글은 목록에서 숨긴다.
   기준 시각: 한국 표준시(KST, Asia/Seoul) — 발행일 자정부터 노출.
   JS가 꺼진 환경(검색엔진 크롤러 포함)에서는 전부 노출되므로
   SEO 색인에는 영향이 없다 (progressive enhancement).
   ============================================================ */
(function () {
    'use strict';

    var todayKST;
    try {
        // en-CA 로케일은 YYYY-MM-DD 포맷을 반환 → ISO 문자열 비교 가능
        todayKST = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
    } catch (e) {
        // Intl/timeZone 미지원 환경: 로컬 날짜로 폴백
        var d = new Date();
        todayKST = d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0');
    }

    var entries = document.querySelectorAll('[data-publish]');
    for (var i = 0; i < entries.length; i++) {
        var el = entries[i];
        var pub = el.getAttribute('data-publish');
        if (pub && pub > todayKST) {
            el.style.display = 'none';
            el.setAttribute('aria-hidden', 'true');
        }
    }

    /* data-gate-max="N" 컨테이너: 게이트 통과한 글 중 최신 N개만 노출
       (메인 페이지 피드처럼 '최신 3편'만 보여줘야 하는 곳에 사용) */
    var capped = document.querySelectorAll('[data-gate-max]');
    for (var c = 0; c < capped.length; c++) {
        var box = capped[c];
        var max = parseInt(box.getAttribute('data-gate-max'), 10);
        if (!max || max < 1) { continue; }
        var items = box.querySelectorAll('[data-publish]');
        var shown = 0;
        for (var k = 0; k < items.length; k++) {
            if (items[k].style.display === 'none') { continue; }
            shown++;
            if (shown > max) {
                items[k].style.display = 'none';
                items[k].setAttribute('aria-hidden', 'true');
            }
        }
    }
})();

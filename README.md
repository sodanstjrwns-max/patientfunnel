# Patient Funnel — 병원 성장의 OS

환자 경험 중심 10단계 병원 경영 시스템 | NOVA Design System v7.1

## 🌐 Production

- **도메인**: https://patientfunnel.kr (Cloudflare DNS → `cuwfhgxi.gensparkspace.com`)
- **배포**: https://cuwfhgxi.gensparkspace.com

## 📁 파일 구조 (7 files, ~276KB total)

```
index.html          ~88 KB   메인 랜딩 페이지
css/style.css       ~64 KB   NOVA Design System 7.1
js/main.js          ~31 KB   인터랙티브 JS (vanilla)
images/og-image.jpg ~100 KB  OG 이미지 (SNS 공유용)
sitemap.xml          ~0.7 KB 사이트맵
robots.txt           ~1.7 KB 검색엔진 크롤링 규칙
README.md            현재 파일
```

## ✅ 구현 완료 기능

### 디자인 & UI
- NOVA Design System 7.1 (Dark/Light Hybrid, Glassmorphism, Gold Branding)
- 커서 글로우 이펙트 (Hero), 3D 틸트 카드, 마그네틱 버튼
- 시네마틱 Hero (메쉬 애니메이션, 노이즈 오버레이, 무빙 그리드)
- 카운트업 숫자 애니메이션, 스크롤 프로그레스 바
- 텍스트 쉬머 (Gold Gradient), 인피니트 마키 (후기 + 과목 아이콘)
- 반응형 (1024px / 768px / 480px), 프린트 스타일

### 섹션 구성 (9개 독립 section + Hero)
1. **Hero** — 핵심 메트릭 벤토 그리드, 듀얼 CTA
2. **Social Proof (H2)** — 6,000+ 숫자, 6개 후기 마키, 12개 과목 아이콘 스크롤 + Pain Points (H3)
3. **10-Step Framework (H2)** — 인터랙티브 타임라인 + 10개 아코디언 카드 (H3 ×10)
4. **Knowledge Hub (H2)** — RSS 블로그 연동 (7개 카테고리 필터, 검색)
5. **Founder Story (H2)** — 타임라인 4블록 (H3 ×4) + 비디오 카드 + 프로필 (H3)
6. **Case Studies (H2)** — Before/After 슬라이더 4개 + 차트 (H3) + 비디오 후기 (H3) + YouTube (H3)
7. **Webinar (H2)** — 핵심 질문 (H4 ×3) + 학습 항목 (H4 ×4) + 타깃 (H3) + CTA + 코칭 + 전자책 (H3)
8. **FAQ (H2)** — 9개 아코디언 (span.faq-question, heading 아님)
9. **Contact (H3)** — 이메일 + 웨비나 CTA

### H태그 계층 구조 (최종)
```
H1 (1개): 환자 경험 중심 10단계 병원 경영 시스템 — Patient Funnel
├─ H2 (7개): proof, framework, knowledge, about, cases, webinar, faq
│  ├─ H3 (22개): pain(1), stages(10), stories(4), founder-name(1), chart(1), videos(1), youtube(1), target(1), resources(1), 웨비나 핵심(1)
│  │  └─ H4 (10개): question-card(3), learn-item(4), target-yes/no(2), coaching(1)
└─ H3 (1개): contact (마무리 CTA)
Footer/Modal: heading 없음 ✅
```

### SEO / AEO (2026-02-12 업데이트)

#### 구조화 데이터 (JSON-LD 13개)
1. Organization + EducationalOrganization (듀얼 타입)
2. WebSite
3. WebPage + SpeakableSpecification
4. Person (창립자 문석준)
5. HowTo (10단계 프레임워크)
6. FAQPage (9개 Q&A)
7. Service + AggregateRating (4.9/5, 127건) + Review 4건 + OfferCatalog 3개
8. Course (무료 웨비나)
9. Course (올인원 클래스)
10. Event (웨비나 이벤트)
11. VideoObject (창립자 인터뷰)
12. ItemList (성과 사례 4건)
13. BreadcrumbList (5단계)

#### AEO 시그널 (14개 ai-* 메타)
- ai-content-declaration, ai-summary, ai-keywords, ai-category
- ai-target-audience, ai-content-type, ai-expertise-level
- ai-trust-signals, ai-quick-answer, ai-related-queries, ai-last-updated

#### SEO 기본
- Open Graph + Twitter Card + Canonical + Hreflang (ko-KR, x-default)
- Google/Bing 인증, sitemap.xml (이미지 포함), robots.txt (30+ AI봇 허용)
- 시멘틱 HTML5 (`<main>`, `<header>`, `<nav>`, `<section>`, `<article>`, `<footer>`)
- ARIA 레이블, 키보드 접근성, skip-link, sr-only 클래스

### 인터랙션
- Sticky 숫자 카운터 (10단계 진행 상황 실시간 표시)
- Before/After 드래그 슬라이더 (마우스/터치/키보드)
- 플로팅 CTA (스크롤 800px 후 표시)
- PDF 다운로드 모달 + Exit Intent 모달
- 풀스크린 모바일 메뉴

### 폰트 최적화
- Critical CSS 인라인 @font-face (font-display: swap)
- Google Fonts 비동기 로딩 (media="print" → onload="all")
- Font Awesome 비동기 로딩

## 🔗 주요 URI

| 페이지 | URL |
|--------|-----|
| 메인 | https://patientfunnel.kr |
| 무료 웨비나 | https://dentalfunnel.liveklass.com/ |
| PF Index | https://pfindex.kr/ |
| 미스테리 쇼퍼 | http://patientview.kr/ |
| 덴탈 커넥트 | https://dentalconnet.com/ |
| 블로그 | https://blog.patientfunnel.kr |
| YouTube | https://www.youtube.com/channel/UCv5HqXYWzG874tgaOBpJMVw |
| 카카오톡 | https://pf.kakao.com/_xkxnMn |
| 이메일 | contact@patientfunnel.kr |

## 🏗️ 호스팅 구조

```
Cloudflare DNS (patientfunnel.kr)
  ├─ CNAME @ → cuwfhgxi.gensparkspace.com (Proxied)
  ├─ CNAME www → cuwfhgxi.gensparkspace.com (Proxied)
  ├─ MX → mailapp.hiworks.co.kr (DNS only)
  └─ TXT → v=spf1 include:_spf.hiworks.co.kr ~all (DNS only)
```

## 📝 SEO/AEO 최적화 이력

### H태그 구조 개편 (v7.1)
- H1 키워드 강화: "환자 경험 중심 10단계 병원 경영 시스템 — Patient Funnel"
- H2 축소: 13개 → 7개 (독립 섹션 1:1 대응)
- H3 정리: 고아 H3 제거 (#videos, #youtube → cases 내부 / #target, #resources → webinar 내부)
- H4 정리: FAQ 버튼 H4 → span.faq-question / Footer H3/H4 → strong/span
- DOM 순서 최적화: #target을 H2 webinar 뒤로 이동하여 H3→H2 역순 해소
- sr-only H3 추가: 웨비나 H4들의 레벨 스킵(H2→H4) 해소
- CSS 셀렉터 12개 업데이트 (태그 → 클래스 셀렉터)

### 구조화 데이터 확장
- 기존 7개 → 13개 스키마 (Course ×2, Event, VideoObject, ItemList, BreadcrumbList, Review 4건 추가)
- Organization → EducationalOrganization 듀얼 타입
- Service 대폭 보강 (OfferCatalog, Audience, Review)

### 시멘틱 마크업 개선
- `<main id="main">` 추가 (skip-link 타겟)
- 독립 section 12개 → 9개 (병합 최적화)
- 모든 footer/modal heading → non-heading 요소로 교체

## 🚀 권장 다음 단계

1. **성능**: 셀프 호스팅 폰트 (woff2), Service Worker 캐싱
2. **전환**: 카카오톡 플로팅 CTA 추가, 긴급성 카운터 (잔여석/마감일)
3. **분석**: Google Analytics 4, Hotjar/Clarity 히트맵
4. **콘텐츠**: 블로그 RSS 프록시 안정화, 추가 사례 확보
5. **A/B 테스트**: CTA 문구/색상/위치 실험
6. **Event 스키마**: 웨비나 날짜를 자동 업데이트하는 메커니즘 구현

---
© 2024-2026 Patient Funnel · 서울비디치과 · 문석준

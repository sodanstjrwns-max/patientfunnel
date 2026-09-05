/* ============================================================
   Patient Funnel Blog — Posts Registry (SEO Hub)
   블로그 목록 · Knowledge Hub · 관련 글 추천의 단일 데이터 소스
   ============================================================ */
const BLOG_POSTS = [
    {
        slug: 'hospital-management-complete-guide',
        title: '병원 경영 완벽 가이드 (2026) — 진료 실력과 경영 실력은 다른 과목입니다',
        category: '병원 경영',
        description: '병원 경영의 전체 지도를 한 장에 담았습니다. 환자 여정 10단계 퍼널 맵, 4대 기둥(환자 경험·직원 조직·데이터 KPI·마케팅 재무), 그리고 오늘부터 시작하는 실행 계획까지 — 병원 경영 필라 가이드.',
        keywords: ['병원 경영', '병원 경영 가이드', '병원 경영 시스템', '병원 경영 컨설팅', '페이션트 퍼널'],
        date: '2026-07-07',
        readTime: 15,
        icon: 'fa-map',
        accent: '#E0B756',
        pillar: true
    },
    {
        slug: 'dental-clinic-management-guide',
        title: '치과 경영 완벽 가이드 (2026) — 월 6천에서 연 120억, 제가 겪은 전 과정',
        category: '병원 경영',
        description: '치과 경영이 일반 병원 경영과 다른 이유: 고관여 진료, 상담실장, 리콜 사이클. 신환 → 동의율 → 리콜·소개 → 숫자 경영 순서로 정리한 치과 경영 필라 가이드.',
        keywords: ['치과 경영', '치과 경영 가이드', '치과 경영 컨설팅', '치과 매출', '치과 신환'],
        date: '2026-07-07',
        readTime: 15,
        icon: 'fa-tooth',
        accent: '#5B8DEF',
        pillar: true
    },
    {
        slug: 'dental-marketing-guide',
        title: '치과 마케팅 완벽 가이드 (2026) — 광고비 안 태우고 신환 늘리는 순서',
        category: '병원 마케팅',
        description: '치과 마케팅은 채널 순서가 전부입니다. 플레이스 → 콘텐츠 → 소유 트래픽 → 소개 → 유료 광고 순서, 대행사 선택 3원칙, 90일 실행 로드맵, 의료법 27조 체크까지 담은 치과 마케팅 필라 가이드.',
        keywords: ['치과 마케팅', '치과 광고', '치과 신환 마케팅', '네이버 플레이스', '치과 마케팅 대행사'],
        date: '2026-07-07',
        readTime: 15,
        icon: 'fa-bullhorn',
        accent: '#E2574C',
        pillar: true
    },
    {
        slug: 'hospital-self-diagnosis-checklist',
        title: '병원 경영 자가진단 22문항 — 다 고치려는 원장이 아무것도 못 고칩니다',
        category: '병원 경영',
        description: '병원 경영의 문제는 느낌이 아니라 문항으로 진단해야 합니다. 퍼널 10단계를 22개 질문으로 쪼갠 자가진단 체크리스트와, 22개 중 딱 1개만 골라 고치는 우선순위 원칙까지 공개합니다.',
        keywords: ['병원 경영 진단', '병원 자가진단', '병원 경영 체크리스트', '페이션트 퍼널', '치과 경영 진단'],
        date: '2026-07-03',
        readTime: 13,
        icon: 'fa-list-check',
        accent: '#E0B756'
    },
    {
        slug: 'hospital-phone-consultation-tips',
        title: '병원 전화 응대 매뉴얼 — \'와보셔야 알아요\'가 환자를 옆 병원으로 보냅니다',
        category: '상담·전환',
        description: '전화 1통의 원가는 10만원이 넘습니다. 인사→공감→가치→예약 제안의 4단계 멘트 설계로, 가격만 묻고 끊는 전화를 예약으로 바꾸는 전화 응대 매뉴얼의 전체 구조를 공개합니다.',
        keywords: ['병원 전화 응대', '치과 전화 응대 매뉴얼', '전화 예약 전환율', '데스크 응대', '전화 응대 멘트'],
        date: '2026-07-03',
        readTime: 13,
        icon: 'fa-phone-volume',
        accent: '#22D3EE'
    },
    {
        slug: 'hospital-waiting-room-design',
        title: '병원 대기실 인테리어보다 중요한 것 — 환자의 시선 동선을 설계하라',
        category: '환자경험',
        description: '수억 들인 인테리어보다 환자가 앉은 자리에서 보이는 3~4곳의 시선 황금자리가 중요합니다. 대기 시간의 기대 관리와 시선 동선 설계로 대기실을 신뢰 축적 공간으로 바꾸는 법.',
        keywords: ['병원 대기실', '병원 인테리어', '시선 동선', '환자 대기 시간', '병원 공간 설계'],
        date: '2026-07-03',
        readTime: 12,
        icon: 'fa-couch',
        accent: '#34D399'
    },
    {
        slug: 'treatment-explanation-report',
        title: '진료 설명 잘하는 법 — 설명은 치료의 완성입니다',
        category: '환자경험',
        description: '아무리 좋은 치료도 환자가 인지하지 못하면 존재하지 않는 것과 같습니다. 설명 3원칙과 4줄 진료 리포트로, 환자가 받은 치료의 가치를 체감하게 만드는 커뮤니케이션 설계법.',
        keywords: ['진료 설명', '진료 리포트', '환자 커뮤니케이션', '치료 설명 방법', '환자 설명'],
        date: '2026-07-03',
        readTime: 13,
        icon: 'fa-file-medical',
        accent: '#8B5CF6'
    },
    {
        slug: 'hospital-mission-vision-values',
        title: '병원 미션·비전·핵심가치 만들기 — 액자 속 문장이 아니라 판단의 기준입니다',
        category: '직원·조직',
        description: '미션은 벽에 거는 장식이 아니라 미션과 매출이 충돌하는 순간의 판단 기준입니다. \'필요한 진료를 받지 못하는 사람이 없도록 하자\'가 실제 운영에서 작동하는 수립 4단계를 공개합니다.',
        keywords: ['병원 미션', '병원 비전', '핵심가치', '병원 경영 철학', '병원 조직문화'],
        date: '2026-07-03',
        readTime: 13,
        icon: 'fa-compass',
        accent: '#FB7185'
    },
    {
        slug: 'doctor-as-ceo-role',
        title: '개원의는 의사이자 사장입니다 — 진료만 하는 원장의 병원은 자라지 않습니다',
        category: '병원 경영',
        description: '진료의자에 묶인 원장은 병원에서 가장 비싼 직원일 뿐입니다. 주 4시간의 사장의 시간 확보와 위임 4단계로, 원장 없이도 돌아가는 병원 시스템을 만드는 법을 공개합니다.',
        keywords: ['개원의 경영', '원장 역할', '의사 사장', '병원 위임', '원장 리더십'],
        date: '2026-07-03',
        readTime: 13,
        icon: 'fa-user-tie',
        accent: '#FFB547'
    },
    {
        slug: 'hospital-content-marketing-blog-youtube',
        title: '병원 콘텐츠 마케팅 — 광고는 멈추면 끝나지만 콘텐츠는 쌓입니다',
        category: '병원 마케팅',
        description: '블로그 대행에 3,600만원을 쓰고 배운 교훈 — 콘텐츠는 외주가 아니라 자산입니다. ZMOT을 장악하는 콘텐츠 주제 선정법과 글 1편을 4곳에 재활용하는 시스템을 공개합니다.',
        keywords: ['병원 콘텐츠 마케팅', '병원 블로그 운영', '병원 유튜브', '의료 콘텐츠', 'ZMOT'],
        date: '2026-07-03',
        readTime: 13,
        icon: 'fa-pen-nib',
        accent: '#6366F1'
    },
    {
        slug: 'dental-consultation-manager-skills',
        title: '치과 상담실장의 역할 — 상담은 설득이 아니라 니즈를 읽는 일입니다',
        category: '상담·전환',
        description: '동의율이 낮은 건 말솜씨가 아니라 환자의 진짜 망설임(페이션트 코드)을 못 읽었기 때문입니다. 두려움·비용·불신·시간 4가지 코드별 대응 설계로 상담 전환율을 올리는 법.',
        keywords: ['치과 상담실장', '상담실장 역할', '상담 동의율', '환자 니즈 파악', '병원 상담 시스템'],
        date: '2026-07-03',
        readTime: 13,
        icon: 'fa-user-nurse',
        accent: '#E0B756'
    },
    {
        slug: 'patient-fan-loyalty-strategy',
        title: '환자를 팬으로 만드는 법 — 만족한 환자는 조용하지만, 팬은 말하고 다닙니다',
        category: '환자경험',
        description: '만족은 기대를 채운 것, 팬은 기대를 넘어선 순간에 태어납니다. 기대가 0인 지점에 감동을 심는 설계로, 신환 44명 중 32명(73%)이 소개로 오는 구조를 만든 방법을 공개합니다.',
        keywords: ['환자 팬 만들기', '환자 충성도', '병원 단골 환자', '환자 만족도', '평생 환자'],
        date: '2026-07-03',
        readTime: 12,
        icon: 'fa-heart',
        accent: '#FB7185'
    },
    {
        slug: 'naver-place-local-seo',
        title: '병원 네이버 플레이스 최적화 — 지도 위의 우리 병원은 24시간 일하는 데스크입니다',
        category: '병원 마케팅',
        description: '환자의 병원 탐색은 네이버 지도에서 시작됩니다. 플레이스 정보 완성도, 리뷰 답글 4단계 공식, 굿하트의 법칙을 피하는 리뷰 관리까지 — 로컬 SEO의 실전 체크리스트를 공개합니다.',
        keywords: ['네이버 플레이스 최적화', '병원 플레이스 관리', '치과 네이버 지도', '병원 리뷰 관리', '로컬 SEO'],
        date: '2026-07-03',
        readTime: 12,
        icon: 'fa-map-location-dot',
        accent: '#34D399'
    },
    {
        slug: 'patient-referral-system',
        title: '소개 환자 늘리는 법 — 지인의 소개는 지구상에서 가장 강력한 사회적 증거입니다',
        category: 'PRM',
        description: '소개 환자는 신뢰 버프를 갖고 마음의 온도 90도로 들어옵니다. 소개율은 병원의 건강검진 수치 — 그런데 소개만 받으면 안 되는 이유(고정비·통제 불가)까지, 소개 시스템의 전체 구조를 공개합니다.',
        keywords: ['소개 환자', '사회적 증거', '마음의 온도', '치과 소개 환자 늘리기', '환자 소개 시스템'],
        date: '2026-07-02',
        readTime: 13,
        icon: 'fa-hand-holding-heart',
        accent: '#FB7185'
    },
    {
        slug: 'hospital-no-show-prevention',
        title: '병원 노쇼 줄이는 법 — 노쇼는 예약과 방문 사이에 마음이 식은 것입니다',
        category: '병원 경영',
        description: '노쇼는 환자의 무례함이 아니라 마음의 온도가 식었다는 신호입니다. 기대를 심는 예약 확정 멘트, 리마인드 3단계, 조용한 노쇼를 사전 변경으로 바꾸는 설계로 부도율을 5%대로 낮추는 법.',
        keywords: ['병원 노쇼', '예약 부도', '노쇼 방지', '마음의 온도', '예약 리마인드 문자'],
        date: '2026-07-02',
        readTime: 12,
        icon: 'fa-calendar-xmark',
        accent: '#22D3EE'
    },
    {
        slug: 'hospital-homepage-conversion',
        title: '병원 홈페이지 전환율 — "봤으면 알아서 전화하겠지"는 마케팅이 아니라 기도입니다',
        category: '병원 마케팅',
        description: '노출은 시작이지 성과가 아닙니다. "이걸 본 사람이 그다음에 뭘 할까?"가 빠진 홈페이지는 1,200명이 들어와도 10초 안에 나갑니다. "문의주세요" 대신 문의해야 할 이유를 주는 여정 설계법.',
        keywords: ['병원 홈페이지', '홈페이지 예약 전환율', 'CTA', '환자 여정 설계', 'ZMOT'],
        date: '2026-07-02',
        readTime: 12,
        icon: 'fa-laptop-medical',
        accent: '#8B5CF6'
    },
    {
        slug: 'hospital-kpi-dashboard',
        title: '병원 KPI 대시보드 — 감으로 경영하는 건 계기판 없이 안갯속을 비행하는 것입니다',
        category: '병원 경영',
        description: '"노출수 3만 건" 대신 "의도 있는 클릭 30건" — 지표의 언어를 바꾸세요. 퍼널 단계별 5대 지표(문의→예약→내원→동의→소개)와 엑셀로 시작하는 대시보드, 사람을 탓하지 않는 데이터 문화까지.',
        keywords: ['병원 KPI', '병원 경영 지표', '데이터 기반 경영', '상담 동의율', '병원 대시보드'],
        date: '2026-07-02',
        readTime: 13,
        icon: 'fa-gauge-high',
        accent: '#34D399'
    },
    {
        slug: 'hospital-marketing-strategy-2026',
        title: '병원 마케팅 전략 완벽 가이드 (2026) — 제가 1억 4,400만원을 날리고 배운 것',
        category: '병원 마케팅',
        description: '마케팅은 나를 알리기 위한 모든 행위입니다. 블로그 대행 3,600만원, 버스광고 2,400만원, 컨설팅 8,400만원을 날리고 배운 것 — 마케팅·광고·콘텐츠·브랜드·브랜딩 5개 용어와 미션의 힘.',
        keywords: ['병원 마케팅', '병원 마케팅 전략', '병원 홍보 방법', '의료 마케팅', '치과 마케팅'],
        date: '2026-06-28',
        readTime: 14,
        icon: 'fa-bullhorn',
        accent: '#E0B756',
        featured: true
    },
    {
        slug: 'dental-new-patient-acquisition',
        title: '치과 신환 늘리는 법 — 입지가 아니라 인지가 없는 겁니다',
        category: '병원 마케팅',
        description: '환자의 검색 결과에 없으면 존재하지 않는 병원입니다. 반경 1km 인지율 5%의 진실, 고관여(자동차)/저관여(껌) 진료의 차이, 검색 여정 길목에 콘텐츠를 까는 법 — 입지는 운, 인지는 설계입니다.',
        keywords: ['치과 신환 늘리기', '병원 인지도', '고관여 진료', '검색 여정', '신환 유입'],
        date: '2026-06-24',
        readTime: 13,
        icon: 'fa-user-plus',
        accent: '#22D3EE'
    },
    {
        slug: 'consultation-conversion-rate',
        title: '상담 동의율 높이는 법 — 동의는 점이 아니라 선입니다',
        category: '상담·전환',
        description: '"이 병원에서 해야겠다"는 순간은 상담실에 없습니다. 검색·전화·대기·진단에서 마음의 온도가 1도씩 쌓여 동의가 됩니다. 0도 환자를 억지로 끓이면 취소 전화로 돌아오는 이유, A병원/B병원 비교.',
        keywords: ['상담 동의율', '상담 전환율', '마음의 온도', 'ZMOT', '호혜성의 법칙'],
        date: '2026-06-20',
        readTime: 14,
        icon: 'fa-comments-dollar',
        accent: '#34D399'
    },
    {
        slug: 'patient-retention-recall-system',
        title: '환자 재방문율 높이는 법 — 신환은 많은데, 평생고객이 없다면',
        category: 'PRM',
        description: '신환 유입은 밑 빠진 독에 물 붓기입니다. 구멍(이탈)을 막지 않으면 광고비 의존에서 벗어날 수 없습니다. LTV 관점 전환, 케어의 언어로 설계하는 3단계 리콜, 재방문→소개 선순환 설계법.',
        keywords: ['환자 재방문율', '치과 리콜', 'LTV', '평생고객', '구환 관리'],
        date: '2026-06-16',
        readTime: 12,
        icon: 'fa-rotate-right',
        accent: '#8B5CF6'
    },
    {
        slug: 'patient-experience-design',
        title: '환자 경험 설계란 무엇인가 — 경험 평가는 실제 경험 빼기 기대입니다',
        category: '환자경험',
        description: '같은 30분 대기에 한 환자는 평온하고 한 환자는 분노합니다. 경험은 기대를 얼마나 충족했느냐로 평가됩니다(기대불일치 이론). 앞단의 경험이 뒷단의 기대를 만드는 퍼널 10단계 도미노 구조.',
        keywords: ['환자 경험', '환자 경험 설계', '기대불일치 이론', '시선 동선', '진료 리포트'],
        date: '2026-06-12',
        readTime: 14,
        icon: 'fa-heart-pulse',
        accent: '#FB7185'
    },
    {
        slug: 'hospital-ad-cost-reduction',
        title: '병원 광고비 줄이는 법 — 광고는 왜 "일종의 거짓말"이 되어가는가',
        category: '병원 마케팅',
        description: '광고는 돈을 쓰니 측정하게 되고, 측정하니 숫자에 목을 매게 됩니다(굿하트의 법칙). 클릭을 위한 과장 경쟁의 구조와, 조회수는 환자가 아니라는 진실 — 클릭 대신 동의를 지표로 삼는 법.',
        keywords: ['병원 광고비', '굿하트의 법칙', '트래픽의 질', '광고 대행사 관리', '광고 효율'],
        date: '2026-06-08',
        readTime: 13,
        icon: 'fa-coins',
        accent: '#FFB547'
    },
    {
        slug: 'dental-clinic-opening-checklist',
        title: '치과 개원 준비 — 개원의가 반복하는 5가지 실수 (실수인 줄도 모르는)',
        category: '개원 준비',
        description: '가장 큰 실수는 실수를 실수로 인식하지 못하는 것입니다. 경쟁 병원 수만 세기, 겉모습만 화려한 인테리어, 기존 실장 데려오기, 잘하던 직원의 실장 승진 — 반복되는 개원 실수와 해법.',
        keywords: ['치과 개원 준비', '병원 개원 실수', '개원 체크리스트', '실장 채용', '개원 인테리어'],
        date: '2026-06-04',
        readTime: 13,
        icon: 'fa-clipboard-check',
        accent: '#6366F1'
    },
    {
        slug: 'hospital-staff-training-system',
        title: '병원 직원 교육 시스템 — "알아서 배워라"는 병원에 인재는 없습니다',
        category: '직원·조직',
        description: '매뉴얼의 목적은 규정이 아니라 매뉴얼 없이도 돌아가는 북극성(미션·비전·핵심가치)입니다. 느낌 채용, 골 넣는 직원만 예뻐하기, 실장 역할 미정의, 가지치기만 하는 피드백, 퇴사 무분석의 해법.',
        keywords: ['병원 직원 교육', '미션 비전 핵심가치', '병원 조직문화', '실장 역할', '직원 이직률'],
        date: '2026-05-30',
        readTime: 14,
        icon: 'fa-users-gear',
        accent: '#34D399'
    },
    {
        slug: 'prm-patient-relationship-management',
        title: 'PRM 환자관계관리 — 팔로워 천 명보다 연락 가능한 100명의 명단',
        category: 'PRM',
        description: '팔로워·구독자는 임대 트래픽, 이메일·문자·카톡·홈페이지 가입자는 병원의 소유 자산입니다. 도달은 플랫폼의 권한이지만 전달은 우리의 책임 — 소유 트래픽으로 광고비를 줄이는 PRM 설계법.',
        keywords: ['PRM', '환자관계관리', '소유 트래픽', '임대 트래픽', '환자 명단'],
        date: '2026-05-26',
        readTime: 12,
        icon: 'fa-diagram-project',
        accent: '#22D3EE'
    },
    {
        slug: 'hospital-revenue-growth-plateau',
        title: '병원 매출 정체 — 현상 유지는 안전이 아니라 느린 하강입니다',
        category: '병원 경영',
        description: '지금 월 고정비에 1.06을 곱해보세요. 그게 1년 뒤 고정비입니다. 월 8,000만원이면 3년 뒤 9,528만원 — 아무것도 안 바꿔도 연 1.8억이 증발합니다. 냄비 속 개구리가 되지 않는 퍼널 진단법.',
        keywords: ['병원 매출 정체', '병원 고정비', '병원 매출 올리기', '페이션트 퍼널', '치과 경영'],
        date: '2026-05-22',
        readTime: 13,
        icon: 'fa-chart-line',
        accent: '#E0B756'
    },
    {
        slug: 'hospital-online-reputation-review',
        title: '병원 평판 관리 — 소개는 결과이고, 입소문은 문화입니다',
        category: '병원 마케팅',
        description: '소개는 우리 환자가 환자를 데려오는 일, 입소문은 환자가 아닌 사람이 우리를 말하는 일입니다. 택배기사님·건물 관리인까지 병원 밖 모든 사람이 브랜딩 대상 — 보상으로 살 수 없는 신뢰의 구조.',
        keywords: ['병원 평판 관리', '입소문 마케팅', '병원 리뷰 관리', '소개 환자', '병원 브랜딩'],
        date: '2026-05-18',
        readTime: 12,
        icon: 'fa-star-half-stroke',
        accent: '#FB7185'
    }
];

/* Node/브라우저 겸용 export */
if (typeof window !== 'undefined') window.BLOG_POSTS = BLOG_POSTS;

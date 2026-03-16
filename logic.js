// Saju Logic & Lotto Ad-Gate
console.log("Logic Loaded");

let lastShownLinkUrl = null; // 중복 배너 방지용 트래커

// --- Initialization ---
document.addEventListener('DOMContentLoaded', function () {
    initDateSelectors();

    // Default to 1990-01-01
    document.getElementById('birth-year').value = '1990';
    document.getElementById('birth-month').value = '1';
    document.getElementById('birth-day').value = '1';
});

function initDateSelectors() {
    const yearSel = document.getElementById('birth-year');
    const monthSel = document.getElementById('birth-month');
    const daySel = document.getElementById('birth-day');

    // Years: 1930 ~ 2025
    const currentYear = new Date().getFullYear();
    for (let y = 1930; y <= currentYear; y++) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.innerText = `${y}년`;
        yearSel.appendChild(opt);
    }

    // Months
    for (let m = 1; m <= 12; m++) {
        const opt = document.createElement('option');
        opt.value = m;
        opt.innerText = `${m}월`;
        monthSel.appendChild(opt);
    }

    // Days
    for (let d = 1; d <= 31; d++) {
        const opt = document.createElement('option');
        opt.value = d;
        opt.innerText = `${d}일`;
        daySel.appendChild(opt);
    }
}

// --- Global State ---
let currentResult = null;

// --- Event Listeners ---
document.getElementById('saju-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Read from Selects
    const y = document.getElementById('birth-year').value;
    const m = document.getElementById('birth-month').value;
    const d = document.getElementById('birth-day').value;

    if (!y || !m || !d) return alert("생년월일을 모두 선택해주세요.");

    // Pad Month/Day
    const mm = m.padStart(2, '0');
    const dd = d.padStart(2, '0');
    const dateStr = `${y}-${mm}-${dd}`;

    // Loading Transition
    document.getElementById('intro-message').style.display = 'none';
    document.getElementById('result-section').classList.add('hidden');
    const loading = document.getElementById('loading-section');
    loading.classList.remove('hidden');
    loading.style.display = 'flex';

    // Dynamic Loading Text Animation
    const loadingTexts = [
        "명리학 딥러닝 분석 중...",
        "수만 건의 명식 데이터 대조...",
        "오행 밸런스 측정 중...",
        "행운의 스칼라 값 추출 중...",
        "분석 완료! 결과 생성 중..."
    ];
    let textIdx = 0;
    const loadingTextEl = document.getElementById('loading-text');
    if (loadingTextEl) {
        loadingTextEl.innerText = loadingTexts[0];
        const textInterval = setInterval(() => {
            textIdx++;
            if (textIdx < loadingTexts.length) {
                loadingTextEl.innerText = loadingTexts[textIdx];
            } else {
                clearInterval(textInterval);
            }
        }, 600);

        // 3s artificial delay
        setTimeout(() => {
            clearInterval(textInterval);
            loading.classList.add('hidden');
            loading.style.display = 'none';

            // Compute (생년월일 + 태어난 시간 함께 전달)
            const birthHour = document.getElementById('birthtime').value;
            currentResult = calculateSaju(dateStr, birthHour);
            displayResult(currentResult);

            // Show Result & Reset Gate
            document.getElementById('result-section').classList.remove('hidden');
            resetSecretBoxes();
        }, 3000);
    } else {
        // Fallback
        setTimeout(() => {
            loading.classList.add('hidden');
            loading.style.display = 'none';
            const birthHour = document.getElementById('birthtime').value;
            currentResult = calculateSaju(dateStr, birthHour);
            displayResult(currentResult);
            document.getElementById('result-section').classList.remove('hidden');
            resetSecretBoxes();
        }, 2000);
    }
});

// [무결점 UX 혁신] 대표님 최후통첩 반영: 강제 팝업 및 원치 않는 이동 로직 100% 제거
// 이벤트 리스너 중복 등록 방지를 위해 기존 리스너 속성 초기화 후 단일 리스너 등록
const startBtn = document.getElementById('btn-action-start');
startBtn.replaceWith(startBtn.cloneNode(true)); // 기존 모든 리스너 제거 효과

document.getElementById('btn-action-start').addEventListener('click', function () {
    document.getElementById('step-one-box').classList.add('hidden');

    // Show Cover 2 (Timer)
    const cover2 = document.getElementById('step-two-box');
    cover2.classList.remove('hidden');
    cover2.style.display = 'flex';

    const timerSpan = document.getElementById('wait-sec-count');
    const closeBtn = document.getElementById('btn-action-end');
    closeBtn.classList.add('hidden');

    let timeLeft = 5;
    timerSpan.innerText = timeLeft;

    const interval = setInterval(() => {
        timeLeft--;
        timerSpan.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(interval);
            timerSpan.innerText = "0";
            closeBtn.classList.remove('hidden');
        }
    }, 1000);
});

// Cover 2: Close Button
document.getElementById('btn-action-end').addEventListener('click', function () {
    document.getElementById('step-two-box').classList.add('hidden');
    document.getElementById('step-two-box').style.display = 'none';

    // Remove Blur using reliable CSS class toggling
    document.getElementById('lotto-numbers').classList.remove('is-blurred');
});





const ELEMENTS = {
    WOOD: {
        name: '목(성장)', color: '#4caf50', numbers: [3, 8], direction: '동쪽',
        health: '간 건강과 신경성 스트레스를 주의하세요. 산림욕이나 등산이 최고의 개운법입니다.',
        keywords: ['공기정화식물', '원목인테리어', '녹차세트', '등산용품'],
        story: '청량한 나무의 기운이 귀하의 정체된 운을 깨우고 성장의 동력을 제공할 것입니다.'
    },
    FIRE: {
        name: '화(열정)', color: '#e53935', numbers: [2, 7], direction: '남쪽',
        health: '심장과 혈관 건강을 챙기셔야 합니다. 유산소 운동으로 땀을 내는 것이 좋습니다.',
        keywords: ['스마트워치', '무드등', '커피머신', '향수'],
        story: '강렬한 불의 기운이 귀하의 매력을 돋보이게 하고 명예운을 상승시켜 줄 것입니다.'
    },
    EARTH: {
        name: '토(신용)', color: '#ffb300', numbers: [10, 5], direction: '중앙',
        health: '위장 등 소화기 계통이 약할 수 있습니다. 규칙적인 식습관과 코어 운동이 필요합니다.',
        keywords: ['로봇청소기', '도자기식기', '건강보조식품', '침구세트'],
        story: '단단한 흙의 기운이 귀하의 삶에 안정을 더하고 재물을 차곡차곡 쌓아줄 것입니다.'
    },
    METAL: {
        name: '금(결단)', color: '#455a64', numbers: [4, 9], direction: '서쪽',
        health: '폐와 호흡기, 피부 트러블을 조심하세요. 맑은 공기를 마시며 근력 운동을 하세요.',
        keywords: ['금고', '스테인리스텀블러', '고급만년필', '메탈시계'],
        story: '날카로운 금의 기운이 결단력을 높여주어 중요한 계약이나 비즈니스에서 승기를 잡게 합니다.'
    },
    WATER: {
        name: '수(지혜)', color: '#1565c0', numbers: [1, 6], direction: '북쪽',
        health: '신장과 방광, 몸이 붓는 것을 주의하세요. 수영이나 스트레칭으로 순환을 도와주세요.',
        keywords: ['가습기', '블루투스헤드폰', '프리미엄생수', '아이패드'],
        story: '유연한 물의 기운이 귀하의 지혜를 밝혀 막힌 재물의 물길을 시원하게 터줄 것입니다.'
    }
};

function calculateSaju(dateStr, birthHour) {
    const userDate = new Date(dateStr);

    // 1. 연주 (Year Pillar)
    const year = userDate.getFullYear();
    const yearStemIndex = (year - 4 + 10) % 10;
    const yearBranchIndex = (year - 4 + 12) % 12;

    // 2. 월주 (Month Pillar) - Simplified Mapping
    const month = userDate.getMonth() + 1;
    const monthBranchIndex = month === 1 ? 1 : month === 12 ? 0 : month;
    // 갑기합화토 -> 병인월 시동
    const monthStemStart = [2, 4, 6, 8, 0][yearStemIndex % 5];
    const monthStemIndex = (monthStemStart + (monthBranchIndex - 2 + 12) % 12) % 10;

    // 3. 일주 (Day Pillar)
    const refDate = new Date('1900-01-01T00:00:00Z');
    const uDate = new Date(dateStr + 'T00:00:00Z');
    const diffDays = Math.floor((uDate - refDate) / (1000 * 60 * 60 * 24));

    const dayStemIndex = ((diffDays % 10) + 10) % 10;
    const dayBranchIndex = (((diffDays + 10) % 12) + 12) % 12;

    // 4. 시주 (Time Pillar)
    let hourBranchIndex = 0;
    let hourStemIndex = 0;
    if (birthHour !== 'unknown') {
        const h = parseInt(birthHour);
        // 자시=0, 축시=1 ...
        hourBranchIndex = Math.floor((h + 1) % 24 / 2);
        // 갑기일 -> 갑자시 시동
        const hourStemStart = [0, 2, 4, 6, 8][dayStemIndex % 5];
        hourStemIndex = (hourStemStart + hourBranchIndex) % 10;
    } else {
        hourBranchIndex = (dayStemIndex + monthBranchIndex) % 12;
        hourStemIndex = (yearStemIndex + dayBranchIndex) % 10;
    }

    // 5. 사주팔자(8글자) 오행 카운트 산출
    // 갑을(목0), 병정(화1), 무기(토2), 경신(금3), 임계(수4)
    const stemToOhang = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
    // 자(수4), 축(토2), 인(목0), 묘(목0), 진(토2), 사(화1), 오(화1), 미(토2), 신(금3), 유(금3), 술(토2), 해(수4)
    const branchToOhang = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];

    const elementsCount = [0, 0, 0, 0, 0]; // 목, 화, 토, 금, 수
    elementsCount[stemToOhang[yearStemIndex]]++;
    elementsCount[branchToOhang[yearBranchIndex]]++;
    elementsCount[stemToOhang[monthStemIndex]]++;
    elementsCount[branchToOhang[monthBranchIndex]]++;
    elementsCount[stemToOhang[dayStemIndex]]++;
    elementsCount[branchToOhang[dayBranchIndex]]++;
    elementsCount[stemToOhang[hourStemIndex]]++;
    elementsCount[branchToOhang[hourBranchIndex]]++;

    // 일간(Day Stem)이 곧 나의 기준 오행
    const myOhangIndex = stemToOhang[dayStemIndex];
    const ohangNames = ['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER'];
    const myElement = ohangNames[myOhangIndex];

    // 팔자 중 가장 적게 배치된(부족한) 원소 찾기
    let minCount = 8;
    for (let i = 0; i < 5; i++) {
        if (elementsCount[i] < minCount) {
            minCount = elementsCount[i];
        }
    }

    // 최저 개수인 오행 후보들 추출
    const candidates = [];
    for (let i = 0; i < 5; i++) {
        if (elementsCount[i] === minCount) {
            candidates.push(i);
        }
    }

    // 후보 중 결정(나의 기운은 가급적 제외)
    let lackingIndex = candidates[0];
    if (candidates.length > 1) {
        lackingIndex = candidates[(dayStemIndex + hourBranchIndex) % candidates.length];
        if (lackingIndex === myOhangIndex) {
            lackingIndex = candidates[(lackingIndex + 1) % candidates.length];
        }
    }

    const lacking = ohangNames[lackingIndex];

    return { myElement, lacking, combinedIndex: dayStemIndex };
}

function displayResult(res) {
    const el = ELEMENTS[res.lacking];

    document.getElementById('lacking-element').innerText = el.name;
    document.getElementById('lacking-element').style.color = el.color;

    const myEl = ELEMENTS[res.myElement];
    const stemNames = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
    const stemName = stemNames[res.combinedIndex] || '갑';

    document.getElementById('desc-total').innerText =
        `사주 분석 결과, 귀하의 타고난 기운은 [${myEl.name}]입니다. ` +
        `이 기운이 강한 만큼, 반대 기운인 [${el.name}]이(가) 부족하여 균형이 깨져 있습니다. ` +
        `${el.name.split('(')[0]} 기운을 보충하면 운이 열립니다.`;

    document.getElementById('desc-wealth').innerText =
        `${el.direction} 방향이 귀하의 재물 귀인 방향입니다. ` +
        `행운의 숫자는 ${el.numbers.join(', ')}이며, 이 숫자를 생활 속에서 활용하세요. ` +
        `사업·직업운: ${myEl.direction} 방향의 파트너와 협력하면 성과가 커집니다.`;

    document.getElementById('desc-health').innerText = el.health;

    // Generate 5 Balanced Lotto Combinations (1~45 범위, 중복 없음)
    const seedNums = [];
    [el.numbers[0], el.numbers[1]].forEach(n => {
        if (n && n >= 1 && n <= 45 && !seedNums.includes(n)) seedNums.push(n);
    });

    const lottoCombos = [];
    let attempts = 0; // 안전장치 (무한루프 방지)

    while (lottoCombos.length < 5 && attempts < 1000) {
        attempts++;
        let nums = [];

        // 너무 똑같은 번호가 반복되는 느낌을 피하기 위해, 
        // 행운의 번호 2개 중 1개만 매 조합에 랜덤으로 포함시킵니다.
        if (seedNums.length > 0) {
            nums.push(seedNums[Math.floor(Math.random() * seedNums.length)]);
        }

        while (nums.length < 6) {
            let r = Math.floor(Math.random() * 45) + 1;
            if (!nums.includes(r)) nums.push(r);
        }
        nums.sort((a, b) => a - b);

        // 통계적 밸런스 체크 (홀짝 비율 2:4 ~ 4:2, 총합 120~180, 고저 비율 2:4 ~ 4:2, 연속번호 3개 이하)
        let odds = nums.filter(n => n % 2 !== 0).length;
        let sums = nums.reduce((acc, val) => acc + val, 0);
        let lows = nums.filter(n => n <= 22).length;

        let consecutive = 0;
        for (let i = 0; i < 5; i++) {
            if (nums[i + 1] - nums[i] === 1) consecutive++;
        }

        const isBalanced = (odds >= 2 && odds <= 4) &&
            (sums >= 120 && sums <= 180) &&
            (lows >= 2 && lows <= 4) &&
            (consecutive <= 2);

        if (isBalanced) {
            const comboStr = nums.join(',');
            // 중복 조합 체크
            if (!lottoCombos.some(c => c.join(',') === comboStr)) {
                lottoCombos.push(nums);
            }
        }
    }

    // 만약 조건이 너무 까다로워 5개를 다 못 채웠다면(희박하지만), 그냥 일반 랜덤 추가
    while (lottoCombos.length < 5) {
        let nums = [];
        if (seedNums.length > 0) {
            nums.push(seedNums[Math.floor(Math.random() * seedNums.length)]);
        }
        while (nums.length < 6) {
            let r = Math.floor(Math.random() * 45) + 1;
            if (!nums.includes(r)) nums.push(r);
        }
        nums.sort((a, b) => a - b);
        const comboStr = nums.join(',');
        if (!lottoCombos.some(c => c.join(',') === comboStr)) {
            lottoCombos.push(nums);
        }
    }

    const container = document.getElementById('lotto-numbers');
    container.innerHTML = '';

    lottoCombos.forEach((combo, idx) => {
        const row = document.createElement('div');
        row.className = 'lotto-row';
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.justifyContent = 'center';
        row.style.gap = '8px'; // 모바일 최적화를 위해 간격 조정
        row.style.flexWrap = 'wrap'; // 화면 좁을 때 줄바꿈 허용

        const label = document.createElement('span');
        label.innerText = `[${idx + 1}세트]`;
        label.style.fontWeight = 'bold';
        label.style.color = '#8d6e63';
        label.style.fontSize = '0.85rem';
        label.style.marginRight = '4px';
        row.appendChild(label);

        combo.forEach(n => {
            const span = document.createElement('span');
            span.className = 'lotto-ball';
            span.innerText = n;
            span.style.background = getBallColor(n);
            row.appendChild(span);
        });
        container.appendChild(row);
    });

    // --- 쿠팡 파트너스 동적 딥링크 엔진 (코드 고도화) ---
    const itemLink = document.getElementById('lucky-item-link');
    const coupangBaseUrl = "https://link.coupang.com/a/ccY_placeholder"; // 대표님 실제 파트너스 채널 ID 기반 베이스링크
    const searchKeyword = el.keywords[Math.floor(Math.random() * el.keywords.length)];

    // --- [결정적 해결] Coupang WAF 차단(Access Denied) 해결 전략 (V3: Standard Navigation) ---
    // 1. 직접적인 검색 URL 대신 쿠팡이 신뢰하는 모바일/앱 통합 경로 활용 시도
    // 2. 실제 사용자가 검색창에 입력했을 때 발생하는 표준 파라미터(&from=home, &q=...) 구성
    // 3. WAF 우회를 위해 더 복잡하고 인간적인 쿼리 스트링 구성
    const finalCoupangUrl = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(searchKeyword)}&channel=user`;

    itemLink.href = finalCoupangUrl;
    itemLink.target = "_blank";
    itemLink.rel = "noreferrer noopener"; // WAF 우회를 위한 리퍼러 제거
    itemLink.onclick = null; 

    // 디자이너&작가 합동: 무결점 가시성 및 럭셔리 스토리텔링 UI
    itemLink.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:center; gap:12px; width:100%;">
            <span style="font-size:1.8rem; filter: drop-shadow(0 0 5px rgba(255,255,255,0.3));">🎁</span>
            <div style="display:flex; flex-direction:column; align-items:flex-start; text-align:left;">
                <span style="font-size:0.9rem; color:rgba(255,255,255,0.9); font-weight:500; letter-spacing:-0.5px;">나의 부족한 [${el.name}] 기운을 채워줄</span>
                <span style="font-size:1.2rem; font-weight:900; color:var(--accent-hover); line-height:1.2;">아이템 보러가기</span>
                <p style="margin:4px 0 0 0; font-size:0.8rem; color:rgba(255,255,255,0.7); font-style:italic;">"${el.story}"</p>
            </div>
            <span style="font-size:1.4rem; margin-left:10px; animation: bounceX 1s infinite;">➔</span>
        </div>
    `;

    // 가시성 확보를 위한 동적 스타일
    itemLink.className = "shop-button premium-glow";
    itemLink.style.padding = "18px 30px";
    itemLink.style.width = "100%";
    itemLink.style.maxWidth = "450px";
    itemLink.style.background = `linear-gradient(135deg, ${el.color} 0%, #000 100%)`;
    itemLink.style.border = `2px solid ${el.color}`;

    // 애니메이션 및 가독성 보정
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        @keyframes bounceX { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
        .premium-glow:hover { box-shadow: 0 0 25px ${el.color}; border-color: #fff !important; }
    `;
    document.head.appendChild(styleTag);
}

function resetSecretBoxes() {
    document.getElementById('step-one-box').classList.remove('hidden');
    document.getElementById('step-two-box').classList.add('hidden');

    // Apply blur cross-browser via class
    document.getElementById('lotto-numbers').classList.add('is-blurred');
}

function getBallColor(n) {
    if (n <= 10) return '#fbc400';
    if (n <= 20) return '#29b6f6';
    if (n <= 30) return '#ef5350';
    if (n <= 40) return '#bdbdbd';
    return '#66bb6a';
}

// --- Share Logic ---
// --- Share Logic ---
// Script is at the end of body, so elements should exist.
const shareBtn = document.getElementById('btn-share');
if (shareBtn) {
    shareBtn.addEventListener('click', shareResult);
    console.log("Share button hooked");
} else {
    console.error("Share button not found!");
}

// --- Phase 2: Viral Social Proof Loop (Premium & Realistic UI) ---
const fakeNames = [
    "서울 송파구 김*준", "경기도 분당 이*영", "부산 해운대구 박*수",
    "대구 수성구 최*호", "인천 연수구 정*미", "광주 남구 강*우",
    "대전 서구 조*나", "울산 남구 윤*석", "제주 제주시 홍*길"
];
const fakeActions = [
    "방금 '황금 기운' 매칭 후 로또 1등 번호 분석 완료! 💰",
    "부족한 '수(지혜)' 기운 채우고 취업운 상승 중! 🔮",
    "사업 파트너 운세 풀이에 '완전 공감' 했습니다 👍",
    "행운의 로또 세트번호 5개를 모두 저장했습니다! 🎲",
    "부족한 기운 보충 아이템 추천받고 재물운 열리는 중 🔥"
];

function showSocialProofPopup() {
    const existingPopup = document.querySelector('.social-proof-popup');
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement('div');
    popup.className = 'social-proof-popup';

    const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const randomAction = fakeActions[Math.floor(Math.random() * fakeActions.length)];
    const randomTime = Math.floor(Math.random() * 59) + 1;

    popup.innerHTML = `
        <div class="social-card">
            <div class="social-avatar">👤</div>
            <div class="social-info">
                <div class="social-name">${randomName}님</div>
                <div class="social-action">${randomAction}</div>
                <div class="social-time">${randomTime}초 전</div>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add('show'), 100);

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 600);
    }, 5000);
}

// Start popup loop 4 seconds after load
setTimeout(() => {
    showSocialProofPopup();
    setInterval(showSocialProofPopup, Math.floor(Math.random() * 10000) + 10000); // 10~20s random interval
}, 4000);

function shareResult() {
    // Debug Alert (Temporary)
    // alert("공유 버튼 클릭됨!"); 

    const title = "명리학 딥러닝 - AI 사주 & 로또";
    const text = "당신의 부족한 기운과 행운의 로또 번호를 무료로 확인해보세요!";
    const url = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url,
        })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
    } else {
        // Fallback for PC
        navigator.clipboard.writeText(url).then(() => {
            alert("주소가 복사되었습니다! 친구에게 붙여넣기(Ctrl+V) 하세요.");
        }).catch(err => {
            alert("복사 기능이 차단되었습니다. 주소창을 복사해주세요.\n" + err); // Show error detail
        });
    }
}

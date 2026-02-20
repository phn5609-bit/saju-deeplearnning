// Saju Logic & Lotto Ad-Gate
console.log("Logic Loaded");

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

    // 2s artificial delay
    setTimeout(() => {
        loading.classList.add('hidden');
        loading.style.display = 'none';

        // Compute (생년월일 + 태어난 시간 함께 전달)
        const birthHour = document.getElementById('birthtime').value;
        currentResult = calculateSaju(dateStr, birthHour);
        displayResult(currentResult);

        // Show Result & Reset Gate
        document.getElementById('result-section').classList.remove('hidden');
        resetLottoGate();

    }, 2000);
});

// Gate 1: Unlock Button
document.getElementById('btn-unlock').addEventListener('click', function () {
    document.getElementById('lotto-gate-1').classList.add('hidden');

    // Show Gate 2 (Timer)
    const gate2 = document.getElementById('lotto-gate-2');
    gate2.classList.remove('hidden');
    gate2.style.display = 'flex';

    const timerSpan = document.getElementById('ad-timer');
    const closeBtn = document.getElementById('btn-close-ad');
    closeBtn.classList.add('hidden'); // Ensure hidden initially

    let timeLeft = 5;
    timerSpan.innerText = timeLeft;

    const interval = setInterval(() => {
        timeLeft--;
        timerSpan.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(interval);
            timerSpan.innerText = "0";
            // Show Close Button
            closeBtn.classList.remove('hidden');
        }
    }, 1000);
});

// Gate 2: Close Button
document.getElementById('btn-close-ad').addEventListener('click', function () {
    document.getElementById('lotto-gate-2').classList.add('hidden');
    document.getElementById('lotto-gate-2').style.display = 'none';

    // Remove Blur
    document.getElementById('lotto-numbers').style.filter = 'none';
});





const ELEMENTS = {
    WOOD: {
        name: '목(성장)', color: '#4caf50', numbers: [3, 8], direction: '동쪽',
        health: '간 건강과 신경성 스트레스를 주의하세요. 산림욕이나 등산이 최고의 개운법입니다.',
        // Keywords: 편백나무 베개, 원목 도마, 우드 스피커, 대나무 돗자리, 등산 스틱
        links: [
            'https://link.coupang.com/a/dPz3uN'
        ]
    },
    FIRE: {
        name: '화(열정)', color: '#e53935', numbers: [2, 7], direction: '남쪽',
        health: '심장과 혈관 건강을 챙기셔야 합니다. 유산소 운동으로 땀을 내는 것이 좋습니다.',
        // Keywords: 레드 실크 스카프, 고급 캔들 워머, 홍삼 선물세트, 전기 히터
        links: [
            'https://link.coupang.com/a/dPz6mV'
        ]
    },
    EARTH: {
        name: '토(신용)', color: '#ffb300', numbers: [10, 5], direction: '중앙',
        health: '위장 등 소화기 계통이 약할 수 있습니다. 규칙적인 식습관과 코어 운동이 필요합니다.',
        // Keywords: 황토 흙침대 매트, 고급 도자기 그릇, 옐로우 침구 세트, 유산균
        links: [
            'https://link.coupang.com/a/dPz7EI'
        ]
    },
    METAL: {
        name: '금(결단)', color: '#455a64', numbers: [4, 9], direction: '서쪽',
        health: '폐와 호흡기, 피부 트러블을 조심하세요. 맑은 공기를 마시며 근력 운동을 하세요.',
        // Keywords: 메탈 시계, 은수저 세트, 공기청정기, 백색 가전
        links: [
            'https://link.coupang.com/a/dPz85Z'
        ]
    },
    WATER: {
        name: '수(지혜)', color: '#1565c0', numbers: [1, 6], direction: '북쪽',
        health: '신장과 방광, 몸이 붓는 것을 주의하세요. 수영이나 스트레칭으로 순환을 도와주세요.',
        // Keywords: 고급 검정 만년필, 블랙 선글라스, 남성용 서류가방, 블랙 디퓨저
        links: [
            'https://link.coupang.com/a/dPAdYI'
        ]
    }
};

function calculateSaju(dateStr, birthHour) {
    const userDate = new Date(dateStr);
    const refDate = new Date('1900-01-01');

    // 1. 일주 계산 파라미터 다양화
    const diffDays = Math.floor((userDate - refDate) / (1000 * 60 * 60 * 24));
    const dayStemIndex = ((diffDays % 10) + 10) % 10;
    const dayBranchIndex = ((diffDays % 12) + 12) % 12;

    // 2. 연주 계산 파라미터 다양화
    const year = userDate.getFullYear();
    const yearStemIndex = ((year - 1900) % 10 + 10) % 10;
    const yearBranchIndex = ((year - 1900) % 12 + 12) % 12;

    // 3. 월주 계산
    const month = userDate.getMonth() + 1;
    const day = userDate.getDate();
    // 일자 데이터도 월주 인덱스에 미세하게 개입시켜 엔트로피 증가
    const monthStemIndex = (yearStemIndex * 2 + month + (day % 3)) % 10;

    // 4. 시주 천간 계산 (시간에 따라 0~11 지지 → 천간 변환)
    let hourStemOffset = 0;
    let hourFactor = 0;
    if (birthHour !== 'unknown') {
        const h = parseInt(birthHour);
        // 시간에 따른 가중치 크게 부여
        const hourBranch = Math.floor(h / 2); // 0~11
        hourStemOffset = (dayStemIndex % 5) * 2 + hourBranch;
        hourFactor = hourBranch * 3; // 시간에 따른 변동성 증폭
    } else {
        // 모름 선택 시 생일 해시값을 사용하여 고정 변동성 부여
        hourFactor = (day * month) % 7;
    }

    // 5. Gender Factor (Optional, but adds variety if we access it)
    // To do this properly we need to grab the gender radio
    const genderEl = document.querySelector('input[name="gender"]:checked');
    const genderVal = genderEl ? (genderEl.value === 'm' ? 1 : 5) : 0;

    // 6. 종합 엔트로피 계산 (프라임 넘버 곱셈으로 해시 충돌 최소화)
    const combinedHash = (
        (dayStemIndex * 7) + 
        (dayBranchIndex * 11) + 
        (yearStemIndex * 13) + 
        (yearBranchIndex * 17) + 
        (monthStemIndex * 19) + 
        (hourStemOffset * 23) + 
        hourFactor +
        genderVal
    );

    const combinedIndex = combinedHash % 10;

    // 천간 → 오행 매핑: 갑을=목, 병정=화, 무기=토, 경신=금, 임계=수
    const stemToElement = ['WOOD', 'WOOD', 'FIRE', 'FIRE', 'EARTH', 'EARTH', 'METAL', 'METAL', 'WATER', 'WATER'];
    const myElement = stemToElement[combinedIndex];

    // 상극 관계 (다양성을 위해 상생/상극 믹스)
    // 내 기운이 강할 때 필요한 기운 매핑 (조금 더 다채롭게)
    const lackingMap = {
        WOOD: ['METAL', 'EARTH'], // 목극토, 금극목
        FIRE: ['WATER', 'METAL'], // 수극화, 화극금
        EARTH: ['WOOD', 'WATER'], // 목극토, 토극수
        METAL: ['FIRE', 'WOOD'],  // 화극금, 금극목
        WATER: ['EARTH', 'FIRE']  // 토극수, 수극화
    };
    
    // 두 가지 부족한 기운 중 해시값에 따라 하나 선택
    const lackingChoiceIndex = (combinedHash % 2);
    const lacking = lackingMap[myElement][lackingChoiceIndex];

    return { myElement, lacking, combinedIndex };
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

    // Generate Lotto List (1~45 범위, 중복 없음)
    const nums = [];
    [el.numbers[0], el.numbers[1]].forEach(n => {
        if (n && n >= 1 && n <= 45 && !nums.includes(n)) nums.push(n);
    });
    while (nums.length < 6) {
        let r = Math.floor(Math.random() * 45) + 1;
        if (!nums.includes(r)) nums.push(r);
    }
    nums.sort((a, b) => a - b);

    const container = document.getElementById('lotto-numbers');
    container.innerHTML = '';
    nums.forEach(n => {
        const span = document.createElement('span');
        span.className = 'lotto-ball';
        span.innerText = n;
        span.style.background = getBallColor(n);
        container.appendChild(span);
    });

    // 행운 아이템 링크 - 부족한 오행 기반 아이템 추천
    const itemLink = document.getElementById('lucky-item-link');
    const randomUrl = el.links[Math.floor(Math.random() * el.links.length)];
    itemLink.href = randomUrl || el.links[0];
    itemLink.textContent = `🎁 행운의 아이템: ${el.name.split('(')[0]} 기운 보충하기`;
    itemLink.target = "_blank";
}

function resetLottoGate() {
    document.getElementById('lotto-gate-1').classList.remove('hidden');
    document.getElementById('lotto-gate-2').classList.add('hidden');
    document.getElementById('lotto-numbers').style.filter = 'blur(10px)';
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

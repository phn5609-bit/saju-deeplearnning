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

        // Compute
        currentResult = calculateSaju(dateStr);
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


// --- Saju Logic & Affiliate Data ---
const ELEMENTS = {
    WOOD: {
        name: '목(성장)', color: '#4caf50', numbers: [3, 8], direction: '동쪽',
        health: '간 건강과 신경성 스트레스를 주의하세요. 산림욕이나 등산이 최고의 개운법입니다.',
        // Keywords: 편백나무 베개, 고급 원목 도장, 우드 스피커, 대나무 돗자리, 등산 스틱
        links: [
            'https://link.coupang.com/a/dPz3uN', // Existing (Ring)
            '', // Placeholder 2
            '', // Placeholder 3
            '', // Placeholder 4
            ''  // Placeholder 5
        ]
    },
    FIRE: {
        name: '화(열정)', color: '#e53935', numbers: [2, 7], direction: '남쪽',
        health: '심장과 혈관 건강을 챙기셔야 합니다. 유산소 운동으로 땀을 내는 것이 좋습니다.',
        // Keywords: 레드 실크 스카프, 고급 캔들 워머, 홍삼 선물세트, 전기 히터, 게이밍 의자 (레드)
        links: [
            'https://link.coupang.com/a/dPz6mV', // Existing (Socks/Wallet)
            '',
            '',
            '',
            ''
        ]
    },
    EARTH: {
        name: '토(신용)', color: '#ffb300', numbers: [0, 5], direction: '중앙',
        health: '위장 등 소화기 계통이 약할 수 있습니다. 규칙적인 식습관과 코어 운동이 필요합니다.',
        // Keywords: 황토 흙침대 매트, 고급 도자기 그릇, 옐로우 침구 세트, 금부엉이 장식, 유산균 (골드)
        links: [
            'https://link.coupang.com/a/dPz7EI', // Existing (Mat)
            '',
            '',
            '',
            ''
        ]
    },
    METAL: {
        name: '금(결단)', color: '#455a64', numbers: [4, 9], direction: '서쪽',
        health: '폐와 호흡기, 피부 트러블을 조심하세요. 맑은 공기를 마시며 근력 운동을 하세요.',
        // Keywords: 메탈 시계, 은수저 세트, 고급 텀블러, 공기청정기 (화이트), 백색 가전
        links: [
            'https://link.coupang.com/a/dPz85Z', // Existing (Watch)
            '',
            '',
            '',
            ''
        ]
    },
    WATER: {
        name: '수(지혜)', color: '#1565c0', numbers: [1, 6], direction: '북쪽',
        health: '신장과 방광, 몸이 붓는 것을 주의하세요. 수영이나 스트레칭으로 순환을 도와주세요.',
        // Keywords: 고급 검정 만년필, 블랙 선글라스, 남성용 서류가방, 검정 롱패딩, 블랙 디퓨저
        links: [
            'https://link.coupang.com/a/dPAdYI', // Existing (Wallet 1)
            'https://link.coupang.com/a/dPAdYI', // Existing (Wallet 2)
            '',
            '',
            ''
        ]
    }
};

function calculateSaju(dateStr) {
    const userDate = new Date(dateStr);
    const refDate = new Date('1900-01-01');
    const diffDays = Math.floor((userDate - refDate) / (1000 * 60 * 60 * 24));
    let stemIndex = (0 + diffDays) % 10;
    if (stemIndex < 0) stemIndex += 10;

    // 0,1=Wood, 2,3=Fire, 4,5=Earth, 6,7=Metal, 8,9=Water
    let myElement = 'WOOD';
    if (stemIndex <= 1) myElement = 'WOOD';
    else if (stemIndex <= 3) myElement = 'FIRE';
    else if (stemIndex <= 5) myElement = 'EARTH';
    else if (stemIndex <= 7) myElement = 'METAL';
    else myElement = 'WATER';

    // Simple Opposition Logic
    let lacking = 'EARTH';
    if (myElement === 'WOOD') lacking = 'METAL';
    if (myElement === 'FIRE') lacking = 'WATER';
    if (myElement === 'EARTH') lacking = 'WOOD';
    if (myElement === 'METAL') lacking = 'FIRE';
    if (myElement === 'WATER') lacking = 'EARTH';

    return { myElement, lacking };
}

function displayResult(res) {
    const el = ELEMENTS[res.lacking];

    document.getElementById('lacking-element').innerText = el.name;
    document.getElementById('lacking-element').style.color = el.color;

    document.getElementById('desc-total').innerText = `딥러닝 분석 결과, 귀하에게는 [${el.name}] 기운의 보강이 시급합니다.`;
    document.getElementById('desc-wealth').innerText = `${el.direction} 방향의 귀인을 찾으세요. 행운의 숫자는 ${el.numbers.join(', ')}입니다.`;
    document.getElementById('desc-health').innerText = el.health;

    // Generate Lotto List
    const nums = [];
    if (el.numbers[0]) nums.push(el.numbers[0]);
    if (el.numbers[1]) nums.push(el.numbers[1]);
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

    // Affiliate Link    // 4. Update Lucky Item Link
    const itemLink = document.getElementById('lucky-item-link');

    // Pick Random Link from the array (5 items)
    const randomUrl = el.links[Math.floor(Math.random() * el.links.length)];

    // Safety check: if empty string (placeholder), fallback to first item
    itemLink.href = randomUrl || el.links[0];

    itemLink.textContent = `🎁 행운의 아이템: ${el.name.split('(')[0]} 기운 보충하기`;
    // Open in new tab?
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

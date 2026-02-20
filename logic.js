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
        name: '목(재능)', color: '#2e7d32', numbers: [3, 8], direction: '동쪽',
        searchQuery: '행운의 나무 도장'
    },
    FIRE: {
        name: '화(열정)', color: '#c62828', numbers: [2, 7], direction: '남쪽',
        searchQuery: '레드 스카프'
    },
    EARTH: {
        name: '토(신용)', color: '#f9a825', numbers: [5, 10], direction: '중앙',
        searchQuery: '황금 두꺼비'
    },
    METAL: {
        name: '금(결단)', color: '#455a64', numbers: [4, 9], direction: '서쪽',
        searchQuery: '메탈 시계'
    },
    WATER: {
        name: '수(지혜)', color: '#1565c0', numbers: [1, 6], direction: '북쪽',
        searchQuery: '검정 지갑'
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
    document.getElementById('desc-health').innerText = `명상을 통해 기운을 다스리십시오.`;

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

    // Affiliate Link Logic (Coupang Search)
    const linkBtn = document.getElementById('lucky-item-link');
    const searchUrl = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(el.searchQuery)}`;
    linkBtn.href = searchUrl;
    linkBtn.target = "_blank";
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

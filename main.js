// ==========================================================================
// NINTENDO.COM (2001 HARDWARE EDITION) INTERACTIVE LOGIC (main.js)
// Player's Bio tabs, Player's Poll counter, Code Bank & Sound/Alert Feedback
// ==========================================================================

// 1. 공식 개발자 스테이트먼트 (Player's Bio Presets)
const bioStatements = [
  {
    category: "CLASSIFICATION: GROWTH & PASSION 💡",
    text: "💡 기술로 아이디어를 실물 소프트웨어로 구현하는 것에 진심인 개발자 김태우입니다. 항상 새로운 기술을 학습하고 흡수하며, 매일 더 단단하고 실용적인 엔지니어로 성장하고 있습니다."
  },
  {
    category: "CLASSIFICATION: AI & VIBE CODING ⚡",
    text: "⚡ 최신 AI 어시스턴트와 최첨단 웹 기술을 페어링하여 아이디어를 빛의 속도로 실체화하는 바이브 코더(Vibe Coder)입니다. 빠른 프로토타이핑과 집요한 문제 해결을 즐깁니다."
  },
  {
    category: "CLASSIFICATION: USER & PROBLEM SOLVER 🛠️",
    text: "🛠️ 일상의 불편함을 예리하게 포착해 깔끔한 코드로 해결합니다. 직관적인 인터페이스와 군더더기 없는 성능으로 사람들에게 명확한 가치를 전달하는 제품을 지향합니다."
  }
];

let activeBioIndex = 0;

// DOM 요소
const bioDisplayText = document.getElementById("bio-display-text");
const bioCategoryLabel = document.getElementById("bio-category-label");
const bioNavTabs = document.querySelectorAll(".bio-nav-tab");
const copyBioTextBtn = document.getElementById("copy-bio-text-btn");

const pollForm = document.getElementById("poll-form");
const totalCheersEl = document.getElementById("total-cheers");

const heroEmailBtn = document.getElementById("hero-email-btn");
const copyEmailRailBtn = document.getElementById("copy-email-rail-btn");
const shareRailBtn = document.getElementById("share-rail-btn");

const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

const codeBankBtn = document.getElementById("code-bank-btn");
const gameFinderBtn = document.getElementById("game-finder-btn");
const promoCodeBtn = document.getElementById("promo-code-btn");

const retroToast = document.getElementById("retro-toast");
const retroToastMsg = document.getElementById("retro-toast-msg");
const themeRetroToggle = document.getElementById("theme-retro-toggle");

// --------------------------------------------------------------------------
// 2. 닌텐도 콘솔 토스트 알림 (Retro Hardware Toast Alert)
// --------------------------------------------------------------------------
let toastTimer = null;
function showRetroAlert(msg) {
  if (toastTimer) clearTimeout(toastTimer);
  retroToastMsg.textContent = msg;
  retroToast.classList.add("show");

  toastTimer = setTimeout(() => {
    retroToast.classList.remove("show");
  }, 2400);
}

// --------------------------------------------------------------------------
// 3. 바이오 탭 전환 (Player's Bio)
// --------------------------------------------------------------------------
function switchBio(index) {
  activeBioIndex = index;
  const bio = bioStatements[index];

  bioDisplayText.style.opacity = "0";
  setTimeout(() => {
    bioDisplayText.textContent = bio.text;
    if (bioCategoryLabel) bioCategoryLabel.textContent = bio.category;
    bioDisplayText.style.opacity = "1";
  }, 120);

  bioNavTabs.forEach((tab, i) => {
    if (i === index) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
}

bioNavTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const idx = parseInt(tab.getAttribute("data-index"), 10);
    switchBio(idx);
  });
});

if (copyBioTextBtn) {
  copyBioTextBtn.addEventListener("click", async () => {
    const text = bioStatements[activeBioIndex].text;
    await copyToClipboard(text);
    showRetroAlert("DEV BIO COPIED TO CLIPBOARD!");
  });
}

// --------------------------------------------------------------------------
// 4. 플레이어스 폴 (Player's Poll: Vote & Cheer)
// --------------------------------------------------------------------------
let pollTally = parseInt(localStorage.getItem("nintendo-poll-tally") || "2001", 10);
if (totalCheersEl) totalCheersEl.textContent = pollTally.toLocaleString();

if (pollForm) {
  pollForm.addEventListener("submit", (e) => {
    e.preventDefault();
    pollTally += 1;
    localStorage.setItem("nintendo-poll-tally", pollTally);
    if (totalCheersEl) totalCheersEl.textContent = pollTally.toLocaleString();

    // 8비트 파티클 이펙트
    trigger8BitBurst(e);
    showRetroAlert("THANK YOU FOR VOTING! +1 VOTE RECORDED");
  });
}

function trigger8BitBurst(e) {
  const rect = pollForm.getBoundingClientRect();
  const particles = ["★", "⚡", "🍄", "1UP", "🪙", "🔥"];
  
  for (let i = 0; i < 5; i++) {
    const p = document.createElement("div");
    p.textContent = particles[Math.floor(Math.random() * particles.length)];
    p.style.position = "fixed";
    p.style.left = `${(e.clientX || (rect.left + rect.width / 2))}px`;
    p.style.top = `${(e.clientY || (rect.top + 40))}px`;
    p.style.fontFamily = "'Silkscreen', monospace";
    p.style.fontSize = "14px";
    p.style.color = "#f68d1f";
    p.style.textShadow = "1px 1px 0 #000";
    p.style.pointerEvents = "none";
    p.style.zIndex = "99999";
    p.style.transition = "all 0.7s cubic-bezier(0.18, 0.89, 0.32, 1.28)";
    p.style.transform = "translate(-50%, -50%) scale(1)";

    document.body.appendChild(p);

    const deltaX = (Math.random() - 0.5) * 120;
    const deltaY = -60 - Math.random() * 50;

    requestAnimationFrame(() => {
      p.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(1.4)`;
      p.style.opacity = "0";
    });

    setTimeout(() => {
      if (p.parentNode) p.parentNode.removeChild(p);
    }, 750);
  }
}

// --------------------------------------------------------------------------
// 5. 클립보드 복사 헬퍼 & 연락처 기능
// --------------------------------------------------------------------------
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

if (copyEmailRailBtn) {
  copyEmailRailBtn.addEventListener("click", async () => {
    const email = copyEmailRailBtn.getAttribute("data-email");
    await copyToClipboard(email);
    showRetroAlert("CUSTOMER SERVICE EMAIL COPIED!");
  });
}

if (heroEmailBtn) {
  heroEmailBtn.addEventListener("click", async () => {
    const email = "188890878+VV743@users.noreply.github.com";
    await copyToClipboard(email);
    showRetroAlert("EMAIL COPIED: " + email);
  });
}

if (shareRailBtn) {
  shareRailBtn.addEventListener("click", async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "VV743 (Nintendo 2001 Hardware Edition)",
          url: url
        });
      } else {
        await copyToClipboard(url);
        showRetroAlert("CONTROLLER LINK COPIED TO CLIPBOARD!");
      }
    } catch {
      await copyToClipboard(url);
      showRetroAlert("CONTROLLER LINK COPIED TO CLIPBOARD!");
    }
  });
}

// --------------------------------------------------------------------------
// 6. 검색 & 코드 뱅크 유틸리티 칩
// --------------------------------------------------------------------------
if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const q = searchInput.value.trim() || "Vibe Coding";
    showRetroAlert(`SEARCH QUERY: "${q}" EXECUTED!`);
  });
}

if (codeBankBtn) {
  codeBankBtn.addEventListener("click", () => {
    showRetroAlert("CODE BANK CHEATS: VITE + AI + CLEAN CODE");
  });
}

if (gameFinderBtn) {
  gameFinderBtn.addEventListener("click", () => {
    const target = document.getElementById("projects-panel");
    if (target) target.scrollIntoView({ behavior: "smooth" });
    showRetroAlert("GAME FINDER: JUMPING TO FEATURED ARCHIVE!");
  });
}

if (promoCodeBtn) {
  promoCodeBtn.addEventListener("click", () => {
    showRetroAlert("SECRET CODE UNLOCKED: ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️ B A");
  });
}

// --------------------------------------------------------------------------
// 7. 레트로 테마 스위치 (Periwinkle Chrome 2001 vs Indigo Night)
// --------------------------------------------------------------------------
let isIndigo = localStorage.getItem("nintendo-night-theme") === "true";
function applyConsoleTheme(night) {
  isIndigo = night;
  if (night) {
    document.body.style.backgroundColor = "#1b233a";
    themeRetroToggle.textContent = "THEME: [INDIGO NIGHT 2001]";
    localStorage.setItem("nintendo-night-theme", "true");
  } else {
    document.body.style.backgroundColor = "#556288";
    themeRetroToggle.textContent = "THEME: [PERIWINKLE 2001]";
    localStorage.setItem("nintendo-night-theme", "false");
  }
}

if (themeRetroToggle) {
  applyConsoleTheme(isIndigo);
  themeRetroToggle.addEventListener("click", () => {
    applyConsoleTheme(!isIndigo);
    showRetroAlert(!isIndigo ? "INDIGO NIGHT CHASSIS ENGAGED!" : "PERIWINKLE CHROME RESTORED!");
  });
}

// 초기 로딩
switchBio(0);

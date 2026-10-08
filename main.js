// ==========================================================================
// NEOBRUTALISM PROFILE LOGIC (main.js)
// Tactile clicks, window tab controls, cheer counter & theme switcher
// ==========================================================================

// 1. 추천 개발자 바이오 데이터
const developerBioPresets = [
  {
    category: "성장 & 열정형 💡",
    text: "💡 기술로 아이디어를 실물 소프트웨어로 구현하는 것에 진심인 개발자 김태우입니다. 항상 새로운 기술을 학습하고 흡수하며, 매일 더 단단하고 실용적인 엔지니어로 성장하고 있습니다."
  },
  {
    category: "AI & 바이브 코딩형 ⚡",
    text: "⚡ 최신 AI 어시스턴트와 최첨단 웹 기술을 페어링하여 아이디어를 빛의 속도로 실체화하는 바이브 코더(Vibe Coder)입니다. 빠른 프로토타이핑과 집요한 문제 해결을 즐깁니다."
  },
  {
    category: "사용자 & 문제 해결형 🛠️",
    text: "🛠️ 일상의 불편함을 예리하게 포착해 깔끔한 코드로 해결합니다. 직관적인 인터페이스와 군더더기 없는 성능으로 사람들에게 명확한 가치를 전달하는 제품을 지향합니다."
  }
];

let currentBioIndex = 0;

// DOM 요소 캐싱
const bioContent = document.getElementById("bio-content");
const bioCategory = document.getElementById("bio-category");
const bioTabs = document.querySelectorAll(".neo-tab");
const copyBioBtn = document.getElementById("copy-bio-btn");

const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeLabel = document.getElementById("theme-label");

const shareBtn = document.getElementById("share-btn");
const copyEmailBtn = document.getElementById("copy-email-btn");

const cheerBtn = document.getElementById("cheer-btn");
const cheerCountEl = document.getElementById("cheer-count");

const toast = document.getElementById("toast");
const toastText = document.getElementById("toast-text");

const filterTabs = document.querySelectorAll(".filter-tab");
const skillBricks = document.querySelectorAll(".skill-brick");

// --------------------------------------------------------------------------
// 2. 토스트 알림 헬퍼
// --------------------------------------------------------------------------
let toastTimer = null;
function showNeoToast(message) {
  if (toastTimer) clearTimeout(toastTimer);
  toastText.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// --------------------------------------------------------------------------
// 3. 바이오 탭 제어 로직
// --------------------------------------------------------------------------
function updateBio(index) {
  currentBioIndex = index;
  const bio = developerBioPresets[index];

  bioContent.style.opacity = "0";
  bioContent.style.transform = "translateY(3px)";

  setTimeout(() => {
    bioContent.textContent = bio.text;
    if (bioCategory) bioCategory.textContent = bio.category;
    bioContent.style.opacity = "1";
    bioContent.style.transform = "translateY(0)";
  }, 140);

  bioTabs.forEach((tab, i) => {
    if (i === index) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
}

bioTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const idx = parseInt(tab.getAttribute("data-index"), 10);
    updateBio(idx);
  });
});

// 바이오 텍스트 복사
if (copyBioBtn) {
  copyBioBtn.addEventListener("click", async () => {
    const textToCopy = developerBioPresets[currentBioIndex].text;
    await copyText(textToCopy);
    showNeoToast("소개글 텍스트가 복사되었습니다!");
  });
}

// --------------------------------------------------------------------------
// 4. 다크 모드 / 라이트 모드 (Cyber Neobrutalism 토글)
// --------------------------------------------------------------------------
function setTheme(isDark) {
  if (isDark) {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    if (themeIcon) themeIcon.textContent = "☀️";
    if (themeLabel) themeLabel.textContent = "LIGHT";
    localStorage.setItem("neo-theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    if (themeIcon) themeIcon.textContent = "🌙";
    if (themeLabel) themeLabel.textContent = "DARK";
    localStorage.setItem("neo-theme", "light");
  }
}

// 초기 테마 복원
const savedNeoTheme = localStorage.getItem("neo-theme");
if (savedNeoTheme === "dark") {
  setTheme(true);
} else {
  setTheme(false);
}

themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark-mode");
  setTheme(!isDark);
  showNeoToast(!isDark ? "다크 사이버 모드로 전환!" : "라이트 캔버스 모드로 전환!");
});

// --------------------------------------------------------------------------
// 5. 기술 스택 필터링 탭
// --------------------------------------------------------------------------
filterTabs.forEach(btn => {
  btn.addEventListener("click", () => {
    filterTabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");
    skillBricks.forEach(brick => {
      const category = brick.getAttribute("data-category");
      if (filter === "all" || category === filter) {
        brick.classList.remove("hidden");
      } else {
        brick.classList.add("hidden");
      }
    });
  });
});

// --------------------------------------------------------------------------
// 6. 인터랙티브 응원하기 (+1 카운트 & 네오 팝핑 이모지)
// --------------------------------------------------------------------------
let cheerCount = parseInt(localStorage.getItem("neo-cheer-count") || "42", 10);
if (cheerCountEl) cheerCountEl.textContent = cheerCount;

function popNeoParticle(e) {
  const emojis = ["💥", "🔥", "🚀", "👏", "⚡", "❤️", "⭐"];
  const particle = document.createElement("div");
  particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  particle.style.position = "fixed";
  particle.style.left = `${e.clientX || (window.innerWidth / 2)}px`;
  particle.style.top = `${e.clientY || (window.innerHeight / 2)}px`;
  particle.style.fontSize = "1.8rem";
  particle.style.pointerEvents = "none";
  particle.style.zIndex = "9999";
  particle.style.fontWeight = "900";
  particle.style.transition = "all 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28)";
  particle.style.transform = "translate(-50%, -50%) scale(0.6) rotate(0deg)";
  particle.style.opacity = "1";

  document.body.appendChild(particle);

  const angle = (Math.random() - 0.5) * 120;
  const deltaX = (Math.random() - 0.5) * 160;
  const deltaY = -80 - Math.random() * 80;

  requestAnimationFrame(() => {
    particle.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(1.6) rotate(${angle}deg)`;
    particle.style.opacity = "0";
  });

  setTimeout(() => {
    if (particle.parentNode) particle.parentNode.removeChild(particle);
  }, 850);
}

if (cheerBtn) {
  cheerBtn.addEventListener("click", (e) => {
    cheerCount += 1;
    localStorage.setItem("neo-cheer-count", cheerCount);
    if (cheerCountEl) cheerCountEl.textContent = cheerCount;

    popNeoParticle(e);
  });
}

// --------------------------------------------------------------------------
// 7. 클립보드 복사 헬퍼 & 이메일 / 링크 공유
// --------------------------------------------------------------------------
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
  }
}

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async () => {
    const email = copyEmailBtn.getAttribute("data-email");
    await copyText(email);
    showNeoToast("이메일 주소가 복사되었습니다! ✉️");
  });
}

if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "김태우 (VV743) Neobrutalism Dev Profile",
          url: url
        });
      } else {
        await copyText(url);
        showNeoToast("프로필 웹 링크가 복사되었습니다! 🔗");
      }
    } catch {
      await copyText(url);
      showNeoToast("프로필 웹 링크가 복사되었습니다! 🔗");
    }
  });
}

// --------------------------------------------------------------------------
// 8. 초기 상태 세팅
// --------------------------------------------------------------------------
updateBio(0);

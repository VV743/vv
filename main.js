// ========================================================
// 김태우 (VV743) - 모던 개발자 프로필 스크립트 (main.js)
// ========================================================

// 1. 추천 개발자 소개글 데이터
const developerBioPresets = [
  {
    category: "성장 & 열정형",
    text: "💡 기술로 아이디어를 현실로 구현하는 것을 즐기는 개발자 김태우입니다. 항상 새로운 것을 배우고 탐구하며, 매일 한 걸음씩 더 단단한 엔지니어로 성장하고 있습니다."
  },
  {
    category: "AI & 바이브 코딩형",
    text: "⚡ 최신 AI 도구와 모던 웹 생태계를 융합하여 상상을 신속하게 소프트웨어로 실현하는 바이브 코더(Vibe Coder)입니다. 빠른 프로토타이핑과 기민한 문제 해결을 지향합니다."
  },
  {
    category: "사용자 & 문제 해결형",
    text: "🛠️ 일상의 불편함을 기술로 해결하고 더 나은 사용자 경험을 만드는 데 집중합니다. 직관적이고 깔끔한 코드로 사람들에게 실질적인 가치를 전하고자 합니다."
  }
];

let currentBioIndex = 0;

// DOM 요소 참조
const bioContent = document.getElementById("bio-content");
const bioCategory = document.getElementById("bio-category");
const bioTabs = document.querySelectorAll(".tab-btn");
const copyBioBtn = document.getElementById("copy-bio-btn");

const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const shareBtn = document.getElementById("share-btn");
const copyEmailBtn = document.getElementById("copy-email-btn");

const cheerBtn = document.getElementById("cheer-btn");
const cheerCountEl = document.getElementById("cheer-count");
const cheerIconEl = document.getElementById("cheer-icon");

const toast = document.getElementById("toast");
const toastText = document.getElementById("toast-text");
const cursorGlow = document.getElementById("cursor-glow");

const filterChips = document.querySelectorAll(".filter-chip");
const skillItems = document.querySelectorAll(".skill-item");

// ----------------------------------------------------
// 토스트 메시지 헬퍼
// ----------------------------------------------------
let toastTimeout = null;
function showToast(message, icon = "✨") {
  if (toastTimeout) clearTimeout(toastTimeout);
  
  toastText.textContent = message;
  const iconEl = toast.querySelector(".toast-icon");
  if (iconEl) iconEl.textContent = icon;

  toast.classList.add("show");
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2300);
}

// ----------------------------------------------------
// 2. 바이오 탭 전환 로직
// ----------------------------------------------------
function updateBio(index) {
  currentBioIndex = index;
  const bio = developerBioPresets[index];

  bioContent.style.opacity = "0";
  bioContent.style.transform = "translateY(4px)";

  setTimeout(() => {
    bioContent.textContent = bio.text;
    if (bioCategory) bioCategory.textContent = bio.category;
    bioContent.style.opacity = "1";
    bioContent.style.transform = "translateY(0)";
  }, 160);

  bioTabs.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

bioTabs.forEach(btn => {
  btn.addEventListener("click", () => {
    const index = parseInt(btn.getAttribute("data-index"), 10);
    updateBio(index);
  });
});

if (copyBioBtn) {
  copyBioBtn.addEventListener("click", async () => {
    const textToCopy = developerBioPresets[currentBioIndex].text;
    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast("소개글이 클립보드에 복사되었습니다!", "📋");
    } catch {
      copyToClipboardFallback(textToCopy);
      showToast("소개글이 클립보드에 복사되었습니다!", "📋");
    }
  });
}

// ----------------------------------------------------
// 3. 다크 모드 / 라이트 모드 전환 로직
// ----------------------------------------------------
function applyTheme(isDark) {
  if (isDark) {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    if (themeIcon) themeIcon.textContent = "☀️";
    localStorage.setItem("user-theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    if (themeIcon) themeIcon.textContent = "🌙";
    localStorage.setItem("user-theme", "light");
  }
}

// 저장된 테마 불러오기
const savedTheme = localStorage.getItem("user-theme");
if (savedTheme === "light") {
  applyTheme(false);
} else {
  applyTheme(true);
}

themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark-mode");
  applyTheme(!isDark);
  showToast(!isDark ? "다크 테마가 적용되었습니다" : "라이트 테마가 적용되었습니다", !isDark ? "🌙" : "☀️");
});

// ----------------------------------------------------
// 4. 기술 스택 필터링 기능
// ----------------------------------------------------
filterChips.forEach(chip => {
  chip.addEventListener("click", () => {
    filterChips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");

    const filter = chip.getAttribute("data-filter");
    skillItems.forEach(item => {
      const category = item.getAttribute("data-category");
      if (filter === "all" || category === filter) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  });
});

// ----------------------------------------------------
// 5. 인터랙티브 응원하기 (+1 카운터 & 플로팅 하트 이펙트)
// ----------------------------------------------------
let cheerCount = parseInt(localStorage.getItem("dev-cheer-count") || "12", 10);
if (cheerCountEl) cheerCountEl.textContent = cheerCount;

function createFloatingHeart(e) {
  const heart = document.createElement("span");
  heart.textContent = ["💖", "✨", "👏", "🔥", "🚀"][Math.floor(Math.random() * 5)];
  heart.style.position = "fixed";
  heart.style.left = `${e.clientX || (window.innerWidth / 2)}px`;
  heart.style.top = `${e.clientY || (window.innerHeight / 2)}px`;
  heart.style.pointerEvents = "none";
  heart.style.fontSize = "1.5rem";
  heart.style.zIndex = "1000";
  heart.style.transition = "all 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)";
  heart.style.transform = "translate(-50%, -50%) scale(1)";
  heart.style.opacity = "1";

  document.body.appendChild(heart);

  const deltaX = (Math.random() - 0.5) * 80;
  const deltaY = -70 - Math.random() * 50;

  requestAnimationFrame(() => {
    heart.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(1.4)`;
    heart.style.opacity = "0";
  });

  setTimeout(() => {
    if (heart.parentNode) heart.parentNode.removeChild(heart);
  }, 950);
}

if (cheerBtn) {
  cheerBtn.addEventListener("click", (e) => {
    cheerCount += 1;
    localStorage.setItem("dev-cheer-count", cheerCount);
    if (cheerCountEl) cheerCountEl.textContent = cheerCount;

    cheerBtn.classList.add("bounce");
    setTimeout(() => cheerBtn.classList.remove("bounce"), 400);

    createFloatingHeart(e);
  });
}

// ----------------------------------------------------
// 6. 클립보드 복사 헬퍼 & 이메일 / 링크 복사
// ----------------------------------------------------
function copyToClipboardFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async () => {
    const email = copyEmailBtn.getAttribute("data-email");
    try {
      await navigator.clipboard.writeText(email);
      showToast("이메일 주소가 복사되었습니다! 💌", "📧");
    } catch {
      copyToClipboardFallback(email);
      showToast("이메일 주소가 복사되었습니다! 💌", "📧");
    }
  });
}

if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "김태우 (VV743) 개발자 프로필",
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("프로필 웹 링크가 복사되었습니다! 🔗", "🔗");
      }
    } catch {
      copyToClipboardFallback(url);
      showToast("프로필 웹 링크가 복사되었습니다! 🔗", "🔗");
    }
  });
}

// ----------------------------------------------------
// 7. 마우스 추적 조명 효과 (Desktop Spotlight)
// ----------------------------------------------------
if (cursorGlow && window.innerWidth > 640) {
  window.addEventListener("pointermove", (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  }, { passive: true });
}

// ----------------------------------------------------
// 8. 초기 로드 시 첫 번째 바이오 표시
// ----------------------------------------------------
updateBio(0);

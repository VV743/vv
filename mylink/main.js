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

// --------------------------------------------------------------------------
// 8. 프로필 편집 (SCR-07/08: localStorage 기반 프로필 관리)
// --------------------------------------------------------------------------
const PROFILE_STORAGE_KEY = "mylink-profile";

const DEFAULT_PROFILE = {
  nickname: "김태우",
  bio: "💡 기술로 아이디어를 실물 소프트웨어로 구현하는 것에 진심인 개발자 김태우입니다.",
  avatarUrl: "https://avatars.githubusercontent.com/u/188890878?v=4",
  siteName: "VV743.com",
};

// --- localStorage 헬퍼 ---
function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : { ...DEFAULT_PROFILE };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function saveProfile(data) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
}

// --- DOM에 프로필 반영 ---
function applyProfileToDOM(profile) {
  // 말풍선 닉네임
  const nicknameEl = document.getElementById("profile-nickname");
  if (nicknameEl) nicknameEl.textContent = profile.nickname;

  // 말풍선 사이트명
  const siteNameEl = document.getElementById("profile-site-name");
  if (siteNameEl) siteNameEl.textContent = profile.siteName;

  // 아바타 이미지
  const avatarImg = document.getElementById("profile-avatar-img");
  if (avatarImg && profile.avatarUrl) {
    avatarImg.src = profile.avatarUrl;
    avatarImg.onerror = () => {
      avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.nickname)}&background=e60012&color=fff&size=100&bold=true`;
    };
  }

  // 히어로 섹션 설명 텍스트 (첫 번째 바이오 탭에 반영)
  const heroBioText = document.getElementById("bio-display-text");
  if (heroBioText && profile.bio) {
    bioStatements[0] = { ...bioStatements[0], text: profile.bio };
    if (activeBioIndex === 0) switchBio(0);
  }
}

// --- 모달 열기/닫기 ---
const profileModal = document.getElementById("profile-edit-modal");
const openProfileEditBtn = document.getElementById("open-profile-edit-btn");
const closeProfileEditBtn = document.getElementById("close-profile-edit-btn");

const editNicknameInput = document.getElementById("edit-nickname");
const editBioTextarea = document.getElementById("edit-bio");
const editAvatarUrlInput = document.getElementById("edit-avatar-url");
const bioCharCount = document.getElementById("bio-char-count");
const modalAvatarPreview = document.getElementById("modal-avatar-preview");
const profileEditForm = document.getElementById("profile-edit-form");
const profileResetBtn = document.getElementById("profile-reset-btn");

function openProfileModal() {
  const profile = loadProfile();
  if (editNicknameInput) editNicknameInput.value = profile.nickname;
  if (editBioTextarea) {
    editBioTextarea.value = profile.bio;
    updateBioCharCount();
  }
  if (editAvatarUrlInput) editAvatarUrlInput.value = profile.avatarUrl;
  updateModalAvatarPreview(profile.avatarUrl, profile.nickname);

  profileModal.removeAttribute("hidden");
  profileModal.classList.add("is-open");
  document.body.style.overflow = "hidden";
  if (editNicknameInput) editNicknameInput.focus();
}

function closeProfileModal() {
  profileModal.setAttribute("hidden", "");
  profileModal.classList.remove("is-open");
  document.body.style.overflow = "";
}

function updateBioCharCount() {
  if (bioCharCount && editBioTextarea) {
    bioCharCount.textContent = editBioTextarea.value.length;
  }
}

function updateModalAvatarPreview(url, nickname) {
  if (!modalAvatarPreview) return;
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(nickname || "VV")}&background=e60012&color=fff&size=100&bold=true`;
  modalAvatarPreview.src = url || fallback;
  modalAvatarPreview.onerror = () => { modalAvatarPreview.src = fallback; };
}

// --- 닉네임 유효성 검사 ---
function validateNickname(value) {
  const trimmed = value.trim();
  if (trimmed.length < 2) return "닉네임은 최소 2자 이상이어야 합니다.";
  if (trimmed.length > 20) return "닉네임은 최대 20자까지 가능합니다.";
  if (/[<>"'`]/.test(trimmed)) return "사용할 수 없는 특수문자가 포함되어 있습니다.";
  return null;
}

// --- 이벤트 바인딩 ---
if (openProfileEditBtn) {
  openProfileEditBtn.addEventListener("click", openProfileModal);
}

if (closeProfileEditBtn) {
  closeProfileEditBtn.addEventListener("click", closeProfileModal);
}

// 오버레이 클릭 시 모달 닫기
if (profileModal) {
  profileModal.addEventListener("click", (e) => {
    if (e.target === profileModal) closeProfileModal();
  });
}

// ESC 키로 모달 닫기
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && profileModal && !profileModal.hasAttribute("hidden")) {
    closeProfileModal();
  }
});

// 바이오 글자 수 카운터 실시간 업데이트
if (editBioTextarea) {
  editBioTextarea.addEventListener("input", updateBioCharCount);
}

// 아바타 URL 입력 시 미리보기 실시간 반영
if (editAvatarUrlInput) {
  editAvatarUrlInput.addEventListener("input", () => {
    const nick = editNicknameInput ? editNicknameInput.value : "VV";
    updateModalAvatarPreview(editAvatarUrlInput.value.trim(), nick);
  });
}

// 저장 (폼 제출)
if (profileEditForm) {
  profileEditForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nickname = editNicknameInput ? editNicknameInput.value.trim() : "";
    const nicknameError = validateNickname(nickname);
    if (nicknameError) {
      showRetroAlert("⚠️ " + nicknameError);
      editNicknameInput.focus();
      return;
    }

    const bio = editBioTextarea ? editBioTextarea.value.trim() : "";
    const avatarUrl = editAvatarUrlInput ? editAvatarUrlInput.value.trim() : "";

    const updatedProfile = {
      ...loadProfile(),
      nickname,
      bio: bio || DEFAULT_PROFILE.bio,
      avatarUrl: avatarUrl || DEFAULT_PROFILE.avatarUrl,
    };

    saveProfile(updatedProfile);
    applyProfileToDOM(updatedProfile);
    closeProfileModal();
    showRetroAlert("✅ PROFILE SAVED TO CARTRIDGE!");
  });
}

// 초기화 버튼
if (profileResetBtn) {
  profileResetBtn.addEventListener("click", () => {
    if (editNicknameInput) editNicknameInput.value = DEFAULT_PROFILE.nickname;
    if (editBioTextarea) {
      editBioTextarea.value = DEFAULT_PROFILE.bio;
      updateBioCharCount();
    }
    if (editAvatarUrlInput) editAvatarUrlInput.value = DEFAULT_PROFILE.avatarUrl;
    updateModalAvatarPreview(DEFAULT_PROFILE.avatarUrl, DEFAULT_PROFILE.nickname);
    showRetroAlert("🔄 RESET TO FACTORY DEFAULTS!");
  });
}

// --- 페이지 로드 시 저장된 프로필 복원 ---
applyProfileToDOM(loadProfile());

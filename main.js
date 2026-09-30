// 추천 개발자 소개글 데이터
const developerBioPresets = [
  {
    type: "성장 & 열정형 (추천)",
    text: "💡 기술로 아이디어를 현실로 구현하는 것을 즐기는 개발자 김태우입니다. 항상 새로운 것을 배우고 탐구하며, 매일 한 걸음씩 더 단단한 엔지니어로 성장하고 있습니다."
  },
  {
    type: "AI & 실용형 (Vibe Coding)",
    text: "⚡ AI 도구와 최신 웹 기술을 융합하여 상상을 빠르게 소프트웨어로 실현하는 바이브 코더(Vibe Coder)입니다. 빠른 프로토타이핑과 기민한 문제 해결을 지향합니다."
  },
  {
    type: "사용자 & 문제해결형",
    text: "🛠️ 일상의 불편함을 기술로 해결하고 더 나은 사용자 경험을 만드는 데 집중합니다. 직관적이고 깔끔한 코드로 사람들에게 유용한 가치를 전하고자 합니다."
  }
];

let currentBioIndex = 0;

// DOM 요소
const bioContent = document.getElementById("bio-content");
const bioTypeTag = document.getElementById("bio-type-tag");
const presetButtons = document.querySelectorAll(".preset-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.querySelector(".icon-theme");
const copyEmailBtn = document.getElementById("copy-email-btn");
const toast = document.getElementById("toast");

// 소개글 업데이트 함수
function updateBio(index) {
  currentBioIndex = index;
  const bio = developerBioPresets[index];

  // 페이드 효과
  bioContent.style.opacity = "0";
  setTimeout(() => {
    bioContent.textContent = bio.text;
    bioTypeTag.textContent = bio.type;
    bioContent.style.opacity = "1";
  }, 150);

  // 버튼 활성화 상태 업데이트
  presetButtons.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// 프리셋 버튼 클릭 이벤트
presetButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const index = parseInt(btn.getAttribute("data-index"), 10);
    updateBio(index);
  });
});

// 테마 토글 (다크 모드 / 라이트 모드)
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.remove("dark-mode");
  document.body.classList.add("light-mode");
  themeIcon.textContent = "🌙";
} else {
  document.body.classList.remove("light-mode");
  document.body.classList.add("dark-mode");
  themeIcon.textContent = "☀️";
}

themeToggleBtn.addEventListener("click", () => {
  if (document.body.classList.contains("dark-mode")) {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    themeIcon.textContent = "🌙";
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    themeIcon.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  }
});

// 이메일 주소 복사 기능
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

copyEmailBtn.addEventListener("click", async () => {
  const email = copyEmailBtn.getAttribute("data-email");
  try {
    await navigator.clipboard.writeText(email);
    showToast("📧 이메일 주소가 복사되었습니다!");
  } catch (err) {
    // 클립보드 fallback
    const tempInput = document.createElement("input");
    tempInput.value = email;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    showToast("📧 이메일 주소가 복사되었습니다!");
  }
});

// 초기화
updateBio(0);

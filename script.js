const intro = document.querySelector("#intro");
const profile = document.querySelector("#profile");
const enterButton = document.querySelector("#enterButton");
const music = document.querySelector("#siteMusic");
const musicButton = document.querySelector("#musicButton");
const musicIcon = document.querySelector("#musicIcon");
const musicStatus = document.querySelector("#musicStatus");
const toast = document.querySelector("#toast");
const bloodLayer = document.querySelector("#bloodLayer");

function createDrips() {
  if (!bloodLayer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const count = window.innerWidth < 600 ? 20 : 36;
  for (let i = 0; i < count; i++) {
    const drip = document.createElement("span");
    drip.className = "drip";
    drip.style.setProperty("--left", `${Math.random() * 100}%`);
    drip.style.setProperty("--length", `${24 + Math.random() * 135}px`);
    drip.style.setProperty("--width", `${1 + Math.random() * 2.2}px`);
    drip.style.setProperty("--drop-size", `${5 + Math.random() * 6}px`);
    drip.style.setProperty("--duration", `${8 + Math.random() * 15}s`);
    drip.style.setProperty("--delay", `${-Math.random() * 22}s`);
    drip.style.setProperty("--opacity", `${0.18 + Math.random() * 0.58}`);
    bloodLayer.appendChild(drip);
  }
}
createDrips();

enterButton?.addEventListener("click", () => {
  enterButton.classList.add("entering");
  intro.classList.add("leaving");
  window.setTimeout(() => {
    intro.classList.add("hidden");
    profile.classList.remove("hidden");
  }, 350);
});

// The glass catches the cursor and gives the border a soft moving reflection.
if (profile && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  profile.addEventListener("pointermove", (event) => {
    const rect = profile.getBoundingClientRect();
    profile.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    profile.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
  profile.addEventListener("pointerleave", () => {
    profile.style.setProperty("--mx", "50%");
    profile.style.setProperty("--my", "25%");
  });
}

// Live local date and clock.
const dateNode = document.querySelector("#liveDate");
const timeNode = document.querySelector("#liveTime");
function updateClock() {
  const now = new Date();
  if (dateNode) dateNode.textContent = now.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
  if (timeNode) timeNode.textContent = now.toLocaleTimeString("ru-RU", { hour12: false });
}
updateClock();
window.setInterval(updateClock, 1000);

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

musicButton?.addEventListener("click", async () => {
  if (!music) return;
  if (music.paused) {
    try {
      await music.play();
      musicButton.classList.add("playing");
      musicButton.setAttribute("aria-pressed", "true");
      musicButton.setAttribute("aria-label", "Выключить музыку");
      musicIcon.textContent = "Ⅱ";
      musicStatus.textContent = "Сейчас играет";
    } catch {
      showToast("Не удалось запустить музыку. Проверь, что music.mp3 загружен рядом с index.html.");
    }
  } else {
    music.pause();
    musicButton.classList.remove("playing");
    musicButton.setAttribute("aria-pressed", "false");
    musicButton.setAttribute("aria-label", "Включить музыку");
    musicIcon.textContent = "▶";
    musicStatus.textContent = "Нажми, чтобы включить";
  }
});
music?.addEventListener("error", () => {
  if (musicStatus) musicStatus.textContent = "Добавь файл music.mp3";
});

// Feature 8: cinematic boot sequence before the intro screen.
const bootScreen = document.querySelector("#bootScreen");
const bootProgress = document.querySelector("#bootProgress");
const bootStatus = document.querySelector("#bootStatus");
if (bootScreen) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const steps = [
    [22, "ESTABLISHING CONNECTION"],
    [48, "LOADING VISUAL MODULES"],
    [76, "SYNCHRONIZING PROFILE"],
    [100, "WELCOME TO PANDEMIA"]
  ];
  let step = 0;
  const runBoot = () => {
    if (step < steps.length) {
      const [value, message] = steps[step++];
      if (bootProgress) bootProgress.style.width = `${value}%`;
      if (bootStatus) bootStatus.textContent = message;
      window.setTimeout(runBoot, reducedMotion ? 30 : 320);
    } else {
      window.setTimeout(() => bootScreen.classList.add("boot-done"), reducedMotion ? 30 : 450);
      window.setTimeout(() => bootScreen.remove(), reducedMotion ? 80 : 1200);
    }
  };
  runBoot();
}

// Feature 6: subtle animated blood drops travelling down the glass card.
const profileBlood = document.querySelector("#profileBlood");
if (profileBlood && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  for (let i = 0; i < 7; i++) {
    const drop = document.createElement("span");
    drop.className = "glass-blood-drop";
    drop.style.setProperty("--x", `${8 + Math.random() * 84}%`);
    drop.style.setProperty("--w", `${2 + Math.random() * 2}px`);
    drop.style.setProperty("--h", `${25 + Math.random() * 55}px`);
    drop.style.setProperty("--t", `${5 + Math.random() * 7}s`);
    drop.style.setProperty("--d", `${-Math.random() * 12}s`);
    drop.style.setProperty("--travel", `${100 + Math.random() * 230}px`);
    profileBlood.appendChild(drop);
  }
}

// Feature 11: switch between crimson, ice-blue and monochrome themes.
const themeChoices = document.querySelectorAll(".theme-choice");
const availableThemes = ["crimson", "ice", "void"];
function setTheme(theme) {
  if (!availableThemes.includes(theme)) return;
  document.documentElement.dataset.theme = theme;
  document.body.classList.remove("theme-ice", "theme-void");
  if (theme !== "crimson") document.body.classList.add(`theme-${theme}`);
  themeChoices.forEach((button) => {
    const selected = button.dataset.theme === theme;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}
themeChoices.forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.theme));
});
setTheme("crimson");

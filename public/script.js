// Год в подвале
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Тема: светлая (бежево-синяя) / тёмная (синяя) ----------
const root = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeBtn.textContent = theme === "dark" ? "Светлая тема" : "Тёмная тема";
}

let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch {}
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeBtn.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch {}
});

// ---------- Вкладки: показываем один раздел за раз ----------
const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = tabs.map((t) => document.getElementById(t.dataset.tab));

function showTab(id, updateHash = true) {
  tabs.forEach((t) => {
    const active = t.dataset.tab === id;
    t.setAttribute("aria-selected", String(active));
    t.tabIndex = active ? 0 : -1;
  });
  panels.forEach((p) => { p.hidden = p.id !== id; });
  if (updateHash) {
    try { history.replaceState(null, "", "#" + id); } catch {}
  }
}

tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => showTab(tab.dataset.tab));

  // Стрелки влево/вправо переключают вкладки с клавиатуры
  tab.addEventListener("keydown", (e) => {
    let j = null;
    if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
    if (j !== null) {
      e.preventDefault();
      tabs[j].focus();
      showTab(tabs[j].dataset.tab);
    }
  });
});

// Открыть нужную вкладку по ссылке вида index.html#stack
const fromHash = location.hash.slice(1);
showTab(tabs.some((t) => t.dataset.tab === fromHash) ? fromHash : "about", false);

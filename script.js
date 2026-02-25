const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function storageKey(group, key) {
  return `sb_portfolio_${group}_${key}`;
}

function loadChecklist() {
  $$(".checklist").forEach(groupEl => {
    const group = groupEl.dataset.group;
    groupEl.querySelectorAll("input[type='checkbox']").forEach(cb => {
      const saved = localStorage.getItem(storageKey(group, cb.dataset.key));
      if (saved === "1") cb.checked = true;

      cb.addEventListener("change", () => {
        localStorage.setItem(storageKey(group, cb.dataset.key), cb.checked ? "1" : "0");
        updateProgress();
      });
    });
  });
}

function calcProgress(groupName) {
  const groupEl = document.querySelector(`.checklist[data-group="${groupName}"]`);
  if (!groupEl) return { pct: 0, done: 0, total: 0 };

  const boxes = Array.from(groupEl.querySelectorAll("input[type='checkbox']"));
  const total = boxes.length;
  const done = boxes.filter(b => b.checked).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { pct, done, total };
}

function updateProgress() {
  const cert = calcProgress("certs");
  $("#certProgressText").textContent = `${cert.pct}%`;
  $("#certProgressBar").style.width = `${cert.pct}%`;

  const weekly = calcProgress("weekly");
  $("#weeklyProgressText").textContent = `${weekly.pct}%`;
  $("#weeklyProgressBar").style.width = `${weekly.pct}%`;
}

function resetAll() {
  $$(".checklist").forEach(groupEl => {
    const group = groupEl.dataset.group;
    groupEl.querySelectorAll("input[type='checkbox']").forEach(cb => {
      cb.checked = false;
      localStorage.setItem(storageKey(group, cb.dataset.key), "0");
    });
  });
  updateProgress();
}

function setupMobileMenu() {
  const btn = $("#menuBtn");
  const mobile = $("#mobileNav");
  if (!btn || !mobile) return;

  btn.addEventListener("click", () => {
    const isHidden = mobile.hasAttribute("hidden");
    if (isHidden) mobile.removeAttribute("hidden");
    else mobile.setAttribute("hidden", "");
  });

  mobile.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => mobile.setAttribute("hidden", ""));
  });
}

async function setupCopyBio() {
  const btn = $("#copyBtn");
  const bio = $("#copyBio");
  const msg = $("#copyMsg");
  if (!btn || !bio || !msg) return;

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(bio.textContent.trim());
      msg.textContent = "Copied!";
      setTimeout(() => (msg.textContent = ""), 1200);
    } catch {
      msg.textContent = "Copy failed — select the text and copy manually.";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();

  setupMobileMenu();
  loadChecklist();
  updateProgress();

  const resetBtn = $("#resetBtn");
  if (resetBtn) resetBtn.addEventListener("click", resetAll);

  setupCopyBio();
});
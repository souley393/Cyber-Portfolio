const $ = (sel) => document.querySelector(sel);

function calcProgress(groupName) {
  const groupEl = document.querySelector(`.checklist[data-group="${groupName}"]`);
  if (!groupEl) return { pct: 0 };

  const boxes = Array.from(groupEl.querySelectorAll("input[type='checkbox']"));
  const total = boxes.length;
  const done = boxes.filter(b => b.checked).length;

  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { pct };
}

function updateProgress() {
  const cert = calcProgress("certs");
  $("#certProgressText").textContent = `${cert.pct}%`;
  $("#certProgressBar").style.width = `${cert.pct}%`;

  const weekly = calcProgress("weekly");
  $("#weeklyProgressText").textContent = `${weekly.pct}%`;
  $("#weeklyProgressBar").style.width = `${weekly.pct}%`;
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
  setupCopyBio();
  updateProgress();
});

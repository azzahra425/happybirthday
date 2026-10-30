// ====== UBAH BAGIAN INI SESUAI KEBUTUHANMU ======
const CONFIG = {
  nama: "Mami",
  dari: "Uve",
  sapaan: "Semoga hari ini penuh tawa dan semua yang mami harapkan datang satu per satu.",
  pesan:
    "Semoga umur baru mami ini membawa kesehatan, rezeki yang lancar, dan banyak kebahagiaan. Terus jadi mami yang baik yaaa mih",
  foto: [
    { src: "foto/foto1.jpeg"},
    { src: "foto/foto3.jpeg"},
    { src: "foto/foto4.jpeg"},
    { src: "foto/foto2.jpeg"},
  ],
};
// =================================================

const deck = document.getElementById("deck");
const slides = deck.querySelectorAll(".slide");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const dotsEl = document.getElementById("dots");
let index = 0;

document.getElementById("nama").textContent = CONFIG.nama;
document.getElementById("dari").textContent = CONFIG.dari;
document.getElementById("sapaan").textContent = CONFIG.sapaan;
document.getElementById("pesan").textContent = CONFIG.pesan;

const hari = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
document.getElementById("tanggal").textContent = hari;

const photosEl = document.getElementById("photos");
CONFIG.foto.forEach((f) => {
  const fig = document.createElement("figure");
  fig.className = "photo";
  const img = document.createElement("img");
  img.src = f.src;
  img.alt = f.caption;
  img.loading = "lazy";
  const cap = document.createElement("figcaption");
  cap.textContent = f.caption;
  fig.append(img, cap);
  photosEl.appendChild(fig);
});

slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "dot";
  dot.setAttribute("aria-label", "Ke slide " + (i + 1));
  dot.addEventListener("click", () => go(i));
  dotsEl.appendChild(dot);
});

function go(i) {
  index = Math.max(0, Math.min(slides.length - 1, i));
  deck.dataset.index = index;
  slides.forEach((s, n) => {
    s.classList.toggle("is-active", n === index);
    s.setAttribute("aria-hidden", n === index ? "false" : "true");
  });
  dotsEl.querySelectorAll(".dot").forEach((d, n) => d.classList.toggle("is-active", n === index));
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === slides.length - 1;
  if (index === 1) burst();
}

prevBtn.addEventListener("click", () => go(index - 1));
nextBtn.addEventListener("click", () => go(index + 1));
document.getElementById("btn-buka").addEventListener("click", () => go(1));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") go(index + 1);
  if (e.key === "ArrowLeft") go(index - 1);
});

let startX = null;
deck.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
deck.addEventListener("touchend", (e) => {
  if (startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 60) go(index + (dx < 0 ? 1 : -1));
  startX = null;
});

// Confetti ringan
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
const colors = ["#8b6fd6", "#b79df0", "#d9c8fa", "#6a4cc0", "#ffffff"];
let pieces = [];
let running = false;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function burst() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 70; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.4,
      w: 6 + Math.random() * 6,
      h: 10 + Math.random() * 8,
      vy: 2 + Math.random() * 3,
      vx: -1 + Math.random() * 2,
      rot: Math.random() * Math.PI,
      vr: -0.1 + Math.random() * 0.2,
      c: colors[Math.floor(Math.random() * colors.length)],
    });
  }
  if (!running) { running = true; requestAnimationFrame(tick); }
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces = pieces.filter((p) => p.y < canvas.height + 30);
  pieces.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
  if (pieces.length) requestAnimationFrame(tick);
  else running = false;
}

go(0);
burst();

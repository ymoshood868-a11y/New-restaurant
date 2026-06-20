/* ── AURUM shared.js — loaded on every page ── */

lucide.createIcons();

/* ---------- Loader ---------- */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;
  const tl = gsap.timeline();
  tl.to(".loader-line", { width: "120px", duration: 1.2, ease: "power2.inOut" })
    .to(
      ".loader-logo",
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=0.5",
    )
    .to(".loader-logo", {
      letterSpacing: "0.25em",
      textIndent: "0.25em",
      duration: 0.8,
      ease: "power2.inOut",
      delay: 0.5,
    })
    .to(".loader-line", { opacity: 0, duration: 0.3 }, "-=0.4")
    .to(
      ".loader-logo",
      { opacity: 0, y: -30, duration: 0.6, ease: "power2.in" },
      "-=0.2",
    )
    .to("#loader", {
      yPercent: -100,
      duration: 1,
      ease: "power3.inOut",
      onComplete: initPage,
    });
});

function initPage() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
  initAnimations();
  if (document.getElementById("barCarousel")) startCarousel();
}

/* ---------- Toast ---------- */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3500);
}

/* ---------- Reservation Modal ---------- */
function openModal(id) {
  document.getElementById(id).classList.add("open");
  document.body.style.overflow = "hidden";
  lucide.createIcons();
}
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------- Lightbox ---------- */
function openLightbox(src) {
  const vid = document.getElementById("lightbox-video");
  vid.src = src;
  vid.play();
  document.getElementById("lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
  lucide.createIcons();
}
function closeLightbox() {
  const vid = document.getElementById("lightbox-video");
  vid.pause();
  vid.src = "";
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------- Menu filter ---------- */
function filterMenu(cat, btn) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".menu-card").forEach((c) => {
    if (cat === "all" || c.dataset.category === cat) {
      c.style.display = "block";
      gsap.fromTo(
        c,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
      );
    } else {
      c.style.display = "none";
    }
  });
}

/* ---------- Auto Carousel ---------- */
let currentSlide = 0,
  carouselInterval;
const totalSlides = 3;

function updateCarousel() {
  const track = document.getElementById("barCarousel");
  if (!track) return;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document
    .querySelectorAll(".carousel-indicator")
    .forEach((d, i) => d.classList.toggle("active", i === currentSlide));
  track.querySelectorAll(".carousel-slide video").forEach((v, i) => {
    if (i === currentSlide) v.play().catch(() => {});
    else v.pause();
  });
}
function startCarousel() {
  updateCarousel();
  carouselInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }, 6000);
}

/* ---------- GSAP Animations ---------- */
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.getAll().forEach((t) => t.kill());

  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      },
    );
  });

  gsap.utils.toArray(".hero-video-container").forEach((c) => {
    const v = c.querySelector("video");
    if (v)
      gsap.to(v, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: c,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
  });

  gsap.utils.toArray(".counter").forEach((el) => {
    const target = parseFloat(el.dataset.target);
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () =>
        gsap.to(el, {
          innerHTML: target,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: "power1.out",
        }),
    });
  });

  ScrollTrigger.create({
    start: "top -80",
    onUpdate: () => {
      const nav = document.getElementById("navbar");
      if (!nav) return;
      if (window.scrollY > 80) {
        nav.style.background = "rgba(10,10,10,.9)";
        nav.style.backdropFilter = "blur(20px)";
        nav.style.borderBottom = "1px solid rgba(255,255,255,.05)";
      } else {
        nav.style.background = "transparent";
        nav.style.backdropFilter = "none";
        nav.style.borderBottom = "none";
      }
    },
  });
}

/* ---------- VIDEO PERFORMANCE ----------
   All <video> elements use  data-src  instead of <source src>.
   This observer sets the real src only when the video is about to
   enter the viewport — so the browser never downloads videos the
   user hasn't scrolled to yet.
------------------------------------------------- */
const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target;

      /* Lazy-load: inject the real src on first intersection */
      if (entry.isIntersecting && !video.dataset.loaded) {
        const source = video.querySelector("source[data-src]");
        if (source) {
          source.src = source.dataset.src;
          video.load();
        }
        video.dataset.loaded = "1";
      }

      /* Play / pause based on visibility (skip carousel — managed separately) */
      if (!video.closest(".carousel-slide")) {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      }
    });
  },
  { rootMargin: "100px 0px", threshold: 0.15 },
);

document.querySelectorAll("video").forEach((v) => videoObserver.observe(v));

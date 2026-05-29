const slides = [...document.querySelectorAll(".slide")];
const navLinks = [...document.querySelectorAll(".side-nav a")];
const revealItems = [...document.querySelectorAll(".reveal")];
const progressBar = document.getElementById("progress-bar");
const modeToggle = document.getElementById("mode-toggle");
const deck = document.getElementById("deck");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const currentIndex = slides.indexOf(visible.target);
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${visible.target.id}`;
      link.classList.toggle("is-active", isActive);
    });

    const progress = ((currentIndex + 1) / slides.length) * 100;
    progressBar.style.width = `${progress}%`;
    document.title = `Adstrategy | ${visible.target.dataset.title}`;
  },
  { threshold: 0.52 }
);

slides.forEach((slide) => sectionObserver.observe(slide));

function goToSlide(index) {
  const target = slides[index];
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.addEventListener("keydown", (event) => {
  const activeIndex = slides.findIndex((slide) => {
    const rect = slide.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.35 && rect.bottom >= window.innerHeight * 0.35;
  });

  if (event.key === "ArrowDown" || event.key === "PageDown") {
    event.preventDefault();
    goToSlide(Math.min(activeIndex + 1, slides.length - 1));
  }

  if (event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    goToSlide(Math.max(activeIndex - 1, 0));
  }

  if (event.key.toLowerCase() === "f") {
    document.body.classList.toggle("presentation-mode");
    deck.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

modeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("presentation-mode");
  modeToggle.textContent = document.body.classList.contains("presentation-mode")
    ? "Exit Presentation Mode"
    : "Presentation Mode";
});

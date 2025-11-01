/**
 * Scroll to Top Button
 * Uses Intersection Observer to show button after 30% page scroll
 */

const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const heroSection = document.querySelector(".hero");

if (scrollToTopBtn && heroSection) {
  // Intersection Observer with rootMargin to trigger at 30% scroll
  const observer = new IntersectionObserver(
    ([entry]) => {
      scrollToTopBtn.classList.toggle(
        "scroll-to-top--visible",
        !entry.isIntersecting
      );
    },
    {
      rootMargin: "30% 0px -70% 0px",
      threshold: 0,
    }
  );

  observer.observe(heroSection);

  // Scroll handlers
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  scrollToTopBtn.addEventListener("click", scrollToTop);
  scrollToTopBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToTop();
    }
  });
}

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

/**
 * Hamburger Menu Toggle
 * Toggles menu visibility and hamburger animation state
 */
const hamburger = document.getElementById("hamburger");
const navigation = document.getElementById("navigation");

if (hamburger && navigation) {
  const toggleMenu = () => {
    const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
    const newState = !isExpanded;

    // Update aria-expanded for accessibility
    hamburger.setAttribute("aria-expanded", String(newState));

    // Toggle menu visibility
    navigation.classList.toggle("menu--open");

    // Toggle hamburger animation state (required by hamburgers.css)
    hamburger.classList.toggle("is-active");
  };

  // Click handler
  hamburger.addEventListener("click", toggleMenu);

  // Keyboard handler for accessibility
  hamburger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Close menu when clicking outside on mobile
  document.addEventListener("click", (e) => {
    const isClickInsideMenu = navigation.contains(e.target);
    const isClickOnHamburger = hamburger.contains(e.target);
    const isMenuOpen = navigation.classList.contains("menu--open");

    if (isMenuOpen && !isClickInsideMenu && !isClickOnHamburger) {
      toggleMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navigation.classList.contains("menu--open")) {
      toggleMenu();
    }
  });
}

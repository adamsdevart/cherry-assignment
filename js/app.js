/**
 * Utility Functions
 */

// Handle keyboard activation (Enter or Space)
const handleKeyboardActivation = (event, callback) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
};

// Check if element is visible (has open/expanded state)
const isVisible = (element, className) =>
  element.classList.contains(className);

/**
 * Scroll to Top Button
 * Shows button after scrolling 30% down the page using Intersection Observer
 */
const initScrollToTop = () => {
  const button = document.getElementById("scrollToTopBtn");
  const hero = document.querySelector(".hero");

  if (!button || !hero) return;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Show/hide button based on scroll position
  const observer = new IntersectionObserver(
    ([entry]) => {
      button.classList.toggle("scroll-to-top--visible", !entry.isIntersecting);
    },
    { rootMargin: "30% 0px -70% 0px", threshold: 0 }
  );

  observer.observe(hero);

  // Event handlers
  button.addEventListener("click", scrollToTop);
  button.addEventListener("keydown", (e) => handleKeyboardActivation(e, scrollToTop));
};

/**
 * Hamburger Menu Toggle
 * Manages mobile menu visibility and accessibility
 */
const initHamburgerMenu = () => {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("navigation");

  if (!hamburger || !menu) return;

  const toggleMenu = () => {
    const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
    const newState = !isExpanded;

    hamburger.setAttribute("aria-expanded", String(newState));
    menu.classList.toggle("menu--open");
    hamburger.classList.toggle("is-active");
  };

  const closeMenu = () => {
    if (isVisible(menu, "menu--open")) {
      toggleMenu();
    }
  };

  const isClickOutside = (target) =>
    !menu.contains(target) && !hamburger.contains(target);

  // Event handlers
  hamburger.addEventListener("click", toggleMenu);
  hamburger.addEventListener("keydown", (e) => handleKeyboardActivation(e, toggleMenu));

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (isClickOutside(e.target)) closeMenu();
  });

  // Close menu on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
};

/**
 * Read More/Read Less Functionality
 * Truncates article descriptions over 15 characters with expand/collapse toggle
 */
const initReadMore = () => {
  const MAX_LENGTH = 15;

  document.querySelectorAll(".article__description").forEach((description) => {
    const fullText = description.textContent.trim();
    const button = description.nextElementSibling;

    // Skip if text is too short or button doesn't exist
    if (fullText.length <= MAX_LENGTH || !button?.classList.contains("read-more-btn")) {
      button?.style.setProperty("display", "none");
      return;
    }

    const truncatedText = `${fullText.substring(0, MAX_LENGTH)}...`;
    let isExpanded = false;

    // Initialize with truncated text
    description.textContent = truncatedText;
    button.textContent = "Read More";

    // Toggle between expanded and collapsed states
    button.addEventListener("click", () => {
      isExpanded = !isExpanded;
      description.textContent = isExpanded ? fullText : truncatedText;
      button.textContent = isExpanded ? "Read Less" : "Read More";
    });
  });
};

/**
 * Initialize all features when DOM is ready
 */
const init = () => {
  initScrollToTop();
  initHamburgerMenu();
  initReadMore();
};

// Start the application
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

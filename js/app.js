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

// Format number with leading zero
const padZero = (num) => String(num).padStart(2, "0");

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
    hamburger.classList.toggle("is-active");

    if (newState) {
      // Opening: add class immediately to trigger entrance animations
      menu.classList.add("menu--open");
    } else {
      // Closing: remove class to trigger exit animations, then hide menu container
      menu.classList.remove("menu--open");
    }
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
 * Promotional Countdown Timer
 * Displays countdown for sale expiration and allows banner dismissal
 */
const initCountdownTimer = () => {
  const banner = document.getElementById("promoBanner");
  const closeBtn = document.getElementById("promoBannerClose");
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!banner) return;

  // Set sale end date (7 days from now by default)
  // You can modify this date as needed
  const saleEndDate = new Date();
  saleEndDate.setDate(saleEndDate.getDate() + 7);
  saleEndDate.setHours(23, 59, 59, 999); // End of day

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = saleEndDate.getTime() - now;

    // If sale has ended, hide banner
    if (distance < 0) {
      banner.classList.add("promo-banner--hidden");
      return;
    }

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update DOM
    if (daysEl) daysEl.textContent = padZero(days);
    if (hoursEl) hoursEl.textContent = padZero(hours);
    if (minutesEl) minutesEl.textContent = padZero(minutes);
    if (secondsEl) secondsEl.textContent = padZero(seconds);
  };

  // Adjust navbar position based on banner visibility
  const updateNavbarPosition = () => {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    const isBannerVisible = !banner.classList.contains("promo-banner--hidden");
    if (isBannerVisible) {
      const bannerHeight = banner.offsetHeight;
      navbar.style.top = `${bannerHeight}px`;
    } else {
      navbar.style.top = "0";
    }
  };

  // Close banner handler
  const closeBanner = () => {
    banner.classList.add("promo-banner--hidden");
    sessionStorage.setItem("promoBannerDismissed", "true");
    setTimeout(updateNavbarPosition, 100);
  };

  if (closeBtn) {
    closeBtn.addEventListener("click", closeBanner);
    closeBtn.addEventListener("keydown", (e) => {
      handleKeyboardActivation(e, closeBanner);
    });
  }

  // Check if banner was dismissed this session
  if (sessionStorage.getItem("promoBannerDismissed") === "true") {
    banner.classList.add("promo-banner--hidden");
    updateNavbarPosition();
    return;
  }

  // Update countdown immediately and then every second
  updateCountdown();
  const interval = setInterval(() => {
    updateCountdown();
    // Clear interval if banner is hidden
    if (banner.classList.contains("promo-banner--hidden")) {
      clearInterval(interval);
      updateNavbarPosition();
    }
  }, 1000);

  // Update navbar position on resize and initial load
  updateNavbarPosition();
  window.addEventListener("resize", updateNavbarPosition);
};

/**
 * Product Carousel Auto-Scroll
 * Automatically scrolls through products on mobile devices
 */
const initProductCarousel = () => {
  const productsInner = document.querySelector(".products__inner");
  if (!productsInner) return;

  const MOBILE_BREAKPOINT = 900;
  const AUTO_SCROLL_DELAY = 3000; // 3 seconds
  const PAUSE_AFTER_INTERACTION = 5000; // Resume after 5 seconds of inactivity

  let autoScrollInterval = null;
  let userInteractionTimeout = null;
  let isUserInteracting = false;
  let isAutoScrolling = false; // Track if scroll is programmatic

  const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;

  const getScrollPosition = () => {
    return {
      scrollLeft: productsInner.scrollLeft,
      scrollWidth: productsInner.scrollWidth,
      clientWidth: productsInner.clientWidth,
    };
  };

  const scrollToNext = () => {
    if (!isMobile() || isUserInteracting) return;

    const { scrollLeft, scrollWidth, clientWidth } = getScrollPosition();
    const cards = productsInner.querySelectorAll(".product-card");
    
    if (cards.length === 0) return;

    // Calculate next card position
    const cardWidth = cards[0].offsetWidth;
    const gap = 10; // 0.625rem ≈ 10px
    const nextPosition = scrollLeft + cardWidth + gap;
    const maxScroll = scrollWidth - clientWidth;

    // Mark as auto-scrolling to ignore scroll event
    isAutoScrolling = true;

    // Check if we've reached the end
    if (nextPosition >= maxScroll - 5) {
      // Loop back to start
      productsInner.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    } else {
      // Scroll to next card
      productsInner.scrollTo({
        left: nextPosition,
        behavior: "smooth",
      });
    }

    // Reset flag after scroll completes
    setTimeout(() => {
      isAutoScrolling = false;
    }, 500);
  };

  const startAutoScroll = () => {
    if (!isMobile() || autoScrollInterval) return;

    autoScrollInterval = setInterval(scrollToNext, AUTO_SCROLL_DELAY);
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  };

  const pauseOnUserInteraction = () => {
    isUserInteracting = true;
    stopAutoScroll();

    // Clear any existing timeout
    if (userInteractionTimeout) {
      clearTimeout(userInteractionTimeout);
    }

    // Resume after inactivity
    userInteractionTimeout = setTimeout(() => {
      isUserInteracting = false;
      if (isMobile()) {
        startAutoScroll();
      }
    }, PAUSE_AFTER_INTERACTION);
  };

  // Track manual scrolling (only pause if user initiated)
  productsInner.addEventListener("scroll", () => {
    // Only pause if scroll was initiated by user, not our auto-scroll
    if (!isAutoScrolling && !isUserInteracting) {
      pauseOnUserInteraction();
    }
  });

  // Pause on touch/mouse interaction
  productsInner.addEventListener("touchstart", pauseOnUserInteraction);
  productsInner.addEventListener("mousedown", pauseOnUserInteraction);
  productsInner.addEventListener("mouseenter", pauseOnUserInteraction);

  // Resume on mouse leave (if user stops interacting)
  productsInner.addEventListener("mouseleave", () => {
    if (!isUserInteracting && isMobile()) {
      startAutoScroll();
    }
  });

  // Handle window resize
  const handleResize = () => {
    if (isMobile()) {
      if (!autoScrollInterval && !isUserInteracting) {
        startAutoScroll();
      }
    } else {
      stopAutoScroll();
    }
  };

  window.addEventListener("resize", handleResize);

  // Start auto-scroll on mobile
  if (isMobile()) {
    // Small delay to ensure layout is complete
    setTimeout(() => {
      startAutoScroll();
    }, 1000);
  }
};

/**
 * Initialize all features when DOM is ready
 */
const init = () => {
  initCountdownTimer();
  initScrollToTop();
  initHamburgerMenu();
  initReadMore();
  initProductCarousel();
};

// Start the application
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

const galleryImages = [
  "assets/galeri/luxe1.jpg",
  "assets/galeri/luxe2.jpg",
  "assets/galeri/luxe3.jpg",
  "assets/galeri/luxe4.jpg",
  "assets/galeri/luxe5.jpg",
  "assets/galeri/luxe6.jpg",
  "assets/galeri/luxe7.jpg",
  "assets/galeri/luxe8.jpg",
  "assets/galeri/luxe9.jpg"
];

// Galeri klasörüne eklenen fotoğrafların dosya adlarını bu listeye ekleyin.

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const updateHeader = () => {
    if (!header) {
      return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  const closeMenu = () => {
    if (!menuButton || !mobileMenu) {
      return;
    }

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Menüyü aç");
    mobileMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  const toggleMenu = () => {
    if (!menuButton || !mobileMenu) {
      return;
    }

    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Menüyü aç" : "Menüyü kapat");
    mobileMenu.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  };

  const renderGallery = () => {
    const track = document.querySelector("#gallery-track");

    if (!track || galleryImages.length === 0) {
      return;
    }

    const createGalleryFrame = (src, index, duplicate) => {
      const figure = document.createElement("figure");
      const image = document.createElement("img");
      const caption = document.createElement("figcaption");

      figure.className = "gallery-frame";
      if (duplicate) {
        figure.setAttribute("aria-hidden", "true");
      }

      image.src = src;
      image.alt = `LUXE BEAUTY & FIT by Ertuğ galeri fotoğrafı ${index + 1}`;
      image.loading = "lazy";
      image.decoding = "async";

      caption.className = "gallery-caption";
      caption.textContent = "Köşkten Kare";

      figure.append(image, caption);
      return figure;
    };

    track.innerHTML = "";

    for (let loop = 0; loop < 2; loop += 1) {
      galleryImages.forEach((src, index) => {
        track.appendChild(createGalleryFrame(src, index, loop === 1));
      });
    }
  };

  const initVisualHeroCarousel = () => {
    const grid = document.querySelector(".visual-hero-grid");
    const previousButton = document.querySelector("[data-hero-prev]");
    const forwardButton = document.querySelector("[data-hero-forward]");

    if (!grid || !previousButton || !forwardButton) {
      return;
    }

    const mobileMedia = window.matchMedia("(max-width: 1024px)");
    const imageCount = grid.querySelectorAll("img").length;
    let activeIndex = 0;

    const updateHero = () => {
      if (!mobileMedia.matches || imageCount === 0) {
        activeIndex = 0;
        grid.style.transform = "";
        return;
      }

      grid.style.transform = `translate3d(${-activeIndex * (100 / imageCount)}%, 0, 0)`;
    };

    previousButton.addEventListener("click", () => {
      activeIndex = (activeIndex - 1 + imageCount) % imageCount;
      updateHero();
    });

    forwardButton.addEventListener("click", () => {
      activeIndex = (activeIndex + 1) % imageCount;
      updateHero();
    });

    if (typeof mobileMedia.addEventListener === "function") {
      mobileMedia.addEventListener("change", updateHero);
    } else if (typeof mobileMedia.addListener === "function") {
      mobileMedia.addListener(updateHero);
    }

    updateHero();
  };

  const initGalleryDrag = () => {
    const viewport = document.querySelector(".gallery-viewport");
    const track = document.querySelector("#gallery-track");

    if (!viewport || !track) {
      return;
    }

    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const getLoopWidth = () => track.scrollWidth / 2;

    const normalizeScroll = () => {
      const loopWidth = getLoopWidth();

      if (loopWidth <= 0) {
        return;
      }

      if (viewport.scrollLeft <= 2) {
        viewport.scrollLeft += loopWidth;
        startScrollLeft += loopWidth;
      } else if (viewport.scrollLeft >= loopWidth) {
        viewport.scrollLeft -= loopWidth;
        startScrollLeft -= loopWidth;
      }
    };

    const centerGalleryScroll = () => {
      const loopWidth = getLoopWidth();

      if (loopWidth > 0) {
        viewport.scrollLeft = loopWidth / 2;
      }
    };

    const endDrag = (event) => {
      if (!isDragging) {
        return;
      }

      isDragging = false;
      viewport.classList.remove("is-dragging");

      if (event && event.pointerId !== undefined && viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }
    };

    viewport.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      isDragging = true;
      startX = event.clientX;
      startScrollLeft = viewport.scrollLeft;
      viewport.classList.add("is-dragging");
      viewport.setPointerCapture(event.pointerId);
    });

    viewport.addEventListener("pointermove", (event) => {
      if (!isDragging) {
        return;
      }

      event.preventDefault();
      const distance = event.clientX - startX;
      viewport.scrollLeft = startScrollLeft - distance;
      normalizeScroll();
    });

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);

    requestAnimationFrame(centerGalleryScroll);
  };

  const initReveal = () => {
    const revealItems = document.querySelectorAll("[data-reveal]");

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.16
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  };

  const initSmoothAnchors = () => {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
          return;
        }

        event.preventDefault();
        closeMenu();
        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start"
        });
      });
    });
  };

  if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      closeMenu();
    }
  });

  window.addEventListener("scroll", updateHeader, { passive: true });

  renderGallery();
  initVisualHeroCarousel();
  initGalleryDrag();
  initReveal();
  initSmoothAnchors();
  updateHeader();
});

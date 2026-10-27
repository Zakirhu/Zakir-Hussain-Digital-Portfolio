/* ==========================================================================
   ZAKIR HUSSAIN — PORTFOLIO INTERACTIONS
   Vanilla JavaScript. No frameworks. Motion with purpose.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function prefersReduced() {
    return reduceMotionQuery.matches;
  }

  function hasFinePointer() {
    return finePointerQuery.matches;
  }

  function setStyle(element, property, value) {
    if (element) element.style.setProperty(property, value);
  }

  /* -----------------------------------------------------------------------
     THEME
     ----------------------------------------------------------------------- */
  var themeToggle = $("#themeToggle");
  var themeColor = $("#themeColor");
  var themeTimeout = null;

  function themeUi(theme) {
    if (!themeToggle) return;
    var isLight = theme === "light";
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    themeToggle.setAttribute("title", isLight ? "Switch to dark theme" : "Switch to light theme");
    if (themeColor) themeColor.setAttribute("content", isLight ? "#f1efe8" : "#05070c");
    root.style.colorScheme = theme;
  }

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    themeUi(theme);

    if (persist) {
      try {
        localStorage.setItem("zh-theme", theme);
      } catch (error) {
        /* Storage can be unavailable in private contexts. */
      }

      root.classList.add("is-theme-changing");
      window.clearTimeout(themeTimeout);
      themeTimeout = window.setTimeout(function () {
        root.classList.remove("is-theme-changing");
      }, 520);
    }

    document.dispatchEvent(
      new CustomEvent("portfolio:themechange", {
        detail: { theme: theme }
      })
    );
  }

  function initTheme() {
    applyTheme(root.getAttribute("data-theme") || "dark", false);

    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        applyTheme(next, true);
      });
    }
  }

  /* -----------------------------------------------------------------------
     INTRO / LOADER
     ----------------------------------------------------------------------- */
  var loader = $("#loader");
  var loaderBar = $("#loaderBar");
  var loaderCount = $("#loaderCount");
  var skipIntro = $("#skipIntro");
  var introFinished = false;
  var introFrame = null;
  var introStart = 0;
  var introLockTargets = [];
  var introActive = false;

  function finishIntro(remember) {
    if (!loader || introFinished) return;
    introFinished = true;

    if (introFrame) {
      window.cancelAnimationFrame(introFrame);
      introFrame = null;
    }

    if (remember) {
      try {
        sessionStorage.setItem("zh-intro-seen", "1");
      } catch (error) {
        /* Not critical. */
      }
    }

    loader.classList.add("is-leaving");
    loader.setAttribute("aria-hidden", "true");
    body.classList.remove("is-loading");
    body.removeAttribute("aria-busy");
    body.classList.add("is-ready");

    introLockTargets.forEach(function (element) {
      if (element) element.removeAttribute("inert");
    });

    window.setTimeout(function () {
      loader.hidden = true;
    }, 800);

    document.removeEventListener("keydown", handleIntroKey);
    document.dispatchEvent(new Event("portfolio:introcomplete"));
  }

  function handleIntroKey(event) {
    if (event.key === "Escape" && introActive) finishIntro(true);
  }

  function introTick(now) {
    if (introFinished) return;
    if (!introStart) introStart = now;
    var progress = clamp((now - introStart) / 2050, 0, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var displayed = Math.round(eased * 100);

    if (loaderBar) loaderBar.style.width = eased * 100 + "%";
    if (loaderCount) loaderCount.textContent = displayed < 10 ? "0" + displayed : String(displayed);

    if (progress < 1) {
      introFrame = window.requestAnimationFrame(introTick);
    } else {
      introFrame = null;
      finishIntro(true);
    }
  }

  function initIntro() {
    var seen = false;
    try {
      seen = sessionStorage.getItem("zh-intro-seen") === "1";
    } catch (error) {
      seen = false;
    }

    var showIntro = !!loader && !prefersReduced() && !seen;

    if (!showIntro) {
      if (loader) {
        loader.hidden = true;
        loader.setAttribute("aria-hidden", "true");
      }
      body.classList.add("is-ready");
      return;
    }

    introActive = true;
    introFinished = false;
    introStart = 0;
    body.classList.add("is-loading");
    body.setAttribute("aria-busy", "true");

    introLockTargets = [
      $(".skip-link"),
      $(".site-header"),
      $("main"),
      $("footer")
    ];

    introLockTargets.forEach(function (element) {
      if (element) element.setAttribute("inert", "");
    });

    if (skipIntro) {
      skipIntro.addEventListener("click", function () {
        finishIntro(true);
      });
    }

    document.addEventListener("keydown", handleIntroKey);
    introFrame = window.requestAnimationFrame(introTick);

    window.setTimeout(function () {
      introActive = false;
    }, 3200);
  }

  /* -----------------------------------------------------------------------
     TEXT SPLITTING
     ----------------------------------------------------------------------- */
  function splitWords(element) {
    if (!element || element.getAttribute("data-split-done") === "true") return;

    var counter = 0;

    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === Node.TEXT_NODE) {
          var value = child.textContent;
          if (!value || !value.trim()) return;

          var fragment = document.createDocumentFragment();
          value.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              fragment.appendChild(document.createTextNode(part));
              return;
            }

            var outer = document.createElement("span");
            outer.className = "split-word";
            var inner = document.createElement("span");
            inner.className = "split-inner";
            inner.textContent = part;
            inner.style.setProperty("--word-index", counter);
            counter += 1;
            outer.appendChild(inner);
            fragment.appendChild(outer);
          });
          child.replaceWith(fragment);
        } else if (
          child.nodeType === Node.ELEMENT_NODE &&
          child.tagName !== "BR" &&
          child.tagName !== "WBR"
        ) {
          walk(child);
        }
      });
    }

    walk(element);
    element.setAttribute("data-split-done", "true");
  }

  function initSplitText() {
    $$("[data-split]").forEach(splitWords);
  }

  /* -----------------------------------------------------------------------
     REVEAL OBSERVER
     ----------------------------------------------------------------------- */
  function initReveals() {
    var elements = $$("[data-reveal], [data-split]");

    if (!elements.length) return;

    if (prefersReduced() || !("IntersectionObserver" in window)) {
      elements.forEach(function (element) {
        element.classList.add("is-inview");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12
      }
    );

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  /* -----------------------------------------------------------------------
     HEADER, ACTIVE SECTION & SCROLL UI
     ----------------------------------------------------------------------- */
  var header = $("#siteHeader");
  var nav = $(".primary-nav");
  var navIndicator = $("#navIndicator");
  var navLinks = $$(".primary-nav .nav-link");
  var mobileLinks = $$(".mobile-nav a");
  var progressBar = $("#scrollProgress");
  var timeline = $("#experienceTimeline");
  var parallaxElements = $$("[data-parallax]");
  var scrollQueued = false;
  var sectionMap = {
    home: "home",
    about: "about",
    philosophy: "about",
    experience: "experience",
    skills: "skills",
    projects: "projects",
    teaching: "teaching",
    recognition: "recognition",
    contact: "contact"
  };
  var currentActive = "home";
  var indicatorReady = false;

  function setNavActive(id) {
    if (!id) return;
    currentActive = id;
    navLinks.forEach(function (link) {
      var active = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    mobileLinks.forEach(function (link) {
      var active = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    positionNavIndicator();
  }

  function positionNavIndicator() {
    if (!nav || !navIndicator) return;
    if (window.getComputedStyle(nav).display === "none") {
      navIndicator.classList.remove("is-ready");
      return;
    }

    var active = navLinks.filter(function (link) {
      return link.classList.contains("is-active");
    })[0];

    if (!active) {
      navIndicator.classList.remove("is-ready");
      return;
    }

    var x = active.offsetLeft - 4;
    navIndicator.style.width = active.offsetWidth + "px";
    navIndicator.style.transform = "translateX(" + x + "px)";
    navIndicator.classList.add("is-ready");
    indicatorReady = true;
  }

  function updateActiveSection() {
    var sections = $$("main section[id]");
    if (!sections.length) return;

    var probe = window.scrollY + Math.min(window.innerHeight * 0.34, 300) + 90;
    var activeId = "home";

    sections.forEach(function (section) {
      var top = section.getBoundingClientRect().top + window.scrollY;
      if (top <= probe) activeId = section.id;
    });

    var navId = sectionMap[activeId] || activeId;
    var hasMobileActive = mobileLinks.some(function (link) {
      return link.classList.contains("is-active");
    });
    if (navId !== currentActive || !$$(".nav-link.is-active").length || !hasMobileActive) {
      setNavActive(navId);
    }
  }

  function updateTimeline() {
    if (!timeline) return;
    if (prefersReduced()) {
      timeline.style.setProperty("--timeline-progress", "1");
      return;
    }

    var rect = timeline.getBoundingClientRect();
    var reference = window.innerHeight * 0.68;
    var progress = clamp((reference - rect.top) / Math.max(rect.height, 1), 0, 1);
    timeline.style.setProperty("--timeline-progress", progress.toFixed(3));
  }

  function updateParallax() {
    if (!parallaxElements.length) return;

    parallaxElements.forEach(function (element) {
      if (prefersReduced()) {
        element.style.transform = "";
        return;
      }

      var rect = element.getBoundingClientRect();
      var centerDistance = rect.top + rect.height / 2 - window.innerHeight / 2;
      var speed = parseFloat(element.getAttribute("data-parallax")) || 0.05;
      var offset = clamp(centerDistance * speed * 0.22, -28, 28);
      element.style.transform = "translate3d(0, " + offset.toFixed(2) + "px, 0)";
    });
  }

  function updateScrollUI() {
    scrollQueued = false;
    var scrollY = window.scrollY;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle("is-scrolled", scrollY > 26);

    if (progressBar) {
      progressBar.style.width = (maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0) + "%";
    }

    updateActiveSection();
    updateTimeline();
    updateParallax();
  }

  function requestScrollUpdate() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(updateScrollUI);
  }

  function handleNavLinkClick(event) {
    var link = event.currentTarget;
    var targetId = (link.getAttribute("href") || "").replace("#", "");
    if (!targetId) return;
    setNavActive(targetId === "philosophy" ? "about" : targetId);
  }

  function initHeader() {
    navLinks.forEach(function (link) {
      link.addEventListener("click", handleNavLinkClick);
    });

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", function () {
      positionNavIndicator();
      requestScrollUpdate();
    });

    if ("ResizeObserver" in window && nav) {
      new ResizeObserver(function () {
        positionNavIndicator();
      }).observe(nav);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        positionNavIndicator();
      });
    }

    updateScrollUI();
    window.setTimeout(positionNavIndicator, 120);
    window.addEventListener("load", function () {
      positionNavIndicator();
      requestScrollUpdate();
    });
  }

  /* -----------------------------------------------------------------------
     MOBILE MENU
     ----------------------------------------------------------------------- */
  var menuToggle = $("#menuToggle");
  var mobileMenu = $("#mobileMenu");
  var menuOpen = false;
  var menuReturnFocus = null;

  function focusableIn(element) {
    if (!element) return [];
    return $$(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      element
    ).filter(function (element) {
      var styles = window.getComputedStyle(element);
      return (
        element.getClientRects().length > 0 &&
        styles.visibility !== "hidden" &&
        styles.display !== "none"
      );
    });
  }

  function openMenu() {
    if (!mobileMenu || !menuToggle || menuOpen) return;
    menuOpen = true;
    menuReturnFocus = document.activeElement;
    body.classList.add("menu-open");
    mobileMenu.removeAttribute("inert");
    mobileMenu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    var label = $(".sr-only", menuToggle);
    if (label) label.textContent = "Close menu";

    var main = $("main");
    var footer = $("footer");
    if (main) main.setAttribute("inert", "");
    if (footer) footer.setAttribute("inert", "");

    window.setTimeout(function () {
      var first = focusableIn(mobileMenu)[0];
      if (first) first.focus({ preventScroll: true });
    }, 160);
  }

  function closeMenu(returnFocus) {
    if (!mobileMenu || !menuToggle || !menuOpen) return;
    menuOpen = false;
    body.classList.remove("menu-open");
    mobileMenu.setAttribute("inert", "");
    mobileMenu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    var label = $(".sr-only", menuToggle);
    if (label) label.textContent = "Open menu";

    var main = $("main");
    var footer = $("footer");
    if (main) main.removeAttribute("inert");
    if (footer) footer.removeAttribute("inert");

    if (returnFocus !== false) {
      var target = menuReturnFocus && document.contains(menuReturnFocus) ? menuReturnFocus : menuToggle;
      window.setTimeout(function () {
        target.focus({ preventScroll: true });
      }, 30);
    }
  }

  function scrollToId(id) {
    var target = document.getElementById(id);
    if (!target) return;
    try {
      if (history.pushState) history.pushState(null, "", "#" + id);
    } catch (error) {
      /* file:// contexts and some embedded browsers disallow history changes. */
    }
    window.setTimeout(function () {
      target.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
    }, 60);
  }

  function initMobileMenu() {
    if (!mobileMenu || !menuToggle) return;

    menuToggle.addEventListener("click", function () {
      if (menuOpen) closeMenu(true);
      else openMenu();
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        var targetId = (link.getAttribute("href") || "").replace("#", "");
        if (!targetId) return;
        event.preventDefault();
        setNavActive(targetId === "philosophy" ? "about" : targetId);
        closeMenu(true);
        scrollToId(targetId);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (!menuOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key === "Tab") {
        var items = focusableIn(mobileMenu);
        var headerItems = focusableIn(header);
        var all = headerItems.concat(items);
        if (!all.length) return;

        var first = all[0];
        var last = all[all.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (menuOpen && window.innerWidth > 1200) closeMenu(false);
      }, 100);
    });
  }

  /* -----------------------------------------------------------------------
     CUSTOM CURSOR
     ----------------------------------------------------------------------- */
  function initCursor() {
    if (!hasFinePointer() || prefersReduced()) return;

    var dot = $(".cursor--dot");
    var ring = $(".cursor--ring");
    if (!dot || !ring) return;

    var x = window.innerWidth / 2;
    var y = window.innerHeight / 2;
    var ringX = x;
    var ringY = y;
    var visible = false;
    var cursorFrame = null;

    body.classList.add("has-custom-cursor");

    function loop() {
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      dot.style.transform = "translate3d(" + x + "px, " + y + "px, 0) translate(-50%, -50%)";
      ring.style.transform = "translate3d(" + ringX.toFixed(2) + "px, " + ringY.toFixed(2) + "px, 0) translate(-50%, -50%)";
      cursorFrame = window.requestAnimationFrame(loop);
    }

    function handleMove(event) {
      if (event.pointerType === "touch") return;
      x = event.clientX;
      y = event.clientY;

      if (!visible) {
        visible = true;
        body.classList.add("cursor-ready");
        dot.classList.remove("is-hidden");
        ring.classList.remove("is-hidden");
      }
    }

    function handleOver(event) {
      var interactive = event.target.closest(
        'a, button, [data-tilt], [role="button"], input, textarea, select, label'
      );
      var isInteractive = !!interactive;
      ring.classList.toggle("is-hovering", isInteractive);
      dot.classList.toggle("is-hovering", isInteractive);
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerover", handleOver, { passive: true });

    document.addEventListener("pointerleave", function () {
      body.classList.remove("cursor-ready");
      visible = false;
    });

    document.addEventListener("pointerenter", function () {
      if (!visible) return;
      body.classList.add("cursor-ready");
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (cursorFrame) {
          window.cancelAnimationFrame(cursorFrame);
          cursorFrame = null;
        }
      } else if (!cursorFrame) {
        cursorFrame = window.requestAnimationFrame(loop);
      }
    });

    cursorFrame = window.requestAnimationFrame(loop);
  }

  /* -----------------------------------------------------------------------
     MAGNETIC BUTTONS & CARD TILT
     ----------------------------------------------------------------------- */
  function initMagnetic() {
    if (!hasFinePointer() || prefersReduced()) return;

    $$("[data-magnetic]").forEach(function (element) {
      element.addEventListener("pointermove", function (event) {
        var rect = element.getBoundingClientRect();
        var x = (event.clientX - (rect.left + rect.width / 2)) * 0.16;
        var y = (event.clientY - (rect.top + rect.height / 2)) * 0.19;
        setStyle(element, "--btn-x", clamp(x, -10, 10).toFixed(1) + "px");
        setStyle(element, "--btn-y", clamp(y, -8, 8).toFixed(1) + "px");
      });

      element.addEventListener("pointerleave", function () {
        setStyle(element, "--btn-x", "0px");
        setStyle(element, "--btn-y", "0px");
      });
    });
  }

  function initTilt() {
    if (!hasFinePointer() || prefersReduced()) return;

    $$("[data-tilt]").forEach(function (element) {
      var max = parseFloat(element.getAttribute("data-tilt-max")) || 3;

      function move(event) {
        var rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
        var py = clamp((event.clientY - rect.top) / rect.height, 0, 1);
        var rx = (0.5 - py) * max * 2;
        var ry = (px - 0.5) * max * 2;

        element.classList.add("is-tilting");
        setStyle(element, "--rx", rx.toFixed(2) + "deg");
        setStyle(element, "--ry", ry.toFixed(2) + "deg");
        setStyle(element, "--gx", (px * 100).toFixed(1) + "%");
        setStyle(element, "--gy", (py * 100).toFixed(1) + "%");
      }

      function leave() {
        element.classList.remove("is-tilting");
        setStyle(element, "--rx", "0deg");
        setStyle(element, "--ry", "0deg");
        setStyle(element, "--gx", "50%");
        setStyle(element, "--gy", "20%");
      }

      element.addEventListener("pointermove", move);
      element.addEventListener("pointerleave", leave);
    });
  }

  /* -----------------------------------------------------------------------
     SPOTLIGHT
     ----------------------------------------------------------------------- */
  function initHeroSpotlight() {
    var hero = $(".hero");
    if (!hero || !hasFinePointer() || prefersReduced()) return;

    var queued = false;
    var lastX = 0;
    var lastY = 0;

    hero.addEventListener(
      "pointermove",
      function (event) {
        if (event.pointerType === "touch") return;
        lastX = event.clientX;
        lastY = event.clientY;
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(function () {
          queued = false;
          var rect = hero.getBoundingClientRect();
          setStyle(hero, "--pointer-x", (lastX - rect.left).toFixed(1) + "px");
          setStyle(hero, "--pointer-y", (lastY - rect.top).toFixed(1) + "px");
        });
      },
      { passive: true }
    );
  }

  /* -----------------------------------------------------------------------
     SKILL FILTERS
     ----------------------------------------------------------------------- */
  function initFilters() {
    var buttons = $$(".filter-btn");
    var grid = $("#skillsGrid");
    var cards = $$(".skill-wrap", grid || document);
    var status = $("#filterStatus");
    if (!buttons.length || !grid || !cards.length) return;

    var timer = null;
    var activeFilter = "all";

    function labelFor(filter, count) {
      var label = filter === "all" ? "all capabilities" : filter + " capabilities";
      return "Showing " + count + " " + label + ".";
    }

    function updateFilter(filter) {
      if (filter === activeFilter) return;
      activeFilter = filter;

      buttons.forEach(function (button) {
        var isActive = button.getAttribute("data-filter") === filter;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      window.clearTimeout(timer);
      cards.forEach(function (card) {
        card.classList.add("is-filtered-out");
      });

      var delay = prefersReduced() ? 0 : 190;

      timer = window.setTimeout(function () {
        var visibleCount = 0;
        cards.forEach(function (card) {
          var category = card.getAttribute("data-category") || "";
          var show = filter === "all" || category === filter;
          card.hidden = !show;

          if (show) {
            visibleCount += 1;
            card.classList.add("is-inview");
            window.requestAnimationFrame(function () {
              card.classList.remove("is-filtered-out");
            });
          } else {
            card.classList.remove("is-filtered-out");
          }
        });

        grid.classList.toggle("is-filtered", filter !== "all");
        grid.setAttribute("data-filter", filter);
        if (status) status.textContent = labelFor(filter, visibleCount);
      }, delay);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        updateFilter(button.getAttribute("data-filter") || "all");
      });
    });
  }

  /* -----------------------------------------------------------------------
     RESOURCE ACCORDION
     ----------------------------------------------------------------------- */
  function initAccordion() {
    var resources = $$(".resource");
    if (!resources.length) return;

    function setResource(resource, open) {
      var trigger = $(".resource__trigger", resource);
      var panel = $(".resource__panel", resource);
      resource.classList.toggle("is-open", open);
      if (trigger) trigger.setAttribute("aria-expanded", open ? "true" : "false");
      if (panel) panel.setAttribute("aria-hidden", open ? "false" : "true");
    }

    resources.forEach(function (resource) {
      var trigger = $(".resource__trigger", resource);
      if (!trigger) return;
      var panel = $(".resource__panel", resource);
      if (panel) panel.setAttribute("aria-hidden", resource.classList.contains("is-open") ? "false" : "true");

      trigger.addEventListener("click", function () {
        var willOpen = !resource.classList.contains("is-open");
        resources.forEach(function (item) {
          setResource(item, false);
        });
        if (willOpen) setResource(resource, true);
      });
    });
  }

  /* -----------------------------------------------------------------------
     COPY & TOAST
     ----------------------------------------------------------------------- */
  var toast = $("#toast");
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 3800);
  }

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();
    var copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    textarea.remove();
    return copied;
  }

  function initCopy() {
    var copyButton = $("#copyEmail");
    if (!copyButton) return;

    copyButton.addEventListener("click", function () {
      var targetSelector = copyButton.getAttribute("data-copy-target");
      var target = targetSelector ? $(targetSelector) : null;
      if (!target) return;
      var text = (target.textContent || "").trim();
      var isPlaceholder = /example\.com|your\./i.test(text);

      function succeed() {
        showToast(
          isPlaceholder
            ? "Placeholder email copied. Replace it with your real address before publishing."
            : "Email address copied."
        );
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(text)
          .then(succeed)
          .catch(function () {
            if (fallbackCopy(text)) succeed();
            else showToast("Copy didn't work in this browser. Please select the address manually.");
          });
      } else if (fallbackCopy(text)) {
        succeed();
      } else {
        showToast("Copy didn't work in this browser. Please select the address manually.");
      }
    });
  }

  /* -----------------------------------------------------------------------
     BACK TO TOP & YEAR
     ----------------------------------------------------------------------- */
  function initBackToTop() {
    var footerButton = $("[data-back-to-top]");

    if (footerButton) {
      footerButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" });
      });
    }

    $$("[data-year]").forEach(function (element) {
      element.textContent = String(new Date().getFullYear());
    });
  }

  /* -----------------------------------------------------------------------
     HERO PARTICLE FIELD
     ----------------------------------------------------------------------- */
  function readPalette() {
    var styles = window.getComputedStyle(root);
    return {
      a: styles.getPropertyValue("--canvas-a").trim() || "#63e9ff",
      b: styles.getPropertyValue("--canvas-b").trim() || "#a98dff",
      c: styles.getPropertyValue("--canvas-c").trim() || "#f0f6ff",
      line: styles.getPropertyValue("--canvas-line").trim() || "rgba(138,194,255,.2)",
      theme: root.getAttribute("data-theme")
    };
  }

  function initParticleField() {
    var canvas = $("#particleCanvas");
    var hero = $(".hero");
    if (!canvas || !hero) return;

    var context = canvas.getContext("2d");
    if (!context) return;

    var width = 0;
    var height = 0;
    var dpr = 1;
    var particles = [];
    var palette = readPalette();
    var raf = null;
    var lastTime = 0;
    var inView = true;
    var mouse = { x: 0, y: 0, active: false };
    var reduced = prefersReduced();

    function makeParticle() {
      var accent = Math.random() < 0.23 ? "b" : Math.random() < 0.08 ? "c" : "a";
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        radius: 0.45 + Math.random() * 1.2,
        alpha: 0.16 + Math.random() * 0.38,
        accent: accent,
        glow: Math.random() < 0.13
      };
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      var count = Math.round(clamp((width * height) / 17500, 24, 78));
      particles = Array.from({ length: count }, makeParticle);
      render(0);
      if (!reduced) start();
    }

    function render(delta) {
      if (!width || !height) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      var connectDistance = width < 640 ? 95 : 125;
      var maxDistanceSquared = connectDistance * connectDistance;

      for (var i = 0; i < particles.length; i += 1) {
        var particle = particles[i];

        if (!reduced) {
          particle.x += particle.vx * delta;
          particle.y += particle.vy * delta;

          if (mouse.active) {
            var mdx = particle.x - mouse.x;
            var mdy = particle.y - mouse.y;
            var mdistance = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
            if (mdistance < 140) {
              var force = (1 - mdistance / 140) * 15 * delta;
              particle.x += (mdx / mdistance) * force;
              particle.y += (mdy / mdistance) * force;
            }
          }

          if (particle.x < -12) particle.x = width + 12;
          if (particle.x > width + 12) particle.x = -12;
          if (particle.y < -12) particle.y = height + 12;
          if (particle.y > height + 12) particle.y = -12;
        }
      }

      context.beginPath();
      for (var a = 0; a < particles.length; a += 1) {
        for (var b = a + 1; b < particles.length; b += 1) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var distance = dx * dx + dy * dy;
          if (distance < maxDistanceSquared) {
            context.moveTo(particles[a].x, particles[a].y);
            context.lineTo(particles[b].x, particles[b].y);
          }
        }
      }
      context.strokeStyle = palette.line;
      context.lineWidth = 0.65;
      context.globalAlpha = 0.58;
      context.stroke();
      context.globalAlpha = 1;

      for (var c = 0; c < particles.length; c += 1) {
        var dot = particles[c];
        var color = palette[dot.accent] || palette.a;

        if (dot.glow) {
          context.beginPath();
          context.fillStyle = color;
          context.globalAlpha = dot.alpha * 0.14;
          context.arc(dot.x, dot.y, dot.radius * 5, 0, Math.PI * 2);
          context.fill();
        }

        context.beginPath();
        context.fillStyle = color;
        context.globalAlpha = dot.alpha;
        context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
    }

    function frame(now) {
      raf = null;
      if (document.hidden || !inView) return;
      var delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      render(delta);
      start();
    }

    function start() {
      if (reduced || raf || document.hidden || !inView) return;
      lastTime = performance.now();
      raf = window.requestAnimationFrame(frame);
    }

    function stop() {
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = null;
      }
    }

    if ("ResizeObserver" in window) {
      new ResizeObserver(function () {
        stop();
        resize();
        render(0);
      }).observe(canvas);
    } else {
      window.addEventListener("resize", resize);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          inView = entries[0].isIntersecting;
          if (inView) start();
          else stop();
        },
        { rootMargin: "120px 0px" }
      ).observe(hero);
    }

    hero.addEventListener(
      "pointermove",
      function (event) {
        if (event.pointerType === "touch" || reduced) return;
        var rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
        mouse.active = true;
      },
      { passive: true }
    );

    hero.addEventListener("pointerleave", function () {
      mouse.active = false;
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    document.addEventListener("portfolio:themechange", function () {
      palette = readPalette();
      if (reduced) render(0);
    });

    resize();
  }

  /* -----------------------------------------------------------------------
     THREE-DIMENSIONAL LEARNING CORE
     ----------------------------------------------------------------------- */
  function initLearningCore() {
    var stage = $("#coreStage");
    var canvas = $("#coreCanvas");
    if (!stage || !canvas) return;

    var context = canvas.getContext("2d");
    if (!context) return;

    var width = 0;
    var height = 0;
    var dpr = 1;
    var radius = 120;
    var points = [];
    var edges = [];
    var palette = readPalette();
    var reduced = prefersReduced();
    var raf = null;
    var inView = true;
    var startTime = performance.now();
    var pointer = { x: 0, y: 0 };
    var target = { x: 0, y: 0 };

    function buildPointCloud(count) {
      var cloud = [];
      var goldenAngle = Math.PI * (3 - Math.sqrt(5));

      for (var i = 0; i < count; i += 1) {
        var y = 1 - (i / Math.max(count - 1, 1)) * 2;
        var ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
        var theta = goldenAngle * i;
        cloud.push({
          x: Math.cos(theta) * ringRadius,
          y: y,
          z: Math.sin(theta) * ringRadius,
          accent: i % 13 === 0 ? "b" : i % 7 === 0 ? "c" : "a",
          size: 0.65 + Math.random() * 1.15,
          bright: i % 17 === 0
        });
      }

      var edgeMap = {};
      var edgeList = [];

      for (var p = 0; p < cloud.length; p += 1) {
        var nearest = -1;
        var nearestDistance = 0.32;
        for (var q = 0; q < cloud.length; q += 1) {
          if (q === p) continue;
          var dx = cloud[p].x - cloud[q].x;
          var dy = cloud[p].y - cloud[q].y;
          var dz = cloud[p].z - cloud[q].z;
          var distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearest = q;
          }
        }

        if (nearest >= 0) {
          var key = p < nearest ? p + "-" + nearest : nearest + "-" + p;
          if (!edgeMap[key]) {
            edgeMap[key] = true;
            edgeList.push([p, nearest]);
          }
        }

        if (p % 19 === 0) {
          var partner = (p + 29) % cloud.length;
          var key2 = p < partner ? p + "-" + partner : partner + "-" + p;
          if (!edgeMap[key2]) {
            edgeMap[key2] = true;
            edgeList.push([p, partner]);
          }
        }
      }

      points = cloud;
      edges = edgeList.slice(0, 260);
    }

    function resize() {
      var rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      radius = Math.min(width, height) * 0.33;
      buildPointCloud(width < 460 ? 175 : 255);
      drawStatic();
    }

    function projectPoints(now) {
      var cx = width / 2;
      var cy = height / 2;
      var time = reduced ? 0.18 : (now - startTime) / 1000;
      var angleY = time * 0.11 + pointer.x * 0.35;
      var angleX = -0.22 + pointer.y * 0.25;
      var cosY = Math.cos(angleY);
      var sinY = Math.sin(angleY);
      var cosX = Math.cos(angleX);
      var sinX = Math.sin(angleX);

      return points.map(function (point) {
        var x1 = point.x * cosY + point.z * sinY;
        var z1 = -point.x * sinY + point.z * cosY;
        var y1 = point.y * cosX - z1 * sinX;
        var z2 = point.y * sinX + z1 * cosX;
        var perspective = 1 + z2 * 0.17;

        return {
          accent: point.accent,
          size: point.size,
          bright: point.bright,
          x: cx + x1 * radius * perspective,
          y: cy + y1 * radius * perspective,
          z: z2,
          alpha: 0.16 + ((z2 + 1) / 2) * 0.7
        };
      });
    }

    function drawStatic() {
      if (!width || !height) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      renderFrame(performance.now());
    }

    function renderFrame(now) {
      if (!width || !height) return;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      var cx = width / 2;
      var cy = height / 2;
      var projected = projectPoints(now);

      var glow = context.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.25);
      glow.addColorStop(0, palette.theme === "light" ? "rgba(20, 99, 162, 0.09)" : "rgba(86, 198, 255, 0.12)");
      glow.addColorStop(0.48, palette.theme === "light" ? "rgba(86, 80, 200, 0.035)" : "rgba(130, 104, 255, 0.055)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      context.lineWidth = 0.65;
      context.strokeStyle = palette.line;

      context.beginPath();
      edges.forEach(function (edge) {
        var first = projected[edge[0]];
        var second = projected[edge[1]];
        if (!first || !second) return;
        if (first.z < -0.45 && second.z < -0.45) return;
        context.moveTo(first.x, first.y);
        context.lineTo(second.x, second.y);
      });
      context.globalAlpha = 0.42;
      context.stroke();

      context.beginPath();
      edges.forEach(function (edge) {
        var first = projected[edge[0]];
        var second = projected[edge[1]];
        if (!first || !second) return;
        if (first.z > 0.18 || second.z > 0.18) {
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
        }
      });
      context.globalAlpha = 0.7;
      context.stroke();
      context.globalAlpha = 1;

      projected.sort(function (a, b) {
        return a.z - b.z;
      });

      projected.forEach(function (point) {
        var color = palette[point.accent] || palette.a;

        if (point.bright) {
          context.beginPath();
          context.fillStyle = color;
          context.globalAlpha = point.alpha * 0.14;
          context.arc(point.x, point.y, point.size * 5.2, 0, Math.PI * 2);
          context.fill();
        }

        context.beginPath();
        context.fillStyle = color;
        context.globalAlpha = point.alpha;
        context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
    }

    function frame(now) {
      raf = null;
      if (document.hidden || !inView) return;

      pointer.x += (target.x - pointer.x) * 0.055;
      pointer.y += (target.y - pointer.y) * 0.055;
      renderFrame(now);
      start();
    }

    function start() {
      if (reduced || raf || document.hidden || !inView) return;
      raf = window.requestAnimationFrame(frame);
    }

    function stop() {
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = null;
      }
    }

    window.addEventListener(
      "pointermove",
      function (event) {
        if (event.pointerType === "touch" || reduced) return;
        target.x = clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1) * 0.55;
        target.y = clamp((event.clientY / window.innerHeight) * 2 - 1, -1, 1) * 0.5;
      },
      { passive: true }
    );

    if ("ResizeObserver" in window) {
      new ResizeObserver(function () {
        stop();
        resize();
        start();
      }).observe(stage);
    } else {
      window.addEventListener("resize", resize);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          inView = entries[0].isIntersecting;
          if (inView) start();
          else stop();
        },
        { rootMargin: "100px 0px" }
      ).observe(stage);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    document.addEventListener("portfolio:themechange", function () {
      palette = readPalette();
      if (reduced) drawStatic();
    });

    resize();
    start();
  }

  /* -----------------------------------------------------------------------
     BOOT
     ----------------------------------------------------------------------- */
  function init() {
    initTheme();
    initIntro();
    initSplitText();
    initReveals();
    initHeader();
    initMobileMenu();
    initCursor();
    initMagnetic();
    initTilt();
    initHeroSpotlight();
    initFilters();
    initAccordion();
    initCopy();
    initBackToTop();
    initParticleField();
    initLearningCore();
    updateActiveSection();

    if (!prefersReduced()) {
      window.setTimeout(function () {
        requestScrollUpdate();
      }, 200);
    }
  }

  init();
})();

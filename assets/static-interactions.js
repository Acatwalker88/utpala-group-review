(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".compact-menu");
  const menuLabel = menuButton?.querySelector("span:last-child");
  const shareButton = document.querySelector(".social-toggle");
  const shareDrawer = document.querySelector(".social-drawer");

  function setMenu(open) {
    header?.classList.toggle("is-menu-open", open);
    document.body.classList.toggle("menu-open", open);
    menuButton?.setAttribute("aria-expanded", String(open));
    menuButton?.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );
    menu?.setAttribute("aria-hidden", String(!open));
    if (open) menu?.removeAttribute("inert");
    else menu?.setAttribute("inert", "");
    if (menuLabel) menuLabel.textContent = open ? "Close" : "Menu";
  }

  function setShare(open) {
    shareDrawer?.classList.toggle("is-open", open);
    shareButton?.setAttribute("aria-expanded", String(open));
  }

  menuButton?.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    setShare(false);
  });
  menu
    ?.querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => setMenu(false)));
  shareButton?.addEventListener("click", () => {
    setShare(shareButton.getAttribute("aria-expanded") !== "true");
    setMenu(false);
  });
  shareDrawer
    ?.querySelector(".close-share")
    ?.addEventListener("click", () => setShare(false));

  const shareLinks = shareDrawer?.querySelectorAll("a");
  const pageUrl = encodeURIComponent(window.location.href);
  if (shareLinks?.[0])
    shareLinks[0].href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
  if (shareLinks?.[1])
    shareLinks[1].href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
  if (shareLinks?.[2])
    shareLinks[2].href = `mailto:?subject=${encodeURIComponent("Utpala Group")}&body=${pageUrl}`;

  const copyButton = shareDrawer?.querySelector(
    'button[aria-label="Copy page link"]',
  );
  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      copyButton.textContent = "✓";
      window.setTimeout(() => {
        copyButton.textContent = "⧉";
      }, 1800);
    } catch {
      window.prompt("Copy this page link:", window.location.href);
    }
  });

  const updateHeader = () =>
    header?.classList.toggle("is-scrolled", window.scrollY > 40);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenu(false);
      setShare(false);
    }
  });

  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll(".hero-dot")];
  const hero = document.querySelector(".hero");
  const newsLabel = document.querySelector(".hero-news-strip span");
  const newsLink = document.querySelector(".hero-news-strip a");
  const news = [
    [
      "One trusted group",
      "Finance, Real Estate, Design, and Construction connected around your goals.",
      "#services",
    ],
    [
      "Finance",
      "Financing strategy and mortgage coordination aligned with your objectives.",
      "finance/",
    ],
    [
      "Real Estate",
      "Purchase, sale, investment, and property advisory across Niagara and the GTA.",
      "real-estate/",
    ],
    [
      "Design",
      "Architectural, engineering, and interior-design coordination for practical project delivery.",
      "design/",
    ],
    [
      "Construction",
      "Residential, commercial, and institutional construction by a licensed and registered builder.",
      "construction/",
    ],
  ];
  let activeSlide = 0;
  let carouselPaused = false;

  function showSlide(index) {
    if (!slides.length) return;
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === activeSlide;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      if (active) slide.removeAttribute("inert");
      else slide.setAttribute("inert", "");
    });
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === activeSlide;
      dot.classList.toggle("is-active", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    if (news[activeSlide]) {
      if (newsLabel) newsLabel.textContent = news[activeSlide][0];
      if (newsLink) {
        newsLink.textContent = news[activeSlide][1];
        newsLink.href = news[activeSlide][2];
      }
    }
  }

  dots.forEach((dot, index) =>
    dot.addEventListener("click", () => showSlide(index)),
  );
  hero?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showSlide(activeSlide - 1);
    if (event.key === "ArrowRight") showSlide(activeSlide + 1);
  });
  hero?.addEventListener("mouseenter", () => {
    carouselPaused = true;
  });
  hero?.addEventListener("mouseleave", () => {
    carouselPaused = false;
  });
  hero?.addEventListener("focusin", () => {
    carouselPaused = true;
  });
  hero?.addEventListener("focusout", (event) => {
    if (!hero.contains(event.relatedTarget)) carouselPaused = false;
  });
  if (
    slides.length > 1 &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const timer = window.setInterval(() => {
      if (!carouselPaused) showSlide(activeSlide + 1);
    }, 7000);
    window.addEventListener("pagehide", () => window.clearInterval(timer));
  }

  const addOns = {
    advisory: [
      "Advisory",
      "Understanding the property, opportunity, risks, and available options.",
      [
        "Property and project context",
        "Opportunity review",
        "Risk considerations",
        "Available options",
      ],
    ],
    strategy: [
      "Strategy",
      "Establishing feasibility, direction, priorities, and a practical pathway.",
      [
        "Feasibility",
        "Strategic direction",
        "Project priorities",
        "Practical pathway",
      ],
    ],
    development: [
      "Development",
      "Coordinating project planning, approvals, consultants, design, and implementation requirements.",
      [
        "Project planning",
        "Approvals",
        "Consultant coordination",
        "Design and implementation requirements",
      ],
    ],
    "project-management": [
      "Project Management",
      "Coordinating scope, schedule, budget, procurement, and project delivery.",
      ["Scope", "Schedule and budget", "Procurement", "Project delivery"],
    ],
  };
  const tabs = [...document.querySelectorAll(".addon-tab")];
  const panel = document.querySelector(".addon-detail");

  function selectAddOn(id) {
    const data = addOns[id];
    if (!data || !panel) return;
    tabs.forEach((tab) => {
      const active = tab.id === `tab-${id}`;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    panel.setAttribute("aria-labelledby", `tab-${id}`);
    const title = panel.querySelector("h3");
    const description = panel.querySelector("h3 + p");
    const list = panel.querySelector("ul");
    if (title) title.textContent = data[0];
    if (description) description.textContent = data[1];
    if (list) {
      list.replaceChildren(
        ...data[2].map((detail) => {
          const item = document.createElement("li");
          item.textContent = detail;
          return item;
        }),
      );
    }
  }

  tabs.forEach((tab) => {
    const id = tab.id.replace(/^tab-/, "");
    tab.addEventListener("click", () => selectAddOn(id));
    tab.addEventListener("keydown", (event) => {
      const current = tabs.indexOf(tab);
      let next;
      if (event.key === "ArrowRight" || event.key === "ArrowDown")
        next = tabs[(current + 1) % tabs.length];
      if (event.key === "ArrowLeft" || event.key === "ArrowUp")
        next = tabs[(current - 1 + tabs.length) % tabs.length];
      if (next) {
        event.preventDefault();
        next.focus();
        selectAddOn(next.id.replace(/^tab-/, ""));
      }
    });
  });

  const form = document.querySelector(".lead-form");
  const serviceSelect = form?.querySelector("#serviceInterest");
  const consultingField = form?.querySelector(".consulting-detail-field");
  const consultingSelect = form?.querySelector("#consultingInterest");
  const contactSection = document.querySelector("#consultation");

  function syncConsultingField() {
    const show = serviceSelect?.value === "Real Estate Consulting";
    if (consultingField) consultingField.hidden = !show;
    if (consultingSelect) {
      consultingSelect.disabled = !show;
      consultingSelect.required = show;
      if (!show) consultingSelect.value = "";
    }
  }

  serviceSelect?.addEventListener("change", syncConsultingField);
  syncConsultingField();

  const ctaMenu = document.querySelector(".service-cta-menu");
  const ctaTrigger = ctaMenu?.querySelector(".service-cta-trigger");
  const ctaOptions = ctaMenu?.querySelector(".service-cta-options");
  const consultingToggle = ctaMenu?.querySelector(
    ".service-cta-consulting-toggle",
  );
  const consultingOptions = ctaMenu?.querySelector(
    ".service-cta-consulting-options",
  );

  function setConsultingOptions(open) {
    consultingToggle?.setAttribute("aria-expanded", String(open));
    if (consultingOptions) consultingOptions.hidden = !open;
  }

  function setCtaMenu(open) {
    ctaTrigger?.setAttribute("aria-expanded", String(open));
    if (ctaOptions) ctaOptions.hidden = !open;
    if (!open) setConsultingOptions(false);
  }

  ctaTrigger?.addEventListener("click", () => {
    const open = ctaTrigger.getAttribute("aria-expanded") !== "true";
    setCtaMenu(open);
    if (open)
      window.requestAnimationFrame(() =>
        ctaOptions?.querySelector("button")?.focus(),
      );
  });

  consultingToggle?.addEventListener("click", () => {
    const open = consultingToggle.getAttribute("aria-expanded") !== "true";
    setConsultingOptions(open);
    if (open)
      window.requestAnimationFrame(() =>
        consultingOptions?.querySelector("button")?.focus(),
      );
  });

  ctaMenu?.querySelectorAll("[data-service-choice]").forEach((choice) => {
    choice.addEventListener("click", () => {
      if (serviceSelect) serviceSelect.value = choice.dataset.serviceChoice;
      syncConsultingField();
      if (consultingSelect && choice.dataset.consultingChoice)
        consultingSelect.value = choice.dataset.consultingChoice;
      setCtaMenu(false);
      contactSection?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => serviceSelect?.focus(), 450);
    });
  });

  document.addEventListener("click", (event) => {
    if (ctaMenu && !ctaMenu.contains(event.target)) setCtaMenu(false);
  });

  ctaMenu?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setCtaMenu(false);
      ctaTrigger?.focus();
    }
  });

  const success = form?.querySelector(".form-success");
  const sent = new URLSearchParams(window.location.search).get("sent");
  if (sent === "1") {
    success?.classList.add("is-visible");
    window.requestAnimationFrame(() => success?.focus());
  }
})();

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
    menuButton?.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
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
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  shareButton?.addEventListener("click", () => {
    setShare(shareButton.getAttribute("aria-expanded") !== "true");
    setMenu(false);
  });
  shareDrawer?.querySelector(".close-share")?.addEventListener("click", () => setShare(false));

  const shareLinks = shareDrawer?.querySelectorAll("a");
  const pageUrl = encodeURIComponent(window.location.href);
  if (shareLinks?.[0]) shareLinks[0].href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
  if (shareLinks?.[1]) shareLinks[1].href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
  if (shareLinks?.[2]) shareLinks[2].href = `mailto:?subject=${encodeURIComponent("Utpala Group")}&body=${pageUrl}`;

  const copyButton = shareDrawer?.querySelector('button[aria-label="Copy page link"]');
  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      copyButton.textContent = "✓";
      window.setTimeout(() => { copyButton.textContent = "⧉"; }, 1800);
    } catch {
      window.prompt("Copy this page link:", window.location.href);
    }
  });

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 40);
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
    ["Clear direction", "Begin with the advice your property, business, or development decision requires.", "#consulting"],
    ["Financial fit", "Discuss financing needs in the context of the opportunity you are considering.", "#mortgages"],
    ["Property insight", "Connect the right property decision with your wider project and financial priorities.", "#realty"],
    ["Built around you", "Move from an approved direction into coordinated residential or commercial construction.", "#constructions"],
    ["Consulting add-ons", "Ask first about a Feasibility Report, Interior Design, Web Design, or Property Management.", "#consultation"],
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

  dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));
  hero?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showSlide(activeSlide - 1);
    if (event.key === "ArrowRight") showSlide(activeSlide + 1);
  });
  hero?.addEventListener("mouseenter", () => { carouselPaused = true; });
  hero?.addEventListener("mouseleave", () => { carouselPaused = false; });
  hero?.addEventListener("focusin", () => { carouselPaused = true; });
  hero?.addEventListener("focusout", (event) => {
    if (!hero.contains(event.relatedTarget)) carouselPaused = false;
  });
  if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const timer = window.setInterval(() => {
      if (!carouselPaused) showSlide(activeSlide + 1);
    }, 7000);
    window.addEventListener("pagehide", () => window.clearInterval(timer));
  }

  const addOns = {
    feasibility: ["Feasibility Report", "Review the planning, approval, site, and project considerations that affect a confident go-forward decision.", ["Property and project context", "Zoning and approval considerations", "Key constraints and dependencies", "Recommended next steps"]],
    "interior-design": ["Interior Design", "Connect space planning and design direction with the practical needs of your property or business.", ["Concept direction", "Space planning", "Material direction", "Residential or commercial fit"]],
    "web-design": ["Web Design", "Create a focused digital presence for a property, development, or business launch.", ["Landing page or website", "Service content structure", "Lead-generation pathway", "Responsive implementation"]],
    "property-management": ["Property Management", "Coordinate ongoing property needs after acquisition, leasing, or project completion.", ["Owner support", "Rental readiness", "Maintenance pathway", "Ongoing property care"]],
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
    panel.id = `panel-${id}`;
    panel.setAttribute("aria-labelledby", `tab-${id}`);
    const title = panel.querySelector("h3");
    const description = panel.querySelector("h3 + p");
    const list = panel.querySelector("ul");
    if (title) title.textContent = data[0];
    if (description) description.textContent = data[1];
    if (list) {
      list.replaceChildren(...data[2].map((detail) => {
        const item = document.createElement("li");
        item.textContent = detail;
        return item;
      }));
    }
  }

  tabs.forEach((tab) => {
    const id = tab.id.replace(/^tab-/, "");
    tab.addEventListener("click", () => selectAddOn(id));
    tab.addEventListener("keydown", (event) => {
      const current = tabs.indexOf(tab);
      let next;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = tabs[(current + 1) % tabs.length];
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = tabs[(current - 1 + tabs.length) % tabs.length];
      if (next) {
        event.preventDefault();
        next.focus();
        selectAddOn(next.id.replace(/^tab-/, ""));
      }
    });
  });

  const form = document.querySelector(".lead-form");
  const success = form?.querySelector(".form-success");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    success?.classList.add("is-visible");
    success?.focus();
  });
})();

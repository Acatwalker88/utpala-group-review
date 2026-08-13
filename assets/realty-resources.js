(() => {
  "use strict";

  const tabs = [...document.querySelectorAll("[data-resource-tab]")];
  const panels = [...document.querySelectorAll("[data-resource-panel]")];

  function selectResource(id, focus = false) {
    tabs.forEach((tab) => {
      const active = tab.dataset.resourceTab === id;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    panels.forEach((panel) => {
      const active = panel.dataset.resourcePanel === id;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () =>
      selectResource(tab.dataset.resourceTab),
    );
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowLeft")
        next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      selectResource(tabs[next].dataset.resourceTab, true);
    });
  });

  const areas = {
    "downtown toronto": {
      name: "Downtown Toronto",
      lat: 43.6532,
      lon: -79.3832,
      zoom: 0.195,
      aliases: ["toronto", "m5v", "m5h"],
    },
    "north york": {
      name: "North York",
      lat: 43.7615,
      lon: -79.4111,
      zoom: 0.16,
      aliases: ["m2n", "m3n"],
    },
    scarborough: {
      name: "Scarborough",
      lat: 43.7764,
      lon: -79.2318,
      zoom: 0.18,
      aliases: ["m1p", "m1s"],
    },
    etobicoke: {
      name: "Etobicoke",
      lat: 43.6205,
      lon: -79.5132,
      zoom: 0.17,
      aliases: ["m8v", "m9a"],
    },
    mississauga: {
      name: "Mississauga",
      lat: 43.589,
      lon: -79.6441,
      zoom: 0.2,
      aliases: ["l5b", "l5m"],
    },
    "port credit": {
      name: "Port Credit",
      lat: 43.5516,
      lon: -79.5856,
      zoom: 0.075,
      aliases: ["l5g"],
    },
    brampton: {
      name: "Brampton",
      lat: 43.7315,
      lon: -79.7624,
      zoom: 0.2,
      aliases: ["l6y", "l6x"],
    },
    oakville: {
      name: "Oakville",
      lat: 43.4675,
      lon: -79.6877,
      zoom: 0.16,
      aliases: ["l6h", "l6j"],
    },
    burlington: {
      name: "Burlington",
      lat: 43.3255,
      lon: -79.799,
      zoom: 0.17,
      aliases: ["l7l", "l7r"],
    },
    hamilton: {
      name: "Hamilton",
      lat: 43.2557,
      lon: -79.8711,
      zoom: 0.2,
      aliases: ["l8p", "l8s"],
    },
    "st. catharines": {
      name: "St. Catharines",
      lat: 43.1594,
      lon: -79.2469,
      zoom: 0.16,
      aliases: ["st catharines", "l2r", "l2n"],
    },
    "niagara falls": {
      name: "Niagara Falls",
      lat: 43.0896,
      lon: -79.0849,
      zoom: 0.14,
      aliases: ["l2e", "l2g"],
    },
  };

  const searchForm = document.querySelector("#area-search-form");
  const searchInput = document.querySelector("#area-search");
  const searchStatus = document.querySelector("#area-search-status");
  const mapFrame = document.querySelector("#area-map-frame");
  const mapLink = document.querySelector("#map-external-link");
  const discussArea = document.querySelector("#discuss-area");
  let selectedArea = areas["downtown toronto"];

  function findArea(query) {
    const normalized = query.trim().toLowerCase().replace(/\s+/g, " ");
    if (!normalized) return null;
    return (
      Object.values(areas).find((area) => {
        const key = area.name.toLowerCase();
        return (
          key === normalized ||
          key.includes(normalized) ||
          area.aliases.some(
            (alias) => alias === normalized || alias.includes(normalized),
          )
        );
      }) || null
    );
  }

  function showArea(area) {
    selectedArea = area;
    const west = (area.lon - area.zoom).toFixed(4);
    const east = (area.lon + area.zoom).toFixed(4);
    const south = (area.lat - area.zoom * 0.72).toFixed(4);
    const north = (area.lat + area.zoom * 0.72).toFixed(4);
    const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${area.lat}%2C${area.lon}`;
    const full = `https://www.openstreetmap.org/?mlat=${area.lat}&mlon=${area.lon}#map=12/${area.lat}/${area.lon}`;
    if (mapFrame) {
      mapFrame.src = embed;
      mapFrame.title = `Interactive map showing ${area.name}`;
    }
    if (mapLink) mapLink.href = full;
    if (searchInput) searchInput.value = area.name;
    if (searchStatus) searchStatus.textContent = `Showing ${area.name}.`;
    if (discussArea) discussArea.textContent = `Discuss ${area.name}`;
  }

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const area = findArea(searchInput?.value || "");
    if (area) showArea(area);
    else if (searchStatus)
      searchStatus.textContent =
        "Choose one of the supported Niagara or GTA areas shown in the suggestions.";
  });

  document.querySelectorAll("[data-area]").forEach((button) => {
    button.addEventListener("click", () => {
      const area = findArea(button.dataset.area || "");
      if (area) showArea(area);
    });
  });

  discussArea?.addEventListener("click", () => {
    const location = document.querySelector("#location");
    const interest = document.querySelector("#serviceInterest");
    if (location) location.value = selectedArea.name;
    if (interest) interest.value = "Real Estate";
  });

  const purchasePrice = document.querySelector("#purchase-price");
  const propertyLocation = document.querySelector("#property-location");
  const ontarioTax = document.querySelector("#ontario-tax");
  const torontoTax = document.querySelector("#toronto-tax");
  const totalTax = document.querySelector("#total-tax");
  const currency = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });

  function graduatedTax(price, brackets) {
    let tax = 0;
    let lower = 0;
    for (const [upper, rate] of brackets) {
      const taxable = Math.max(0, Math.min(price, upper) - lower);
      tax += taxable * rate;
      lower = upper;
      if (price <= upper) break;
    }
    return tax;
  }

  function calculateTax() {
    const price = Math.max(0, Number(purchasePrice?.value) || 0);
    const provincial = graduatedTax(price, [
      [55000, 0.005],
      [250000, 0.01],
      [400000, 0.015],
      [2000000, 0.02],
      [Infinity, 0.025],
    ]);
    const municipal =
      propertyLocation?.value === "toronto"
        ? graduatedTax(price, [
            [55000, 0.005],
            [250000, 0.01],
            [400000, 0.015],
            [2000000, 0.02],
            [3000000, 0.025],
            [4000000, 0.044],
            [5000000, 0.0545],
            [10000000, 0.065],
            [20000000, 0.0755],
            [Infinity, 0.086],
          ])
        : 0;
    if (ontarioTax) ontarioTax.textContent = currency.format(provincial);
    if (torontoTax) torontoTax.textContent = currency.format(municipal);
    if (totalTax)
      totalTax.textContent = currency.format(provincial + municipal);
  }

  purchasePrice?.addEventListener("input", calculateTax);
  propertyLocation?.addEventListener("change", calculateTax);
  calculateTax();
})();

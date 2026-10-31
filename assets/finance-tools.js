const currency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

export function mortgagePayment(principal, annualRate, years, paymentsPerYear) {
  const amount = Math.max(0, Number(principal) || 0);
  const termYears = Math.max(1, Number(years) || 1);
  const frequency = Math.max(1, Number(paymentsPerYear) || 12);
  const paymentCount = termYears * frequency;
  const nominalRate = Math.max(0, Number(annualRate) || 0) / 100;

  if (!amount) return { payment: 0, interest: 0, total: 0 };
  if (!nominalRate) {
    const payment = amount / paymentCount;
    return { payment, interest: 0, total: amount };
  }

  // Canadian fixed mortgage rates are quoted as nominal annual rates,
  // compounded semi-annually. Convert to the selected payment period.
  const periodicRate = Math.pow(1 + nominalRate / 2, 2 / frequency) - 1;
  const payment =
    (amount * periodicRate) /
    (1 - Math.pow(1 + periodicRate, -paymentCount));
  const total = payment * paymentCount;
  return { payment, interest: total - amount, total };
}

export function graduatedTax(price, brackets) {
  const value = Math.max(0, Number(price) || 0);
  let tax = 0;
  let lower = 0;

  for (const [upper, rate] of brackets) {
    const taxable = Math.max(0, Math.min(value, upper) - lower);
    tax += taxable * rate;
    lower = upper;
    if (value <= upper) break;
  }

  return tax;
}

export function landTransferTax(price, location = "ontario", firstTime = false) {
  const provincial = graduatedTax(price, [
    [55000, 0.005],
    [250000, 0.01],
    [400000, 0.015],
    [2000000, 0.02],
    [Infinity, 0.025],
  ]);

  const municipal =
    location === "toronto"
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

  const provincialRebate = firstTime ? Math.min(provincial, 4000) : 0;
  const municipalRebate = firstTime ? Math.min(municipal, 4475) : 0;
  const rebate = provincialRebate + municipalRebate;

  return {
    provincial,
    municipal,
    rebate,
    total: Math.max(0, provincial + municipal - rebate),
  };
}

function numberValue(selector) {
  return Number(document.querySelector(selector)?.value) || 0;
}

function text(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function initMortgageCalculator() {
  const form = document.querySelector("#mortgage-calculator");
  if (!form) return;

  const update = () => {
    const price = Math.max(0, numberValue("#mortgage-price"));
    const downPayment = Math.min(
      price,
      Math.max(0, numberValue("#mortgage-down-payment")),
    );
    const principal = Math.max(0, price - downPayment);
    const rate = Math.max(0, numberValue("#mortgage-rate"));
    const years = Math.max(1, numberValue("#mortgage-amortization"));
    const frequency = Math.max(1, numberValue("#mortgage-frequency"));
    const result = mortgagePayment(principal, rate, years, frequency);
    const frequencyLabels = {
      12: "per month",
      26: "every two weeks",
      52: "per week",
    };

    text("#mortgage-principal", currency.format(principal));
    text("#mortgage-payment", currency.format(result.payment));
    text("#mortgage-payment-label", frequencyLabels[frequency] || "per payment");
    text("#mortgage-interest", currency.format(result.interest));

    const downPercent = price ? (downPayment / price) * 100 : 0;
    const note = document.querySelector("#mortgage-insurance-note");
    if (note) {
      note.classList.toggle("is-alert", price > 0 && downPercent < 20);
      note.textContent =
        price > 0 && downPercent < 20
          ? `Your down payment is ${downPercent.toFixed(1)}%. Mortgage default insurance may apply and is not included in this estimate.`
          : "Calculation uses Canadian semi-annual compounding. Property tax, fees, and qualification rules are not included.";
    }
  };

  form.addEventListener("input", update);
  form.addEventListener("change", update);
  update();
}

function initLandTaxCalculator() {
  const form = document.querySelector("#land-tax-calculator");
  if (!form) return;

  const update = () => {
    const price = Math.max(0, numberValue("#tax-purchase-price"));
    const location =
      document.querySelector("#tax-property-location")?.value || "ontario";
    const firstTime = Boolean(document.querySelector("#tax-first-time")?.checked);
    const result = landTransferTax(price, location, firstTime);

    text("#tax-ontario", currency.format(result.provincial));
    text("#tax-toronto", currency.format(result.municipal));
    text("#tax-rebate", `−${currency.format(result.rebate)}`);
    text("#tax-total", currency.format(result.total));
  };

  form.addEventListener("input", update);
  form.addEventListener("change", update);
  update();
}

async function initPolicyRate() {
  const value = document.querySelector("#policy-rate-value");
  if (!value) return;

  const status = document.querySelector("#policy-rate-status");
  const date = document.querySelector("#policy-rate-date");

  try {
    const response = await fetch(
      "https://www.bankofcanada.ca/valet/observations/V39079/json?recent=1",
      { headers: { Accept: "application/json" } },
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const observation = data.observations?.at(-1);
    const rate = observation?.V39079?.v;
    if (!rate || !observation?.d) throw new Error("Missing rate observation");

    value.textContent = `${Number(rate).toFixed(2)}%`;
    const observedDate = new Date(`${observation.d}T00:00:00`);
    if (date) {
      date.textContent = `Official observation: ${observedDate.toLocaleDateString(
        "en-CA",
        { year: "numeric", month: "long", day: "numeric" },
      )}`;
    }
    if (status) status.textContent = "Live official observation loaded.";
  } catch {
    if (status) {
      status.textContent =
        "The live feed is temporarily unavailable. Showing the last verified official observation.";
    }
  }
}

if (typeof document !== "undefined") {
  initMortgageCalculator();
  initLandTaxCalculator();
  initPolicyRate();
}

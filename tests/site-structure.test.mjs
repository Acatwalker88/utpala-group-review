import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const pages = [
  "index.html",
  "404.html",
  "finance/index.html",
  "real-estate/index.html",
  "design/index.html",
  "construction/index.html",
];

function page(path) {
  return readFileSync(join(root, path), "utf8");
}

test("all pages use the approved brand lockup and Contact Us label", () => {
  for (const path of pages) {
    const html = page(path);
    assert.match(html, /class="logo-link brand-lockup"/, path);
    assert.match(html, /brand-lockup__word">Utpala</, path);
    assert.match(html, /brand-lockup__word">Construction</, path);
    assert.match(html, /header-actions__link"[^>]*>Contact Us</, path);
  }
});

test("service pages include persistent cross-service navigation", () => {
  for (const path of pages.slice(2)) {
    const html = page(path);
    assert.match(html, /class="service-switcher"/, path);
    assert.match(html, /aria-current="page"/, path);
  }
});

test("finance page includes both calculators and the rate centre", () => {
  const html = page("finance/index.html");
  for (const id of [
    "mortgage-calculator",
    "land-tax-calculator",
    "policy-rate-value",
    "rate-table",
  ]) {
    if (id === "rate-table") assert.match(html, /class="rate-table"/);
    else assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /assets\/finance-tools\.js/);
});

test("HTML pages do not contain duplicate IDs", () => {
  for (const path of pages) {
    const ids = [...page(path).matchAll(/\sid="([^"]+)"/g)].map(
      (match) => match[1],
    );
    assert.equal(new Set(ids).size, ids.length, path);
  }
});

test("local href and src references resolve", () => {
  for (const path of pages) {
    const html = page(path);
    const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(
      (match) => match[1],
    );

    for (const ref of refs) {
      if (
        /^(?:https?:|mailto:|tel:|data:|#)/.test(ref) ||
        ref.startsWith("javascript:")
      ) {
        continue;
      }

      const clean = ref.split(/[?#]/)[0];
      if (!clean) continue;
      const relative = clean.startsWith("/utpala-group-review/")
        ? clean.replace("/utpala-group-review/", "")
        : clean;
      let target = normalize(join(root, dirname(path), relative));
      if (clean.endsWith("/")) target = join(target, "index.html");
      assert.ok(existsSync(target), `${path}: ${ref}`);
    }
  }
});

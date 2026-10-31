import test from "node:test";
import assert from "node:assert/strict";

import {
  graduatedTax,
  landTransferTax,
  mortgagePayment,
} from "../assets/finance-tools.js";

test("mortgage payment uses Canadian semi-annual compounding", () => {
  const result = mortgagePayment(560000, 4.84, 25, 12);
  assert.ok(Math.abs(result.payment - 3206.17) < 0.02);
  assert.ok(result.interest > 400000);
});

test("zero-rate mortgage divides principal evenly", () => {
  const result = mortgagePayment(120000, 0, 10, 12);
  assert.equal(result.payment, 1000);
  assert.equal(result.interest, 0);
});

test("Ontario tax matches the official $400,000 example", () => {
  const result = landTransferTax(400000, "ontario", false);
  assert.equal(result.provincial, 4475);
  assert.equal(result.municipal, 0);
  assert.equal(result.total, 4475);
});

test("Toronto applies provincial and municipal tax", () => {
  const result = landTransferTax(400000, "toronto", false);
  assert.equal(result.provincial, 4475);
  assert.equal(result.municipal, 4475);
  assert.equal(result.total, 8950);
});

test("first-time rebates are capped at current maximums", () => {
  const result = landTransferTax(700000, "toronto", true);
  assert.equal(result.rebate, 8475);
  assert.equal(result.total, result.provincial + result.municipal - 8475);
});

test("graduated tax accepts an open upper bracket", () => {
  const result = graduatedTax(100000, [
    [50000, 0.01],
    [Infinity, 0.02],
  ]);
  assert.equal(result, 1500);
});

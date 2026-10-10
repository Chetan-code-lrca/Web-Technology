const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const { calculateValues } = require("../calculator.js");

test("calculates each supported operation", () => {
  assert.deepEqual(calculateValues("12", "3", "+"), { ok: true, value: 15 });
  assert.deepEqual(calculateValues("12", "3", "-"), { ok: true, value: 9 });
  assert.deepEqual(calculateValues("12", "3", "*"), { ok: true, value: 36 });
  assert.deepEqual(calculateValues("12", "3", "/"), { ok: true, value: 4 });
});

test("supports decimals and negative values", () => {
  assert.deepEqual(calculateValues("-2.5", "0.5", "*"), { ok: true, value: -1.25 });
  assert.deepEqual(calculateValues("0.1", "0.2", "+"), { ok: true, value: 0.30000000000000004 });
});

test("rejects missing and invalid inputs", () => {
  assert.equal(calculateValues("", "2", "+").ok, false);
  assert.equal(calculateValues(" ", "2", "+").ok, false);
  assert.equal(calculateValues("abc", "2", "+").ok, false);
  assert.equal(calculateValues("Infinity", "2", "+").ok, false);
});

test("rejects unsupported operators", () => {
  const result = calculateValues("2", "3", "**");
  assert.equal(result.ok, false);
  assert.match(result.message, /supported operation/i);
});

test("prevents division by zero", () => {
  const result = calculateValues("8", "0", "/");
  assert.equal(result.ok, false);
  assert.match(result.message, /zero/i);
});

test("rejects numeric overflow", () => {
  const result = calculateValues("1e308", "1e308", "*");
  assert.equal(result.ok, false);
  assert.match(result.message, /numeric range/i);
});


test("labels arithmetic controls as an accessible group", () => {
  const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
  const operationsContainer = html.match(/<div\b(?=[^>]*\bclass="operations")([^>]*)>/);

  assert.ok(operationsContainer, "operations container should exist");
  assert.match(operationsContainer[1], /\brole="group"/);
  assert.match(operationsContainer[1], /\baria-label="Arithmetic operations"/);
});

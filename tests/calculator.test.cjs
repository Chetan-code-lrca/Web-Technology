const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { calculateValues } = require("../calculator.js");

function createPageHarness() {
  const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
  const inlineScript = html.match(/<script>([\\s\\S]*?)<\\/script>/i)?.[1];
  assert.ok(inlineScript, "index.html should contain the inline UI script");

  const listeners = new Map();
  const classes = new Set();
  const result = {
    textContent: "Result: 0",
    classList: {
      toggle(name, enabled) {
        if (enabled) classes.add(name);
        else classes.delete(name);
      },
      remove(...names) {
        names.forEach((name) => classes.delete(name));
      },
    },
  };
  const elements = {
    num1: { value: "" },
    num2: { value: "" },
    result,
    clear: {
      addEventListener(event, handler) {
        assert.equal(event, "click");
        listeners.set("clear", handler);
      },
    },
  };
  const operatorButtons = ["+", "-", "*", "/"].map((operator) => ({
    dataset: { operator },
    addEventListener(event, handler) {
      assert.equal(event, "click");
      listeners.set(operator, handler);
    },
  }));
  const document = {
    querySelectorAll(selector) {
      assert.equal(selector, "[data-operator]");
      return operatorButtons;
    },
    getElementById(id) {
      assert.ok(Object.hasOwn(elements, id), `Unexpected DOM element: ${id}`);
      return elements[id];
    },
  };

  vm.runInNewContext(inlineScript, {
    document,
    window: { CalculatorCore: require("../calculator.js") },
  });

  return { elements, listeners, classes };
}

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


test("Clear resets inputs, result, and success styling after a calculation", () => {
  const page = createPageHarness();
  page.elements.num1.value = "8";
  page.elements.num2.value = "2";

  page.listeners.get("+")();

  assert.equal(page.elements.result.textContent, "Result: 10");
  assert.ok(page.classes.has("success"));

  page.listeners.get("clear")();

  assert.equal(page.elements.num1.value, "");
  assert.equal(page.elements.num2.value, "");
  assert.equal(page.elements.result.textContent, "Result: 0");
  assert.equal(page.classes.size, 0);
});

test("Clear removes error styling after division by zero", () => {
  const page = createPageHarness();
  page.elements.num1.value = "8";
  page.elements.num2.value = "0";

  page.listeners.get("/")();

  assert.equal(page.elements.result.textContent, "Cannot divide by zero.");
  assert.ok(page.classes.has("error"));

  page.listeners.get("clear")();

  assert.equal(page.elements.result.textContent, "Result: 0");
  assert.equal(page.classes.size, 0);
});

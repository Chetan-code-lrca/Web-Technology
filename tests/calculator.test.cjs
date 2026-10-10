const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const match = html.match(/<script>([\s\S]*?)<\/script>/i);
assert.ok(match, "index.html should contain the calculator script");

const calculatorScript = match[1];

function createCalculator() {
  const elements = {
    num1: { value: "" },
    num2: { value: "" },
    result: { innerText: "0", style: { color: "black" } },
  };
  const context = {
    document: {
      getElementById(id) {
        assert.ok(Object.hasOwn(elements, id), `Unexpected DOM element: ${id}`);
        return elements[id];
      },
    },
  };
  vm.runInNewContext(calculatorScript, context);
  return { elements, calculate: context.calculate, clear: context.clearCalculator };
}

test("supports addition, subtraction, multiplication, and division", () => {
  const { elements, calculate } = createCalculator();
  elements.num1.value = "8";
  elements.num2.value = "2";

  calculate("+");
  assert.equal(elements.result.innerText, 10);
  calculate("-");
  assert.equal(elements.result.innerText, 6);
  calculate("*");
  assert.equal(elements.result.innerText, 16);
  calculate("/");
  assert.equal(elements.result.innerText, 4);
});

test("shows a message when either input is missing", () => {
  const { elements, calculate } = createCalculator();
  elements.num1.value = "8";
  elements.num2.value = "";

  calculate("+");

  assert.match(elements.result.innerText, /enter both values/i);
  assert.equal(elements.result.style.color, "red");
});

test("prevents division by zero", () => {
  const { elements, calculate } = createCalculator();
  elements.num1.value = "8";
  elements.num2.value = "0";

  calculate("/");

  assert.match(elements.result.innerText, /cannot divide by 0/i);
  assert.equal(elements.result.style.color, "blue");
});

test("clear resets values, output, and color", () => {
  const { elements, calculate, clear } = createCalculator();
  elements.num1.value = "8";
  elements.num2.value = "2";
  calculate("+");

  clear();

  assert.equal(elements.num1.value, "");
  assert.equal(elements.num2.value, "");
  assert.equal(elements.result.innerText, "0");
  assert.equal(elements.result.style.color, "black");
});

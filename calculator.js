(function exposeCalculator(root, factory) {
  const calculator = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = calculator;
  }
  if (root) {
    root.CalculatorCore = calculator;
  }
})(typeof globalThis === "object" ? globalThis : this, function createCalculator() {
  const operations = {
    "+": (left, right) => left + right,
    "-": (left, right) => left - right,
    "*": (left, right) => left * right,
    "/": (left, right) => left / right,
  };

  function calculateValues(first, second, operator) {
    if (String(first).trim() === "" || String(second).trim() === "") {
      return { ok: false, message: "Please enter both numbers." };
    }

    const left = Number(first);
    const right = Number(second);
    if (!Number.isFinite(left) || !Number.isFinite(right)) {
      return { ok: false, message: "Please enter valid finite numbers." };
    }

    if (!Object.prototype.hasOwnProperty.call(operations, operator)) {
      return { ok: false, message: "Choose a supported operation." };
    }

    if (operator === "/" && right === 0) {
      return { ok: false, message: "Cannot divide by zero." };
    }

    const value = operations[operator](left, right);
    if (!Number.isFinite(value)) {
      return { ok: false, message: "The result is outside the supported numeric range." };
    }
    return { ok: true, value };
  }

  return Object.freeze({ calculateValues });
});

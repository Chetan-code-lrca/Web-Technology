# Web Technology Practice

A small, dependency-free calculator made with semantic HTML, CSS, and plain JavaScript.

## Features

- Addition, subtraction, multiplication, and division
- Decimal and negative numbers
- Validation for missing, non-finite, and unsupported values
- Clear button
- Accessible input labels, keyboard focus styles, and an announced result
- Automated tests using Node.js's built-in test runner

## Run locally

Requirements: a modern browser and Python 3 (for the local static server). No package installation is required to run the page.

```bash
git clone https://github.com/Chetan-code-lrca/Web-Technology.git
cd Web-Technology
python -m http.server 8000
```

Open [http://localhost:8000/calculator.html](http://localhost:8000/calculator.html).

## Run tests

Node.js 20 or newer is required only for the tests:

```bash
node --test tests/*.test.cjs
```

## Files

```text
calculator.html       Page structure
calculator.css        Responsive styling
calculator.js         Testable arithmetic logic
tests/calculator.test.cjs
```

The calculation logic is deliberately separated from the DOM, so edge cases can be tested without browser automation or third-party libraries.

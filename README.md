# Web Technology Practice

A collection of small web-development exercises written with plain HTML, CSS, and JavaScript.

## Current project

The repository currently contains a browser-based calculator.

The calculator supports:

- Addition
- Subtraction
- Multiplication
- Division
- Clearing the inputs and result
- Basic validation when an input is missing
- Division-by-zero handling

The implementation is contained in a single HTML file with its CSS and JavaScript included in the same document.

## Run locally

Clone the repository:

```bash
git clone https://github.com/Chetan-code-lrca/Web-Technology.git
cd Web-Technology
```

Open the calculator file in a web browser:

```text
Calculator using HTML,CSS,JS
```

You can double-click the file or open it from the browser using **File → Open**. No server, Node.js installation, or external dependencies are required for the current example.

## How it works

Two numeric inputs are read from the page. Each operator button passes its operation to the `calculate()` function, which performs the calculation and updates the result on the page.

The JavaScript also checks for empty inputs before calculating and prevents division by zero.

## Repository structure

```text
Web-Technology/
├── Calculator using HTML,CSS,JS
└── README.md
```

## Notes

This is a small practice repository for web-technology coursework and experimentation. The current calculator is intentionally simple and does not use a JavaScript framework or a build system.

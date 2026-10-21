const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");

let expr = "";

function showExpression(text) {
  text = text.replaceAll("*", "×");
  text = text.replaceAll("/", "÷");
  text = text.replaceAll("-", "−");
  expressionEl.textContent = text;
}

function updateScreen() {
  showExpression(expr);
  resultEl.textContent = expr || "0";
}

function addValue(value) {
  const operators = "+-*/";
  const last = expr.slice(-1);

  if (operators.includes(value)) {
    if (expr === "" && value !== "-") return;
    if (operators.includes(last)) {
      expr = expr.slice(0, -1);
    }
  }
  expr += value;
  updateScreen();
}

function calculate() {
  if (expr === "") return;
  try {
    const value = eval(expr);
    if (!isFinite(value)) {
      throw new Error("Math error");
    }
    const answer = String(parseFloat(value.toFixed(10)));
    showExpression(expr + " =");
    resultEl.textContent = answer;
    expr = answer;
  } catch (error) {
    resultEl.textContent = "Error";
    expr = "";
  }
}

function clearAll() {
  expr = "";
  expressionEl.textContent = "";
  resultEl.textContent = "0";
}

function deleteLast() {
  expr = expr.slice(0, -1);
  updateScreen();
}

function negate() {
  const match = expr.match(/\d+\.?\d*$/);
  if (!match) return;
  const number = match[0];
  const start = expr.length - number.length;
  const before = expr.slice(0, start);

  if (before.endsWith("-")) {
    const beforeMinus = before.slice(0, -1);
    expr = beforeMinus + (beforeMinus === "" ? "" : "+") + number;
  } else if (before.endsWith("+")) {
    expr = before.slice(0, -1) + "-" + number;
  } else {
    expr = before + "-" + number;
  } updateScreen();
}

const buttons = document.querySelectorAll("button");
buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value !== undefined) addValue(value);
    else if (action === "clear") clearAll();
    else if (action === "delete") deleteLast();
    else if (action === "negate") negate();
    else if (action === "equals") calculate();
  });
});

document.addEventListener("keydown", function (e) {
  if ("0123456789.+-*/".includes(e.key)) addValue(e.key);
  else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    calculate();
  }
  else if (e.key === "Backspace") deleteLast();
  else if (e.key === "Escape") clearAll();
});
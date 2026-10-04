const display = document.querySelector('.display input');
const buttons = document.querySelectorAll('.btn');

let expression = '';
let shouldReset = false;

function updateDisplay(value) {
  display.value = value;
}

function appendValue(value) {
  if (shouldReset) {
    expression = '';
    shouldReset = false;
  }

  const lastChar = expression.slice(-1);

  if (['+', '−', '×', '÷'].includes(value)) {
    if (!expression || ['+', '−', '×', '÷'].includes(lastChar)) {
      return;
    }
    expression += value;
    updateDisplay(expression);
    return;
  }

  if (value === '.') {
    const lastNumber = expression.split(/[+−×÷]/).pop();
    if (lastNumber.includes('.')) {
      return;
    }
  }

  if (expression === '0' && value !== '.') {
    expression = value;
  } else {
    expression += value;
  }

  updateDisplay(expression);
}

function clearCalculator() {
  expression = '';
  shouldReset = false;
  updateDisplay('0');
}

function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay(expression || '0');
}

function calculatePercentage() {
  if (!expression) return;
  const currentValue = Number(expression);
  const result = currentValue / 100;
  expression = String(result);
  updateDisplay(expression);
}

function evaluateExpression() {
  if (!expression) return;

  try {
    const normalized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    const result = Function(`"use strict"; return (${normalized});`)();

    if (!Number.isFinite(result)) {
      throw new Error('Invalid expression');
    }

    const formattedResult = Number.isInteger(result)
      ? String(result)
      : String(Number(result.toFixed(10)));

    expression = formattedResult;
    updateDisplay(formattedResult);
    shouldReset = true;
  } catch (error) {
    expression = '';
    shouldReset = false;
    updateDisplay('Error');
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value || button.textContent.trim();

    if (action === 'clear') {
      clearCalculator();
      return;
    }

    if (action === 'delete') {
      deleteLast();
      return;
    }

    if (action === 'percent') {
      calculatePercentage();
      return;
    }

    if (action === 'equals') {
      evaluateExpression();
      return;
    }

    appendValue(value);
  });
});
function filterme(value) {
  value = parseInt(value, 10);
  var themeToggle = document.getElementById('theme-toggle');
  var mainBody = document.getElementById('main-body');
  var calcBody = document.getElementById('calc-container');
  var calcScreen = document.getElementById('calc-screen');
  var keyBody = document.getElementById('keys-container');
  var numKeys = document.querySelectorAll('.num-keys');
  var delKeys = document.querySelectorAll('.del-keys');
  var enterKey = document.querySelector('.enter-keys');

  if (value === 1) {
    updateClasses(
      [themeToggle, mainBody, calcBody, calcScreen, keyBody],
      ['light_mode', 'fancy_mode'],
      'dark_mode'
    );

    numKeys.forEach((numKey) => {
      numKey.classList.remove('num-keys_light', 'num-keys_fancy');
      numKey.classList.add('num-keys_dark');
    });

    delKeys.forEach((delKey) => {
      delKey.classList.remove('del-keys_light', 'del-keys_fancy');
      delKey.classList.add('del-keys_dark');
    });

    enterKey.classList.remove('enter-keys_light', 'enter-keys_fancy');
    enterKey.classList.add('enter-keys_dark');
  } else if (value === 2) {
    updateClasses(
      [themeToggle, mainBody, calcBody, calcScreen, keyBody],
      ['dark_mode', 'fancy_mode'],
      'light_mode'
    );

    numKeys.forEach((numKey) => {
      numKey.classList.remove('num-keys_dark', 'num-keys_fancy');
      numKey.classList.add('num-keys_light');
    });

    delKeys.forEach((delKey) => {
      delKey.classList.remove('del-keys_dark', 'del-keys_fancy');
      delKey.classList.add('del-keys_light');
    });

    enterKey.classList.remove('enter-keys_dark', 'enter-keys_fancy');
    enterKey.classList.add('enter-keys_light');
  } else if (value === 3) {
    updateClasses(
      [themeToggle, mainBody, calcBody, calcScreen, keyBody],
      ['light_mode', 'dark_mode'],
      'fancy_mode'
    );

    numKeys.forEach((numKey) => {
      numKey.classList.remove('num-keys_dark', 'num-keys_light');
      numKey.classList.add('num-keys_fancy');
    });

    delKeys.forEach((delKey) => {
      delKey.classList.remove('del-keys_dark', 'del-keys_light');
      delKey.classList.add('del-keys_fancy');
    });

    enterKey.classList.remove('enter-keys_dark', 'enter-keys_light');
    enterKey.classList.add('enter-keys_fancy');
  }
}

function updateClasses(elements, removeClasses, addClass) {
  elements.forEach((element) => {
    element.classList.remove(...removeClasses);
    element.classList.add(addClass);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const calcScreen = document.getElementById('calc-screen');
  const keysContainer = document.getElementById('keys-container');

  let currentInput = '';
  let previousInput = '';
  let operator = '';

  keysContainer.addEventListener('click', (e) => {
    const key = e.target;
    const value = key.dataset.value;
    if (!value) return;

    processInput(value);
  });

  document.addEventListener('keydown', (e) => {
    const key = e.key;
    let value = '';

    if (/\d/.test(key)) {
      value = key;
    } else if (key === '.') {
      value = '.';
    } else if (key === '+') {
      value = '+';
    } else if (key === '-') {
      value = '-';
    } else if (key === '*' || key === 'x') {
      value = 'x';
    } else if (key === '/') {
      value = '/';
    } else if (key === 'Enter') {
      value = 'RESULT';
    } else if (key === 'Backspace') {
      value = 'DEL';
    }

    if (value) {
      const keyElement = document.querySelector(`[data-value="${value}"]`);
      if (keyElement) {
        keyElement.classList.add('hover');
        setTimeout(() => {
          keyElement.classList.remove('hover');
        }, 200);
      }

      processInput(value);
    }
  });

  function processInput(value) {
    if (/\d|\./.test(value)) {
      if (currentInput === '' && value === '.') {
        currentInput += '0.';
      } else if (currentInput === 'Undefined') {
        currentInput = value;
      } else if (currentInput.includes('.') && value === '.') {
        window.alert('Invalid input: Only one decimal point is allowed in a number.');
      } else {
        currentInput += value;
      }
      calcScreen.textContent = formatNumber(currentInput);
    } else if (/[\+\-x\/]/.test(value)) {
      if (currentInput === '' && previousInput !== '') {
        operator = value;
      } else {
        operator = value;
        previousInput = currentInput;
        currentInput = '';
      }
    } else if (value === "RESULT") {
      if (currentInput && previousInput && operator) calculate();
    } else if (value === "DEL") {
      if (currentInput === 'Undefined') {
        currentInput = '';
      } else {
        currentInput = currentInput.slice(0, -1);
      }
      calcScreen.textContent = formatNumber(currentInput) || '0';
    } else if (value === "RESET") {
      currentInput = '';
      previousInput = '';
      operator = '';
      calcScreen.textContent = '0';
    }
  }

  function calculate() {
    const a = parseFloat(previousInput);
    const b = parseFloat(currentInput);
    if (isNaN(a) || isNaN(b)) return;

    let result;
    switch (operator) {
      case '+':
        result = a + b;
        break;
      case '-':
        result = a - b;
        break;
      case 'x':
        result = a * b;
        break;
      case '/':
        result = b !== 0 ? a / b : 'Undefined';
    }

    currentInput = result.toString();
    previousInput = '';
    operator = '';
    calcScreen.textContent = currentInput;
  }

  function formatNumber(value) {
    const numericValue = value.replace(/,/g,'');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g,',');
  }
});
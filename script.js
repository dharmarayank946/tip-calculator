/**
 * Tip Calculator — Task 23
 * Professional, Accessible & Responsive Bill Split & Tip Application
 *
 * Core Formulas:
 *   tipAmount     = (billAmount * tipPercentage) / 100
 *   totalBill     = billAmount + tipAmount
 *   tipPerPerson  = tipAmount / numberOfPeople
 *   totalPerPerson = totalBill / numberOfPeople
 */

'use strict';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Currency configuration. Easily customizable.
 * Default is INR (₹) as required.
 */
const CURRENCY_SETTINGS = {
  INR: { locale: 'en-IN', currency: 'INR', symbol: '₹' },
  USD: { locale: 'en-US', currency: 'USD', symbol: '$' },
  EUR: { locale: 'de-DE', currency: 'EUR', symbol: '€' },
  GBP: { locale: 'en-GB', currency: 'GBP', symbol: '£' },
};

let activeCurrencyKey = 'INR';
let currencyFormatter = createCurrencyFormatter(activeCurrencyKey);

/**
 * Factory to build standard Intl.NumberFormat instance
 * @param {string} currencyKey
 * @returns {Intl.NumberFormat}
 */
function createCurrencyFormatter(currencyKey) {
  const config = CURRENCY_SETTINGS[currencyKey] || CURRENCY_SETTINGS.INR;
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ============================================================================
// State Management
// ============================================================================

const state = {
  billAmount: null,        // Number | null
  tipPercentage: null,     // Number | null
  numberOfPeople: 1,       // Number (integer >= 1)
  activePresetBtn: null,   // HTMLButtonElement | null
  hasInteracted: false,    // Tracks if user touched any input
};

// ============================================================================
// DOM Elements
// ============================================================================

const DOM = {
  // Inputs
  billInput: document.getElementById('bill-amount'),
  customTipInput: document.getElementById('custom-tip'),
  peopleInput: document.getElementById('people-count'),
  presetButtons: document.querySelectorAll('.tip-btn'),
  decrementPeopleBtn: document.getElementById('decrement-people'),
  incrementPeopleBtn: document.getElementById('increment-people'),
  currencySelect: document.getElementById('currency-select'),
  resetBtn: document.getElementById('reset-btn'),

  // Controls & wrappers
  billControl: document.getElementById('bill-group')?.querySelector('.input-control'),
  peopleControl: document.getElementById('people-group')?.querySelector('.input-control'),
  billCurrencySymbol: document.getElementById('bill-currency-symbol'),
  currencyTag: document.getElementById('currency-tag'),
  selectedTipDisplay: document.getElementById('selected-tip-display'),
  calcStatus: document.getElementById('calc-status'),
  resultsFootnote: document.getElementById('results-footnote'),

  // Error Messages
  billError: document.getElementById('bill-error'),
  tipError: document.getElementById('tip-error'),
  peopleError: document.getElementById('people-error'),

  // Output Displays
  tipAmountDisplay: document.getElementById('tip-amount'),
  totalBillDisplay: document.getElementById('total-bill'),
  tipPerPersonDisplay: document.getElementById('tip-per-person'),
  totalPerPersonDisplay: document.getElementById('total-per-person'),
};

// ============================================================================
// Formatting & Helpers
// ============================================================================

/**
 * Formats a monetary amount into the current currency string
 * @param {number} amount
 * @returns {string} Formatted currency string (e.g. ₹1,100.00)
 */
function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
    return currencyFormatter.format(0);
  }
  return currencyFormatter.format(amount);
}

/**
 * Display an error message for an input field
 * @param {HTMLElement} errorElement
 * @param {HTMLElement} controlElement
 * @param {string} message
 */
function showError(errorElement, controlElement, message) {
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
  if (controlElement) {
    controlElement.classList.add('is-invalid');
  }
}

/**
 * Clear error message and reset error styling
 * @param {HTMLElement} errorElement
 * @param {HTMLElement} controlElement
 */
function clearError(errorElement, controlElement) {
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }
  if (controlElement) {
    controlElement.classList.remove('is-invalid');
  }
}

// ============================================================================
// Input Validation
// ============================================================================

/**
 * Validates the Bill Amount input
 * @returns {{ isValid: boolean, value: number|null }}
 */
function validateBill() {
  const rawValue = DOM.billInput.value.trim();

  // If user hasn't typed anything yet
  if (rawValue === '') {
    if (state.hasInteracted) {
      showError(DOM.billError, DOM.billControl, 'Please enter a bill amount');
    } else {
      clearError(DOM.billError, DOM.billControl);
    }
    return { isValid: false, value: null };
  }

  const num = parseFloat(rawValue);

  if (isNaN(num)) {
    showError(DOM.billError, DOM.billControl, 'Please enter a valid numeric amount');
    return { isValid: false, value: null };
  }

  if (num < 0) {
    showError(DOM.billError, DOM.billControl, 'Bill amount cannot be negative');
    return { isValid: false, value: null };
  }

  if (num === 0) {
    showError(DOM.billError, DOM.billControl, 'Bill amount must be greater than zero');
    return { isValid: false, value: null };
  }

  clearError(DOM.billError, DOM.billControl);
  return { isValid: true, value: num };
}

/**
 * Validates the Tip Percentage (from preset or custom input)
 * @returns {{ isValid: boolean, value: number|null }}
 */
function validateTip() {
  // If custom tip has a value
  const customRaw = DOM.customTipInput.value.trim();

  if (customRaw !== '') {
    const customNum = parseFloat(customRaw);

    if (isNaN(customNum)) {
      showError(DOM.tipError, null, 'Please enter a valid tip percentage');
      return { isValid: false, value: null };
    }

    if (customNum < 0) {
      showError(DOM.tipError, null, 'Tip percentage cannot be negative');
      return { isValid: false, value: null };
    }

    if (customNum > 100) {
      showError(DOM.tipError, null, 'Tip percentage cannot exceed 100%');
      return { isValid: false, value: null };
    }

    clearError(DOM.tipError, null);
    return { isValid: true, value: customNum };
  }

  // If a preset button is active
  if (state.tipPercentage !== null) {
    clearError(DOM.tipError, null);
    return { isValid: true, value: state.tipPercentage };
  }

  // If neither preset nor custom is selected, but bill is entered
  clearError(DOM.tipError, null);
  return { isValid: false, value: null };
}

/**
 * Validates the Number of People input
 * @returns {{ isValid: boolean, value: number|null }}
 */
function validatePeople() {
  const rawValue = DOM.peopleInput.value.trim();

  if (rawValue === '') {
    showError(DOM.peopleError, DOM.peopleControl, 'Please enter number of people');
    return { isValid: false, value: null };
  }

  const num = Number(rawValue);

  if (isNaN(num)) {
    showError(DOM.peopleError, DOM.peopleControl, 'Please enter a valid number');
    return { isValid: false, value: null };
  }

  if (!Number.isInteger(num)) {
    showError(DOM.peopleError, DOM.peopleControl, 'Number of people must be a whole number');
    return { isValid: false, value: null };
  }

  if (num === 0) {
    showError(DOM.peopleError, DOM.peopleControl, 'Cannot divide by zero. Enter at least 1');
    return { isValid: false, value: null };
  }

  if (num < 1) {
    showError(DOM.peopleError, DOM.peopleControl, 'Number of people must be at least 1');
    return { isValid: false, value: null };
  }

  clearError(DOM.peopleError, DOM.peopleControl);
  return { isValid: true, value: num };
}

// ============================================================================
// Core Calculation & DOM Updates
// ============================================================================

/**
 * Recalculates all values and updates the UI
 */
function calculate() {
  const billValidation = validateBill();
  const tipValidation = validateTip();
  const peopleValidation = validatePeople();

  // Update Reset button state
  const isFormDirty = DOM.billInput.value !== '' ||
                      DOM.customTipInput.value !== '' ||
                      state.tipPercentage !== null ||
                      DOM.peopleInput.value !== '1';

  DOM.resetBtn.disabled = !isFormDirty;

  // Check if we have complete and valid inputs to compute
  const canCalculate = billValidation.isValid &&
                       tipValidation.isValid &&
                       peopleValidation.isValid;

  if (!canCalculate) {
    renderZeroResults();

    // Contextual footnote message
    if (!billValidation.isValid) {
      DOM.resultsFootnote.textContent = 'Enter a valid bill amount greater than zero.';
    } else if (!tipValidation.isValid) {
      DOM.resultsFootnote.textContent = 'Select a preset tip or enter a custom percentage.';
    } else if (!peopleValidation.isValid) {
      DOM.resultsFootnote.textContent = 'Ensure the number of people is at least 1.';
    }
    return;
  }

  const bill = billValidation.value;
  const tipPercent = tipValidation.value;
  const people = peopleValidation.value;

  // Arithmetic formulas
  const tipAmount = (bill * tipPercent) / 100;
  const totalBill = bill + tipAmount;
  const tipPerPerson = tipAmount / people;
  const totalPerPerson = totalBill / people;

  // Safeguard against NaN/Infinity
  if (!isFinite(tipAmount) || !isFinite(totalBill) || !isFinite(tipPerPerson) || !isFinite(totalPerPerson)) {
    renderZeroResults();
    return;
  }

  // Render formatted results
  DOM.tipAmountDisplay.textContent = formatCurrency(tipAmount);
  DOM.totalBillDisplay.textContent = formatCurrency(totalBill);
  DOM.tipPerPersonDisplay.textContent = formatCurrency(tipPerPerson);
  DOM.totalPerPersonDisplay.textContent = formatCurrency(totalPerPerson);

  // Status message
  DOM.resultsFootnote.textContent = `Calculated with ${tipPercent}% tip for ${people} ${people === 1 ? 'person' : 'people'}.`;
}

/**
 * Reset all displayed calculation numbers to ₹0.00 safely
 */
function renderZeroResults() {
  const zero = formatCurrency(0);
  DOM.tipAmountDisplay.textContent = zero;
  DOM.totalBillDisplay.textContent = zero;
  DOM.tipPerPersonDisplay.textContent = zero;
  DOM.totalPerPersonDisplay.textContent = zero;
}

// ============================================================================
// Tip Selection Logic (Preset vs Custom)
// ============================================================================

/**
 * Handles preset tip button clicks
 * @param {HTMLButtonElement} button
 */
function handlePresetClick(button) {
  state.hasInteracted = true;
  const tipVal = parseFloat(button.dataset.tip);

  // If clicked again, deselect it
  if (state.activePresetBtn === button) {
    deselectAllPresets();
    state.tipPercentage = null;
    DOM.selectedTipDisplay.textContent = 'None selected';
  } else {
    deselectAllPresets();
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    state.activePresetBtn = button;
    state.tipPercentage = tipVal;
    DOM.selectedTipDisplay.textContent = `${tipVal}% selected`;
  }

  // Clear custom tip input
  DOM.customTipInput.value = '';
  DOM.customTipInput.classList.remove('active-custom');
  clearError(DOM.tipError, null);

  calculate();
}

/**
 * Handles custom tip percentage input
 */
function handleCustomTipInput() {
  state.hasInteracted = true;
  deselectAllPresets();
  state.tipPercentage = null;

  if (DOM.customTipInput.value.trim() !== '') {
    DOM.customTipInput.classList.add('active-custom');
    DOM.selectedTipDisplay.textContent = `Custom (${DOM.customTipInput.value}%)`;
  } else {
    DOM.customTipInput.classList.remove('active-custom');
    DOM.selectedTipDisplay.textContent = 'None selected';
  }

  calculate();
}

/**
 * Deselect all preset tip buttons
 */
function deselectAllPresets() {
  DOM.presetButtons.forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });
  state.activePresetBtn = null;
}

// ============================================================================
// Stepper Controls
// ============================================================================

function stepPeople(delta) {
  state.hasInteracted = true;
  const current = parseInt(DOM.peopleInput.value, 10) || 1;
  const next = Math.max(1, current + delta);
  DOM.peopleInput.value = next;
  calculate();
}

// ============================================================================
// Reset Action
// ============================================================================

/**
 * Resets all inputs, errors, selections and state to default
 */
function resetCalculator() {
  state.billAmount = null;
  state.tipPercentage = null;
  state.numberOfPeople = 1;
  state.activePresetBtn = null;
  state.hasInteracted = false;

  // Clear inputs
  DOM.billInput.value = '';
  DOM.customTipInput.value = '';
  DOM.customTipInput.classList.remove('active-custom');
  DOM.peopleInput.value = '1';

  // Deselect preset buttons
  deselectAllPresets();
  DOM.selectedTipDisplay.textContent = 'None selected';

  // Clear error states
  clearError(DOM.billError, DOM.billControl);
  clearError(DOM.tipError, null);
  clearError(DOM.peopleError, DOM.peopleControl);

  // Render zero results
  renderZeroResults();

  // Reset footnote and disable reset button
  DOM.resultsFootnote.textContent = 'Enter a bill amount and select a tip percentage to calculate.';
  DOM.resetBtn.disabled = true;

  // Refocus bill input for great UX
  DOM.billInput.focus();
}

// ============================================================================
// Currency Switcher
// ============================================================================

function handleCurrencyChange(e) {
  const newCurrency = e.target.value;
  if (!CURRENCY_SETTINGS[newCurrency]) return;

  activeCurrencyKey = newCurrency;
  currencyFormatter = createCurrencyFormatter(activeCurrencyKey);

  // Update UI symbols
  const symbol = CURRENCY_SETTINGS[activeCurrencyKey].symbol;
  DOM.billCurrencySymbol.textContent = symbol;
  DOM.currencyTag.textContent = `${activeCurrencyKey} (${symbol})`;

  calculate();
}

// ============================================================================
// Event Listeners Initialization
// ============================================================================

function initEventListeners() {
  // Live calculation on input
  DOM.billInput.addEventListener('input', () => {
    state.hasInteracted = true;
    calculate();
  });

  DOM.peopleInput.addEventListener('input', () => {
    state.hasInteracted = true;
    calculate();
  });

  // Preset tip buttons
  DOM.presetButtons.forEach(btn => {
    btn.addEventListener('click', () => handlePresetClick(btn));
  });

  // Custom tip input
  DOM.customTipInput.addEventListener('input', handleCustomTipInput);
  DOM.customTipInput.addEventListener('focus', () => {
    if (DOM.customTipInput.value.trim() !== '') {
      handleCustomTipInput();
    }
  });

  // Stepper buttons for people
  DOM.decrementPeopleBtn.addEventListener('click', () => stepPeople(-1));
  DOM.incrementPeopleBtn.addEventListener('click', () => stepPeople(1));

  // Currency selector
  DOM.currencySelect.addEventListener('change', handleCurrencyChange);

  // Reset button
  DOM.resetBtn.addEventListener('click', resetCalculator);

  // Keyboard navigation & accessibility enhancements
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!DOM.resetBtn.disabled) {
        resetCalculator();
      }
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  renderZeroResults();
  initEventListeners();
});

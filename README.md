# Tip Calculator — Web Development Task 23

A modern, responsive, and accessible **Tip Calculator** web application built with semantic HTML5, modern CSS3, and vanilla JavaScript. The calculator allows users to enter a bill amount, select or input a custom tip percentage, specify the number of people splitting the bill, and view instant live calculations for individual and total shares.

---

## 🌟 Key Features

- **Bill Amount Input**:
  - Supports standard and decimal amounts.
  - Rejects negative values and non-numeric inputs with helpful inline validation.
  - Safely handles zero and empty inputs without producing misleading calculations.

- **Interactive Tip Selection**:
  - Quick preset buttons: **5%**, **10%**, **15%**, **20%**, and **25%**.
  - Custom tip percentage input field for custom gratuity amounts.
  - Clear visual highlight for the active preset.
  - Automatically deselects presets when entering a custom percentage, and vice versa.
  - Validation guards against negative tip percentages and values exceeding 100%.

- **Split Bill by People**:
  - Supports whole number of people sharing the bill (defaults to 1).
  - Quick increment (`+`) and decrement (`-`) stepper buttons.
  - Strict validation preventing division by zero, negative people, and fractional numbers.

- **Instant Live Calculations**:
  - Recalculates dynamically on every keystroke and button click without reloading the page.
  - Displays:
    - **Tip Amount** (Total bill tip)
    - **Total Bill** (Bill + tip)
    - **Tip / Person** (Individual tip share)
    - **Total / Person** (Featured hero breakdown of total cost per person)

- **Currency Formatting**:
  - Uses JavaScript's native `Intl.NumberFormat` API.
  - Formats numbers in Indian Rupee (**INR - ₹**) with 2 decimal places by default.
  - Easily customizable configuration object for international currencies (includes instant switcher for INR ₹, USD $, EUR €, and GBP £).

- **Reset Functionality**:
  - Resets all inputs, custom tip, and people count back to initial defaults.
  - Clears all active presets and error banners.
  - Automatically activates only when inputs have been modified.

- **Modern & Accessible UX**:
  - Dark Navy & Mint Slate card theme with polished typography.
  - Fully responsive layout optimized for mobile, tablet, and desktop viewports.
  - ARIA attributes, semantic markup, visible focus indicators, and keyboard navigation support (`Escape` to reset).

---

## 📐 Calculation Formulas

The calculations in `script.js` adhere to standard financial split logic:

$$
\text{tipAmount} = \frac{\text{billAmount} \times \text{tipPercentage}}{100}
$$

$$
\text{totalBill} = \text{billAmount} + \text{tipAmount}
$$

$$
\text{tipPerPerson} = \frac{\text{tipAmount}}{\text{numberOfPeople}}
$$

$$
\text{totalPerPerson} = \frac{\text{totalBill}}{\text{numberOfPeople}}
$$

All monetary outputs are rounded to two decimal places and formatted using `Intl.NumberFormat`.

---

## 📁 File Structure

```
tip-calculator/
├── index.html        # Semantic HTML5 layout, inputs, preset buttons & results panel
├── style.css         # Responsive styling, design tokens, typography & animations
├── script.js         # Core calculation engine, input validation, state & DOM updates
└── README.md         # Comprehensive project documentation & usage guide
```

---

## 🚀 How to Run Locally

Since this project uses pure HTML5, CSS3, and Vanilla JavaScript, no build step or package installation is required.

### Option 1: Direct File Open
Double click `index.html` or right-click and choose **Open With > Google Chrome** (or any modern browser).

### Option 2: Local HTTP Server (Recommended)
Using Python or Node.js:

```bash
# Using Python 3
python -m http.server 3000

# Or using Node.js npx serve
npx serve .
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verified Test Cases

| Test Case | Inputs | Expected Output | Status |
|:---|:---|:---|:---:|
| **Test 1** | Bill: ₹1,000, Tip: 10%, People: 1 | Tip: ₹100.00, Total: ₹1,100.00, Tip/Person: ₹100.00, Total/Person: ₹1,100.00 | Passed ✅ |
| **Test 2** | Bill: ₹1,000, Tip: 15%, People: 2 | Tip: ₹150.00, Total: ₹1,150.00, Tip/Person: ₹75.00, Total/Person: ₹575.00 | Passed ✅ |
| **Test 3** | Bill: ₹999.99, Tip: 10%, People: 3 | Tip: ₹100.00, Total: ₹1,099.99, Tip/Person: ₹33.33, Total/Person: ₹366.66 | Passed ✅ |
| **Test 4** | Empty bill amount | Safely handles zero/empty without NaN; prompts user with clear message | Passed ✅ |
| **Test 5** | Zero or negative people | Displays error "Cannot divide by zero. Enter at least 1"; prevents calculation error | Passed ✅ |
| **Test 6** | Negative bill or tip | Displays "Bill amount cannot be negative" / "Tip percentage cannot be negative" | Passed ✅ |
| **Test 7** | Custom tip percentage | Dynamic calculation updates accurately; clears preset button selection | Passed ✅ |
| **Test 8** | Reset button | Restores inputs to empty, people to 1, deselects presets, and sets outputs to ₹0.00 | Passed ✅ |
| **Test 9** | Responsive layout | Fluid grid adapting seamlessly to mobile, tablet, and desktop screens | Passed ✅ |
| **Test 10** | Console health | Clean runtime with 0 errors or warnings during execution | Passed ✅ |

---

## 📄 License
Open source and educational project created for Web Development Track Task 23.

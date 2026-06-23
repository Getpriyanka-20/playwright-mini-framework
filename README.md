# Playwright Mini Automation Framework

A portfolio automation project built using Playwright and JavaScript.

The framework covers:

- SauceDemo UI automation
- Restful Booker API testing
- Cross-browser testing
- Page Object Model
- Test-data management
- HTML reports
- Screenshots, videos, and traces on failure

## Current Progress

- [x] Playwright project created
- [x] SauceDemo login automation added
- [x] Chromium, Firefox, and WebKit configured
- [x] HTML reporting configured
- [x] Login Page Object Model created
- [x] Valid login test
- [x] Invalid login test
- [x] Locked-out user test
- [x] Required-field validation tests
- [x] Product tests
- [x] Products Page Object Model created
- [x] Product-list validation
- [x] Product name and price validation
- [x] Name sorting validation
- [x] Price sorting validation
- [x] Product-details navigation test
- [x] Cart tests
- [x] Cart Page Object Model created
- [x] Add one product to cart
- [x] Add multiple products to cart
- [x] Verify cart product names and prices
- [x] Remove product from cart
- [x] Continue Shopping navigation
- [x] Cart persistence after refresh
- [x] Checkout tests
- [x] Checkout Page Object Model created
- [x] Checkout required-field validation
- [x] Checkout customer-information test
- [x] Order-overview product validation
- [x] Subtotal, tax, and total validation
- [x] Successful order-completion test
- [x] Return-to-products validation
- [x] Cancel-checkout validation
- [x] Restful Booker API tests
- [x] Restful Booker API project configured
- [x] Retrieve booking IDs
- [x] Create and retrieve booking
- [x] Complete booking update using PUT
- [x] Partial booking update using PATCH
- [x] Authentication validation
- [x] Delete booking and verify deletion
- [x] Negative API scenarios

## Run Tests

Run all tests:

```bash
npm test
class CheckoutPage {
  constructor(page) {
    this.page = page;

    // Checkout information page
    this.pageTitle = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Checkout overview page
    this.overviewItems = page.locator('[data-test="inventory-item"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');

    // Checkout complete page
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async enterFirstName(firstName) {
    await this.firstNameInput.fill(firstName);
  }

  async enterLastName(lastName) {
    await this.lastNameInput.fill(lastName);
  }

  async enterPostalCode(postalCode) {
    await this.postalCodeInput.fill(postalCode);
  }

  async fillCheckoutInformation(customer) {
    await this.enterFirstName(customer.firstName);
    await this.enterLastName(customer.lastName);
    await this.enterPostalCode(customer.postalCode);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async backToProducts() {
    await this.backToProductsButton.click();
  }

  getOverviewItem(productName) {
    return this.overviewItems.filter({
      has: this.page.getByText(productName, { exact: true }),
    });
  }

  async getCurrencyAmount(locator) {
    const text = await locator.textContent();

    if (!text) {
      throw new Error('Unable to read currency amount');
    }

    const match = text.match(/\$([\d.]+)/);

    if (!match) {
      throw new Error(`Currency amount not found in: ${text}`);
    }

    return Number(match[1]);
  }

  async getSubtotal() {
    return await this.getCurrencyAmount(this.subtotalLabel);
  }

  async getTax() {
    return await this.getCurrencyAmount(this.taxLabel);
  }

  async getTotal() {
    return await this.getCurrencyAmount(this.totalLabel);
  }
}

module.exports = { CheckoutPage };
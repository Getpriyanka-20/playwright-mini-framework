class CartPage {
  constructor(page) {
    this.page = page;

    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');

    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]'
    );

    this.checkoutButton = page.locator(
      '[data-test="checkout"]'
    );
  }

  getCartItem(productName) {
    return this.cartItems.filter({
      has: this.page.getByText(productName, { exact: true }),
    });
  }

  getCartItemPrice(productName) {
    return this.getCartItem(productName).locator(
      '[data-test="inventory-item-price"]'
    );
  }

  async removeProduct(productName) {
    const cartItem = this.getCartItem(productName);

    await cartItem
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };
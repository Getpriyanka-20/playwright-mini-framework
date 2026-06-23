class ProductsPage {
  constructor(page) {
    this.page = page;

    this.pageTitle = page.locator('[data-test="title"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.productNames = page.locator('[data-test="inventory-item-name"]');
    this.productPrices = page.locator('[data-test="inventory-item-price"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');

    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  getProductCard(productName) {
    return this.inventoryItems.filter({
      has: this.page.getByText(productName, { exact: true }),
    });
  }

  getProductPrice(productName) {
    return this.getProductCard(productName).locator(
      '[data-test="inventory-item-price"]'
    );
  }

  async sortProductsBy(sortValue) {
    await this.sortDropdown.selectOption(sortValue);
  }

  async getAllProductNames() {
    return await this.productNames.allTextContents();
  }

  async getAllProductPrices() {
    const priceTexts = await this.productPrices.allTextContents();

    return priceTexts.map((price) =>
      Number(price.replace('$', '').trim())
    );
  }

  async openProductDetails(productName) {
    const productCard = this.getProductCard(productName);

    await productCard
      .getByText(productName, { exact: true })
      .click();
  }
  async addProductToCart(productName) {
  const productCard = this.getProductCard(productName);

  await productCard
    .getByRole('button', { name: 'Add to cart' })
    .click();
}

async removeProductFromProductsPage(productName) {
  const productCard = this.getProductCard(productName);

  await productCard
    .getByRole('button', { name: 'Remove' })
    .click();
}

async openCart() {
  await this.cartLink.click();
}
}

module.exports = { ProductsPage };
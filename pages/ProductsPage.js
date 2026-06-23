class ProductsPage {
  constructor(page) {
    this.page = page;

    this.pageTitle = page.locator('[data-test="title"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.productNames = page.locator('[data-test="inventory-item-name"]');
    this.productPrices = page.locator('[data-test="inventory-item-price"]');
    this.sortDropdown = page.locator(
      '[data-test="product-sort-container"]'
    );
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
}

module.exports = { ProductsPage };
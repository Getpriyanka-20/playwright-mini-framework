const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage.js');
const { ProductsPage } = require('../../pages/ProductsPage.js');
const users = require('../../test-data/users.json');

test.describe('SauceDemo Products Tests', () => {
  let loginPage;
  let productsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    await loginPage.navigateToLoginPage();

    await loginPage.login(
      users.validUser.username,
      users.validUser.password
    );

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('should display the products page and all products', async () => {
    await expect(productsPage.pageTitle).toHaveText('Products');
    await expect(productsPage.inventoryItems).toHaveCount(6);
  });

  test('should display the correct product name and price', async () => {
    const productName = 'Sauce Labs Backpack';

    const productCard = productsPage.getProductCard(productName);

    await expect(productCard).toBeVisible();

    await expect(
      productsPage.getProductPrice(productName)
    ).toHaveText('$29.99');
  });

  test('should sort products by name from Z to A', async () => {
    await productsPage.sortProductsBy('za');

    const actualNames = await productsPage.getAllProductNames();

    const expectedNames = [...actualNames].sort((first, second) =>
      second.localeCompare(first)
    );

    expect(actualNames).toEqual(expectedNames);
  });

  test('should sort products by price from low to high', async () => {
    await productsPage.sortProductsBy('lohi');

    const actualPrices = await productsPage.getAllProductPrices();

    const expectedPrices = [...actualPrices].sort(
      (first, second) => first - second
    );

    expect(actualPrices).toEqual(expectedPrices);
  });

  test('should open the selected product details page', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';

    await productsPage.openProductDetails(productName);

    await expect(page).toHaveURL(/inventory-item\.html/);

    await expect(
      page.locator('[data-test="inventory-item-name"]')
    ).toHaveText(productName);
  });
});
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage.js');
const { ProductsPage } = require('../../pages/ProductsPage.js');
const { CartPage } = require('../../pages/CartPage.js');
const users = require('../../test-data/users.json');

test.describe('SauceDemo Shopping Cart Tests', () => {
  let loginPage;
  let productsPage;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    await loginPage.navigateToLoginPage();

    await loginPage.login(
      users.validUser.username,
      users.validUser.password
    );

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('should add one product to the cart', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';

    await productsPage.addProductToCart(productName);

    await expect(productsPage.cartBadge).toHaveText('1');

    await productsPage.openCart();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    await expect(cartPage.getCartItem(productName)).toBeVisible();
  });

  test('should add two products and display correct prices', async () => {
    const firstProduct = 'Sauce Labs Backpack';
    const secondProduct = 'Sauce Labs Bike Light';

    await productsPage.addProductToCart(firstProduct);
    await productsPage.addProductToCart(secondProduct);

    await expect(productsPage.cartBadge).toHaveText('2');

    await productsPage.openCart();

    await expect(cartPage.cartItems).toHaveCount(2);

    await expect(
      cartPage.getCartItem(firstProduct)
    ).toBeVisible();

    await expect(
      cartPage.getCartItem(secondProduct)
    ).toBeVisible();

    await expect(
      cartPage.getCartItemPrice(firstProduct)
    ).toHaveText('$29.99');

    await expect(
      cartPage.getCartItemPrice(secondProduct)
    ).toHaveText('$9.99');
  });

  test('should remove a product from the cart', async () => {
    const productName = 'Sauce Labs Backpack';

    await productsPage.addProductToCart(productName);
    await productsPage.openCart();

    await expect(cartPage.getCartItem(productName)).toBeVisible();

    await cartPage.removeProduct(productName);

    await expect(cartPage.getCartItem(productName)).toHaveCount(0);
    await expect(productsPage.cartBadge).toHaveCount(0);
  });

  test('should return to the products page using Continue Shopping', async ({
    page,
  }) => {
    await productsPage.openCart();

    await expect(page).toHaveURL(/cart\.html/);

    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(productsPage.pageTitle).toHaveText('Products');
  });

  test('should retain the cart item after page refresh', async ({ page }) => {
    const productName = 'Sauce Labs Backpack';

    await productsPage.addProductToCart(productName);
    await productsPage.openCart();

    await page.reload();

    await expect(cartPage.getCartItem(productName)).toBeVisible();
    await expect(productsPage.cartBadge).toHaveText('1');
  });
});
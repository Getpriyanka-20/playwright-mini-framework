//const { test, expect } = require('@playwright/test');
//const { LoginPage } = require('../../pages/LoginPage.js');
//const { ProductsPage } = require('../../pages/ProductsPage.js');
//const { CartPage } = require('../../pages/CartPage.js');
//const { CheckoutPage } = require('../../pages/CheckoutPage.js');
const { test, expect } = require('../../fixtures/baseTest.js');

const users = require('../../test-data/users.json');
const checkoutData = require('../../test-data/checkoutData.json');

test.describe('SauceDemo Checkout Tests', () => {
  //let loginPage;
  //let productsPage;
  //let cartPage;
  //let checkoutPage;

  const firstProduct = 'Sauce Labs Backpack';
  const secondProduct = 'Sauce Labs Bike Light';

  test.beforeEach(async ({page ,loginPage, productsPage, cartPage}) => {
    //loginPage = new LoginPage(page);
    //productsPage = new ProductsPage(page)
    //cartPage = new CartPage(page);
    //checkoutPage = new CheckoutPage(page);

    await loginPage.navigateToLoginPage();

    await loginPage.login(
      users.validUser.username,
      users.validUser.password
    );

    await expect(page).toHaveURL(/inventory\.html/);

    await productsPage.addProductToCart(firstProduct);
    await productsPage.addProductToCart(secondProduct);

    await expect(productsPage.cartBadge).toHaveText('2');

    await productsPage.openCart();
    await expect(page).toHaveURL(/cart\.html/);

    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('should display the checkout information page', async ({checkoutPage}) => {
    await expect(checkoutPage.pageTitle).toHaveText(
      'Checkout: Your Information'
    );

    await expect(checkoutPage.firstNameInput).toBeVisible();
    await expect(checkoutPage.lastNameInput).toBeVisible();
    await expect(checkoutPage.postalCodeInput).toBeVisible();
    await expect(checkoutPage.continueButton).toBeVisible();
  });

  test('should require the first name', async ({checkoutPage}) => {
    await checkoutPage.continueCheckout();

    await expect(checkoutPage.errorMessage).toHaveText(
      'Error: First Name is required'
    );
  });

  test('should require the last name', async ({checkoutPage}) => {
    await checkoutPage.enterFirstName(
      checkoutData.validCustomer.firstName
    );

    await checkoutPage.continueCheckout();

    await expect(checkoutPage.errorMessage).toHaveText(
      'Error: Last Name is required'
    );
  });

  test('should require the postal code', async ({checkoutPage}) => {
    await checkoutPage.enterFirstName(
      checkoutData.validCustomer.firstName
    );

    await checkoutPage.enterLastName(
      checkoutData.validCustomer.lastName
    );

    await checkoutPage.continueCheckout();

    await expect(checkoutPage.errorMessage).toHaveText(
      'Error: Postal Code is required'
    );
  });

  test('should display selected products in the order overview', async ({page, checkoutPage}) => {
    await checkoutPage.fillCheckoutInformation(
      checkoutData.validCustomer
    );

    await checkoutPage.continueCheckout();

    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await expect(checkoutPage.pageTitle).toHaveText(
      'Checkout: Overview'
    );

    await expect(
      checkoutPage.getOverviewItem(firstProduct)
    ).toBeVisible();

    await expect(
      checkoutPage.getOverviewItem(secondProduct)
    ).toBeVisible();

    await expect(checkoutPage.overviewItems).toHaveCount(2);
  });

  test('should display the correct subtotal, tax, and total', async ({checkoutPage}) => {
    await checkoutPage.fillCheckoutInformation(
      checkoutData.validCustomer
    );

    await checkoutPage.continueCheckout();

    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    expect(subtotal).toBe(39.98);
    expect(tax).toBeGreaterThan(0);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('should complete an order successfully', async ({page, checkoutPage, productsPage}) => {
    await checkoutPage.fillCheckoutInformation(
      checkoutData.validCustomer
    );

    await checkoutPage.continueCheckout();

    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await checkoutPage.finishOrder();

    await expect(page).toHaveURL(/checkout-complete\.html/);

    await expect(checkoutPage.completeHeader).toHaveText(
      'Thank you for your order!'
    );

    await expect(checkoutPage.completeText).toBeVisible();

    await expect(productsPage.cartBadge).toHaveCount(0);
  });

  test('should return to Products after completing an order', async ({ page, checkoutPage, productsPage}) => {
    await checkoutPage.fillCheckoutInformation(
      checkoutData.validCustomer
    );

    await checkoutPage.continueCheckout();
    await checkoutPage.finishOrder();
    await checkoutPage.backToProducts();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(productsPage.pageTitle).toHaveText('Products');
  });

  test('should return to the cart when checkout is cancelled', async ({
    page, checkoutPage, cartPage
  }) => {
    await checkoutPage.cancelCheckout();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    await expect(cartPage.cartItems).toHaveCount(2);
  });
});
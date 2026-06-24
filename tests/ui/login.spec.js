//const { test, expect } = require('@playwright/test');
//const { LoginPage } = require('../../pages/LoginPage');
const { test, expect } = require('../../fixtures/baseTest.js');
const users = require('../../test-data/users.json');

test.describe('SauceDemo Login Tests', () => {
  //let loginPage;

  test.beforeEach(async ({ loginPage }) => {
   // loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('should login successfully with valid credentials', async ({page, loginPage }) => {
    await loginPage.login(
      users.validUser.username,
      users.validUser.password
    );

    await expect(page).toHaveURL(
      'https://www.saucedemo.com/inventory.html'
    );

    await expect(
      page.getByText('Products', { exact: true })
    ).toBeVisible();
  });

  test('should show an error for invalid credentials', async ({loginPage}) => {
    await loginPage.login(
      users.invalidUser.username,
      users.invalidUser.password
    );

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('should show an error for a locked-out user', async ({loginPage}) => {
    await loginPage.login(
      users.lockedOutUser.username,
      users.lockedOutUser.password
    );

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('should require a username when fields are empty', async ({loginPage}) => {
    await loginPage.clickLoginButton();

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Username is required'
    );
  });

  test('should require a password when only username is entered', async ({loginPage}) => {
    await loginPage.enterUsername(users.validUser.username);
    await loginPage.clickLoginButton();

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Password is required'
    );
  });
});
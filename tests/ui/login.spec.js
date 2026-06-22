const {test, expect} = require('@playwright/test');
test.describe('SauceDemo login page', () => {
    test('should diplay the login form',async ({page}) => {
        await page.goto('/');

        await expect(page).toHaveTitle('Swag Labs');
        await expect(page.getByPlaceholder('Username')).toBeVisible();
        await expect(page.getByPlaceholder('Password')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

        //await expect(page.locator('#login-button')).toBeVisible();
    });
});
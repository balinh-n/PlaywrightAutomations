const { test, expect } = require('@playwright/test');

test.describe('Playwright Methods Demo', () => {

  test.beforeEach(async ({ page }) => {
    // Go to a demo page before each test
    await page.goto('https://www.saucedemo.com/');
    // Login
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('Locator Methods', async ({ page }) => {
    // --- getByRole ---
    // Locate an element by its ARIA role
    const pageTitle = await page.getByRole('heading', { name: /products/i });
    await expect(pageTitle).toBeVisible();

    // --- getByText ---
    // Locate an element by the text it contains
    const inventoryItem = await page.getByText('Sauce Labs Backpack');
    await expect(inventoryItem).toBeVisible();

    // --- getByLabel ---
    // Note: This page doesn't have elements with labels, but the usage is as follows:
    // const input = await page.getByLabel('User Name');
    // await input.fill('example');

    // --- getByPlaceholder ---
    // Note: This page doesn't have elements with placeholders after login, but the usage is as follows:
    // const input = await page.getByPlaceholder('Enter your username');
    // await input.fill('example');

    // --- getByAltText ---
    // Locate an image by its alt text
    const itemImage = await page.getByAltText('Sauce Labs Backpack');
    await expect(itemImage).toBeVisible();

    // --- getByTitle ---
    // Note: This page doesn't have elements with titles, but the usage is as follows:
    // const element = await page.getByTitle('Close');
    // await expect(element).toBeVisible();

    // --- getByTestId ---
    // Locate an element by its data-testid attribute
    const shoppingCartLink = await page.getByTestId('shopping-cart-link');
    await expect(shoppingCartLink).toBeVisible();
  });



  test('Action Methods', async ({ page }) => {
    const shoppingCartLink = await page.getByTestId('shopping-cart-link');
    // --- click ---
    await shoppingCartLink.click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await page.goBack();

    // --- fill ---
    // Already demonstrated in the beforeEach hook

    // --- inputValue ---
    const usernameInput = await page.locator('[data-test="username"]');
    // The page reloads, so we have to go back to the login page
    await page.goto('https://www.saucedemo.com/');
    await usernameInput.fill('test_user');
    const inputValue = await usernameInput.inputValue();
    expect(inputValue).toBe('test_user');

    // --- isChecked ---
    // Note: This page doesn't have checkboxes, but the usage is as follows:
    // const checkbox = await page.getByRole('checkbox');
    // await checkbox.check();
    // expect(await checkbox.isChecked()).toBe(true);
  });

  test('Assertion and Other Methods', async ({ page }) => {
    // --- screenshot ---
    await page.screenshot({ path: 'screenshot.png' });

    // --- textContent ---
    const pageTitle = await page.getByRole('heading', { name: /products/i });
    const text = await pageTitle.textContent();
    expect(text).toContain('Products');

    // --- waitForSelector ---
    await page.waitForSelector('.inventory_item');
    const items = await page.locator('.inventory_item').count();
    expect(items).toBeGreaterThan(0);

    // --- waitForNavigation ---
    // Note: This is often used with Promise.all to avoid race conditions
    await Promise.all([
      page.waitForNavigation(),
      page.getByTestId('shopping-cart-link').click()
    ]);
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    

    // --- evaluate ---
    const pageTitleText = await page.evaluate(() => {
      return document.querySelector('.title').textContent;
    });
    expect(pageTitleText).toBe('Your Cart');
  });
});

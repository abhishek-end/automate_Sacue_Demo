import { test, expect } from "@playwright/test";

test("Open the SauceDemo page", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  const username = await page.getByPlaceholder("Username");
  const password = await page.getByPlaceholder("Password");
  const loginButton = await page.getByRole("button", { name: /login/i });

  await expect(username).toBeVisible();
  await expect(password).toBeVisible();
  await expect(loginButton).toBeVisible();

  await expect(page).toHaveTitle("Swag Labs");

  await page.waitForTimeout(1200); // Wait for 12 seconds to observe the page before closing
});

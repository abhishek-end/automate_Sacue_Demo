import { test, expect } from "@playwright/test";
const url = "https://www.saucedemo.com/";

test.beforeEach(async ({ page }) => {
  await page.goto(url);
  const username = page.getByPlaceholder("Username");
  const password = page.getByPlaceholder("Password");
  const loginButton = page.getByRole("button", { name: /login/i });

  await expect(username).toBeVisible();
  await expect(password).toBeVisible();
  await expect(loginButton).toBeVisible();

  await username.fill("standard_user");
  await password.fill("secret_sauce");
  await loginButton.click();
});

test("Inventory page shows all 6 products with correct details", async ({
  page,
}) => {
  const products = page.locator(".inventory_item");
  await expect(products).toHaveCount(6);
  const count = await products.count();

  for (let i = 0; i < count; i++) {
    const product = products.nth(i);

    const image = product.locator("img.inventory_item_img");
    const productName = product.locator(".inventory_item_name");
    const name = (await productName.textContent()).trim();
    const productPrice = product.locator(".inventory_item_price");
    const price = (await productPrice.textContent()).trim();
    const button = product.locator(".btn_small");

    await expect(image).toBeVisible();
    await expect(productName).toBeVisible();
    await expect(productPrice).toBeVisible();
    await expect(button).toBeVisible();
    expect(name.length).toBeGreaterThan(0);
    expect(price.startsWith("$")).toBeTruthy();
    await expect(button).toHaveText("Add to cart");
  }
});

test("Add product to cart and remove it", async ({ page }) => {
  //login
  const inventory_list_desc = (
    await page.locator(".inventory_item_price").first().textContent()
  ).trim();

  const homeName = (
    await page.locator(".inventory_item_name").first().textContent()
  ).trim();

  const addToCart = page.locator(".btn_inventory").first();
  await addToCart.click();

  await expect(addToCart).toHaveText(/remove/i);
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await page.locator(".shopping_cart_link").click();
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");

  const cartPage = (
    await page.locator(".inventory_item_price").first().textContent()
  ).trim();
  await expect(inventory_list_desc).toEqual(cartPage);

  const cartName = (
    await page.locator(".inventory_item_name").first().textContent()
  ).trim();
  await expect(homeName).toEqual(cartName);

  await page.getByRole("button", { name: /remove/i }).click();
  await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);
  await expect(page.locator(".cart_item")).toHaveCount(0);
});

test("Complete checkout flow", async ({ page }) => {
  await page.locator(".btn_inventory").first().click();
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  await page.locator(".shopping_cart_link").click();
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");

  await page.getByRole("button", { name: /checkout/i }).click();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-one.html",
  );

  const inputName = page.getByPlaceholder("First Name");
  await expect(inputName).toBeVisible();
  await inputName.fill("Abhishek");

  const lastName = page.getByPlaceholder("Last Name");
  await expect(lastName).toBeVisible();
  await lastName.fill("QA");

  const zipFields = page.getByPlaceholder("Zip/Postal Code");
  await expect(zipFields).toBeVisible();
  await zipFields.fill("123200");

  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-two.html",
  );

  await page.getByRole("button", { name: /finish/i }).click();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-complete.html",
  );

  await expect(page.getByText(/Thank you for your order!/i)).toBeVisible();

  const backBtn = page.getByRole("button", { name: /back home/i });
  await expect(backBtn).toBeVisible();
  await backBtn.click();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
});

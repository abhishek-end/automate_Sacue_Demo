import { test, expect } from "@playwright/test";

const url = "https://www.saucedemo.com/";
test("Login successfully with valid credentials", async ({ page }) => {
  await page.goto(url);
  // locate username password filed then enter data
  const username = page.getByPlaceholder("Username");
  const password = page.getByPlaceholder("Password");
  const loginButton = page.getByRole("button", { name: /login/i });
  //form element should
  await expect(username).toBeVisible();
  await expect(password).toBeVisible();
  await expect(loginButton).toBeVisible();
  // swag labs title should show

  // enter data
  await username.fill("standard_user");
  await password.fill("secret_sauce");
  //click login button
  await loginButton.click();

  await expect(page).toHaveURL(/inventory.html/);
  //app logo visible
  await expect(page.locator(".app_logo")).toBeVisible();
  // •	Shopping cart icon visible
  await expect(page.locator(".shopping_cart_link")).toBeVisible();
  // inventory container visible
  await expect(page.locator(".inventory_container")).toBeVisible();
  //  count products
  //target inventory item
  const products = page.locator(".inventory_item");
  await expect(products).toHaveCount(6);
  const count = await products.count();

  for (let i = 0; i < count; i++) {
    const product = products.nth(i);

    // Locate all the elements
    const image = product.locator("img.inventory_item_img");
    const productName = product.locator(".inventory_item_name");
    const name = (await productName.textContent()).trim();
    const productPrice = product.locator(".inventory_item_price");
    const price = (await productPrice.textContent()).trim();
    const button = product.locator(".btn_small");

    ///assertions
    await expect(image).toBeVisible();
    await expect(productName).toBeVisible();
    await expect(productPrice).toBeVisible();
    await expect(button).toBeVisible();
    // check name , symbol , button text
    expect(name.length).toBeGreaterThan(0);
    //symbol
    expect(price.startsWith("$")).toBeTruthy();
    // add to cart text
    expect(button).toHaveText("Add to cart");
  }
});

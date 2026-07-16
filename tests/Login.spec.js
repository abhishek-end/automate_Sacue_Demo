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
  // target inventory item
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
    const img = product.locator("img");

    ///assertions
    await expect(image).toBeVisible();
    await expect(productName).toBeVisible();
    await expect(productPrice).toBeVisible();
    await expect(button).toBeVisible();
    // check name , symbol , button text
    await expect(name.length).toBeGreaterThan(0);
    //symbol
    await expect(price.startsWith("$")).toBeTruthy();
    // add to cart text
    await expect(button).toHaveText("Add to cart");
  }
  const inventory_list_desc = (
    await page.locator(".inventory_item_price").first().textContent()
  ).trim();
  //check if name is same
  const homeName = (
    await page.locator(".inventory_item_name").first().textContent()
  ).trim();

  console.log(homeName);
  const addToCart = page.locator(".btn_inventory").first();
  await addToCart.click();

  await expect(addToCart).toHaveText(/remove/i);
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

  const clicked = await page.locator(".shopping_cart_link").click();
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");

  const cartPage = (
    await page.locator(".inventory_item_price").first().textContent()
  ).trim();
  await expect(inventory_list_desc).toEqual(cartPage);

  const cartName = (
    await page.locator(".inventory_item_name").first().textContent()
  ).trim();

  await expect(homeName).toEqual(cartName);
  console.log(cartName);

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
  //click
  await page.getByRole("button", { name: /continue/i }).click();

  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-two.html",
  );

  await page.getByRole("button", { name: /finish/i }).click();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-complete.html",
  );

  // ur assignment isn't fully complete yet. After reaching the complete page, also verify:

  // ✅ "Thank you for your order!" message is visible.
  await expect(page.getByText(/Thank you for your order!/i)).toBeVisible();
  // ✅ "Back Home" button is visible.
  // ✅ Click "Back Home".

  const backBtn = page.getByRole("button", { name: /back home/i });
  await expect(backBtn).toBeVisible();
  await backBtn.click();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

  // ✅ Verify you're back on inventory.html.

  //check -- cart should be empty
  // await page.getByRole("button", { name: /remove/i }).click();
  // await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);

  // await page.waitForTimeout(5000);
});

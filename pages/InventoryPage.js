import { expect } from "@playwright/test";
class InventoryPage {
  constructor(page) {
    this.page = page;
    this.product = page.locator(".inventory_item ");
  }

  async expectSixProductsWithDetails() {
    await expect(this.product).toHaveCount(6);
    const count = await this.product.count();

    for (let i = 0; i < count; i++) {
      const product = this.product.nth(i);

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
  }
}
export { InventoryPage };

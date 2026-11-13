import { test, expect } from "@playwright/test";

test("shop search persists in URL and supports back navigation", async ({
  page,
}) => {
  await page.goto("/shop");

  await expect(
    page.getByRole("heading", { name: "Shop Catalogue" }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", {
      name: /Maple lamp/,
    }),
  ).toBeVisible();

  await page.getByLabel("Search").fill("lamp");

  await expect(page).toHaveURL(/q=lamp/);

  await expect(page.getByRole("link", { name: /Maple lamp/ })).toBeVisible();

  await expect(page.getByRole("link", { name: /Cedar stool/ })).toHaveCount(0);

  await page.reload();

  await expect(page.getByLabel("Search")).toHaveValue("lamp");

  await page.goBack();

  await expect(page.getByRole("link", { name: /Maple lamp/ })).toBeVisible();

  await expect(page.getByRole("link", { name: /Cedar stool/ })).toBeVisible();
});

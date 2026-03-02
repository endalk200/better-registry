import { expect, test } from "@playwright/test";

test("playground smoke flow: send, stop, regenerate, export", async ({ page }) => {
  test.skip(
    process.env.PLAYGROUND_SMOKE_E2E !== "true",
    "Set PLAYGROUND_SMOKE_E2E=true to run smoke e2e."
  );

  await page.goto("/playground");
  await expect(page.getByText("AI SDK Playground")).toBeVisible();

  await page.getByLabel("Message input").fill("Say hello in one sentence.");
  await page.getByRole("button", { name: "Submit" }).click();

  const stopButton = page.getByRole("button", { name: "Stop" });
  if (await stopButton.isVisible().catch(() => false)) {
    await stopButton.click();
  }

  const regenerateButton = page.getByRole("button", { name: "Regenerate" });
  if (await regenerateButton.isVisible().catch(() => false)) {
    await regenerateButton.click();
  }

  const exportButton = page.getByRole("button", { name: /download/i });
  if (await exportButton.isVisible().catch(() => false)) {
    await exportButton.click();
  }
});

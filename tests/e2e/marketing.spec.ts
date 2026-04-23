import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Pre-existing a11y debt from the frozen design system that is out of scope for Epic 0:
// - color-contrast: light-mode token palette does not meet WCAG 2 AA
// - heading-order: Footer uses h4 column headings without preceding h2/h3
// - landmark-*: desktop+mobile CSS fork creates duplicate landmark roles in DOM;
//   the hidden tree uses display:none and is not user-facing, but axe still flags it.
const EXCLUDED_AXE_RULES = [
  "color-contrast",
  "heading-order",
  "landmark-main-is-top-level",
  "landmark-no-duplicate-main",
  "landmark-unique",
];

test.describe("Marketing homepage /", () => {
  test("renders with correct title and H1 on desktop", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
    await expect(page).toHaveTitle(/Ajira Next/);

    // Use filter to find a visible h1 regardless of desktop/mobile DOM order
    const visibleH1 = page.locator("h1").locator("visible=true");
    await expect(visibleH1.first()).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(EXCLUDED_AXE_RULES)
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);

    expect(consoleErrors).toEqual([]);
  });

  test("renders with correct title and H1 on mobile", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page).toHaveTitle(/Ajira Next/);

    const visibleH1 = page.locator("h1").locator("visible=true");
    await expect(visibleH1.first()).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(EXCLUDED_AXE_RULES)
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);

    expect(consoleErrors).toEqual([]);
  });
});

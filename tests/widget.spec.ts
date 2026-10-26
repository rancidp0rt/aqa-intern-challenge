import { test, expect } from '@playwright/test';
import {WidgetPage} from "./widget.page";

test.describe('Uchi.ru widget ', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({page}) => {
    widgetPage = new WidgetPage(page);

    // close cookies popup when it appears (it slides in with .show class)
    await page.addLocatorHandler(page.locator('._UCHI_COOKIE__wrap.show ._UCHI_COOKIE__button'), async (button) => {
      await button.click();
    });

    // open uchi.ru main page
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('opens', async ({page}) => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible()
  });

  test('has correct title', async ({ page }) => {
    await widgetPage.openWidget();

    const articles = await widgetPage.getPopularArticles();

    await articles[0].click();

    await widgetPage.clickWriteToUs();

    await expect(widgetPage.getTitle()).toHaveText('Связь с поддержкой');
  });

  test('closes', async ({ page }) => {
    await widgetPage.openWidget();
    await expect(widgetPage.getWidgetBody()).toBeVisible();

    await widgetPage.closeWidget();

    await expect(widgetPage.getWidgetBody()).toBeHidden();
    await expect(widgetPage.getOpenButton()).toBeVisible();
  });

  test('reopens after closing', async ({ page }) => {
    await widgetPage.openWidget();
    await expect(widgetPage.getWidgetBody()).toBeVisible();

    await widgetPage.closeWidget();
    await expect(widgetPage.getWidgetBody()).toBeHidden();

    await widgetPage.openWidget();
    await expect(widgetPage.getWidgetBody()).toBeVisible();
  });
  
  test('shows feedback button', async ({ page }) => {
    await widgetPage.openWidget();

    await expect(page.locator('[data-test=button_feedback_form]')).toBeVisible();
  });
});

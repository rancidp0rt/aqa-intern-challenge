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
  
  test('displays widget title when opened', async () => {
    await widgetPage.openWidget();

    await expect(widgetPage.getTitle()).toBeVisible();
  });
  test('opens popular articles and finds them in search', async () => {
  
    test.slow();

    await widgetPage.openWidget();

    const articles = await widgetPage.getPopularArticles();
    const titles = await widgetPage.getPopularArticleItems().allInnerTexts();
    expect(titles.length).toBeGreaterThan(0);

    for (let i = 0; i < titles.length; i++) {
      await test.step(`popular article "${titles[i]}"`, async () => {
      await articles[i].click();

      await expect(widgetPage.getArticleTitle()).toHaveText(titles[i], { timeout: 20000 });
      await expect(widgetPage.getArticleText()).not.toBeEmpty();
      await expect(widgetPage.getArticleLink()).toHaveAttribute('href', /help\.uchi\.ru/);

      await widgetPage.clickBack();

      await expect(widgetPage.getPopularArticleItems()).toHaveText(titles);
    });
  }

      await test.step('search by article title', async () => {
      const title = titles[titles.length - 1];
      await widgetPage.search(title);

      const results = widgetPage.getSearchResults();
      await expect(results.getByText(title, { exact: true })).toBeVisible();

      const foundText = await widgetPage.getSearchFoundTitle().textContent();
      const found = Number(foundText?.match(/\d+/)?.[0]);
      await expect(results).toHaveCount(found);

      await results.getByText(title, { exact: true }).click();
      await expect(widgetPage.getArticleTitle()).toHaveText(title, { timeout: 20000 });

      await widgetPage.clickBack();
      await expect(results).toHaveCount(found);
    });

      await test.step('search with no results', async () => {
      await widgetPage.search('qwzxjkq');

      await expect(widgetPage.getSearchFoundTitle()).toHaveText('Нашлось 0 статей');
      await expect(widgetPage.getSearchResults()).toHaveCount(0);
    });
  });
});

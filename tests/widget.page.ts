import {Page} from "@playwright/test";

enum WidgetPageSelectors {
    WRAPPER = '[class^=widget__]:has([data-test=openWidget])',
    WIDGET_BODY = '[class^=widgetWrapper] > [class^=widget__]',
    HEADER_TEXT = 'header h5',
    BUTTON_OPEN = '[data-test=openWidget]',
    // button_close in header is visible only on mobile
    BUTTON_CLOSE = '[class^=widgetWrapper] > button[class^=closeBtn__]',
    BUTTON_WRITE_TO_US = '[data-test=button_feedback_form]',
    ARTICLE_POPULAR_TITLE = '[class^=popularTitle__]',
    ARTICLE_POPULAR_LIST = `${ARTICLE_POPULAR_TITLE} + ul[class^=articles__]`,
    ARTICLE_POPULAR_LIST_ITEM = `${ARTICLE_POPULAR_LIST} > li`,
    ARTICLE_TITLE = '[class^=article__] > p[class^=title__]',
    ARTICLE_TEXT = '#articleWrapper',
    ARTICLE_LINK = '[data-test=knowledgeBaseRedirect]',
    BUTTON_BACK = '[data-test=button_back]',
    SEARCH_INPUT = '[class^=search__] input',
    SEARCH_FOUND_TITLE = '[class^=found__] > [class^=title__]',
    SEARCH_RESULT_ITEM = '[class^=found__] ul[class^=articles__] > li',
}

export class WidgetPage {
    static selector = WidgetPageSelectors;

    constructor(protected page: Page) {}

    wrapper() {
        return this.page.locator(WidgetPage.selector.WRAPPER)
    }

    async openWidget() {
        return this.getOpenButton().click();
    }

    async closeWidget() {
        return this.wrapper().locator(WidgetPage.selector.BUTTON_CLOSE).click();
    }

    async getPopularArticles() {
        const articles = this.wrapper().locator(WidgetPage.selector.ARTICLE_POPULAR_LIST_ITEM);

        // all() doesn't wait for elements
        await articles.first().waitFor();

        return articles.all()
    }

    async clickWriteToUs() {
        return this.wrapper().locator(WidgetPage.selector.BUTTON_WRITE_TO_US).click();
    }

    getTitle() {
        return this.wrapper().locator(WidgetPage.selector.HEADER_TEXT);
    }

    getWidgetBody() {
        return this.page.locator(WidgetPage.selector.WIDGET_BODY);
    }

    getOpenButton() {
        return this.wrapper().locator(WidgetPage.selector.BUTTON_OPEN);
    }

    getMobileCloseButton() {
        return this.wrapper().locator(WidgetPage.selector.BUTTON_CLOSE);
    }
    
    getPopularArticleItems() {
        return this.wrapper().locator(WidgetPage.selector.ARTICLE_POPULAR_LIST_ITEM);
    }

    getArticleTitle() {
        return this.wrapper().locator(WidgetPage.selector.ARTICLE_TITLE);
    }

    getArticleText() {
        return this.wrapper().locator(WidgetPage.selector.ARTICLE_TEXT);
    }

    getArticleLink() {
        return this.wrapper().locator(WidgetPage.selector.ARTICLE_LINK);
    }

    async clickBack() {
        return this.wrapper().locator(WidgetPage.selector.BUTTON_BACK).click();
    }

    async search(text: string) {
        return this.wrapper().locator(WidgetPage.selector.SEARCH_INPUT).fill(text);
    }

    getSearchFoundTitle() {
        return this.wrapper().locator(WidgetPage.selector.SEARCH_FOUND_TITLE);
    }

    getSearchResults() {
        return this.wrapper().locator(WidgetPage.selector.SEARCH_RESULT_ITEM);
    }
}


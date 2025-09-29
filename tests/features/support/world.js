const { setWorldConstructor } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('playwright');
require('dotenv').config();

class CustomWorld {
  constructor({ parameters }) {
    this.browserName = parameters.browser || 'chromium'; 
    this.login = process.env.LOGIN;
    this.password = process.env.PASSWORD;
  }

  async launchBrowser() {
    const browserType = { chromium, firefox, webkit }[this.browserName];

    if (!browserType) {
      throw new Error(`Browser inválido: ${this.browserName}`);
    }

    this.browser = await browserType.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async closeBrowser() {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);

const { Before, After } = require('@cucumber/cucumber');
const { setDefaultTimeout } = require('@cucumber/cucumber');


Before(async function () {
  await this.launchBrowser();
});

After(async function () {
  await this.closeBrowser();
});

setDefaultTimeout(60 * 1000); // 60 segundos
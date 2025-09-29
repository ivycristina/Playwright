const { Given, When, Then, setWorldConstructor } = require('@cucumber/cucumber');
const assert = require('assert');  
const { chromium } = require('playwright');
const { expect } = require('@playwright/test');
 
    
Given('eu acesso o site do Playwright', async function () {
    if (!this.page) await this.init();
    await this.page.goto('https://playwright.dev/');
         });

When('clicar em "Get Started"', async function () {
  // Certifique-se de que a página está acessível
  await this.page.waitForSelector('text=Get Started');
  await this.page.click('text=Get Started');
    });

Then('devo ver o título {string}', async function (expectedTitle) {
  await this.page.waitForLoadState('load');
  const actualTitle = await this.page.title("Fast and reliable end-to-end testing for modern web apps | Playwright");
  if (actualTitle !== expectedTitle) {
    throw new Error(`Título esperado: "${expectedTitle}", mas encontrou: "${actualTitle}"`);
  }
});

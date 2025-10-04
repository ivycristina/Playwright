const { Given, When, Then, setWorldConstructor } = require('@cucumber/cucumber');
const assert = require('assert');  
const { chromium } = require('playwright');
const { expect } = require('@playwright/test');
const { time } = require('console');
 
  
Given('eu acesso o site da Americanas.com', async function () {
  await this.page.goto('https://www.americanas.com.br', { timeout: 30000 });

  // Tenta fechar popup de promoção relâmpago, se aparecer
  try {
    const fecharPoup = await this.page.waitForSelector('button[aria-label="Fechar"]', {
      timeout: 5000,
    });
    await fecharPoup.click();
  } catch (e) {
    // Se não aparecer o botão, segue normalmente
    console.log('✅ Popup não apareceu, seguindo o fluxo.');
  }

  // Garante que o campo de busca está disponível
  await this.page.waitForSelector('input[placeholder="busque aqui seu produto"]', { timeout: 15000 });
});


When('digitar Smart TV no campo de busca', async function () {
  try {
    // Tenta detectar o botão fechar do popup com timeout baixo (ex: 3000ms)
    const btnFecharPopup = await this.page.waitForSelector('button[aria-label="Fechar"]', { timeout: 3000 });
    await btnFecharPopup.click();
    console.log('Popup fechado');
  } catch {
    // Se timeout, significa que o popup não apareceu, segue o fluxo normalmente
    console.log('Popup não apareceu, seguindo fluxo');
  }

  // Aguarda o campo de busca aparecer
  const campoBusca = await this.page.waitForSelector('input[placeholder*="busque aqui seu produto"]', { timeout: 15000 });
  await campoBusca.fill('Smart TV');
  await this.page.waitForTimeout(2000);
});


When('clicar no botão de pesquisar', async function () {
   await this.page.keyboard.press('Enter');
   await this.page.waitForLoadState('networkidle');
   await this.page.waitForTimeout(2000);
  });

Then('devo selecionar o filtro {string}', async function (filtro) {
   const filtroPreco = await this.page.waitForSelector(`text=${filtro}`, { timeout: 10000 });
   await filtroPreco.click();
});


Then('devo selecionar a opção de {string}', async function (opcao) {
  const filtroAccordion = this.page.locator('[data-testid="fs-filter-Preço-3-accordion"]');
  const verTudoButton = filtroAccordion.locator('button[aria-label="Ver tudo"]');

  // Primeiro, expande o painel do filtro (se estiver fechado)
  const isExpanded = await filtroAccordion.getAttribute('aria-expanded');
  if (isExpanded !== 'true') {
    await filtroAccordion.click(); // abre o painel (exemplo, pode variar)
    await this.page.waitForTimeout(1000);
  }

  // Depois, clica no botão "Ver tudo" para mostrar todas as opções
  if (await verTudoButton.isVisible()) {
    await verTudoButton.click();
    await this.page.waitForTimeout(1000);
  }

  // Agora espera o checkbox aparecer visível
  const checkbox = this.page.locator(`input[type="checkbox"][value="${opcao}"]`);
  await checkbox.waitFor({ state: 'visible', timeout: 5000 });

  await checkbox.check({ force: true });

  await this.page.waitForTimeout(2000);
});


Then('a partir da lista de produtos, deve selecionar os que tiverem maior que {string}', async function (valorMinimo) {
  const minimo = parseFloat(valorMinimo);

  // Espera até o nome dos produtos aparecer na página
  await this.page.waitForSelector('.ProductCard_productName__mwx7Y', { timeout: 10000 });

  // Pega todos os containers dos produtos
  const produtos = await this.page.$$('div.ProductCard_productCard__MwY4X');
  this.produtosFiltrados = [];

  console.log(`🧾 Total de produtos encontrados: ${produtos.length}`);

  // Função para converter preços do formato "R$ 4.923,45" para número 4923.45
  function parsePreco(precoTexto) {
    let textoLimpo = precoTexto.trim();
    textoLimpo = textoLimpo.replace(/[^\d.,]/g, '');

    if (textoLimpo.indexOf('.') > -1 && textoLimpo.indexOf(',') > -1) {
      textoLimpo = textoLimpo.replace(/\./g, '').replace(',', '.');
    } else if (textoLimpo.indexOf(',') > -1) {
      textoLimpo = textoLimpo.replace(',', '.');
    }

    return parseFloat(textoLimpo);
  }

  for (const produto of produtos) {
    try {
      const nome = await produto.$eval('.ProductCard_productName__mwx7Y', el => el.innerText);
      const precoTexto = await produto.$eval('.ProductCard_productPrice__XFEqu', el => el.innerText);
      const preco = parsePreco(precoTexto);

      console.log(`→ Produto: ${nome}`);
      console.log(`   Preço bruto extraído: "${precoTexto}"`);
      console.log(`   Preço convertido: ${preco}`);

      if (preco >= minimo) {
        this.produtosFiltrados.push({ nome, preco });
      }
    } catch (err) {
      console.warn(`⚠️ Erro ao processar produto: ${err.message}`);
      continue;
    }
  }

  if (this.produtosFiltrados.length === 0) {
    console.warn(`⚠️ Nenhum produto acima de R$ ${minimo} foi encontrado.`);
  } else {
    console.log(`✅ Produtos encontrados acima de R$ ${minimo}:`, this.produtosFiltrados);
  }
   console.log(parsePreco("R$ 4.923,45"));  // Deve imprimir 4923.45
  console.log(parsePreco("4.923,45"));    // Deve imprimir 4923.45
  console.log(parsePreco("3500"));         // Deve imprimir 3500
  console.log(parsePreco("3.000,00"));    // Deve imprimir 3000
});


 
Then('trazer o nome\\/o preço do produto\\/quantidade estrelas', async function () {
  if (!this.produtosFiltrados || this.produtosFiltrados.length === 0) {
    console.log('⚠️ Nenhum produto acima de R$ 3.500 foi encontrado.');
  } else {
    console.log('\n📦 Produtos encontrados:\n');
    this.produtosFiltrados.forEach(prod => {
      console.log(`- ${prod.nome} => R$ ${prod.preco.toFixed(2)} | Avaliação: ${prod.estrelas}`);
    });
  }
});

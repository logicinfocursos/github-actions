import { test, expect } from '@playwright/test';

// 1. Defina sua massa de testes em um array de objetos
const massaDeTestes = [
  {
    caso: 'Usuário padrão',
    nome: 'João da Silva',
    email: 'joao@exemplo.com',
    opcaoSelect: 'valor-1',
    marcarCheckbox: true
  },
  {
    caso: 'Usuário sem checkbox',
    nome: 'Maria Souza',
    email: 'maria@exemplo.com',
    opcaoSelect: 'valor-2',
    marcarCheckbox: false
  },
  {
    caso: 'Nome abreviado',
    nome: 'Rui',
    email: 'rui@exemplo.com',
    opcaoSelect: 'valor-1',
    marcarCheckbox: true
  }
];

// 2. Itere sobre a massa de testes para criar testes dinâmicos
for (const dados of massaDeTestes) {

  // O título do teste recebe o nome de cada caso para facilitar a identificação no relatório
  test(`preencher e enviar o formulário - Cenário: ${dados.caso}`, async ({ page }) => {

    await page.goto('http://localhost:3333');
    //await page.goto('/');

    // 1. Troque getByLabel('Nome') pelo ID correto do HTML
    await page.locator('#nome').fill(dados.nome);

    // 2. Troque getByLabel('Email') pelo ID correto do HTML (Resolve o seu erro atual)
    await page.locator('#email').fill(dados.email);

    // 3. Troque getByLabel('Seu Select') pelo ID correto do HTML
    // (Verifique se no seu objeto 'dados' a propriedade se chama 'opcaoSelect' ou 'nivel')
    await page.locator('#nivel').selectOption(dados.opcaoSelect || dados.nivel);

    // 4. Se houver o passo do checkbox dos termos, use o ID também:
    await page.locator('#termos').check();

    // 5. Clique no botão de enviar pelo ID
    await page.locator('#btn-enviar').click();

    //await page.waitForTimeout(5000)
  });
}
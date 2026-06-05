import { test, expect } from '@playwright/test';

// 1. Defina sua massa de testes em um array de objetos
const massaDeTestes = [
  {
    caso: 'Usuário padrão',
    nome: 'João da Silva',
    email: 'joao@exemplo.com',
    opcaoSelect: 'junior',
    marcarCheckbox: true
  },
  {
    caso: 'Usuário sem checkbox',
    nome: 'Maria Souza',
    email: 'maria@exemplo.com',
    opcaoSelect: 'pleno',
    marcarCheckbox: false
  },
  {
    caso: 'Nome abreviado',
    nome: 'Rui Barbosa',
    email: 'rui@exemplo.com',
    opcaoSelect: 'senior',
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

    // 1. (Opcional) Adicione um console.log temporário para ver o que está vindo nos logs do GitHub Actions:
    console.log(`Tentando selecionar o nível com o dado:`, dados.opcaoSelect || dados.nivel);

    // 2. Converta o valor para letras minúsculas usando .toLowerCase() para bater com o 'value' do seu HTML
    const valorNivel = String(dados.opcaoSelect || dados.nivel || 'pleno').toLowerCase().trim();

    // 3. Execute a seleção usando o valor tratado
    await page.locator('#nivel').selectOption(valorNivel);

    // 4. Se houver o passo do checkbox dos termos, use o ID também:
    await page.locator('#termos').check();

    // 5. Clique no botão de enviar pelo ID
    await page.locator('#btn-enviar').click();

    //await page.waitForTimeout(5000)
  });
}
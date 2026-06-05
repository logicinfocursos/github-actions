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

    // Preenche os campos usando os dados dinâmicos da iteração atual
    await page.getByLabel('Nome').fill(dados.nome);
    await page.getByLabel('Email').fill(dados.email);
    
    await page.getByLabel('Seu Select').selectOption(dados.opcaoSelect);

    // Lógica condicional baseada na massa de testes
    if (dados.marcarCheckbox) {
      await page.getByLabel('Seu Checkbox').check();
    }

    await page.getByRole('button', { name: 'Enviar' }).click();

    await page.waitForTimeout(5000)
  });
}
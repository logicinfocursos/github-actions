// tests/cadastro.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Formulário de Cadastro de Dev', () => {

  // Executa antes de cada teste: navega para a página inicial (http://localhost:3333/)
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Deve realizar o cadastro com sucesso preenchendo todos os campos', async ({ page }) => {
    // 1. Preenche o campo Nome Completo pelo ID
    await page.locator('#nome').fill('Rodrigo Silva');

    // 2. Preenche o campo E-mail pelo ID
    await page.locator('#email').fill('rodrigo@exemplo.com');

    // 3. Seleciona a opção 'Pleno' no Dropdown pelo valor do ID
    await page.locator('#nivel').selectOption('pleno');

    // 4. Marca o checkbox dos termos de condições
    await page.locator('#termos').check();

    // 5. Clica no botão de enviar inscrição
    await page.locator('#btn-enviar').click();

    // 6. VALIDAÇÃO: Verifica se a seção de sucesso ficou visível
    const successSection = page.locator('#success-section');
    await expect(successSection).toBeVisible();

    // 7. VALIDAÇÃO: Verifica se o texto de sucesso esperado está na tela
    const successMessage = page.locator('#success-message');
    await expect(successMessage).toContainText('¡Inscrição realizada com sucesso! 🎉');
  });

  test('Deve exibir mensagem de erro ao tentar enviar o formulário em branco', async ({ page }) => {
    // 1. Clica direto no botão de enviar sem preencher nada
    await page.locator('#btn-enviar').click();

    // 2. VALIDAÇÃO: Mensagem de erro deve aparecer em vermelho
    const errorMessage = page.locator('#error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Por favor, preencha todos os campos e aceite os termos.');
  });

  test('Deve permitir resetar o formulário após um envio bem-sucedido', async ({ page }) => {
    // 1. Preenche o formulário rapidamente para poder resetar
    await page.locator('#nome').fill('Dev Teste');
    await page.locator('#email').fill('teste@dev.com');
    await page.locator('#nivel').selectOption('senior');
    await page.locator('#termos').check();
    await page.locator('#btn-enviar').click();

    // 2. Clica no botão "Voltar/Resetar" que aparece na tela de sucesso
    await page.locator('#btn-reset').click();

    // 3. VALIDAÇÃO: O input de nome deve voltar a ficar vazio
    const inputNome = page.locator('#nome');
    await expect(inputNome).toBeEmpty();
    
    // 4. VALIDAÇÃO: O checkbox deve voltar a ficar desmarcado
    const checkboxTermos = page.locator('#termos');
    await expect(checkboxTermos).not.toBeChecked();
  });

});
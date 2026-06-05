const { test, expect } = require("@playwright/test");

test.describe("Testes de Validação do Formulário de Cadastro", () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Cenário Sucesso: Deve permitir envio e tirar screenshot quando dados forem válidos", async ({ page }) => {
    // Preenche dados válidos (CPF válido real gerado para testes)
    await page.locator("#nome").fill("Anselmo Silva");
    await page.locator("#email").fill("anselmo@provedor.com");
    await page.locator("#cpf").fill("11144477735"); 
    await page.locator("#nivel").selectOption("pleno");
    await page.locator("#termos").check();

    // Valida que o botão foi desbloqueado
    const botao = page.locator("#btn-enviar");
    await expect(botao).toBeEnabled();
    await botao.click();

    // Valida tela de sucesso
    await expect(page.locator("#success-section")).toBeVisible();

    // TIRA A SCREENSHOT DE PROVA DE SUCESSO
    await page.screenshot({ path: "playwright-report/evidencia-sucesso.png", fullPage: true });
  });

  test("Cenário Erro: Deve exibir alerta de Nome Inválido e bloquear botão", async ({ page }) => {
    // Nome apenas com 2 letras no sobrenome ou sem sobrenome
    await page.locator("#nome").fill("Joe Ma");
    await page.locator("#email").fill("valido@email.com");
    await page.locator("#cpf").fill("11144477735");
    await page.locator("#nivel").selectOption("junior");
    await page.locator("#termos").check();

    // Verifica se a mensagem de alerta do nome apareceu
    const alertaNome = page.locator("#error-nome");
    await expect(alertaNome).toBeVisible();
    await expect(alertaNome).toContainText("Informe nome e sobrenome");

    // Verifica que o botão ENVIAR continua desativado
    await expect(page.locator("#btn-enviar")).toBeDisabled();
  });

  test("Cenário Erro: Deve exibir alerta de E-mail Inválido e bloquear botão", async ({ page }) => {
    await page.locator("#nome").fill("Rodrigo Silva");
    await page.locator("#email").fill("email_invalido_sem_arroba.com");
    await page.locator("#cpf").fill("11144477735");
    await page.locator("#nivel").selectOption("senior");
    await page.locator("#termos").check();

    const alertaEmail = page.locator("#error-email");
    await expect(alertaEmail).toBeVisible();
    await expect(alertaEmail).toContainText("Informe um e-mail válido");

    await expect(page.locator("#btn-enviar")).toBeDisabled();
  });

  test("Cenário Erro: Deve exibir alerta de CPF Inválido e bloquear botão", async ({ page }) => {
    await page.locator("#nome").fill("Marcos Oliveira");
    await page.locator("#email").fill("marcos@email.com");
    // CPF com os dígitos verificadores falsos (sequência inválida matemática)
    await page.locator("#cpf").fill("11111111111");
    await page.locator("#nivel").selectOption("senior");
    await page.locator("#termos").check();

    const alertaCPF = page.locator("#error-cpf");
    await expect(alertaCPF).toBeVisible();
    await expect(alertaCPF).toContainText("Informe um CPF válido");

    await expect(page.locator("#btn-enviar")).toBeDisabled();
  });
});
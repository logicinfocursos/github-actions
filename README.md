# 🚀 Local CI/CD Pipeline Lab: Automatizando Testes e Deploy no Windows 11 com Docker e GitHub Actions

[repositório desse projeto: https://github.com/logicinfocursos/github-actions.git](https://github.com/logicinfocursos/github-actions.git)

[playwright - docs: https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)

Este projeto demonstra como construir uma esteira de Integração e Entrega Contínua (CI/CD) completa utilizando o seu próprio computador Windows 11 como infraestrutura (Localhost), substituindo temporariamente a necessidade de uma VPS paga para fins de estudo e validação técnica.

---

## 🎯 Objetivo do Projeto

O grande objetivo deste laboratório é puramente **pedagógico e prático**. Configurar pipelines em nuvem pode gerar custos desnecessários durante a fase de aprendizado. Aqui, simulamos o comportamento exato de um servidor de produção (VPS) transformando sua máquina local em um **GitHub Self-Hosted Runner** operando em conjunto com o **Docker Desktop**.

Ao dar um `git push` para a branch de homologação, sua máquina intercepta o comando, recria os containers Docker locais, roda testes automatizados de ponta a ponta com **Playwright**, anexa relatórios visuais (screenshots) e te avisa se deu certo ou errado diretamente no **Telegram**.

---

## 🏗️ Entendendo a Arquitetura do Projeto

Para isolar a aplicação e garantir que ela rode exatamente da mesma forma no seu PC ou em um servidor na nuvem, utilizamos duas ferramentas cruciais:

### O papel do `Dockerfile`

O `Dockerfile` é a receita de bolo do seu container. Ele define o sistema operacional base (ex: Node.js em Alpine Linux), instala as dependências necessárias, executa o comando de build da aplicação (como o `next build`) e prepara o ambiente para rodar em modo de produção. É ele quem garante o empacotamento isolado do sistema.

### O papel do `docker-compose.yml`

Enquanto o Dockerfile cria a imagem de um container isolado, o Docker Compose é o maestro. Ele gerencia múltiplos containers ao mesmo tempo, define quais portas físicas da sua máquina serão mapeadas (ex: porta `3333`), gerencia volumes e, de forma automatizada, injeta as variáveis do arquivo `.env` para dentro do sistema sem que você precise configurar isso manualmente a cada deploy.

---

## 🛠️ Pré-requisitos & Guia de Comandos Básicos

Antes de começar, certifique-se de ter instalado no seu Windows 11:

* Git Git Bash
* Docker Desktop (com suporte a WSL2 ativo)
* Node.js (versão 20 ou superior)

### 📌 Git Cheat Sheet (Comandos Essenciais)

* `git clone <url-do-repositorio>`: Baixa o projeto para sua máquina.
* `git checkout -b <nome-da-branch>`: Cria e muda para uma nova branch de desenvolvimento.
* `git add .`: Prepara todas as alterações feitas para serem salvas.
* `git commit -m "sua mensagem"`: Salva as alterações localmente com uma descrição.
* `git push origin <nome-da-branch>`: Envia suas alterações locais para o GitHub.

Para forçar a atualização de uma branch com o conteúdo de outra, por exemplo atualizar a branch "main" com o conteúdo de "homolog" sem se preocupar com merges:
# 1. Mude para a branch main
git checkout main

# 2. Garanta que seu repositório local está atualizado com o servidor
git fetch origin

# 3. Força a main local a ficar idêntica à homolog local
git reset --hard homolog

# 4. Atualiza o servidor remoto marretando a main de lá com a sua local
git push origin main --force

**Obs: é também possível usar o rebase, mas ele pode falhar e pedir o uso do merge**

### 📌 Docker Cheat Sheet (Comandos Essenciais)

* `docker compose up -d --build`: Cria, compila e inicia os containers em segundo plano.
* `docker compose down`: Remove e limpa todos os containers e redes criados pelo projeto.
* `docker ps`: Lista todos os containers que estão rodando na máquina neste momento.
* `docker logs <id-do-container> -f`: Exibe os logs internos da aplicação em tempo real.

---

## ⚠️ Alerta Crítico: Configuração de Branches

> **IMPORTANTE:** Para que o GitHub Actions reconheça o seu arquivo de pipeline e saiba quais eventos escutar, a sua branch principal (**`main`**) precisa estar atualizada e conter a pasta `.github/workflows/deploy-homolog.yml`. Mesmo que o gatilho esteja configurado para disparar apenas quando houver alterações na branch `homolog`, o GitHub precisa ler a existência desse arquivo a partir da branch padrão (`main`) para registrar o fluxo. Sempre garanta esse alinhamento de código antes de testar.

---

## 🚀 Passo 1: Configurando o GitHub Runner no Windows

Para fazer o GitHub conversar com o Docker do seu computador, criaremos um agente de execução (Runner) na raiz do seu sistema.

1. No seu repositório do GitHub, vá em **Settings** > **Actions** > **Runners**.
2. Clique no botão verde **New self-hosted runner** e selecione a aba **Windows**.
3. Abra o **PowerShell** no seu Windows como **Administrador** e crie a pasta oficial recomendada na raiz do sistema:
```powershell
mkdir C:\actions-runner; cd C:\actions-runner

```


4. Copie e cole os comandos de **Download** fornecidos na tela do GitHub para baixar e extrair o agente.
5. Execute o comando de configuração fornecido pelo GitHub (ele conterá um token único):
```powershell
./config.cmd --url https://github.com/seu-usuario/seu-repositorio --token SEU_TOKEN_AQUI

```


* *Dica:* Durante a configuração no terminal, você pode aceitar as opções padrões pressionando `Enter`. Quando perguntado sobre o nome do runner, você pode chamá-lo de `ultra9` ou o nome de sua preferência.


6. Para iniciar o seu servidor local e deixá-lo escutando o GitHub, execute:
```powershell
./run.cmd

```



---

## 🎭 Passo 2: Configurando o Playwright & Evidências Visuais

O Playwright é o responsável por abrir o navegador de forma invisível, preencher o formulário do seu sistema e garantir que nenhum bug foi para produção.

### Instalação no projeto

Na raiz do seu projeto local, instale a estrutura do Playwright executando:

```bash
npm init playwright@latest

```

### Configurando Capturas de Tela em Caso de Sucesso

Por padrão, o Playwright só tira prints se o teste der erro. Para alterar esse comportamento e gerar evidências visuais de que tudo deu certo, abra o arquivo `playwright.config.js` (ou `.ts`) e certifique-se de que a propriedade `screenshot` está configurada como `'on'`:

```javascript
// playwright.config.js
module.exports = {
  use: {
    screenshot: 'on', // Força o print de evidência em TODOS os testes (Sucesso ou Falha)
    trace: 'on-first-retry',
  },
  reporter: [['html', { outputFolder: 'playwright-report' }]],
};

```

As evidências coletadas pela esteira serão automaticamente compactadas e disponibilizadas para download na aba **Actions** do seu GitHub ao final de cada execução, sob o nome de `evidencias-playwright-homolog`.

---

## 🤖 Passo 3: Integração de Avisos com o Telegram

Para receber alertas de sucesso ou falha em tempo real no seu bolso, configuramos uma chamada direta para a API do Telegram utilizando comandos em lote estruturados em PowerShell dentro da nossa esteira.

### 1. Criando o Bot

1. Procure por **`@BotFather`** no seu Telegram e envie `/newbot`.
2. Siga as instruções para dar um nome e um ID de usuário para o seu bot.
3. Guarde o **Token HTTP API** gerado (Ex: `789456:AAH_...`).
4. Clique no link do seu bot criado e mande uma mensagem de `/start` para ele.

### 2. Pegando seu Chat ID Privado

1. Procure por **`@userinfobot`** no seu Telegram e envie `/start`.
2. Ele responderá imediatamente com o seu número de `Id`. Guarde este número.

### 3. Salvando no GitHub Secrets

Para proteger seus dados sensíveis contra vazamentos de código, vá em **Settings** > **Secrets and variables** > **Actions** no seu repositório do GitHub e adicione duas chaves criptografadas clicando em **New repository secret**:

* `TELEGRAM_TOKEN`: Cole o token que o BotFather te deu.
* `TELEGRAM_CHAT_ID`: Cole o número do seu ID obtido com o userinfobot.

---

## 🌐 Virando a Chave: Como migrar este exemplo para Produção (VPS Real)?

Quando você se sentir confortável com o ambiente local e decidir enviar o seu projeto para uma VPS real de produção (como Hostinger, DigitalOcean ou AWS), algumas mudanças estruturais precisarão ser feitas no seu arquivo de pipeline `.yml`:

1. **Alteração do Ambiente de Execução (`runs-on`):**
* *Antes (Local):* `runs-on: self-hosted` (usa a sua máquina física Windows).
* *Depois (Produção):* Mudar para `runs-on: ubuntu-latest`. Isso fará com que o GitHub forneça uma máquina virtual Linux limpa na nuvem deles para processar as tarefas de compilação.


2. **Remover Comandos Windows (`shell: cmd`/`powershell`):**
* Servidores VPS de produção utilizam distribuições Linux. Você precisará remover as flags de shell do Windows e adaptar os comandos para a sintaxe do terminal Bash padrão do Linux.


3. **Substituir o Deploy Local por Acesso SSH:**
* Em vez do Runner rodar o comando docker diretamente na sua máquina, a esteira do GitHub na nuvem precisará se conectar remotamente à sua VPS via chaves SSH de segurança. Você utilizará Actions prontas da comunidade (como `appleboy/ssh-action`) para injetar comandos na VPS, disparando um `git pull` dentro do servidor e rodando o `docker compose up -d --build` remotamente lá dentro.



---

## 🚑 Rollback (Procedimento de Emergência)

Caso ocorra um problema crítico no ambiente de produção (branch `main`) após um deploy, o processo de rollback deve ser iniciado imediatamente para restaurar a última versão estável. 

Escolha um dos métodos abaixo dependendo da gravidade e da necessidade de preservar o histórico:

### Método 1: Reverter o último commit/merge (Recomendado e Seguro)
Este método cria um novo commit que "desfaz" as alterações do commit defeituoso. É a opção mais segura pois não reescreve o histórico do repositório.

```bash
# 1. Garanta que você está na branch main e atualizado
git checkout main
git pull origin main

# 2. Visualize o histórico para encontrar o hash do commit problemático
git log --oneline

# 3. Desfaça as alterações do commit com erro (substitua pelo hash correto)
git revert <hash-do-commit-com-erro>

# 4. Salve e envie a reversão para o repositório remoto
git push origin main
```

### Método 2: Hard Reset para a última versão estável (Destrutivo)
⚠️ Atenção: Este método apaga o histórico recente e força o repositório a voltar no tempo. Use apenas se o ambiente estiver quebrado de forma severa e o revert não funcionar. Requer permissão para force push na main.

# 1. Garanta que você está na branch main
git checkout main
git fetch origin

# 2. Identifique o hash do último commit ESTÁVEL (que estava funcionando)
git log --oneline

# 3. Force a sua branch local a voltar para esse commit estável
git reset --hard <hash-do-commit-estavel>

# 4. Force a atualização no servidor (marretada)
git push origin main --force

### Pós-Rollback:
Independente do método utilizado, após a restauração do ambiente, avise a equipe no canal de comunicação oficial e crie uma branch separada para investigar o bug que causou a falha no deploy.

---
*Este repositório foi criado para fins estritamente educacionais e serve como fundação sólida para arquiteturas de DevOps modernas.*
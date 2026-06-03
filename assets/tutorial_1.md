**Passo 1: Preparação do Repositório e Branches**
No seu GitHub pessoal, crie um repositório para o projeto Next.js. Em seguida, crie a estrutura de ramificações que você mencionou:
*   `main`: Para o código seguro.
*   `production`: Para o ambiente de produção simulado.
*   `homolog`: Para o ambiente de testes.
*   `MAEST-365` (ou `workitem-issue`): Branch onde você fará o desenvolvimento da tarefa.

**Passo 2: Configurar um Executor Auto-hospedado (Self-Hosted Runner)**
Como você deseja atualizar contêineres Docker localmente no seu computador (Windows 11) a partir do GitHub, os executores hospedados na nuvem do GitHub não terão acesso direto ao seu *localhost*. A solução é configurar um **executor auto-hospedado (self-hosted runner)**. Isso permite ter controle total sobre a infraestrutura e executar comandos Docker diretamente na sua rede local.
1. No seu repositório no GitHub, vá em **Settings > Actions > Runners**.
2. Clique em **New self-hosted runner**, selecione **Windows** e siga as instruções na tela para baixar e instalar o agente no seu PC.
3. Deixe o programa executando em segundo plano no seu Windows.

**Passo 3: Criar a Cerimônia de Aprovação para Produção**
Para garantir que a branch `production` só seja atualizada após uma autorização formal, usaremos os **Environments (Ambientes)**.
1. Vá na aba **Settings** do seu repositório no GitHub.
2. Acesse **Environments** e crie um novo ambiente chamado `production`.
3. Marque a opção de **Required reviewers** (Revisores obrigatórios) nas Regras de Proteção de Ambiente e adicione o seu próprio usuário como aprovador. 
***Obs:*** essa opção não irá aparece se o repositório for "private" e o plano for "free". Creio que para planos pagos deva aparecer.

***Depois que o agente já estiver instalado, para executá-lo novamente:***
Na pasta raiz actions-runner, rodar .\run.cmd (modo terminal, fica “escutando” jobs).
Se você quer em segundo plano e resiliente a reboot, instalar como serviço:
.\svc install
.\svc start

**Passo 4: Criar o Workflow de Homologação**
Os fluxos de trabalho são arquivos YAML que devem ficar obrigatoriamente na pasta `.github/workflows/` do seu projeto. 
Crie o arquivo `.github/workflows/deploy-homolog.yml`:

```yaml
name: Deploy Homolog
# O gatilho (evento) será a atualização (push) direta na branch homolog
on:
  push:
    branches:
      - homolog

jobs:
  deploy:
    runs-on: self-hosted # Informa ao GitHub para rodar no seu Windows 11
    steps:
      - name: Checkout do código
        uses: actions/checkout@v4 # Baixa o código do repositório
      
      - name: Atualizar Container Docker Local
        # Aqui você insere os comandos que rodam no seu Windows
        run: |
          docker build -t maestro-homolog .
          docker stop maestro-homolog-container || true
          docker rm maestro-homolog-container || true
          docker run -d -p 3000:3000 --name maestro-homolog-container maestro-homolog
```

**Passo 5: Criar o Workflow de Produção**
O fluxo de produção começará com a abertura do **Pull Request** (que é a primeira barreira de qualidade). Quando esse PR for mesclado (merged) na branch `production`, o deploy será acionado, mas pausará pedindo a aprovação manual.
Crie o arquivo `.github/workflows/deploy-production.yml`:

```yaml
name: Deploy Production
# O gatilho será quando a branch production receber a mescla (push) do Pull Request
on:
  push:
    branches:
      - production

jobs:
  deploy-prod:
    runs-on: self-hosted
    environment: production # Referencia o ambiente protegido criado no Passo 3
    steps:
      - name: Checkout do código
        uses: actions/checkout@v4
      
      - name: Atualizar Container Docker de Produção (Local)
        run: |
          docker build -t maestro-prod .
          docker stop maestro-prod-container || true
          docker rm maestro-prod-container || true
          docker run -d -p 8080:3000 --name maestro-prod-container maestro-prod
```

**O Fluxo na Prática (Simulando o cenário da Always On):**
1. Você desenvolve o formulário Next.js na branch `MAEST-365`.
2. Quando a tarefa estiver pronta, você faz o merge de `MAEST-365` para `homolog` (seja via pull request ou push direto).
3. O GitHub Actions detecta a mudança em `homolog` e aciona o **Workflow de Homologação**, atualizando seu Docker local automaticamente na porta 3333.
4. Estando tudo certo em homologação, você abre um **Pull Request** de `MAEST-365` (ou de `homolog`) para a branch `production`. O Pull Request funciona como a revisão do código pela equipe.
5. Você (como Tech Lead) aprova o Pull Request e faz o merge do código.
6. O **Workflow de Produção** é disparado. No entanto, o pipeline será **pausado automaticamente** ao chegar no *job* de deploy.
7. O GitHub enviará um aviso pedindo a sua **Aprovação Manual** no ambiente `production`.
8. Após você clicar em "Approve" na interface, o seu *self-hosted runner* executará os comandos finais e subirá o contêiner de produção na porta 8080.

Os demais processos que você mencionou — realizar os testes automatizados, criar as rotinas de rollback e os fluxos focados na branch `main` — são passos excelentes para evoluir a maturidade desse pipeline de CI/CD posteriormente. Quando quiser avançar para eles, é só me avisar!
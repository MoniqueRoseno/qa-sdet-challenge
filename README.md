# QA/SDET Challenge

Projeto de automação de testes desenvolvido como parte de um desafio técnico para QA.

A solução utiliza Cypress, TypeScript e Cucumber para automação de cenários Web e API, com foco em legibilidade, rastreabilidade, reutilização e execução reproduzível.

## Tecnologias

- Cypress
- TypeScript
- Cucumber / Gherkin
- ESLint
- Mochawesome
- GitHub Actions

## Escopo automatizado

### Web

Foram automatizados os seguintes fluxos:

- autenticação e logout;
- busca de produtos;
- carrinho de compras;
- checkout;
- pagamento.

### API

Foram automatizados cenários para:

- consulta de ações de um board utilizando a API do Trello;
- criação de contas utilizando a API do Automation Exercise.

A relação entre requisitos e cenários pode ser consultada em:

`TRACEABILITY.md`

## Estrutura do projeto

```text
.
├── .github/
│   └── workflows/
│       └── tests.yml
│
├── cypress/
│   ├── e2e/
│   │   ├── features/
│   │   └── step_definitions/
│   │
│   └── support/
│       ├── page_objects/
│       ├── utils/
│       ├── commands.ts
│       └── e2e.ts
│
├── .env.example
├── .gitignore
├── cypress.config.ts
├── eslint.config.js
├── package.json
├── tsconfig.json
└── TRACEABILITY.md
```

## Arquitetura

Os testes foram organizados buscando separar as responsabilidades entre as diferentes camadas.

### Feature files

Os arquivos `.feature` descrevem os comportamentos esperados utilizando Gherkin.

### Step Definitions

Os Step Definitions são responsáveis pela orquestração dos cenários, evitando concentrar seletores e detalhes de implementação.

### Page Objects

Os Page Objects encapsulam seletores, interações e validações relacionadas às páginas da aplicação.

### Commands

Custom Commands são utilizados para comportamentos técnicos reutilizáveis, como autenticação utilizada como pré-condição de outros fluxos.

### API

A automação de API é mantida separada da camada visual e utiliza dados e configurações externas ao código sempre que necessário.

## Pré-requisitos

Para executar o projeto é necessário possuir:

- Node.js
- npm
- Git

## Instalação

Clone o repositório e instale as dependências:

```bash
npm ci
```

## Configuração das variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`.

Exemplo:

```env
BASE_URL=https://automationexercise.com

TEST_USER_EMAIL=
TEST_USER_PASSWORD=

TRELLO_API_KEY=
TRELLO_TOKEN=
TRELLO_BOARD_ID=
```

> O arquivo `.env` não deve ser versionado.

As credenciais e tokens utilizados pela automação são configurados externamente para evitar a exposição de dados sensíveis no repositório.

## Execução

### Abrir Cypress

```bash
npx cypress open
```

### Executar todos os testes

```bash
npm test
```

### Smoke

```bash
npm run test:smoke
```

### Regressão

```bash
npm run test:regression
```

### Testes Web

```bash
npm run test:e2e
```

### Testes de API

```bash
npm run test:api
```

### Lint

```bash
npm run lint
```

### Execução com relatório

```bash
npm run report
```

## Estratégia de testes

Os cenários são classificados utilizando tags para permitir diferentes estratégias de execução.

Principais tags:

- `@smoke` — principais fluxos críticos;
- `@regression` — cobertura complementar e cenários negativos;
- `@web` — automação Web;
- `@api` — automação de API;
- `@WEB-01` a `@WEB-05` — rastreabilidade dos requisitos Web;
- `@API-01` e `@API-02` — rastreabilidade dos requisitos de API.

Os cenários foram desenvolvidos de forma independente, evitando dependência da ordem de execução.

## Relatórios e evidências

A execução gera relatório consolidado utilizando Mochawesome.

Em caso de falha, também podem ser geradas evidências como:

- screenshots;
- vídeos;
- relatório HTML.

Esses artefatos podem ser utilizados para auxiliar na investigação de falhas.

## CI/CD

O projeto possui pipeline utilizando GitHub Actions.

O pipeline executa:

1. checkout do código;
2. instalação das dependências com `npm ci`;
3. análise estática com ESLint;
4. execução da suíte automatizada;
5. publicação dos artefatos de teste.

Credenciais utilizadas pelo pipeline são configuradas através de GitHub Secrets e não são armazenadas no código-fonte.

## Hipóteses

Para implementação da solução, foram consideradas as seguintes hipóteses:

- o ambiente do Automation Exercise está disponível durante a execução;
- o usuário utilizado nos testes Web já está previamente cadastrado;
- as credenciais são fornecidas através de variáveis de ambiente;
- o board utilizado nos testes do Trello existe e possui ações disponíveis para consulta;
- serviços externos podem apresentar indisponibilidade ou variações de tempo de resposta;
- os cenários foram implementados considerando o comportamento atualmente observado nas aplicações utilizadas no desafio.

## Limitações conhecidas

### Dependência de serviços externos

A suíte depende da disponibilidade do Automation Exercise e da API do Trello. Instabilidades nesses serviços podem causar falhas que não representam necessariamente regressões na automação.

### Massa de dados

Parte da massa utilizada nos cenários Web ainda está definida próxima aos testes, como produto e dados utilizados no fluxo de pagamento.

Para o tamanho atual da suíte, essa abordagem mantém a solução simples e legível. Com o crescimento do projeto, a estratégia poderia evoluir para factories, fixtures ou builders, reduzindo duplicação e facilitando manutenção e reutilização dos dados.

Para os cenários de criação de conta via API, onde dados únicos são necessários, já foi utilizada uma Factory para geração da massa.

### Preparação de estado

Alguns cenários de maior nível, como checkout e pagamento, ainda utilizam etapas anteriores da interface para preparar o estado necessário.

Em uma suíte maior, seria avaliada a preparação dessas pré-condições através de API ou outros mecanismos de setup, quando suportados pela aplicação, reduzindo o tempo de execução e o acoplamento entre fluxos.

## Comportamento observado — Pagamento

Durante a implementação dos cenários de pagamento foi identificada uma diferença entre o comportamento esperado inicialmente e o comportamento efetivamente apresentado pela aplicação.

Os campos de pagamento não realizam validação de formato ou consistência dos valores informados. Quando preenchidos, a aplicação aceita valores que não necessariamente representam dados válidos.

Por outro lado, quando os campos obrigatórios permanecem vazios, o navegador impede a submissão do formulário devido às validações de obrigatoriedade existentes nos campos.

Diante desse comportamento, não foram implementadas asserções que presumissem regras de validação inexistentes no sistema. A automação foi mantida aderente ao comportamento observável da aplicação.

Como evolução do produto, recomenda-se implementar validações explícitas para os dados de pagamento, incluindo formato e consistência dos campos, acompanhadas de mensagens de erro claras para o usuário.

## Decisões arquiteturais

A arquitetura foi definida considerando o escopo e o tamanho atual da suíte, evitando abstrações desnecessárias.

### Abstração proporcional ao tamanho da suíte

A estrutura atual foi escolhida considerando a quantidade de cenários implementados no desafio.

Alguns pontos poderiam ser abstraídos ainda mais, como preparação de pedidos, massa de produtos e dados de pagamento. Entretanto, para o tamanho atual da suíte, abstrações adicionais poderiam aumentar a complexidade sem proporcionar ganho proporcional de manutenção.

Caso a suíte cresça, a arquitetura poderá evoluir com:

- factories e builders adicionais para massa de dados;
- componentes reutilizáveis para comportamentos compartilhados;
- preparação de estado através de API;
- separação mais granular das camadas de serviço;
- estratégias adicionais para execução paralela e gerenciamento de ambientes.

A intenção foi manter a solução simples o suficiente para o escopo atual, mas preparada para evolução conforme o crescimento da cobertura.


## Rastreabilidade

A matriz completa de rastreabilidade entre requisitos, funcionalidades e cenários automatizados está disponível em:

`TRACEABILITY.md`
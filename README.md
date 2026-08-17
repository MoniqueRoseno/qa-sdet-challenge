# QA/SDET Challenge

Projeto de automação de testes desenvolvido como parte de um desafio técnico para QA/SDET.

A solução utiliza Cypress, TypeScript e Cucumber para automação de cenários Web e API, com foco em qualidade de engenharia, rastreabilidade, isolamento, reutilização, segurança das evidências e execução reproduzível.

## Tecnologias

- Cypress
- TypeScript
- Cucumber / Gherkin
- AJV / JSON Schema
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
- criação de contas utilizando a API do Automation Exercise;
- validação de contrato das respostas utilizando JSON Schema;
- validação de regras de negócio;
- geração de dados únicos para cenários mutáveis.

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
│   ├── schemas/
│   │   ├── account-created.schema.json
│   │   ├── account-error.schema.json
│   │   └── trello-actions.schema.json
│   │
│   └── support/
│       ├── api/
│       ├── factories/
│       ├── page_objects/
│       ├── utils/
│       ├── validators/
│       ├── commands.ts
│       └── e2e.ts
│
├── .env.example
├── .gitignore
├── cypress.config.ts
├── eslint.config.js
├── package.json
├── tsconfig.json
├── TRACEABILITY.md
└── SDET_PARECER.md
```

## Arquitetura

A solução foi estruturada com separação de responsabilidades entre comportamento, orquestração, interação com interfaces, comunicação com APIs, geração de dados e validação de contratos.

### Feature Files

Os arquivos `.feature` descrevem os comportamentos esperados utilizando Gherkin declarativo.

As tags permitem rastrear os cenários até os requisitos correspondentes.

### Step Definitions

Os Step Definitions são responsáveis pela orquestração dos cenários e pelas expectativas de negócio.

Detalhes de implementação, seletores, geração de dados e chamadas HTTP são mantidos em suas respectivas camadas.

### Page Objects

Os Page Objects encapsulam seletores, interações e validações relacionadas às páginas da aplicação, reduzindo duplicação e centralizando alterações de interface.

### API

A camada `support/api` encapsula a comunicação HTTP com os serviços utilizados pelos testes.

Os Step Definitions não concentram detalhes de transporte, mantendo separadas as responsabilidades de execução da requisição e validação do comportamento.

### Factories

A camada `support/factories` centraliza a criação e disponibilização das massas de teste.

São utilizadas factories para:

- contas;
- produtos;
- dados de pagamento.

Para cenários que modificam estado, como criação de conta, são gerados dados únicos para reduzir colisões entre execuções e favorecer a idempotência.

### Validação de contrato

As respostas das APIs são validadas utilizando JSON Schema e AJV.

A estratégia de validação considera três níveis:

1. transporte — status HTTP;
2. contrato — estrutura e tipos da resposta;
3. negócio — valores e comportamentos esperados.

Dessa forma, uma resposta tecnicamente válida não é considerada suficiente caso o contrato ou a regra de negócio estejam incorretos.

### Sanitização de dados

Requests e responses utilizadas para diagnóstico são sanitizadas antes de serem registradas.

Campos sensíveis, como senhas, tokens e API Keys, são mascarados para evitar exposição em logs e evidências.

As requisições que contêm informações sensíveis utilizam `log: false`, e somente versões sanitizadas são registradas para diagnóstico.

### Resiliência e classificação de falhas

A suíte realiza verificações de disponibilidade para dependências externas e diferencia falhas funcionais de problemas relacionados ao ambiente.

A classificação considera, entre outros casos:

- `401/403` — configuração ou autenticação;
- `429` — rate limit da dependência externa;
- `5xx` — indisponibilidade ou instabilidade do serviço;
- falhas de contrato ou regra de negócio — falhas funcionais da execução.

A indisponibilidade de uma dependência não é convertida em sucesso ou ignorada. A execução permanece com falha, mas apresenta uma classificação que auxilia na identificação da causa.

## Pré-requisitos

Para executar o projeto é necessário possuir:

- Node.js;
- npm;
- Git.

## Instalação

Clone o repositório e instale as dependências:

```bash
npm ci
```

## Configuração das variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`.

```env
BASE_URL=https://automationexercise.com

TEST_USER_EMAIL=
TEST_USER_PASSWORD=

TRELLO_API_KEY=
TRELLO_TOKEN=
TRELLO_BOARD_ID=
```

> O arquivo `.env` não deve ser versionado.

Credenciais e tokens são configurados externamente e não são armazenados no código-fonte.

No pipeline, esses valores são fornecidos através de GitHub Secrets.

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

### Web

```bash
npm run test:e2e
```

### API

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

Os cenários são classificados através de tags para permitir execução seletiva e rastreabilidade.

Principais tags:

- `@smoke` — principais fluxos críticos;
- `@regression` — cobertura complementar e cenários negativos;
- `@web` — automação Web;
- `@api` — automação de API;
- `@WEB-01` a `@WEB-05` — rastreabilidade Web;
- `@API-01` e `@API-02` — rastreabilidade API.

Os cenários foram desenvolvidos buscando independência entre execuções e evitando dependência de ordem.

## Estratégia de dados

Dados reutilizáveis de produto e pagamento são centralizados em factories, evitando definições duplicadas nos Step Definitions.

Dados mutáveis são tratados de forma diferente de dados de referência.

Na criação de conta via API, a `AccountFactory` gera dados únicos para reduzir colisões entre execuções.

Após os cenários que criam uma conta, a suíte realiza a remoção da massa criada quando aplicável, reduzindo resíduos no ambiente.

Essa estratégia busca favorecer isolamento, repetibilidade e idempotência dos testes.

## Política de Retry

A suíte utiliza uma política limitada e transparente de retry:

- `runMode: 1` — em execução headless/CI, uma falha pode receber uma tentativa adicional;
- `openMode: 0` — durante execução interativa local, retries permanecem desabilitados.

Retry não é utilizado para transformar falhas determinísticas em sucesso.

Falhas relacionadas a contrato, regra de negócio, autenticação ou configuração devem permanecer visíveis e ser investigadas.

A tentativa adicional em CI busca auxiliar na identificação de instabilidades transitórias e flakiness. A ocorrência inicial continua observável nos resultados da execução.

Indisponibilidades de serviços externos são classificadas como problemas de ambiente/configuração em vez de serem tratadas apenas através de novas tentativas.

## Relatórios e evidências

A execução gera relatório consolidado utilizando Mochawesome.

Em caso de falha, podem ser gerados:

- screenshots;
- vídeos;
- relatório HTML;
- informações de diagnóstico sanitizadas.

Os artefatos auxiliam na investigação sem expor deliberadamente credenciais ou tokens utilizados pela automação.

## CI/CD

O projeto possui pipeline utilizando GitHub Actions.

O pipeline executa:

1. checkout do código;
2. configuração do Node.js;
3. instalação reproduzível com `npm ci`;
4. análise estática com ESLint;
5. execução da suíte automatizada;
6. publicação dos artefatos de teste.

Credenciais utilizadas pelo pipeline são configuradas através de GitHub Secrets.

Os mecanismos de diagnóstico e classificação de indisponibilidade ajudam a diferenciar falhas funcionais de problemas relacionados às dependências externas.

## Hipóteses

Foram consideradas as seguintes hipóteses:

- o usuário utilizado nos testes Web está previamente cadastrado;
- credenciais válidas são fornecidas através de variáveis de ambiente;
- o board configurado no Trello existe e possui ações disponíveis;
- dependências externas podem apresentar indisponibilidade, rate limit ou variações de tempo de resposta;
- os cenários representam o comportamento observável das aplicações no momento da implementação.

## Limitações conhecidas

### Dependência de serviços externos

A suíte depende do Automation Exercise e da API do Trello.

Como esses ambientes não são controlados pelo projeto, indisponibilidades podem impedir a execução de cenários dependentes.

Para reduzir ambiguidade no diagnóstico, a solução possui verificação de disponibilidade e classificação de respostas relacionadas a configuração, rate limit e indisponibilidade.

Essas condições não são mascaradas como sucesso.

### Preparação de estado

Alguns cenários de maior nível, especialmente checkout e pagamento, ainda utilizam etapas da interface para preparar o estado necessário.

A utilização de API para preparação de estado é preferível quando a aplicação disponibiliza endpoints adequados para esse objetivo, pois reduz tempo de execução e acoplamento entre fluxos.

No ambiente utilizado pelo desafio, a preparação foi mantida pela interface nos pontos em que não há mecanismo de setup adequado disponível na solução implementada.

Essa dependência é tratada como risco arquitetural conhecido.

## Comportamento observado — Pagamento

Durante a implementação dos cenários de pagamento foi identificada uma diferença entre o comportamento esperado inicialmente e o comportamento efetivamente apresentado pela aplicação.

Os campos de pagamento não apresentam validações suficientes de formato e consistência. Quando preenchidos, a aplicação aceita valores que não necessariamente representam dados válidos.

Quando os campos obrigatórios permanecem vazios, o navegador impede a submissão devido às validações de obrigatoriedade existentes.

Diante desse comportamento, a automação não presume regras que não estão implementadas no produto.

O comportamento foi documentado como risco funcional conhecido.

Como evolução do produto, recomenda-se implementar validações explícitas para os dados de pagamento, incluindo formato e consistência, acompanhadas de mensagens de erro claras.

## Decisões arquiteturais

As decisões arquiteturais buscam manter responsabilidades explícitas e permitir evolução da suíte sem concentrar regras técnicas nos cenários.

Foram adotadas as seguintes decisões:

- Page Objects para encapsular interação e validação da interface;
- camada dedicada de API para centralizar comunicação HTTP;
- factories para centralização e geração de massa;
- JSON Schema e AJV para validação de contratos;
- separação entre validação de transporte, contrato e negócio;
- sanitização de informações sensíveis antes da geração de logs;
- geração de dados únicos para operações mutáveis;
- cleanup de dados criados quando suportado;
- classificação explícita de falhas relacionadas a dependências externas;
- preflight de disponibilidade para cenários Web;
- retry limitado e documentado;
- rastreabilidade entre requisitos e cenários através de tags.

Novas abstrações devem possuir responsabilidade técnica clara e não apenas aumentar a quantidade de camadas do projeto.

## Rastreabilidade

A matriz completa de rastreabilidade entre requisitos, funcionalidades e cenários automatizados está disponível em:

`TRACEABILITY.md`

## Parecer técnico

A análise crítica da solução, riscos identificados, limitações, impactos e propostas de evolução está disponível em:

`SDET_PARECER.md`
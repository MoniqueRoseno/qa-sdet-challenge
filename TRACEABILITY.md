# Matriz de Rastreabilidade

Este documento relaciona os requisitos do desafio técnico aos cenários automatizados implementados no projeto.

## Automação Web

| Requisito | Funcionalidade | Cenário | Classificação |
|---|---|---|---|
| WEB-01 | Autenticação | LOGIN-001 - Login com credenciais válidas | Smoke |
| WEB-01 | Autenticação | LOGIN-002 - Login com senha inválida | Regression |
| WEB-01 | Autenticação | LOGIN-003 - Login com e-mail não cadastrado | Regression |
| WEB-01 | Autenticação | LOGIN-004 - Logout de usuário autenticado | Regression |
| WEB-02 | Busca | SEARCH-001 - Busca por produto existente | Smoke |
| WEB-02 | Busca | SEARCH-002 - Busca por produto inexistente | Regression |
| WEB-02 | Busca | SEARCH-003 - Busca sem informar termo | Regression |
| WEB-02 | Busca | SEARCH-004 - Busca contendo apenas espaços | Regression |
| WEB-03 | Carrinho | CART-001 - Adicionar produto ao carrinho | Smoke |
| WEB-03 | Carrinho | CART-002 - Validar produto adicionado ao carrinho | Regression |
| WEB-04 | Checkout | CHECKOUT-001 - Revisar endereço e produto no checkout | Smoke |
| WEB-04 | Checkout | CHECKOUT-002 - Prosseguir do checkout para pagamento | Regression |
| WEB-05 | Pagamento | PAYMENT-001 - Concluir pedido com dados de pagamento preenchidos | Smoke |
| WEB-05 | Pagamento | PAYMENT-002 - Tentar concluir pedido sem preencher dados obrigatórios | Regression |

## Automação de API

| Requisito | Funcionalidade | Cenário | Classificação |
|---|---|---|---|
| API-01 | Trello | Consultar ações de um board com sucesso | Smoke |
| API-02 | Criação de conta | ACCOUNT-001 - Criar conta com dados válidos e únicos | Smoke |
| API-02 | Criação de conta | ACCOUNT-002 - Criar conta sem e-mail | Regression |
| API-02 | Criação de conta | ACCOUNT-003 - Criar conta utilizando e-mail já cadastrado | Regression |

## Estratégia de execução

Os cenários são classificados por tags para permitir execuções seletivas:

- `@smoke`: validação dos principais fluxos críticos.
- `@regression`: cenários de cobertura complementar e comportamentos negativos.
- `@web`: cenários relacionados à interface web.
- `@api`: cenários relacionados às APIs.
- `@WEB-01` a `@WEB-05`: rastreabilidade dos requisitos web.
- `@API-01` e `@API-02`: rastreabilidade dos requisitos de API.

A execução pode ser realizada pelos scripts definidos no `package.json`.

```bash
npm run test:smoke
npm run test:regression
npm run test:e2e
npm run test:api
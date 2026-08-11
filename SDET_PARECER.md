# Parecer Crítico SDET

## Visão geral

A aplicação apresenta boa testabilidade para os fluxos principais, principalmente por possuir rotas previsíveis, elementos com atributos relativamente estáveis em diversos pontos e APIs acessíveis para automação.

Para o escopo atual do desafio, a arquitetura implementada atende bem à quantidade de cenários existente, mantendo separação entre features, step definitions, page objects, camada de API, comandos reutilizáveis e geração de dados.

A solução foi mantida propositalmente simples, evitando abstrações excessivas para o tamanho atual da suíte. Com o crescimento da cobertura, alguns pontos podem evoluir para reduzir duplicação, tempo de execução e custo de manutenção.

## Testabilidade

### Pontos positivos

A aplicação apresentou características favoráveis à automação:

- presença de atributos como `data-qa` em campos importantes;
- URLs previsíveis para navegação;
- estrutura de carrinho que permite identificar produtos individualmente;
- retorno observável após autenticação, logout e conclusão de pedidos;
- APIs que permitem validar regras independentemente da interface;
- possibilidade de geração e limpeza de massa através da API de contas.

A utilização de seletores estáveis foi priorizada sempre que disponível. Quando não havia um atributo específico para teste, os seletores foram encapsulados nos Page Objects para reduzir o impacto de futuras mudanças na interface.

## Limitações observadas

### Validação dos dados de pagamento

O principal gap funcional identificado está no fluxo de pagamento.

O requisito WEB-05 determina que campos obrigatórios e dados de pagamento inválidos devem bloquear o avanço. :contentReference[oaicite:1]{index=1}

Durante os testes exploratórios, porém, foi observado que a aplicação implementa essencialmente a obrigatoriedade dos campos, mas não valida adequadamente o conteúdo informado.

Foram aceitos, por exemplo:

- número de cartão com apenas um caractere;
- CVC alfabético;
- CVC com apenas um caractere;
- mês de validade igual a `13`;
- valores com formato incompatível com o esperado.

Quando os campos permanecem vazios, a submissão é bloqueada pela validação nativa do navegador através do atributo `required`.

Diante disso, a automação não foi alterada para simular uma regra que o produto não possui. O comportamento observado foi tratado como limitação funcional e risco residual.

Essa decisão também segue a orientação do próprio desafio de validar apenas o comportamento observável do ambiente quando o gateway ou a natureza real do pagamento não estão claramente definidos. :contentReference[oaicite:2]{index=2}

### Massa de dados

A estratégia atual de massa atende ao tamanho da suíte, porém pode ser evoluída.

Alguns dados estáticos, como produto utilizado nos fluxos Web e informações de pagamento, ainda são definidos próximos aos cenários.

Com o crescimento da cobertura, recomendo centralizar esses dados em factories, fixtures ou builders, de acordo com sua natureza.

Dados mutáveis ou que exigem unicidade devem continuar sendo gerados dinamicamente. Essa abordagem já foi aplicada na criação de contas via API através da `AccountFactory`.

Essa evolução reduziria duplicação, facilitaria manutenção e permitiria criação de massas específicas por cenário.

### Preparação de estado

Os cenários de checkout e pagamento percorrem etapas anteriores da interface para preparar o estado necessário.

Essa estratégia é adequada para o escopo atual e mantém o fluxo fácil de entender. Entretanto, em uma suíte maior, aumentaria o tempo de execução e o acoplamento entre funcionalidades.

Como próximo incremento, avaliaria preparar pré-condições através de APIs quando disponíveis, mantendo os testes de UI responsáveis apenas pelo comportamento que realmente precisam validar.

Por exemplo:

- o teste de login continua validando autenticação pela interface;
- o teste de checkout pode iniciar com usuário já autenticado;
- o teste de pagamento pode iniciar com pedido previamente preparado por uma camada de serviço.

## Riscos residuais

Mesmo com a cobertura implementada, permanecem alguns riscos não totalmente cobertos.

### Dependência de ambientes externos

Automation Exercise e Trello são serviços externos à suíte.

Indisponibilidade, lentidão ou alteração desses ambientes pode causar falhas sem que exista regressão no código da automação.

O próprio desafio reconhece que ambiente, credenciais e estabilidade não são garantidos e orienta que essas condições sejam configuráveis e documentadas. :contentReference[oaicite:3]{index=3}

Por isso, falhas devem ser classificadas entre:

- falha de produto;
- falha de teste;
- falha de dados;
- indisponibilidade de ambiente.

Essa classificação também é exigida no relatório de execução. :contentReference[oaicite:4]{index=4}

### Cobertura de pagamento

Como não há evidência de integração com um gateway financeiro real, a cobertura valida apenas os comportamentos observáveis da interface.

Não são utilizados dados financeiros reais.

Permanecem sem cobertura aspectos como:

- autorização real do cartão;
- antifraude;
- comunicação com adquirente;
- recusas de pagamento;
- timeout do gateway;
- estorno e chargeback.

### Compatibilidade entre navegadores

A suíte foi priorizada para um navegador principal.

Uma iniciativa real poderia adicionar execução em outros navegadores de acordo com métricas de uso e risco.

### Performance, segurança e acessibilidade

Esses aspectos não fazem parte do escopo obrigatório do desafio, mas representam riscos residuais importantes em uma aplicação de comércio eletrônico.

O próprio enunciado indica que performance, segurança ofensiva, compatibilidade ampla e acessibilidade completa estão fora do escopo obrigatório, mas devem ser considerados em uma iniciativa real. :contentReference[oaicite:5]{index=5}

## Próximos incrementos

Caso a suíte evoluísse para um projeto de longo prazo, eu priorizaria:

1. evoluir a estratégia de massa com factories, builders e fixtures;
2. preparar estados complexos através de APIs para reduzir tempo de execução;
3. criar validações funcionais mais robustas no pagamento;
4. expandir cobertura de contratos das APIs;
5. adicionar execução paralela conforme o volume da suíte;
6. ampliar a matriz de browsers de acordo com risco e uso;
7. incorporar testes de acessibilidade;
8. incluir testes de performance nos fluxos críticos;
9. adicionar uma estratégia específica de testes de segurança;
10. acompanhar métricas de flakiness, duração, taxa de falha e causas recorrentes.

## Conclusão

A solução atual busca equilíbrio entre cobertura, legibilidade e manutenção.

Para o volume de testes implementado, a arquitetura atende ao objetivo sem introduzir camadas ou abstrações desnecessárias. Ao mesmo tempo, existem pontos claros de evolução caso a suíte cresça, especialmente em massa de dados, preparação de estado, cobertura de pagamento e tratamento de dependências externas.

O principal ponto funcional identificado durante a análise foi a ausência de validação adequada dos dados de pagamento. Esse comportamento deve ser tratado como risco do produto, e não mascarado pela automação.

A estratégia adotada foi priorizar testes determinísticos, rastreáveis e alinhados ao comportamento observável, mantendo explícitas as limitações e os riscos que permanecem fora da cobertura atual.
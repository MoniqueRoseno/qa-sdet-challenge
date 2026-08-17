# Parecer Crítico SDET

## 1. Visão geral

A análise da aplicação e da solução de automação considerou não apenas a cobertura funcional, mas também testabilidade, isolamento, confiabilidade dos resultados, segurança das evidências, dependências externas e sustentabilidade da suíte.

A estratégia adotada busca separar claramente:

- comportamento funcional;
- transporte e comunicação com APIs;
- contratos;
- regras de negócio;
- geração de dados;
- preparação de estado;
- falhas de produto;
- falhas de automação;
- falhas de configuração;
- indisponibilidade de ambiente.

Durante a implementação foram identificados riscos relacionados principalmente à validação de pagamento, dependência de serviços externos, preparação de estado via interface e disponibilidade dos ambientes.

Esses riscos são detalhados neste parecer juntamente com as respectivas estratégias de mitigação e riscos residuais.

---

## 2. Testabilidade

### Pontos positivos

A aplicação apresentou características favoráveis à automação:

- presença de atributos como `data-qa` em campos importantes;
- URLs previsíveis;
- estrutura do carrinho que permite identificar produtos individualmente;
- resultados observáveis após autenticação, logout e conclusão de pedidos;
- APIs disponíveis para validação independente da interface;
- possibilidade de geração e limpeza de massa através da API de contas.

Seletores estáveis foram priorizados sempre que disponíveis.

Quando não havia atributo específico para teste, os seletores foram encapsulados nos Page Objects, reduzindo o impacto de alterações futuras da interface.

---

## 3. Estratégia de dados

A massa de testes é tratada de acordo com sua natureza.

Dados reutilizáveis de produto e pagamento são centralizados através de factories, evitando que informações de teste permaneçam duplicadas ou diretamente definidas nos Step Definitions.

Foram utilizadas:

- `AccountFactory`;
- `ProductFactory`;
- `PaymentFactory`.

Para operações mutáveis, a estratégia prioriza geração dinâmica e unicidade.

Na criação de contas via API, a `AccountFactory` gera dados únicos para reduzir colisões entre execuções e permitir execução independente.

Quando uma conta é criada durante um cenário, a suíte executa cleanup após o teste quando aplicável.

### Risco

Dados mutáveis compartilhados entre execuções poderiam gerar colisões e tornar os testes dependentes de estado anterior.

### Mitigação

- geração de dados únicos;
- centralização da massa;
- cleanup quando suportado;
- independência entre cenários.

### Risco residual

Dependências externas podem manter estado fora do controle da suíte caso uma execução seja interrompida antes do cleanup.

Nesse caso, a geração de dados únicos reduz a possibilidade de colisão em execuções futuras.

---

## 4. Estratégia de testes de API

Os testes de API foram estruturados para separar transporte, contrato e regra de negócio.

A validação ocorre em três níveis:

### Transporte

Validação do status HTTP retornado pelo serviço.

### Contrato

As respostas são validadas utilizando JSON Schema e AJV.

Foram definidos schemas específicos para os contratos utilizados pela automação, incluindo criação de conta, respostas de erro e consulta de ações do Trello.

A validação de contrato permite detectar alterações estruturais, ausência de propriedades obrigatórias ou tipos incompatíveis.

### Regra de negócio

Após a validação estrutural, são realizadas asserções relacionadas ao comportamento esperado.

Exemplos:

- confirmação da criação de usuário;
- rejeição de conta sem e-mail;
- rejeição de conta duplicada;
- retorno de lista de ações do Trello;
- presença do nome da lista quando a ação possui associação com uma lista.

Essa separação evita considerar uma resposta válida apenas porque retornou HTTP 200.

---

## 5. Segurança e sanitização das evidências

Credenciais, tokens e outros dados sensíveis são mantidos fora do código-fonte através de variáveis de ambiente.

O arquivo `.env` não é versionado e, no CI, as credenciais são fornecidas através de GitHub Secrets.

Além disso, requests que manipulam informações sensíveis utilizam `log: false`.

Quando informações de request ou response são utilizadas para diagnóstico, os dados passam por sanitização antes de serem registrados.

Campos como:

- password;
- token;
- API Key;
- authorization;
- secrets equivalentes;

são mascarados nas evidências.

### Risco

Logs automáticos de chamadas de API poderiam expor credenciais utilizadas pela automação.

### Mitigação

- secrets externos ao repositório;
- `.env` ignorado pelo Git;
- `log: false` em requisições sensíveis;
- sanitização antes da geração de logs.

### Risco residual

Novos campos sensíveis adicionados futuramente precisam ser incorporados à estratégia de sanitização.

---

## 6. Dependências externas e indisponibilidade de ambiente

Automation Exercise e Trello são dependências externas e não são controlados pela suíte.

Por isso, uma falha de comunicação não deve ser automaticamente interpretada como regressão funcional.

Foi implementada uma estratégia de detecção e classificação de falhas.

### Automation Exercise

Os cenários Web executam uma verificação de disponibilidade antes da execução.

Caso a aplicação não esteja acessível, a falha é identificada antes das validações funcionais.

### Trello

As respostas do serviço são classificadas de acordo com o status retornado.

Exemplos:

| Resposta | Classificação | Interpretação |
|---|---|---|
| 2xx | disponível | execução funcional pode prosseguir |
| 401 / 403 | configuração | credencial, token ou autorização |
| 429 | rate limit | limitação da dependência externa |
| 5xx | ambiente | indisponibilidade ou instabilidade externa |

A indisponibilidade não é transformada em sucesso nem ignorada.

O cenário permanece com falha, mas a causa é explicitamente classificada para facilitar o diagnóstico.

### Contingência

Quando uma dependência externa estiver indisponível:

1. a falha deve permanecer visível;
2. a causa deve ser classificada;
3. as evidências disponíveis devem ser preservadas;
4. não deve ser aberto automaticamente um defeito funcional sem análise da causa;
5. a execução pode ser repetida após normalização do ambiente.

### Risco residual

Uma dependência pode estar tecnicamente acessível e ainda apresentar degradação parcial, comportamento inconsistente ou lentidão.

Por isso, o preflight reduz ambiguidade, mas não substitui as validações realizadas pelos próprios cenários.

---

## 7. Política de retry e flakiness

A suíte utiliza retry limitado:

- `runMode: 1`;
- `openMode: 0`.

Em execução headless/CI, uma falha pode receber uma tentativa adicional.

Em execução interativa local, retry permanece desabilitado para tornar falhas imediatamente visíveis durante desenvolvimento e investigação.

Retry não deve ser utilizado para mascarar:

- falhas de contrato;
- falhas de regra de negócio;
- configuração incorreta;
- autenticação inválida;
- defeitos determinísticos.

A tentativa adicional em CI auxilia na identificação de instabilidades transitórias.

Uma falha que passa apenas após retry deve ser considerada sinal de possível flakiness e analisada, e não simplesmente tratada como evidência de estabilidade.

---

## 8. Preparação de estado

Os cenários de checkout e pagamento ainda dependem parcialmente de etapas anteriores da interface para criação do estado necessário.

Isso cria maior acoplamento e aumenta o tempo de execução.

### Risco

Uma falha em uma etapa de preparação pode impedir a validação do comportamento realmente pretendido pelo cenário.

Por exemplo, uma instabilidade na inclusão do produto no carrinho pode impedir que o cenário de pagamento chegue ao comportamento que pretende validar.

### Estratégia recomendada

Quando a aplicação fornecer APIs ou mecanismos de test support adequados, pré-condições devem ser preparadas fora da interface sempre que isso não eliminar o comportamento que o cenário pretende testar.

Exemplos:

- teste de autenticação → autenticação pela interface;
- teste de checkout → autenticação pode ser preparada tecnicamente;
- teste de pagamento → carrinho/pedido pode ser preparado por API quando houver suporte.

### Limitação atual

No ambiente utilizado, nem todos os estados necessários ao checkout e pagamento possuem mecanismo de preparação adequado disponível na solução implementada.

Por isso, parte do setup permanece pela interface.

### Risco residual

Permanece acoplamento entre algumas etapas Web.

Esse risco é conhecido e deve ser considerado caso a cobertura ou o volume de execução aumente.

---

## 9. Gap funcional — validação de pagamento

O principal gap funcional identificado durante os testes exploratórios está no fluxo de pagamento.

Foi observado que os campos possuem validação de obrigatoriedade, porém não apresentam validação suficiente de formato ou consistência.

Foram aceitos comportamentos como:

- número de cartão com apenas um caractere;
- CVC alfabético;
- CVC com apenas um caractere;
- mês de validade igual a `13`;
- valores incompatíveis com formatos esperados.

Quando os campos permanecem vazios, a submissão é bloqueada pela validação de obrigatoriedade existente.

A automação não foi adaptada para simular uma regra inexistente no produto.

### Impacto

Dados estruturalmente inválidos podem avançar no fluxo de pagamento.

Em uma aplicação real integrada a serviços financeiros, isso poderia aumentar rejeições posteriores, inconsistência na experiência do usuário e dependência desnecessária de validações downstream.

### Recomendação

Implementar validações explícitas para:

- formato do número do cartão;
- tamanho e formato do CVC;
- mês válido;
- ano de validade;
- mensagens de erro associadas aos campos.

Após implementação das regras, os cenários negativos devem ser incorporados à regressão.

### Risco residual

A cobertura atual valida somente o comportamento observável da aplicação e não representa autorização financeira real.

---

## 10. Cobertura de pagamento

Não há evidência, no escopo analisado, de integração com gateway financeiro real que permita validar todo o ciclo de pagamento.

Não são utilizados dados financeiros reais.

Permanecem fora da cobertura:

- autorização real do cartão;
- antifraude;
- comunicação com adquirente;
- recusas do emissor;
- timeout de gateway;
- estorno;
- chargeback.

Em um produto real, esses comportamentos deveriam ser cobertos em camadas apropriadas utilizando ambientes controlados, mocks, stubs ou sandboxes dos provedores envolvidos.

---

## 11. Matriz de riscos

| Risco | Probabilidade | Impacto | Detecção | Mitigação | Contingência | Residual |
|---|---|---|---|---|---|---|
| Automation Exercise indisponível | Média | Alto | Preflight | Environment Check | Classificar falha e preservar evidências | Médio |
| Trello indisponível | Média | Médio | Status da API | Failure Classifier | Classificar como ambiente | Baixo/Médio |
| Credencial Trello inválida | Média | Médio | 401/403 | Secrets + validação de configuração | Classificar como configuração | Baixo |
| Rate limit Trello | Baixa/Média | Médio | HTTP 429 | Classificação específica | Nova execução após normalização | Baixo |
| Colisão de dados de conta | Baixa | Médio | Resposta API | Factory com dados únicos | Gerar nova massa | Baixo |
| Alteração de contrato API | Média | Alto | AJV | JSON Schema | Falha explícita de contrato | Médio |
| Vazamento de segredo em log | Baixa | Alto | Revisão de evidências | Sanitização + `log: false` | Rotação da credencial se necessário | Baixo |
| Dados inválidos de pagamento aceitos | Alta | Alto | Teste exploratório | Gap documentado | Correção funcional | Alto |
| Setup Web acoplado | Média | Médio | Falha em pré-condição | Commands/API quando disponíveis | Diagnóstico da etapa responsável | Médio |
| Flakiness transitória | Média | Médio | Retry/relatórios | Retry limitado | Investigação da causa | Médio |

---

## 12. Compatibilidade, performance, segurança e acessibilidade

A cobertura principal foi priorizada de acordo com o escopo funcional do desafio.

Em uma iniciativa de produto real, outros atributos de qualidade também devem ser considerados de acordo com risco e criticidade:

- compatibilidade entre navegadores;
- acessibilidade;
- performance;
- segurança;
- resiliência;
- observabilidade.

A priorização dessas frentes deve considerar criticidade do fluxo, volume de usuários, arquitetura e impacto de falha.

---

## 13. Próximos incrementos

Os próximos incrementos recomendados seriam:

1. reduzir preparação de estado via UI quando APIs adequadas estiverem disponíveis;
2. incorporar cenários negativos de pagamento após implementação das regras funcionais;
3. acompanhar taxa de retry e flakiness ao longo das execuções;
4. acompanhar duração da suíte e avaliar paralelização conforme o volume crescer;
5. ampliar contratos de API conforme novos endpoints forem incorporados;
6. ampliar matriz de browsers baseada em risco e dados de uso;
7. incorporar testes de acessibilidade;
8. adicionar performance aos fluxos críticos;
9. evoluir testes de segurança de acordo com o contexto da aplicação.

---

## 14. Conclusão

A estratégia de qualidade busca tornar explícita a diferença entre falha funcional, falha de contrato, problema de configuração e indisponibilidade de dependência externa.

A arquitetura utiliza separação de responsabilidades, factories para gestão de dados, validação de contratos com JSON Schema/AJV, sanitização de evidências, classificação de falhas externas e política limitada de retry.

Os principais riscos residuais estão relacionados à preparação parcial de estado pela interface, dependência de ambientes externos e às limitações funcionais observadas no pagamento.

Esses riscos não são tratados como detalhes de implementação: são documentados considerando impacto, mitigação, contingência e evolução recomendada.

O objetivo da suíte não é apenas produzir execuções verdes, mas gerar sinais confiáveis sobre a qualidade do produto e permitir distinguir regressões reais de problemas de teste, dados, configuração ou ambiente.
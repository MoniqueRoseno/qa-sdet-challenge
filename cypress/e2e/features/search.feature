@web @search
Feature: Busca de produtos
  Como usuário
  Quero pesquisar produtos
  Para localizar itens disponíveis no catálogo

  @WEB-02 @SEARCH-001 @smoke
  Scenario: Usuário pesquisa por um produto existente
    Given que o usuário está na listagem de produtos
    When ele pesquisa por um produto existente
    Then o sistema deve apresentar a seção de produtos pesquisados
    And deve apresentar produtos correspondentes ao termo pesquisado

  @WEB-02 @SEARCH-002 @regression
  Scenario: Usuário pesquisa por um produto inexistente
    Given que o usuário está na listagem de produtos
    When ele pesquisa por um produto inexistente
    Then o sistema deve apresentar a seção de produtos pesquisados
    And não deve apresentar produtos correspondentes à pesquisa

  @WEB-02 @SEARCH-003 @regression
  Scenario: Usuário realiza uma busca sem informar um termo
    Given que o usuário está na listagem de produtos
    When ele realiza uma busca sem informar um termo
    Then o sistema deve manter a listagem de produtos disponível

  @WEB-02 @SEARCH-004 @regression
  Scenario: Usuário realiza uma busca contendo apenas espaços
    Given que o usuário está na listagem de produtos
    When ele realiza uma busca contendo apenas espaços
    Then o sistema deve apresentar comportamento equivalente à busca sem termo
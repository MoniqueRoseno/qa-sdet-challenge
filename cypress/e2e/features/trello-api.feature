@api @trello
Feature: Consulta de ações de um board no Trello
  Como consumidor da API
  Quero consultar as ações de um board
  Para validar o contrato retornado pelo serviço

  @API-01 @smoke
  Scenario: Consultar ações de um board com sucesso
    Given que possuo credenciais válidas para acessar o Trello
    When consulto as ações do board
    Then a API do Trello deve retornar sucesso
    And deve retornar uma lista de ações
    And as ações que possuem lista devem apresentar o nome da lista
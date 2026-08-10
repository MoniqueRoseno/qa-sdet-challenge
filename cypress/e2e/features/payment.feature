@web @payment
Feature: Pagamento
  Como usuário
  Quero informar os dados de pagamento
  Para concluir meu pedido

  @WEB-05 @PAYMENT-001 @smoke
  Scenario: Usuário conclui o pedido com todos os campos preenchidos
    Given que o usuário está na página de pagamento com um pedido preparado
    When ele informa os dados de pagamento
    And confirma o pedido
    Then o sistema deve concluir o pedido
    And deve apresentar a confirmação da compra

  @WEB-05 @PAYMENT-002 @regression
  Scenario: Campos obrigatórios vazios impedem a conclusão do pedido
    Given que o usuário está na página de pagamento com um pedido preparado
    When ele tenta confirmar o pedido sem preencher os dados de pagamento
    Then o sistema deve impedir a conclusão do pedido
    And os campos obrigatórios devem permanecer inválidos
@web @checkout
Feature: Checkout
  Como usuário autenticado
  Quero revisar os dados da compra
  Para prosseguir com segurança para o pagamento

  @WEB-04 @CHECKOUT-001 @smoke
  Scenario: Usuário acessa o checkout com um produto no carrinho
    Given que o usuário está autenticado para realizar uma compra
    And possui um produto no carrinho
    When ele prossegue para o checkout
    Then o sistema deve apresentar o endereço de entrega
    And deve apresentar o endereço de cobrança
    And deve apresentar o produto na revisão do pedido
    And o total da revisão deve corresponder ao preço multiplicado pela quantidade

  @WEB-04 @CHECKOUT-002 @regression
  Scenario: Usuário prossegue da revisão do pedido para o pagamento
    Given que o usuário está autenticado para realizar uma compra
    And possui um produto no carrinho
    And está na página de checkout
    When ele confirma a revisão do pedido
    Then o sistema deve direcioná-lo para a página de pagamento
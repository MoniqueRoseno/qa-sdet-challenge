@web @cart
Feature: Carrinho de compras
  Como usuário
  Quero adicionar produtos ao carrinho
  Para revisar os itens antes de realizar a compra

  @WEB-03 @CART-001 @smoke
  Scenario: Usuário adiciona um produto ao carrinho
    Given que o usuário está na página de produtos
    When ele adiciona um produto ao carrinho
    And acessa o carrinho
    Then o produto deve ser apresentado no carrinho
    And o preço do produto deve estar correto
    And a quantidade deve ser igual a 1
    And o subtotal deve corresponder ao preço multiplicado pela quantidade

  @WEB-03 @CART-002 @regression
  Scenario: Usuário adiciona o mesmo produto duas vezes
    Given que o usuário está na página de produtos
    When ele adiciona o mesmo produto duas vezes ao carrinho
    And acessa o carrinho
    Then o produto deve ser apresentado no carrinho
    And a quantidade deve ser igual a 2
    And o subtotal deve corresponder ao preço multiplicado pela quantidade
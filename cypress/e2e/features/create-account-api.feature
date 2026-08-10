@api @account
Feature: Criação de conta via API
  Como consumidor da API
  Quero criar contas
  Para validar o contrato e as regras de criação de usuário

  @API-02 @ACCOUNT-001 @smoke
  Scenario: Criar conta com dados válidos e únicos
    Given que possuo dados válidos e únicos para uma nova conta
    When solicito a criação da conta
    Then a API deve confirmar a criação com sucesso
    And deve retornar a mensagem de usuário criado

  @API-02 @ACCOUNT-002 @regression
  Scenario: Criar conta sem e-mail
    Given que possuo dados de conta sem e-mail
    When solicito a criação da conta
    Then a API deve rejeitar a criação
    And deve retornar uma resposta de erro

  @API-02 @ACCOUNT-003 @regression
  Scenario: Criar conta utilizando e-mail já cadastrado
    Given que existe uma conta previamente cadastrada
    When solicito novamente a criação da conta com o mesmo e-mail
    Then a API deve rejeitar a criação duplicada
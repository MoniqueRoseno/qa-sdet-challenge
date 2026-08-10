@web @authentication
Feature: Autenticação de usuário

  @WEB-01 @LOGIN-001 @smoke
  Scenario: Usuário acessa sua conta com credenciais válidas
    Given que o usuário está na página de autenticação
    When informa credenciais válidas
    Then deve acessar sua conta com sucesso

  @WEB-01 @LOGIN-002 @regression
  Scenario: Usuário tenta acessar com senha inválida
    Given que o usuário está na página de autenticação
    When informa uma senha inválida
    Then a autenticação deve ser rejeitada

  @WEB-01 @LOGIN-003 @regression
  Scenario: Usuário tenta acessar com e-mail não cadastrado
    Given que o usuário está na página de autenticação
    When informa credenciais de um usuário não cadastrado
    Then a autenticação deve ser rejeitada

  @WEB-01 @LOGIN-004 @regression
  Scenario: Usuário encerra sua sessão
    Given que o usuário está autenticado
    When realiza logout
    Then sua sessão deve ser encerrada
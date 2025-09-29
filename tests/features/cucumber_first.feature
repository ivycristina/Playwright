Feature: Acesso ao site Playwright

      Scenario: Login bem-sucedido
        Given eu acesso o site do Playwright
        When clicar em "Get Started"
        Then devo ver o título "Fast and reliable end-to-end testing for modern web apps | Playwright"


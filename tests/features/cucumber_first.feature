Feature: Acesso ao site Americanas.com

      Scenario: Pesquisa produto
        Given eu acesso o site da Americanas.com
        When digitar Smart TV no campo de busca
        And clicar no botão de pesquisar
        Then devo selecionar o filtro "Preço"
        And devo selecionar a opção de "2500-5000"
        And a partir da lista de produtos, deve selecionar os que tiverem maior que "3500"
        And trazer o nome/o preço do produto/quantidade estrelas


Feature: ranking de pedidos em determinado mês
  As a cliente do aplicativo
  I want to poder ver informações sobre meus pedidos do mês 
  So that eu possa entender quanto eu gastei, em que e onde 

  Scenario: cliente não comprou nada no mês
    Given eu não comprei nada há trinta dias
    When eu checo a página "Perfil de Consumo Mensal"
    Then aparece uma mensagem dizendo que nada foi comprado aquele mês  

  Scenario: o item mais consumido foi o que trouxe o maior custo
    Given eu comprei nos últimos 30 dias 3 "pizza" que custam "R$ 40,00" cada
    And eu comprei nos últimos 30 dias 2 "kebab" que custam "R$15,00" cada 
    When eu checo a página "Perfil de Consumo Mensal"
    Then o destaque de frequência e o destaque de custo indicam "pizza"
    And o percentual de frequência de "pizza" é "60%" e o de "kebab" é "40%"
    And o percentual de custo de "pizza" é "80%" e o de kebab é "20%"
    And o custo total apresentado é "R$150,00"

  Scenario: o item mais consumido não foi o que trouxe um maior custo
    Given eu comprei nos últimos 30 dias 4 "pizza" que custam "R$ 40,00" cada
    And eu comprei nos últimos 30 dias 6 "kebab" que custam "R$15,00" cada 
    When eu checo a página "Perfil de Consumo Mensal"
    Then o destaque de frequência indica "kebab"
    And  o destaque de custo indica "pizza"
    And o percentual de frequência de "pizza" é "40%" e o de "kebab" é "60%"
    And o percentual de custo de "pizza" é "64%" e o de kebab é "36%"
    And o custo total apresentado é "R$250,00"

  Scenario: o item mais consumido não foi do restaurante com mais custo 
    Given eu comprei nos últimos 30 dias 2 "pizza vegetariana" e 2 "pizza marguerita" do restaurante "Pizzaria Mia"
    And eu comprei nos últimos 30 dias 6 "kebab" do restaurante "Kebabado"
    When eu checo a página "Perfil de Consumo Mensal"
    Then o destaque de frequência indica "kebab"
    And  o destaque de restaurante onde eu mais gastei indica "Pizzaria Mia"
    And o percentual de frequência de "pizza marguerita" é "20%", o de "pizza vegetariana" é "20%" e o de "kebab" é "60%"
    And o percentual dos gastos nos restaurantes é de "64%" para "Pizzaria Mia" e "36%" para "Kebabado"
    And o custo total apresentado é "R$250,00"
  
  Scenario: o item mais consumido não foi do restaurante mais pedido 
    Given eu comprei nos últimos 30 dias 3 "pizza vegetariana" e 3 "pizza marguerita" do restaurante "Pizzaria Mia"
    And eu comprei nos últimos 30 dias 4 "kebab" do restaurante "Kebabado"
    When eu checo a página "Perfil de Consumo Mensal"
    Then o destaque de frequência indica "kebab"
    And  o destaque de restaurante mais pedido indica "Pizzaria Mia"
    And o percentual de frequência de "pizza marguerita" é "30%", o de "pizza vegetariana" é "30%" e o de "kebab" é "40%"
    And o percentual de pedidos de "Pizzaria Mia" é "60%" e os de "Kebabado" é "40%"
    And o custo total apresentado é "R$300,00"

  Scenario: o restautante mais pedido não é o com mais custo
    Given eu comprei nos últimos 30 dias 4 "pizza vegetariana" do restaurante "Pizzaria Mia"
    And eu comprei nos últimos 30 dias 6 "kebab" do restaurante "Kebabado" 
    When eu checo a página "Perfil de Consumo Mensal"
    Then o destaque de restaurante mais pedido indica "Kebabado"
    And o destaque de restaurante onde eu mais gastei indica "Pizzaria Mia" 
    And o percentual de pedidos de "Pizzaria Mia" é "40%" e os de "Kebabado" é "60%"
    And o percentual dos gastos nos restaurantes é de "64%" para "Pizzaria Mia" e "36%" para "Kebabado"
    And o custo total apresentado é "R$250,00"

  Scenario: pegar frequência comprada de cada produto
    Given está guardado no sistema que eu comprei nos últimos 30 dias 4 "pizza" 
    And está guardado no sistema que eu comprei nos últimos 30 dias 6 "kebab"
    When eu peço a frequência de cada produto  
    Then o sistema retorna "40%" associado a "pizza" e "60%" associado a "kebab"
    And ainda está guardado no sistema o log de 4 "pizzas" e 6 "kebabs" nos últimos 30 dias   

  Scenario: pegar custo total de cada produto
    Given está guardado no sistema que eu comprei nos últimos 30 dias 4 "pizza" que custaram "R$40,00" cada
    And está guardado no sistema que eu comprei nos últimos 30 dias 6 "kebab" que custaram "R$15,00" cada
    When eu peço o custo total de cada produto  
    Then o sistema retorna "R$160,00" associado a "pizza" e "R$90,00" associado a "kebab"
    And ainda está guardado no sistema o log de 4 "pizzas" e 6 "kebabs" nos últimos 30 dias

  Scenario: pegar custo total de cada produto
    Given não há nada no sistema 
    When eu peço o custo total de cada produto  
    Then o sistema retorna uma mensagem que indica que nada foi comprado 
  
  Scenario: pegar frequência comprada de cada produto
    Given não há nada no sistema
    When eu peço a frequência de cada produto  
    Then o sistema retorna uma mensagem que indica que nada foi comprado

  Scenario: o restautante mais pedido é o com mais custo
    Given eu comprei nos últimos 30 dias 4 "pizza vegetariana" do restaurante "Pizzaria Mia"
    And eu comprei nos últimos 30 dias 1 "kebab" do restaurante "Kebabado" 
    When eu checo a página "Perfil de Consumo Mensal"
    Then o destaque de restaurante mais pedido indica "Kebabado"
    And o destaque de restaurante onde eu mais gastei indica "Pizzaria Mia" 
    And o percentual de pedidos de "Pizzaria Mia" é "80%" e os de "Kebabado" é "20%"
    And o percentual dos gastos nos restaurantes é de "91,43%" para "Pizzaria Mia" e "8,57%" para "Kebabado"
    And o custo total apresentado é "R$175,00" 

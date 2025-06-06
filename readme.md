## O que é a vehicle api.

Uma solução que atende as seguintes necessidades de um negócio de venda de carros:

• Cadastrar um veículo para venda (Marca, modelo, ano, cor, preço);
• Editar os dados do veículo;
• Permitir a reserva de compra do veículo.
• Permitir a finalização da compra do veículo via webhook.
• Listagem de veículos à venda, ordenada por preço, do mais barato para o mais caro;
• Listagem de veículos vendidos, ordenada por preço, do mais barato para o mais caro.

## Como rodar a aplicação

# Pre requisitos

1 - Docker e docker compose

# Criar network

1 - Rodar o comando abaixo para que os dois microserviços tenham uma network compartilhada:  
docker network create microservices-network

# Rodando a aplicação

1 - Criar um arquivo .env a partir do arquivo .env.example
2 - rodar o comando docker compose up na raiz do projeto

## Curls para teste

# Criar veiculo

curl --location 'http://localhost:3000/vehicles' \
--header 'Content-Type: application/json' \
--data '{
"brand":"Gm",
"model": "Agile",
"year":2014,
"color": "preto",
"price": 30,
"isAvailable": true
}'

# Listar veiculos

curl --location 'http://localhost:3000/vehicles?isAvailable=true'

# Atualizar veiculo

curl --location --request PATCH 'http://localhost:3000/vehicles' \
--header 'Content-Type: application/json' \
--data '{
"id": "9a0e5418-79c6-455b-b67a-583085a5fa2f",
"brand":"Honda",
"model": "City",
"year":2010,
"color": "red",
"price": 16,
"isAvailable": true
}'

# Criar ordem de compra

curl --location --request POST 'http://localhost:3000/orders' \

# Finalizar compra

curl --location 'http://localhost:3000/orders/finish' \
--header 'Content-Type: application/json' \

--data '{
"id":"e8486af0-1e40-4561-9daa-6842bed92217",
"paymentInfo": success

}'

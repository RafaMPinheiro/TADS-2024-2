# API de Exemplo
Documentação da API para o trabalho de WEB II

## Version: 1.0.0

### /

#### GET
##### Summary:

Instalação e Configuração do Express.js

##### Description:

Configuração inicial do Express.js.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Sucesso na configuração do Express.js |

### /rota-dinamica/{nome}

#### GET
##### Summary:

Rotas Dinâmicas

##### Description:

Retorna uma resposta baseada no nome dinâmico fornecido na URL.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| nome | path | Nome dinâmico do usuário. | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Sucesso |

### /dados

#### GET
##### Summary:

Manipulação de Dados com Query Params

##### Description:

Retorna um usuário específico com base no ID fornecido ou todos os usuários se nenhum ID for especificado.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | query | ID do usuário a ser retornado. | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Usuário(s) retornado(s) com sucesso |
| 404 | Usuário não encontrado |

#### POST
##### Summary:

Receber Dados com POST

##### Description:

Recebe dados via POST e retorna o corpo enviado junto com um `id` gerado.

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Dados recebidos com sucesso e `id` gerado |
| 400 | Erro na requisição - Falta de dados obrigatórios |

# AgroRisk

Produtores rurais de médio porte enfrentam dificuldades no planejamento da safra devido à forte dependência do clima, à falta de organização dos dados e à ausência de registros históricos confiáveis, o que resulta em baixa previsibilidade de produtividade, dificuldade no controle de custos e maior risco de perdas na produção.

O AgroRisk nasce para resolver esse problema: um sistema que centraliza e organiza os dados da propriedade rural, permitindo o registro de usuários, fazendas, safras e produções, além de fornecer uma base estruturada para análise de produtividade e apoio à tomada de decisão no campo.

## Estrutura do projeto
```text
AgroRisk/
├── frontend/
└── backend/
    ├── app.py
    ├── requirements.txt
    ├── .env.example
    ├── controllers/
    │   ├── usuario_controller.py
    │   ├── fazenda_controller.py
    │   ├── safra_controller.py
    │   └── producao_controller.py
    ├── models/
    │   ├── database.py
    │   ├── usuario_model.py
    │   ├── fazenda_model.py
    │   ├── safra_model.py
    │   └── producao_model.py
    ├── repositories/
    │   └── README.md
    └── database/
        └── create_database.sql
```
## Arquitetura usada
```text
Frontend
   ↓
Controller
   ↓
Repository
   ↓
Model
   ↓
Banco de Dados
```

Cada camada tem uma responsabilidade única: o Controller recebe a requisição HTTP e devolve a resposta, o Repository contém consultas mais avançadas do sistema, e o Model concentra o acesso ao banco (herdando de db.Model) e o CRUD básico das entidades.

## Funcionalidades implementadas (backend)

CRUD do sistema AgroRisk:

- Cadastrar usuário, fazenda, safra e produção
- Listar todos os registros
- Buscar registros por id
- Atualizar dados
- Excluir registros
- Como a produção é organizada


 ### A produção agrícola (principalmente silagem de milho) é registrada com base na fazenda e safra, permitindo controle histórico de produtividade e análise de desempenho ao longo do tempo.

## Como executar o backend

Entre na pasta do backend:

```bash
cd backend
```

Crie o ambiente virtual:

```bash
python -m venv .venv
```

Ative o ambiente virtual.

No Windows:

```bash
.venv\Scripts\activate
```

No Linux ou macOS:

```bash
source .venv/bin/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Crie o arquivo `.env` com base no exemplo:

```bash
cp .env.example .env
```
Execute o backend:
```bash
python app.py
```
A API ficará disponível em:
```text
http://127.0.0.1:5000
```
## Banco de dados

Por padrão, o projeto usa SQLite para facilitar o teste local:
```text
DATABASE_URL=sqlite:///agrorisk.db
```
```text
Para usar MySQL, execute o script:
```
```text
backend/database/create_database.sql
```
Depois altere o `.env` para:
```text
DATABASE_URL=mysql+pymysql://root:sua_senha@localhost:3306/agrorisk
```
## Rotas da API
Método | Rota | Descrição
|GET   |`/usuarios`|	Lista todos os usuários|
|GET   |`/usuarios/<id>`|	Busca usuário pelo id|
|POST	|`/usuarios`|	Cadastra usuário|
|PUT	|`/usuarios/<id>`|	Atualiza usuário|
|DELETE	|`/usuarios/<id>`|	Remove usuário|



## Exemplo de JSON para cadastrar
```json
{
  "nome": "Fazenda São João",
  "localizacao": "Interior",
  "area_hectares": 120
}
```
## Status atual do projeto

Esta etapa cobre apenas o backend: models, controllers, repositories e persistência no banco de dados.

A camada de frontend (telas de cadastro, listagem, edição e exclusão consumindo essas rotas) faz parte da próxima etapa do trabalho.
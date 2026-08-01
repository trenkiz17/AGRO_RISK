# AgroRisk

Pequenos e médios produtores rurais enfrentam dificuldades para centralizar e organizar as informações das suas propriedades, safras e produções, o que dificulta o acompanhamento da produtividade, o planejamento agrícola e a tomada de decisões.

O **AgroRisk** foi desenvolvido para resolver esse problema, oferecendo uma plataforma de gerenciamento rural que permite cadastrar usuários, propriedades e safras, reunindo todas as informações em um único sistema e facilitando o controle das atividades agrícolas.

## Estrutura do projeto

```text
AgroRisk/
├── frontend/
└── backend/
    ├── app.py
    ├── requirements.txt
    ├── .env.example
    ├── controllers/
    │   └── usuario_controller.py
    ├── models/
    │   ├── database.py
    │   └── usuario.py
    ├── repositories/
    │   └── README.md
    ├── services/
    │   ├── criar_usuario_service.py
    │   ├── listar_usuarios_service.py
    │   ├── buscar_usuario_por_id_service.py
    │   ├── atualizar_usuario_service.py
    │   └── deletar_usuario_service.py
    └── database/
        └── create_database.sql
```

## Arquitetura utilizada

```text
Frontend
   ↓
Controller
   ↓
Service
   ↓
Model
   ↓
Banco de Dados
```

Cada camada possui uma responsabilidade específica. O **Controller** recebe as requisições HTTP e retorna as respostas da API. O **Service** concentra as regras de negócio de cada funcionalidade. Já a **Model** representa as tabelas do banco de dados utilizando o SQLAlchemy (`db.Model`) e realiza as operações de persistência.

## Funcionalidades implementadas (backend)

CRUD de Usuários:

- Cadastrar um usuário;
- Listar todos os usuários cadastrados;
- Buscar um usuário pelo id;
- Atualizar os dados de um usuário;
- Excluir um usuário.

## Como executar o backend

Entre na pasta do backend:

```bash
cd backend
```

Crie o ambiente virtual:

```bash
python -m venv venv
```

Ative o ambiente virtual.

No Windows:

```bash
venv\Scripts\activate
```

No Linux ou macOS:

```bash
source venv/bin/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Crie o arquivo `.env` com base no exemplo:

```bash
cp .env.example .env
```

Configure a conexão com o banco de dados no arquivo `.env`.

Execute a aplicação:

```bash
python app.py
```

A API ficará disponível em:

```text
http://127.0.0.1:5000
```

## Banco de dados

O projeto utiliza **MySQL** como banco de dados.

Execute o script localizado em:

```text
backend/database/create_database.sql
```

Configure o arquivo `.env` com sua conexão:

```text
DATABASE_URL=mysql+pymysql://root:@localhost/agrorisk
```

Caso seu usuário possua senha:

```text
DATABASE_URL=mysql+pymysql://root:sua_senha@localhost/agrorisk
```

## Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/usuarios` | Lista todos os usuários |
| GET | `/usuarios/<id>` | Busca um usuário pelo id |
| POST | `/usuarios` | Cadastra um novo usuário |
| PUT | `/usuarios/<id>` | Atualiza os dados de um usuário |
| DELETE | `/usuarios/<id>` | Remove um usuário |

## Exemplo de JSON para cadastro

```json
{
    "nome": "Leonardo Silva",
    "email": "leonardo@email.com",
    "senha": "123456"
}
```

## Resposta esperada

```json
{
    "id": 1,
    "nome": "Leonardo Silva",
    "email": "leonardo@email.com",
    "senha": "123456"
}
```

## Tecnologias utilizadas

- Python
- Flask
- Flask SQLAlchemy
- SQLAlchemy
- Flask CORS
- MySQL
- PyMySQL
- Python Dotenv

## Status atual do projeto

Nesta etapa foi implementada a arquitetura do backend utilizando Flask e SQLAlchemy, seguindo o padrão Controller → Service → Model apresentado em aula.

Até o momento foi desenvolvido o CRUD completo da Model **Usuário**, incluindo cadastro, listagem, busca por id, atualização e exclusão de registros no banco de dados MySQL.

As próximas etapas do projeto contemplam a implementação das Models **Propriedade** e **Safra**, além da integração completa com o frontend do sistema AgroRisk.
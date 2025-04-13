# gymplanner-backend

## Sobre o Projeto
Este é um sistema web desenvolvido para facilitar o agendamento de horários de uso de máquinas e equipamentos em academias. O objetivo é organizar e otimizar a utilização dos equipamentos, oferecendo uma experiência prática e eficiente para os usuários.

## Tecnologias Utilizadas

Este projeto será desenvolvido utilizando as seguintes tecnologias:

- **Node.js** e **Express** para o backend.
- **HTML**, **CSS** e **JavaScript** para o frontend.
- **Banco de dados relacional** (PostgreSQL) para armazenamento de informações.

## Como executar o projeto com banco local

Siga os passos abaixo para clonar o repositório e executar o projeto com um banco de dados PostgreSQL local, sem usar Docker.

### Pré-requisitos

- Node.js (v20 ou superior recomendado)
- PostgreSQL instalado localmente (porta 5432, usuário `postgres`)

### Passos para rodar localmente

1. **Clone o repositório e acesse a pasta do projeto**:

2. **Instale as dependências**:

```bash
npm install
```

3. **Configure o arquivo `.env`** com os seguintes dados:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=[senha do seu postgresql localmente]
DB_NAME=postgres
```

4. **Execute o script de criação do banco de dados**:

Abra o terminal e rode o comando abaixo no PowerShell (ajuste o caminho se necessário):

```powershell
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d postgres -f init_db.sql
```

5. **Execute os scripts de hash de senha**:

```bash
node scripts/hash_admin_password.js
node scripts/hash_testuser_password.js
```

6. **Inicie o servidor**:

```bash
npm start
```

7. **Execute os testes (opcional)**:

```bash
npx mocha
```

---

Com isso, o sistema estará rodando localmente com um banco de dados PostgreSQL real.

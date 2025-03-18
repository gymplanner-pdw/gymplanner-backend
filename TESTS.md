# Documentação de Testes

## Introdução
Este documento descreve a implementação dos testes para a API do GymPlanner, utilizando Mocha e Chai para testes de unidade e integração. O objetivo dos testes é garantir que os endpoints funcionem corretamente, validando diferentes cenários e respostas esperadas.

---

## Configuração do Ambiente de Testes

1. **Instalação das Dependências**  
   Certifique-se de que as dependências de testes estejam instaladas no projeto. Caso não estejam, execute o seguinte comando:

   ```sh
   npm install --save-dev mocha chai chai-http nyc
   ```

2. **Estrutura de Diretórios**  
   A estrutura dos testes está organizada da seguinte forma:

   ```
   projeto/
   ├── src/
   ├── test/
   │   ├── agendamento.spec.js
   │   ├── exercicio.spec.js
   │   ├── machine.spec.js
   │   ├── treino.spec.js
   │   ├── user.spec.js
   ├── package.json
   ├── ...
   ```

---

## Testes Implementados

Abaixo está a lista de testes implementados, categorizados por entidade:

| Categoria       | Método | Endpoint                        | Descrição |
|---------------|--------|--------------------------------|-----------|
| Agendamento  | GET    | /agendamentos                 | Retorna a lista de agendamentos |
| Agendamento  | POST   | /agendamentos                 | Cria um novo agendamento |
| Exercício    | GET    | /exercicios                   | Retorna a lista de exercícios |
| Exercício    | POST   | /exercicios                   | Cria um novo exercício |
| Máquina      | GET    | /machines/nome/:nome          | Busca uma máquina pelo nome |
| Máquina      | GET    | /machines/nome/:nome          | Retorna erro para máquina inexistente |
| Treino       | GET    | /treinos                      | Retorna a lista de treinos |
| Treino       | POST   | /treinos                      | Cria um novo treino |
| Usuário      | POST   | /users                        | Cria um usuário válido |
| Usuário      | GET    | /users/nome/:nome             | Busca um usuário pelo nome |
| Usuário      | GET    | /users/nome/:nome             | Retorna erro para usuário inexistente |

---

## Relatório de Cobertura de Testes

Abaixo está o relatório de cobertura de testes gerado pelo `nyc`:

```
---------------------------|---------|----------|---------|---------|-----------------------------------------------------
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------------|---------|----------|---------|---------|-----------------------------------------------------
All files                  |   26.78 |     7.49 |      10 |   27.12 |
 src                       |   96.29 |    58.33 |      50 |   96.29 |
  app.js                   |   95.65 |      100 |      50 |   95.65 | 24
  database.js              |     100 |       50 |     100 |     100 | 5-9
 src/config                |     100 |      100 |     100 |     100 |
  swaggerConfig.js         |     100 |      100 |     100 |     100 |
 src/controllers           |   15.11 |     8.69 |    3.33 |   15.21 |
  agendamentoController.js |   10.71 |        0 |       0 |   10.71 | 4-12,18-33,39-60,66-82,88-103
  exercicioController.js   |   12.72 |        0 |       0 |   12.72 | 6-10,16-26,32-56,62-81,87-105
  machineController.js     |   11.32 |        0 |       0 |   11.32 | 4-8,13-23,28-53,58-75,80-96
  treinoController.js      |   12.67 |        0 |       0 |   12.85 | 6-11,17-25,31-36,42-53,59-71,77-88,94-127
  userController.js        |      25 |    24.61 |   14.28 |   25.33 | 13,17,21,25,30,34,42-63,69-77,82-97,102-123,128-148
---------------------------|---------|----------|---------|---------|-----------------------------------------------------
```

---

## Problemas Atuais

1. **Autenticação Bloqueando Testes**  
   - Muitos testes falham devido a autenticação exigida para acessar os endpoints. Precisamos criar um mock de autenticação para os testes.

2. **Dados Inexistentes no Banco de Dados**  
   - Alguns testes falham porque os dados requisitados não existem. Precisamos garantir que os dados de teste sejam inseridos antes da execução dos testes.

3. **Cobertura Baixa em Alguns Módulos**  
   - Os controllers e services têm baixa cobertura. Precisamos adicionar mais testes unitários para aumentar essa cobertura.

---

## Próximos Passos

1. **Implementar Mock de Autenticação**  
   - Criar um middleware de mock para permitir testes sem autenticação real.

2. **Criar Seeders para Testes**  
   - Criar um script que popula o banco de testes com dados iniciais antes da execução dos testes.

3. **Aumentar Cobertura**  
   - Adicionar mais testes unitários nos controllers e services para atingir pelo menos 80% de cobertura.

---

## Executando os Testes

Para rodar os testes, utilize:

```sh
npm test
```

Para rodar os testes com relatório de cobertura:

```sh
npm run coverage
```

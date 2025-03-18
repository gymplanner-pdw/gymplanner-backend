# Documentação de Testes

## Introdução
Este documento descreve a implementação dos testes para a API do GymPlanner, utilizando Mocha e Chai para testes de unidade e integração. O objetivo dos testes é garantir que os endpoints funcionem corretamente, validando diferentes cenários e respostas esperadas.

---

## Configuração do Ambiente de Testes

1. **Instalação das Dependências**  
   Certifique-se de que as dependências de testes estejam instaladas no projeto. Caso não estejam, execute o seguinte comando:

   ```sh
   npm install --save-dev mocha chai chai-http
   ```

2. **Estrutura de Diretórios**  
   Os arquivos de teste estão organizados dentro do diretório `test/` seguindo a estrutura abaixo:

   ```
   test/
   │── agendamento.spec.js
   │── exercicio.spec.js
   │── machine.spec.js
   │── treino.spec.js
   └── user.spec.js
   ```

   Cada arquivo de teste é responsável por validar os endpoints relacionados à sua respectiva entidade.

---

## Execução dos Testes

Para rodar os testes, utilize o seguinte comando:

```sh
npm test
```

Isso executará todos os testes dentro do diretório `test/`. Caso deseje rodar um teste específico, utilize:

```sh
npx mocha test/user.spec.js
```

---

## Descrição dos Testes Implementados

### **1. Testes de Usuário (`user.spec.js`)**
**Objetivo:** Testar a criação e recuperação de usuários na API.

**Casos de Teste Implementados:**
- `POST /users` - Criar um usuário válido (esperado: `201 Created`).
- `POST /users` - Criar um usuário sem nome (esperado: `400 Bad Request`).
- `GET /users/nome/:nome` - Buscar um usuário existente (esperado: `200 OK`).
- `GET /users/nome/:nome` - Buscar um usuário inexistente (esperado: `404 Not Found`).

### **2. Testes de Máquinas (`machine.spec.js`)**
**Objetivo:** Validar a recuperação de máquinas cadastradas.

**Casos de Teste Implementados:**
- `GET /machines/nome/:nome` - Buscar uma máquina pelo nome (esperado: `200 OK`).
- `GET /machines/nome/:nome` - Buscar uma máquina inexistente (esperado: `404 Not Found`).

### **3. Testes de Treinos (`treino.spec.js`)**
**Objetivo:** Verificar o correto funcionamento da criação e recuperação de treinos.

**Casos de Teste Implementados:**
- `GET /treinos` - Recuperar lista de treinos (esperado: `200 OK`).
- `POST /treinos` - Criar um novo treino (esperado: `201 Created`).

### **4. Testes de Exercícios (`exercicio.spec.js`)**
**Objetivo:** Validar a manipulação de exercícios dentro de treinos.

**Casos de Teste Implementados:**
- `GET /exercicios` - Recuperar lista de exercícios (esperado: `200 OK`).
- `POST /exercicios` - Criar um novo exercício (esperado: `201 Created`).

### **5. Testes de Agendamentos (`agendamento.spec.js`)**
**Objetivo:** Testar a criação e recuperação de agendamentos.

**Casos de Teste Implementados:**
- `GET /agendamentos` - Recuperar lista de agendamentos (esperado: `200 OK`).
- `POST /agendamentos` - Criar um novo agendamento (esperado: `201 Created`).

---

## Problemas Conhecidos e Próximos Passos

### **1. Problemas com Autenticação**
Os testes falham devido a problemas com autenticação (`403 Forbidden`). Para corrigir:
- **Verificar a geração de tokens JWT**: As requisições devem ser autenticadas corretamente antes de acessar rotas protegidas.
- **Criar usuários de teste**: Usuários administradores e padrões precisam ser criados antes da execução dos testes.
- **Revisar middleware de autenticação**: Alguns testes podem necessitar de ajustes nas permissões de acesso.

### **2. Ajustes nos Dados de Teste**
Os testes podem falhar devido à ausência de dados esperados no banco de dados. Para corrigir:
- **Criar scripts de seed** para popular o banco antes dos testes.
- **Garantir rollback após os testes** para evitar inconsistências.

### **3. Melhorias Futuras**
- Implementação de testes adicionais para os endpoints `PUT` e `DELETE`.
- Automação dos testes no CI/CD utilizando GitHub Actions.
- Melhor cobertura de testes para validações de entrada.

Após a correção dos problemas acima, os testes devem passar sem erros e garantir a estabilidade da API.

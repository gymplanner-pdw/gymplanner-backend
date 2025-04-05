const chai = require("chai");
const server = require("../src/app");

let adminToken, userToken;

const setupAuthTokens = () => {
  return new Promise((resolve, reject) => {
    // Login do admin
    chai.request(server)
      .post("/users/login")
      .send({ nome: "admin", senha: "admin123" })
      .end((err, res) => {
        if (!err && res.body.token) {
          adminToken = res.body.token;
          return loginOrRegisterTestUser();
        }

        // Se falhou login, tenta registro
        chai.request(server)
          .post("/users/register")
          .send({ nome: "admin", senha: "admin123", tipo_usuario: "admin" })
          .end((err2, res2) => {
            if (err2 || !res2.body.token) {
              console.error("Erro ao registrar admin:", err2?.message, res2?.body);
              return reject(new Error("Falha ao registrar usuário admin"));
            }
            adminToken = res2.body.token;
            loginOrRegisterTestUser();
          });
      });

    // Função para login ou registro do testuser
    function loginOrRegisterTestUser() {
      chai.request(server)
        .post("/users/login")
        .send({ nome: "testuser", senha: "senha123" })
        .end((err, res) => {
          if (!err && res.body.token) {
            userToken = res.body.token;
            return resolve({ adminToken, userToken });
          }

          // Se falhou login, tenta registro
          chai.request(server)
            .post("/users/register")
            .send({ nome: "testuser", senha: "senha123" })
            .end((err2, res2) => {
              if (err2 || !res2.body.token) {
                console.error("Erro ao registrar testuser:", err2?.message, res2?.body);
                return reject(new Error("Falha ao registrar usuário testuser"));
              }
              userToken = res2.body.token;
              resolve({ adminToken, userToken });
            });
        });
    }
  });
};

module.exports = setupAuthTokens;

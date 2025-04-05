const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/app");
const { expect } = chai;
const setupAuthTokens = require("./authHelper");

chai.use(chaiHttp);

let userToken;

describe("Exercício API", () => {
  before(async () => {
    const tokens = await setupAuthTokens();
    userToken = tokens.userToken;
  });

  describe("GET /exercicios", () => {
    it("Deve retornar a lista de exercícios", (done) => {
      chai.request(server)
        .get("/exercicios")
        .set("Authorization", `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });

  describe("POST /exercicios", () => {
    it("Deve criar um novo exercício", (done) => {
      chai.request(server)
        .post("/exercicios")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          nome: "Supino Reto",
          id_maquina: 1,
          repeticoes: 10,
          peso: 50,
          id_treino: 1
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });
});

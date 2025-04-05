const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/app");
const { expect } = chai;
const setupAuthTokens = require("./authHelper");

chai.use(chaiHttp);

let userToken;

describe("Agendamento API", () => {
  before(async () => {
    const tokens = await setupAuthTokens();
    userToken = tokens.userToken;
  });

  describe("GET /agendamentos", () => {
    it("Deve retornar a lista de agendamentos", (done) => {
      chai.request(server)
        .get("/agendamentos")
        .set("Authorization", `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });

  describe("POST /agendamentos", () => {
    it("Deve criar um novo agendamento", (done) => {
      chai.request(server)
        .post("/agendamentos")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          id_maquina: 1,
          data_inicio: "2025-04-01T10:00:00Z",
          data_fim: "2025-04-01T10:10:00Z"
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });
});

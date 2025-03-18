const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/app");
const { expect } = chai;

chai.use(chaiHttp);

let authToken;

describe("Treino API", () => {

    before((done) => {
        chai.request(server)
            .post("/users/register")
            .send({ nome: "testuser", senha: "123456" })
            .end((err, res) => {
                if (!err && res.body.token) {
                    authToken = res.body.token;
                }
                done();
            });
    });

    describe("GET /treinos", () => {
        it("Deve retornar a lista de treinos", (done) => {
            chai.request(server)
                .get("/treinos")
                .set("Authorization", `Bearer ${authToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an("array");
                    done();
                });
        });
    });

    describe("POST /treinos", () => {
        it("Deve criar um novo treino", (done) => {
            chai.request(server)
                .post("/treinos")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    nome: "Treino de Força",
                    data_inicio: "2025-04-01",
                    data_fim: "2025-04-30",
                    duracao: 60
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property("message");
                    done();
                });
        });
    });
});

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/app");
const { expect } = chai;

chai.use(chaiHttp);

let authToken;

describe("Agendamento API", () => {

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

    describe("GET /agendamentos", () => {
        it("Deve retornar a lista de agendamentos", (done) => {
            chai.request(server)
                .get("/agendamentos")
                .set("Authorization", `Bearer ${authToken}`)
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
                .set("Authorization", `Bearer ${authToken}`)
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

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/app");
const { expect } = chai;

chai.use(chaiHttp);

let authToken;

describe("Machine API", () => {

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

    describe("GET /machines/nome/:nome", () => {
        it("Deve buscar uma máquina pelo nome", (done) => {
            chai.request(server)
                .get("/machines/nome/supino")
                .set("Authorization", `Bearer ${authToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("id");
                    expect(res.body.nome).to.equal("supino");
                    done();
                });
        });

        it("Deve retornar erro para máquina inexistente", (done) => {
            chai.request(server)
                .get("/machines/nome/nao_existe")
                .set("Authorization", `Bearer ${authToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property("error");
                    done();
                });
        });
    });
});

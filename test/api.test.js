const resetDatabase = require('./resetDB');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../src/app');

let tokenAdmin;
let tokenUser;
let idUsuario;
let idAdmin;
let idMaquina;
let idAgendamento;

describe('API GymPlanner', () => {

    before(async () => {
        await resetDatabase();
      });

  // ------------------ SETUP ADMIN ------------------
  it('Deve registrar um novo administrador', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ nome: 'admin', senha: 'admin123', tipo_usuario: 'admin' });

    expect([201, 403]).to.include(res.status);
    // Pode dar 403 caso não tenha token para criar admin
  });

  it('Deve autenticar o administrador', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ nome: 'admin', senha: 'admin123' });

    expect(res.status).to.equal(200);
    tokenAdmin = res.body.token;
  });

  // ------------------ USUÁRIO COMUM ------------------
  it('Deve registrar um novo usuário comum', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ nome: 'testeuser', senha: '123456' });

    expect(res.status).to.equal(201);
    expect(res.body.usuario).to.have.property('id');
    idUsuario = res.body.usuario.id;
  });

  it('Deve autenticar o usuário', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({ nome: 'testeuser', senha: '123456' });

    expect(res.status).to.equal(200);
    tokenUser = res.body.token;
  });

  it('Não deve registrar usuário com nome curto', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ nome: 'a', senha: '123456' });

    expect(res.status).to.equal(400);
  });

  // ------------------ MÁQUINAS ------------------
  it('Admin deve criar uma nova máquina', async () => {
    const res = await request(app)
      .post('/machines')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nome: 'Supino Reto',
        grupo_muscular: 'Peito',
        status: 'disponivel'
      });

    expect(res.status).to.equal(201);
    idMaquina = res.body.id;
  });

  it('Usuário deve listar máquinas', async () => {
    const res = await request(app)
      .get('/machines')
      .set('Authorization', `Bearer ${tokenUser}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('Usuário deve visualizar máquina específica', async () => {
    const res = await request(app)
      .get(`/machines/${idMaquina}`)
      .set('Authorization', `Bearer ${tokenUser}`);

    expect(res.status).to.equal(200);
  });

  it('Deve retornar 404 para máquina inexistente', async () => {
    const res = await request(app)
      .get('/machines/99999')
      .set('Authorization', `Bearer ${tokenUser}`);

    expect(res.status).to.equal(404);
  });

  // ------------------ AGENDAMENTOS ------------------
  it('Usuário deve criar um novo agendamento', async () => {
    const now = new Date();
    const inicio = new Date(now.getTime() + 5 * 60000);
    const fim = new Date(inicio.getTime() + 5 * 60000);

    const res = await request(app)
      .post('/agendamentos')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        id_maquina: idMaquina,
        data_inicio: inicio.toISOString(),
        data_fim: fim.toISOString()
      });

    expect(res.status).to.equal(201);
    idAgendamento = res.body.id;
  });

  it('Usuário deve listar agendamentos', async () => {
    const res = await request(app)
      .get('/agendamentos')
      .set('Authorization', `Bearer ${tokenUser}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('Usuário deve consultar agendamento por ID', async () => {
    const res = await request(app)
      .get(`/agendamentos/${idAgendamento}`)
      .set('Authorization', `Bearer ${tokenUser}`);

    expect(res.status).to.equal(200);
  });

  it('Não deve criar agendamento com duração > 10 minutos', async () => {
    const now = new Date();
    const inicio = new Date(now.getTime() + 60 * 60000);
    const fim = new Date(inicio.getTime() + 11 * 60000);

    const res = await request(app)
      .post('/agendamentos')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        id_maquina: idMaquina,
        data_inicio: inicio.toISOString(),
        data_fim: fim.toISOString()
      });

    expect(res.status).to.equal(400);
  });

  it('Usuário deve deletar seu agendamento', async () => {
    const res = await request(app)
      .delete(`/agendamentos/${idAgendamento}`)
      .set('Authorization', `Bearer ${tokenUser}`);

    expect(res.status).to.equal(200);
  });

});

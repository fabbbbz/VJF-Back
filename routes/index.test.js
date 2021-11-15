var app = require("../app")
var request = require("supertest")
const mongoose = require('mongoose')
require('../config/connexion')

test("Get Infos from User", async () => {
  await request(app)
    .get("/users/me/123")
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => {
      expect(response.body.result).toBe('success')
    });
});

test("Get Infos from Bad User", async () => {
  await request(app)
    .get("/users/me/baduser")
    .expect('Content-Type', /json/)
    .expect(400)
    .then((response) => {
      expect(response.body.result).toBe(false)
    });
});

test("Test - SignIn", async () => {
  await request(app).post('/users/sign-in')
    .send({ emailFromFront: 'fab@fab', passwordFromFront: "Fab" })
    .expect(200)
    .then((response) => {
      expect(response.body.token).toBe('123')
    });
});

test("Test if App is up", async () => {
  await request(app)
    .get("/testapp")
    .expect(200)
    .then((response) => {
      expect(response.body.version).toBe('0.1')
      expect(response.body.result).toBe('success')
      expect(response.body.appname).toBe("Vite Jai Faim!!")
    });
});

afterAll(() => { mongoose.connection.close(); });

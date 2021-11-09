var app = require("../app")
var request = require("supertest")

test("Test if App is up", async () => {
  await request(app)
    .get("/testapp")
    .expect(200)
    .then((response) => {
      expect(response.body.version).toBe('0.1')
      expect(response.body.result).toBe('success')
      expect(response.body.appname).toBe("Vite Jai Faim!!")
    })
})

test("Get user info", async () => {
  await request(app)
    .get('/orders/recap/123')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200);
}, 30000);

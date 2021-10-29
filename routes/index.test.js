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

test("Test recap orders for a customer", async () => {
  await request(app)
    .get("/orders/recap/BHbxITgVrZnaS5OQHxYVgaIaROQHliZr")
    .expect(200)
    .then((response) => {
      expect(response.body.orderPrice).toBe(12)
      expect(response.body.result).toBe('success')
    })
}, 30000);
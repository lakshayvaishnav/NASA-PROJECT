const request = require("supertest");
const app = require("../../app");
const {mongoConnect, mongoDisconnet} = require('../../services/mongo')

describe('launches api',()=>{

  beforeAll(async()=>{
   await mongoConnect()
  })

  afterAll(async()=>{
    await mongoDisconnet()
  })

  describe("Test get launches", () => {
    test("should respond with 200 success", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
  
  describe("Test post /launch", () => {
    const completeLaunchData = {
      mission: "uss enterprise",
      rocket: "jaadu",
      target: "pluto",
      launchDate: "january 24, 2080",
    };
  
    const launchDataWithouDate = {
      mission: "uss enterprise",
      rocket: "jaadu",
      target: "pluto",
    };
  
    const launchDataWithInvalidDate = {
      mission: "uss enterprise",
      rocket: "jaadu",
      target: "pluto",
      launchDate: "kabootar",
    };
  
    test("should respond with 201 created", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/);
      expect(201);
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
  
      expect(response.body).toMatchObject(launchDataWithouDate);
    });
    test("should catch missing require properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithouDate)
        .expect("Content-Type", /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: "missing required launch property",
      });
    });
    test("should also catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: "your date is not valid",
      });
    });
  });
  

})


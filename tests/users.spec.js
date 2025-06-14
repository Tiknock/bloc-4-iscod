const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const User = require("../api/users/users.model");
const usersService = require("../api/users/users.service");

describe("tester API users", () => {
  let token;
  const USER_ID = new mongoose.Types.ObjectId();
  const MOCK_USER = {
    _id: USER_ID,
    name: "ana",
    email: "nfegeg@gmail.com",
    password: "azertyuiop",
    role: "admin"
  };
  const MOCK_DATA = [MOCK_USER];
  const MOCK_DATA_CREATED = {
    name: "test",
    email: "test@test.net",
    password: "azertyuiop",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID.toString(), role: "admin" }, config.secretJwtToken);
    // Mock du modèle User pour findById
    mockingoose(User).toReturn(MOCK_USER, "findById");
    // Mock du modèle User pour find
    mockingoose(User).toReturn(MOCK_DATA, "find");
    // Mock du modèle User pour save
    mockingoose(User).toReturn(MOCK_DATA_CREATED, "save");
    // Mock du service utilisateur
    jest.spyOn(usersService, "get").mockResolvedValue(MOCK_USER);
  });

  test("[Users] Get All", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("[Users] Create User", async () => {
    const res = await request(app)
      .post("/api/users")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(MOCK_DATA_CREATED.name);
  });

  test("Est-ce userService.getAll", async () => {
    const spy = jest
      .spyOn(usersService, "getAll")
      .mockImplementation(() => MOCK_DATA);
    await request(app).get("/api/users").set("x-access-token", token);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockingoose.resetAll();
  });
});

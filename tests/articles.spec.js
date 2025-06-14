const request = require("supertest");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const mongoose = require("mongoose");

const Article = require("../api/articles/articles.schema");
const usersService = require("../api/users/users.service");

const { app } = require("../server");

describe("tester API articles", () => {
  let token;
  const USER_ID = new mongoose.Types.ObjectId();
  const ARTICLE_ID = new mongoose.Types.ObjectId();
  const MOCK_USER = {
    _id: USER_ID,
    name: "Test User",
    email: "test@test.com",
    role: "admin"
  };
  const MOCK_DATA_CREATED = {
    title: "New Article",
    content: "New Content",
    status: "draft"
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID.toString(), role: "admin" }, config.secretJwtToken);
    
    // Mock du service utilisateur pour l'authentification
    jest.spyOn(usersService, "get").mockResolvedValue(MOCK_USER);
    
    const mockArticleData = {
      _id: new mongoose.Types.ObjectId(),
      ...MOCK_DATA_CREATED,
      user: USER_ID
    };
    
    // Approche hybride : mock direct pour create, mockingoose pour le reste
    jest.spyOn(Article, 'create').mockResolvedValue(mockArticleData);
    
    // mockingoose pour update et delete
    mockingoose(Article).toReturn({
      _id: ARTICLE_ID,
      title: "Updated Title",
      content: "Test Content",
      user: USER_ID,
      status: "draft"
    }, 'findOneAndUpdate');
    
    mockingoose(Article).toReturn({
      _id: ARTICLE_ID,
      title: "Test Article",
      content: "Test Content",
      user: USER_ID,
      status: "draft"
    }, 'findOneAndDelete');
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    
    console.log("Response status:", res.status);
    console.log("Response body:", res.body);
    
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
  });

  test("[Articles] Update Article", async () => {
    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send({ title: "Updated Title" })
      .set("x-access-token", token);
    
    console.log("Update Response status:", res.status);
    console.log("Update Response body:", res.body);
    
    expect(res.status).toBe(200);
  });

  test("[Articles] Delete Article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", token);
    
    console.log("Delete Response status:", res.status);
    console.log("Delete Response body:", res.body);
    
    expect(res.status).toBe(200);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});


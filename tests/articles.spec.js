const { createArticle, updateArticle, deleteArticle } = require("../api/articles/articles.service");
const supertest = require("supertest");
const app = require("../server");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");

mockingoose.resetAll();
describe("Article", () => {
  it("should create an article", async () => {
    mockingoose(Article).toReturn({ _id: "1", title: "Test", content: "Test" });
    const article = await createArticle({ title: "Test", content: "Test" });
    expect(article).toBeDefined();
    supertest(app).post("/api/articles").send({ title: "Test", content: "Test" }).expect(201);
  });
});

describe("Article", () => {
  it("should update an article", async () => {
    mockingoose(Article).toReturn({ _id: "1", title: "Test", content: "Test" });
    const article = await updateArticle({ title: "Test", content: "Test" });
    expect(article).toBeDefined();
    supertest(app).put("/api/articles/1").send({ title: "Test", content: "Test" }).expect(200);
});
});

describe("Article", () => {
  it("should delete an article", async () => {
    mockingoose(Article).toReturn({ _id: "1", title: "Test", content: "Test" });
    const article = await deleteArticle({ title: "Test", content: "Test" });
    expect(article).toBeDefined();
    supertest(app).delete("/api/articles/1").expect(200);
  });
});


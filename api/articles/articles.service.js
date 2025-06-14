const Article = require("./articles.schema");

const createArticle = async (articleData) => {
  const article = await Article.create(articleData);
  return article;
};

const updateArticle = async (id, articleData) => {
  const article = await Article.findByIdAndUpdate(id, articleData, { new: true });
  return article;
};

const deleteArticle = async (id) => {
  const article = await Article.findByIdAndDelete(id);
  return article;
};

const getArticlesByUserId = async (userId) => {
  const articles = await Article.find({ user: userId }).populate('user', '-password');
  return articles;
};

module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByUserId
};

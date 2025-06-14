const Article = require("./articles.schema");
const NotFoundError = require("../../errors/not-found");

const createArticle = async (articleData) => {
  try {
    const article = await Article.create(articleData);
    return article;
  } catch (error) {
    throw error;
  }
};

const updateArticle = async (id, articleData) => {
  try {
    const article = await Article.findByIdAndUpdate(id, articleData, { new: true });
    if (!article) {
      throw new NotFoundError("Article non trouvé");
    }
    return article;
  } catch (error) {
    throw error;
  }
};

const deleteArticle = async (id) => {
  try {
    const article = await Article.findByIdAndDelete(id);
    if (!article) {
      throw new NotFoundError("Article non trouvé");
    }
    return article;
  } catch (error) {
    throw error;
  }
};

const getArticlesByUserId = async (userId) => {
  try {
    const articles = await Article.find({ user: userId }).populate('user', '-password');
    return articles;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByUserId
};

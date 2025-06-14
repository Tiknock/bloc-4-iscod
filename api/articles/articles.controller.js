const { createArticle, updateArticle, deleteArticle, getArticlesByUserId } = require("./articles.service");
const ForbiddenError = require("../../errors/forbidden");
const NotFoundError = require("../../errors/not-found");

const createArticleController = async (req, res, next) => {
  try {
    const articleData = {
      ...req.body,
      user: req.user._id
    };
    const article = await createArticle(articleData);
    req.io.emit('article:created', article);
    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
};

const updateArticleController = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw new ForbiddenError("Vous n'avez pas les droits pour modifier un article");
    }
    const article = await updateArticle(req.params.id, req.body);
    if (!article) {
      throw new NotFoundError("Article non trouvé");
    }
    req.io.emit('article:updated', article);
    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

const deleteArticleController = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw new ForbiddenError("Vous n'avez pas les droits pour supprimer un article");
    }
    const article = await deleteArticle(req.params.id);
    if (!article) {
      throw new NotFoundError("Article non trouvé");
    }
    req.io.emit('article:deleted', { id: req.params.id });
    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

const getArticlesByUserController = async (req, res, next) => {
  try {
    const articles = await getArticlesByUserId(req.params.userId);
    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createArticleController,
  updateArticleController,
  deleteArticleController,
  getArticlesByUserController
};

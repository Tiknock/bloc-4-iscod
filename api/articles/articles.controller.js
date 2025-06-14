const { createArticle, updateArticle, deleteArticle, getArticlesByUserId } = require("./articles.service");

const createArticleController = async (req, res) => {
  const articleData = {
    ...req.body,
    user: req.user._id
  };
  const article = await createArticle(articleData);
  req.io.emit('article:created by ' + req.user.name, article);
  res.status(201).json(article);
};

const updateArticleController = async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ForbiddenError("Vous n'avez pas les droits pour modifier un article");
  }
  const article = await updateArticle(req.params.id, req.body);
  req.io.emit('article:updated', article);
  res.status(200).json(article);
};

const deleteArticleController = async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ForbiddenError("Vous n'avez pas les droits pour supprimer un article");
  }
  const article = await deleteArticle(req.params.id);
  req.io.emit('article:deleted', { id: req.params.id });
  res.status(200).json(article);
};

const getArticlesByUserController = async (req, res) => {
  const articles = await getArticlesByUserId(req.params.userId);
  res.status(200).json(articles);
};

module.exports = {
  createArticleController,
  updateArticleController,
  deleteArticleController,
  getArticlesByUserController
};

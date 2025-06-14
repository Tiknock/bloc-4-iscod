const router = require("express").Router();
const { createArticleController, updateArticleController, deleteArticleController } = require("./articles.controller");

router.post("/", createArticleController);
router.put("/:id", updateArticleController);
router.delete("/:id", deleteArticleController);

module.exports = router;
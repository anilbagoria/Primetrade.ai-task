const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createTaskValidator,
  updateTaskValidator,
} = require("../validators/taskValidator");

// All task routes require authentication
router.use(authMiddleware);

router.route("/").get(getTasks).post(createTaskValidator, createTask);

router
  .route("/:id")
  .get(getTaskById)
  .put(updateTaskValidator, updateTask)
  .delete(deleteTask);

module.exports = router;

const ValidationManager = require("../middleware/validation");
const UserController = require("../modules/user/controller");
const TaskController = require("../modules/task/controller");
const { createOrDeleteTaskPermission, updateTaskPermission } = require("../middleware/validatePermission");
const { userVerification } = require("../middleware/jwtVerification");

const route = (app) => {
  // user apis
  app.post(
    "/user",
    ValidationManager.validateCreateUser,
    UserController.createUser
  );
  
  app.post(
    "/login-user",
    ValidationManager.validateLoginUser,
    UserController.loginUser
  );

  // task apis
  app.post(
    "/task",
    ValidationManager.validateCreateTask,
    userVerification,
    createOrDeleteTaskPermission,
    TaskController.createTask
  );

  app.put(
    "/task/:taskId",
    ValidationManager.validateUpdateTask,
    userVerification,
    updateTaskPermission,
    TaskController.updateTask
  );

  app.delete(
    "/task/:taskId",
    ValidationManager.validateDeleteTask,
    userVerification,
    createOrDeleteTaskPermission,
    TaskController.deleteTask
  );

  app.get(
    "/task/:taskId",
    ValidationManager.validateGetTaskById,
    userVerification,
    TaskController.getTaskById
  );

  app.get(
    "/tasks",
    userVerification,
    TaskController.getTasks
  );

};

module.exports = route;

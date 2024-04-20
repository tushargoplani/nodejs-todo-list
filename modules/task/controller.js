const TaskModule = require("./manager");

class TaskController {
  createTask = async (req, res) => {
    try {
      const result = await TaskModule.createTask(req.body);
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 500).send({
        message: error.message || error,
        statusCode: error.statusCode || 500,
      });
    }
  };

  updateTask = async (req, res) => {
    try {
      const result = await TaskModule.updateTask({...req.params, ...req.body });
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 500).send({
        message: error.message || error,
        statusCode: error.statusCode || 500,
      });
    }
  };
  
  deleteTask = async (req, res) => {
    try {
      const result = await TaskModule.deleteTask({...req.params, ...req.body });
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 500).send({
        message: error.message || error,
        statusCode: error.statusCode || 500,
      });
    }
  };

  getTaskById = async (req, res) => {
    try {
      const result = await TaskModule.getTaskById(req.params);
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 500).send({
        message: error.message || error,
        statusCode: error.statusCode || 500,
      });
    }
  };

  getTasks = async (req, res) => {
    try {
      const result = await TaskModule.getTasks(req.query);
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 500).send({
        message: error.message || error,
        statusCode: error.statusCode || 500,
      });
    }
  };
};

module.exports = new TaskController();

const UserModule = require("./manager");

class UserController {
  createUser = async (req, res) => {
    try {
      const result = await UserModule.createUser(req.body);
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 500).send({
        message: error.message || error,
        statusCode: error.statusCode || 500,
      });
    }
  }

  loginUser = async (req, res) => {
    try {
      const result = await UserModule.loginUser(req.body);
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 500).send({
        message: error.message || error,
        statusCode: error.statusCode || 500,
      });
    }
  };
};

module.exports = new UserController();

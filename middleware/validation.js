const joi = require("@hapi/joi");

module.exports = {
  validateCreateUser: async (req, res, next) => {
    const schema = joi.object().keys({
      email: joi.string().required(),
      password: joi.string().min(8).max(20).required(),
      name: joi.string().required(),
    });
    await validate(schema, req.body, res, next);
  },
  validateLoginUser: async (req, res, next) => {
    const schema = joi.object().keys({
      email: joi.string().required(),
      password: joi.string().required(),
    });
    await validate(schema, req.body, res, next);
  },
  validateCreateTask: async (req, res, next) => {
    const schema = joi.object().keys({
      summary: joi.string().required(),
      description: joi.string().required(),
      assigneeId: joi.string().required(),
    });
    await validate(schema, req.body, res, next);
  },
  validateUpdateTask: async (req, res, next) => {
    const schema = joi.object().keys({
      taskId: joi.string().required(),
      status: joi.string().valid('OPEN', 'IN-PROGRESS', 'DONE'),
    });
    await validate(schema, {...req.params, ...req.body }, res, next);
  },
  validateDeleteTask: async (req, res, next) => {
    const schema = joi.object().keys({
      taskId: joi.string().required(),
    });
    await validate(schema, req.params, res, next);
  },
  validateGetTaskById: async (req, res, next) => {
    const schema = joi.object().keys({
      taskId: joi.string().required(),
    });
    await validate(schema, req.params, res, next);
  },
};

const validate = async (schema, reqData, res, next) => {
  try {
    await joi.validate(reqData, schema, {
      abortEarly: false,
      allowUnknown: true,
    });
    next();
  } catch (e) {
    const errors = e.details.map(({ path, message, value }) => ({
      path,
      message,
      value,
    }));
    res.status(400).format({
      json: () => {
        res.send({ message: "Invalid request", errors, code: 400 });
      },
    });
  }
};

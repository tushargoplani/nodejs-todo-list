const { ObjectId } = require("mongodb");
const RedisService = require("../service/redis");
const { apiFailureMessage, collectionNames } = require("../common/constants");

exports.createOrDeleteTaskPermission = async (req, res, next) => {
  try {
    let userResponse = await RedisService.getDataFromRedis(req.body.userId);
    if (!userResponse) {
      const userCollection = global.db.collection(
        collectionNames.userCollection
      );
      userResponse = await userCollection.findOne({
        _id: new ObjectId(req.body.userId),
      });

      if(userResponse) {
        await RedisService.setDataInRedis(
          String(req.body.userId),
          JSON.stringify(userResponse)
        );
      }
    }

    if (!userResponse || userResponse.role != "ADMIN")
      throw { message: apiFailureMessage.CREATE_TASK_PERMISSION_ERROR };

    next();
  } catch (err) {
    res.status(400).send({
      message: err.message || apiFailureMessage.SOMETHING_WENT_WRONG,
      statusCode: 400,
    });
  }
};

exports.updateTaskPermission = async (req, res, next) => {
  try {
    let userResponse = await RedisService.getDataFromRedis(req.body.userId);
    if (!userResponse) {
      const userCollection = global.db.collection(collectionNames.userCollection);
      userResponse = await userCollection.findOne({
        _id: new ObjectId(req.body.userId),
      });

      if(userResponse) {
        await RedisService.setDataInRedis(
          String(req.body.userId),
          JSON.stringify(userResponse)
        );
      }
    }

    let taskResponse = await RedisService.getDataFromRedis(req.params.taskId);
    if (!taskResponse) {
      const taskCollection = global.db.collection(collectionNames.taskCollection);
      taskResponse = await taskCollection.findOne({
        _id: new ObjectId(req.params.taskId),
      });

      if(taskResponse) {
        await RedisService.setDataInRedis(
          String(req.params.taskId),
          JSON.stringify(taskResponse)
        );
      }
    }

    if (
      !taskResponse ||
      (String(taskResponse.assigneeId) != req.body.userId &&
        userResponse.role != "ADMIN")
    )
      throw { message: apiFailureMessage.UPDATE_TASK_PERMISSION_ERROR };

    req.body.taskResponse = taskResponse;
    next();
  } catch (err) {
    res.status(400).send({
      message: err.message || apiFailureMessage.SOMETHING_WENT_WRONG,
      statusCode: 400,
    });
  }
};

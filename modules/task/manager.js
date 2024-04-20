const { ObjectId } = require("mongodb");
const {
  apiFailureMessage,
  apiSuccessMessage,
  collectionNames,
} = require("../../common/constants");
const RedisService = require("../../service/redis");

class TaskModule {
  async createTask(requestBody) {
    try {
      const taskCollection = global.db.collection(
        collectionNames.taskCollection
      );

      await this.checkUserExist({ _id: new ObjectId(requestBody.assigneeId) });

      const taskObject = {
        summary: requestBody.summary,
        description: requestBody.description,
        assigneeId: new ObjectId(requestBody.assigneeId),
        assignedBy: new ObjectId(requestBody.userId),
        status: "OPEN",
        addedOn: Date.now(),
        modifiedOn: Date.now(),
      };

      const result = await taskCollection.insertOne(taskObject);

      await RedisService.setDataInRedis(
        String(result.insertedId),
        JSON.stringify({ ...taskObject, _id: result.insertedId })
      );

      return {
        response: {
          _id: result.insertedId,
          ...taskObject,
        },
        message: apiSuccessMessage.TASK_CREATED_SUCCESSFULLY,
        statusCode: 200,
      };
    } catch (error) {
      throw {
        message: error.message || error,
        statusCode: error.code || 500,
      };
    }
  }

  async updateTask(requestData) {
    try {
      if (requestData.assigneeId)
        await this.checkUserExist({
          _id: new ObjectId(requestData.assigneeId),
        });

      const updateObj = {
        summary: requestData.summary || requestData.taskResponse.summary,
        description:
          requestData.description || requestData.taskResponse.description,
        assigneeId:
          new ObjectId(requestData.assigneeId) ||
          requestData.taskResponse.assigneeId,
        status: requestData.status || requestData.taskResponse.status,
        modifiedOn: Date.now(),
      };

      const taskCollection = global.db.collection(
        collectionNames.taskCollection
      );

      const updatedTask = await taskCollection.findOneAndUpdate(
        { _id: new ObjectId(requestData.taskId) },
        { $set: updateObj },
        {
          upsert: false,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      await RedisService.setDataInRedis(
        requestData.taskId,
        JSON.stringify({ ...updatedTask, ...updateObj })
      );

      return {
        response: { ...updatedTask, ...updateObj },
        statusCode: 200,
        message: apiSuccessMessage.TASK_UPDATED_SUCCESSFULLY,
      };
    } catch (error) {
      throw {
        message: error.message || error,
        statusCode: error.code || 500,
      };
    }
  }

  async deleteTask(requestData) {
    const taskCollection = global.db.collection(collectionNames.taskCollection);
    let taskResponse = await RedisService.getDataFromRedis(requestData.taskId);

    if (!taskResponse) {
      taskResponse = await taskCollection.findOne({
        _id: new ObjectId(requestData.taskId),
      });
      if (!taskResponse) throw { message: apiFailureMessage.TASK_NOT_FOUND };
    }

    const deleteTaskResponse = await taskCollection.deleteOne({
      _id: new ObjectId(taskResponse._id),
    });

    await RedisService.deleteDataFromRedis(requestData.taskId);

    return {
      response: deleteTaskResponse,
      message: apiSuccessMessage.TASK_DELETED_SUCCESSFULLY,
      statusCode: 200,
    };
  }

  async getTaskById(requestData) {
    let taskResponse = await RedisService.getDataFromRedis(requestData.taskId);
    if (!taskResponse) {
      const taskCollection = global.db.collection(
        collectionNames.taskCollection
      );
      taskResponse = await taskCollection.findOne({
        _id: new ObjectId(requestData.taskId),
      });

      if (!taskResponse) throw { message: apiFailureMessage.TASK_NOT_FOUND };

      await RedisService.setDataInRedis(
        requestData.taskId,
        JSON.stringify(taskResponse)
      );
    }

    return {
      response: taskResponse,
      message: apiSuccessMessage.TASK_DELETED_SUCCESSFULLY,
      statusCode: 200,
    };
  }

  async getTasks(requestData) {
    const taskCollection = global.db.collection(collectionNames.taskCollection);

    let matchObj = {};

    if (requestData.status) {
      matchObj.status = requestData.status;
    }

    if (requestData.assigneeId) {
      matchObj.assigneeId = new ObjectId(requestData.assigneeId);
    }

    if (requestData.seachString) {
      matchObj = {
        $or: [
          { summary: { $regex: requestData.seachString, $options: "i" } },
          { description: { $regex: requestData.seachString, $options: "i" } },
        ],
      };
    }

    const sortingKey = requestData.sortingKey || "addedOn";
    const sortingOrder = parseInt(requestData.sortingOrder) || -1;

    const query = [
      {
        $facet: {
          data: [
            { $match: matchObj },
            { $sort: { [sortingKey]: sortingOrder } },
            { $skip: parseInt(requestData.skip) || 0 },
            { $limit: parseInt(requestData.limit) || 10 },
          ],
          total: [
            { $match: matchObj },
            { $group: { _id: null, count: { $sum: 1 } } },
          ],
        },
      },
    ];

    const tasks = await taskCollection.aggregate(query).toArray();

    return {
      response: {
        data: tasks[0] && tasks[0].data,
        total:
          tasks[0] &&
          tasks[0].total &&
          tasks[0].total.length &&
          tasks[0].total[0].count,
      },
      message: apiSuccessMessage.TASKS_FETCHED_SUCCESSFULLY,
      statusCode: 200,
    };
  }

  async checkUserExist(findObj) {
    let assigneeResponse = await RedisService.getDataFromRedis(
      String(findObj._id)
    );
    if (!assigneeResponse) {
      const userCollection = global.db.collection(
        collectionNames.userCollection
      );
      assigneeResponse = await userCollection.findOne(findObj);
      if (!assigneeResponse)
        throw { message: apiFailureMessage.ASSIGNEE_NOT_FOUND, code: 404 };

      await RedisService.setDataInRedis(
        String(assigneeResponse._id),
        JSON.stringify(assigneeResponse)
      );
    }

    return assigneeResponse;
  }
}

module.exports = new TaskModule();

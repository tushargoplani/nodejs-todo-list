const {
  apiFailureMessage,
  apiSuccessMessage,
  collectionNames,
} = require("../../common/constants");
const RedisService = require("../../service/redis");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserModule {
  async createUser(requestBody) {
    try {
      const userCollection = global.db.collection(
        collectionNames.userCollection
      );
      const checkEmailExist = await userCollection.findOne({
        email: requestBody.email,
      });
      if (checkEmailExist)
        throw {
          message: apiFailureMessage.USER_ALREADY_EXISTS,
          code: 400,
        };

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(requestBody.password, salt);

      const userObject = {
        name: requestBody.name,
        email: requestBody.email,
        password: hashedPassword,
        role: requestBody.role,
        addedOn: Date.now(),
        modifiedOn: Date.now(),
      };

      const result = await userCollection.insertOne(userObject);
      const token = await this.generateToken(userObject);

      await RedisService.setDataInRedis(
        String(result.insertedId),
        JSON.stringify({ ...userObject, _id: result.insertedId })
      );

      return {
        response: {
          userId: result.insertedId,
          token,
          message: apiSuccessMessage.USER_SUCCESSFULLY_SIGNEDUP,
        },
        message: apiSuccessMessage.USER_SAVED_SUCCESSFULLY,
        statusCode: 200,
      };
    } catch (error) {
      throw {
        message: error.message || error,
        statusCode: error.code || 500,
      };
    }
  }

  async loginUser(requestBody) {
    try {
      let userResponse = await RedisService.getDataFromRedis(requestBody.email);
      if (!userResponse) {
        const userCollection = global.db.collection(
          collectionNames.userCollection
        );

        userResponse = await userCollection.findOne({
          email: requestBody.email,
        });

        if (!userResponse)
          throw {
            message: apiFailureMessage.USER_NOT_FOUND,
            code: 404,
          };

        await RedisService.setDataInRedis(
          userResponse.email,
          JSON.stringify(userResponse)
        );
      }

      const password = await bcrypt.compare(
        requestBody.password,
        userResponse.password
      );
      if (!password)
        throw {
          message: apiFailureMessage.INCORRECT_PASSWORD,
          code: 400,
        };

      const token = await this.generateToken(userResponse);

      return {
        userResponse: {
          ...userResponse,
          token,
        },
        message: apiSuccessMessage.USER_LOGGED_IN_SUCCESSFULLY,
        statusCode: 200,
      };
    } catch (error) {
      throw {
        message: error.message || error,
        statusCode: error.code || 500,
      };
    }
  }

  async generateToken(user) {
    return jwt.sign(
      {
        userId: String(user._id),
      },
      process.env.SECRET,
      {
        expiresIn: "7d",
      }
    );
  }
}

module.exports = new UserModule();

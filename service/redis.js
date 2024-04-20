const { createClient } = require("redis");
const { apiFailureMessage } = require("../common/constants");

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST_URL,
    port: process.env.REDIS_PORT,
  },
});

class RedisService {
  setDataInRedis = async (key, value) => {
    try {
      if (!key || !value)
        throw new Error(apiFailureMessage.KEY_AND_VALUE_ARE_REQUIRED);
      if (!client.isReady)
        await client.connect()
      const res = await client.set(key, value);
      return res;
    } catch (error) {
      throw error;
    }
  };

  getDataFromRedis = async (key) => {
    try {
      if (!key) throw new Error(apiFailureMessage.KEY_IS_REQUIRED);
      if (!client.isReady)
        await client.connect()
      let response = await client.get(key);
      if (response) response = JSON.parse(response);
      return response;
    } catch (error) {
      throw error;
    }
  };

  deleteDataFromRedis = async (key) => {
    try {
      if (!key) throw new Error(apiFailureMessage.KEY_IS_REQUIRED);
      if (!client.isReady)
        await client.connect()
      const response = await client.del(key);
      return response;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = new RedisService();

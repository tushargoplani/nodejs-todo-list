const { MongoClient } = require("mongodb");
require("dotenv").config();

exports.connectMongoDB = async () => {
  const client = new MongoClient(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("DB Connected Successfully");

    // Return the connected database
    return client.db(process.env.DB_NAME);
  } catch (error) {
    console.error("DB connection error:", error.message);
    throw error;
  }
};

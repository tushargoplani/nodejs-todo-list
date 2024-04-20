require('dotenv').config();
const express = require("express");
const route = require("./routes/index");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { connectMongoDB } = require("./dbConnection");
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.json());
route(app);

async function startServer() {
  try {
    // Connect to the database
    global.db = await connectMongoDB();
    // Start the server
    app.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });
  } catch (error) {
    console.error("Error: ", error);
  }
}

startServer();

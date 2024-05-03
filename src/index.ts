import app from "./app.js";
import checkEnvVars from "./helpers/check-env-var.js";
import mongoClient from "./repository/mongoDB/init-mongo.js";

const main = async () => {
  try {
    checkEnvVars();

    await mongoClient.connect();

    // todo: add redis

    const port = process.env["SERVICE_PORT"];
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

main();

import app from "./app.js";
import checkEnvVars from "./helpers/check-env-var.js";

const main = async () => {
  const port = process.env["SERVICE_PORT"];
  try {
    checkEnvVars();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

main();

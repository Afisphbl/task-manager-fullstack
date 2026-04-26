const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config({ path: "./config.env" });

const app = require("./app");

app.set("query parser", "extended");

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

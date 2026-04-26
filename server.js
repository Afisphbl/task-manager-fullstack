const dotenv = require("dotenv");
const app = require("./app");

const morgan = require("morgan");
const connectDB = require("./config/db");

dotenv.config({ path: "./config.env" });

const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === "development") app.use(morgan("dev"));

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

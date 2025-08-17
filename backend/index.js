import "./config/validateEnv.js";

import { config } from "dotenv";

import app from "./app.js";

// const app = express();
// ----- MIDDLEWARE -----
// app.use(cors());
// app.use(express.json());
// ----- ROUTES -----
// Root route
// app.get("/", (req, res) => {
//   res.json({ message: "API is running…" });
// });

config();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});

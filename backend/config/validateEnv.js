import { config } from "dotenv";

config(); // Load .env before anything else

const requiredEnv = [
  "MONGO_URI",
  "PORT",
  "JWT_PRIVATE_KEY_PATH",
  "JWT_PUBLIC_KEY_PATH",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} nahi milega toh kaam kaise chalega, bhai?`);
  }
});

// import createError from 'http-errors';
// import jwt from 'jsonwebtoken';

// import User from '../models/User.js';

// export default async function auth(req, _res, next) {
//   try {
//     const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
//     if (!token) throw createError(401, "No token provided");

//     const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, {
//       algorithms: ["RS256"],
//     });
//     const user = await User.findById(decoded.id).lean();
//     if (!user) throw createError(401, "Invalid token");

//     req.user = user; // { _id, role, baseId }
//     next();
//   } catch (err) {
//     next(createError(401, err.message));
//   }
// }

import fs from "fs";
import createError from "http-errors";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

// Load public key once at startup
let publicKey;
try {
  publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH, "utf8");
  // console.log("✅ Public key loaded for JWT verification");
} catch (err) {
  console.error("❌ Failed to load public key:", err.message);
  throw new Error("JWT_PUBLIC_KEY_PATH is invalid or missing");
}

export default async function auth(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // console.warn("⚠️ No Bearer token found in Authorization header");
      throw createError(401, "No token provided");
    }

    const token = authHeader.split(" ")[1];
    // console.log("🔍 Verifying token:", token.slice(0, 20) + "...");

    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    });
    // console.log("✅ Token decoded:", decoded);

    const user = await User.findById(decoded.id).lean();
    if (!user) {
      // console.warn("⚠️ No user found for decoded token ID:", decoded.id);
      throw createError(401, "Invalid token");
    }

    req.user = user; // Attach user to request
    // console.log(`🛡️ Authenticated user: ${user.name} (${user.role})`);
    next();
  } catch (err) {
    console.error("❌ Auth middleware error:", err.message);
    next(createError(401, err.message));
  }
}

import express from "express";
import cookieParser from "cookie-parser";
import { ENV } from "./lib/env.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import path from "path";
import { connectDB } from "./lib/db.js";
import cors from "cors";

const app = express();
const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

// Use CORS before routes
app.use(cors({
  origin: ENV.CLIENT_URL,
  credentials: true, // allows cookies or auth headers
}));

app.use(express.json());
app.use(cookieParser());

// Register routes after CORS
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Deployment setup
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
  connectDB();
});

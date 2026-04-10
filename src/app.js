import express from "express";
import cors from "cors";
import authrouter from "./routes/auth.routes.js";
import astrorouter from "./routes/astro.routes.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);
app.use(express.json());
// Global JSON error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, message: "Invalid JSON input or empty body" });
  }
  next();
});
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// Move your root route HERE so it's globally available
app.get("/", (req, res) => {
  res.send("Welcome to the authentication API");
});
app.use("/api/auth", authrouter);
app.use("/api/astro", astrorouter);

export default app;

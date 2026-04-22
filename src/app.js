import express from "express";
import cors from "cors";
import authrouter from "./routes/auth.routes.js";
import astrorouter from "./routes/astro.routes.js";
import cookieParser from "cookie-parser";
const app = express();
const AllowedOrigins=process.env.CORS_ORIGIN?process.env.CORS_ORIGIN.split(","):["https://astrologic-frontend.vercel.app","http://localhost:5173"];
app.use(
  cors({
    origin: AllowedOrigins,
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

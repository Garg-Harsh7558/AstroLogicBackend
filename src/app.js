import express from "express";
import cors from "cors";
import authrouter from "./routes/auth.routes.js";
import astrorouter from "./routes/astro.routes.js";
import cookieParser from "cookie-parser";
const app = express();
const defaultOrigins = ["https://astrologic-frontend.vercel.app", "http://localhost:5173"];
const envOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : [];
const AllowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])]; 

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (AllowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Origin not allowed by CORS:", origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'set-cookie']
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

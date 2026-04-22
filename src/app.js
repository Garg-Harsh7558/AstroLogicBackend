import express from "express";
import cors from "cors";
import authrouter from "./routes/auth.routes.js";
import astrorouter from "./routes/astro.routes.js";
import cookieParser from "cookie-parser";
const app = express();
const defaultOrigins = [
  "https://astrologic-frontend.vercel.app",
  "https://astrologic-frontend.vercel.app/",
  "http://localhost:5173",
  "http://localhost:5173/"
];
const envOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(",").map(o => o.trim()) 
  : [];
const AllowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])]; 

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const normalizedOrigin = origin.toLowerCase().trim();
      
      // Check if the origin is in our allowed list or is a vercel subdomain
      const isAllowed = AllowedOrigins.some(allowed => {
        if (allowed === "*") return true;
        const normalizedAllowed = allowed.toLowerCase().trim().replace(/\/$/, "");
        return normalizedOrigin === normalizedAllowed;
      }) || normalizedOrigin.endsWith('.vercel.app');

      if (isAllowed) {
        callback(null, true);
      } else {
        console.log("Origin not allowed by CORS:", origin);
        callback(null, false);
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'set-cookie', 'cookie']
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

// Minimal Express server for the backend API
// Usage:
//   - Dev:  npm run server  (or from backend: npm run dev)
//   - Env:  set PORT and HOST if needed; defaults are 3001 and 0.0.0.0
// Endpoints:
//   - GET /          → simple text to confirm API is running
//   - GET /health    → JSON health check
//   - 404 handler    → JSON for unknown routes
//   - 500 handler    → JSON for unhandled errors

import express from "express";
import cors from "cors";
import { env } from "node:process";

// Create and configure the application instance
const app = express();
app.use(cors());
app.use(express.json());

// Root endpoint to quickly verify the server is up
app.get("/", (_request, response) => {
  response.type("text/plain").send("API is running");
});

// Health check endpoint for uptime and probes
app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

// Not found handler (must be after defined routes)
app.use((_request, response) => {
  response.status(404).json({ error: "Not Found" });
});

// Centralized error handler to avoid leaking stack traces
// eslint-disable-next-line no-unused-vars -- Express error middleware requires 4 params
app.use((error, _request, response, _next) => {
  const isProduction = env.NODE_ENV === "production";
  const message = isProduction ? "Internal Server Error" : error?.message || "Internal Server Error";
  response.status(500).json({ error: message });
});

// Start the HTTP server
const PORT = Number(env.PORT) || 3001;
const HOST = env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  // Log a concise startup message with URL
  console.log(`Backend server listening at http://${HOST}:${PORT}`);
});



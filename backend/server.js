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
import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Create and configure the application instance
const app = express();
app.use(cors());
app.use(express.json());

// Resolve scripts directory (works with ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptsDir = path.join(__dirname, "scripts");

// Root endpoint to quickly verify the server is up
app.get("/", (_request, response) => {
  response.type("text/plain").send("API is running");
});

// Health check endpoint for uptime and probes
app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

// Execute PowerShell script that shows a MessageBox
app.get("/test-message", async (_request, response, next) => {
  try {
    const psScript = path.join(scriptsDir, "powershell", "test-message.ps1");
    execFile(
      "powershell.exe",
      [
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        psScript,
      ],
      { windowsHide: true },
      (error, stdout, stderr) => {
        if (error) {
          return response.status(200).json({ ok: false, stdout, stderr: stderr?.toString() || error.message });
        }
        response.status(200).json({ ok: true, stdout: stdout?.toString() || "" });
      }
    );
  } catch (error) {
    next(error);
  }
});

// Execute Batch script that opens a CMD window (non-blocking via 'start')
app.get("/test-bat", async (_request, response, next) => {
  try {
    const batScript = path.join(scriptsDir, "batch", "test-message.bat");
    // Use 'start' to open in a new window and return immediately
    execFile("cmd.exe", ["/c", "start", "", batScript], { windowsHide: false }, (error) => {
      if (error) {
        return response.status(200).json({ ok: false, stdout: "", stderr: error.message });
      }
      response.status(200).json({ ok: true, stdout: "" });
    });
  } catch (error) {
    next(error);
  }
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



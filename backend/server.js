// Minimal Express server for the backend API


import express from "express";
import cors from "cors";
import net from "node:net";
import { env } from "node:process";
import { execFile } from "node:child_process";
import { exec } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";

// Create and configure the application instance
const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger (method, path, status)
app.use((request, response, next) => {
  const start = Date.now();
  const { method, url } = request;
  response.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`[HTTP] ${method} ${url} → ${response.statusCode} (${ms}ms)`);
  });
  next();
});

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

// Debug: list all registered routes on the server
function collectRoutesFromLayer(layer, prefix = "") {
  const routes = [];
  if (layer.route && layer.route.path) {
    const methods = Object.keys(layer.route.methods || {}).filter(Boolean).map((m) => m.toUpperCase());
    routes.push({ path: prefix + layer.route.path, methods });
  } else if (layer.name === "router" && layer.handle && layer.handle.stack) {
    const newPrefix = prefix + (layer.regexp?.fast_slash ? "" : (layer.regexp?.source?.includes("^\\/bitlocker\\/?$") ? "/bitlocker" : ""));
    for (const sub of layer.handle.stack) {
      routes.push(...collectRoutesFromLayer(sub, newPrefix));
    }
  }
  return routes;
}

app.get("/__routes", (_request, response) => {
  try {
    const stack = app?._router?.stack || [];
    const routes = [];
    for (const layer of stack) {
      routes.push(...collectRoutesFromLayer(layer, ""));
    }
    response.status(200).json(routes);
  } catch (error) {
    response.status(500).json({ error: error?.message || "route dump error" });
  }
});

// Execute PowerShell script that shows a MessageBox
app.get("/test-message", async (_request, response) => {
  response.status(200).json({ ok: true, message: "Server ping ok" });
});

// Scripts launcher (Windows PowerShell + Linux Bash)
function launchScript(scriptName, openUi, isLinux = false) {
  if (isLinux) {
    const scriptPath = path.join(scriptsDir, "linux", "disks", scriptName);
    if (openUi) {
      try {
        execFile(
          "xterm",
          ["-e", "bash", scriptPath],
          { windowsHide: false },
          () => { /* started */ }
        );
      } catch { /* ignore UI start failures */ }
    }
    return new Promise((resolve) => {
      execFile(
        "bash",
        [scriptPath],
        { windowsHide: true },
        (_error, stdout) => {
          resolve({ ok: true, stdout: stdout?.toString() || "" });
        }
      );
    });
  } else {
    // Windows PowerShell
    const psScript = path.join(scriptsDir, "disks", "powershells", scriptName);
    if (openUi) {
      try {
        execFile(
          "cmd.exe",
          [
            "/c",
            "start",
            "",
            "powershell.exe",
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-NoExit",
            "-File",
            psScript,
          ],
          { windowsHide: false },
          () => { /* started */ }
        );
      } catch { /* ignore UI start failures */ }
    }
    return new Promise((resolve) => {
      execFile(
        "powershell.exe",
        ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", psScript],
        { windowsHide: true },
        (_error, stdout) => {
          resolve({ ok: true, stdout: stdout?.toString() || "" });
        }
      );
    });
  }
}

// Elevated admin: launch .bat that elevates PowerShell for BitLocker check
app.get("/disk/check-bitlocker-admin", async (_request, response, next) => {
  try {
    const batPath = path.join(scriptsDir, "disks", "batch", "check-bitlocker.bat");
    execFile("cmd.exe", ["/c", "start", "", batPath], { windowsHide: false }, (error) => {
      if (error) {
        return response.status(200).json({ ok: false, error: error.message });
      }
      response.status(200).json({ ok: true });
    });
  } catch (error) {
    next(error);
  }
});

app.get("/disk/bitlocker-off-admin", async (_request, response, next) => {
  try {
    const batPath = path.join(scriptsDir, "disks", "batch", "bitlocker-off.bat");
    execFile("cmd.exe", ["/c", "start", "", batPath], { windowsHide: false }, (error) => {
      if (error) {
        return response.status(200).json({ ok: false, error: error.message });
      }
      response.status(200).json({ ok: true });
    });
  } catch (error) {
    next(error);
  }
});

app.get("/disk/chkdsk", async (request, response, next) => {
  try {
    const ui = String(request?.query?.ui ?? "").toLowerCase();
    const isLinux = process.platform === "linux";
    const scriptName = isLinux ? "check-bitlocker.sh" : "chkdsk-drive.ps1";
    const result = await launchScript(scriptName, ui === "1" || ui === "true", isLinux);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

app.get("/disk/defrag", async (request, response, next) => {
  try {
    const ui = String(request?.query?.ui ?? "").toLowerCase();
    const isLinux = process.platform === "linux";
    const scriptName = isLinux ? "list-drives.sh" : "defrag-drive.ps1";
    const result = await launchScript(scriptName, ui === "1" || ui === "true", isLinux);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// DiskPart: format drive (interactive)
app.get("/disk/format", async (request, response, next) => {
  try {
    const ui = String(request?.query?.ui ?? "").toLowerCase();
    const isLinux = process.platform === "linux";
    const scriptName = isLinux ? "list-drives.sh" : "format-drive.ps1";
    const result = await launchScript(scriptName, ui === "1" || ui === "true", isLinux);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// DiskPart: format drive with admin elevation via .bat
app.get("/disk/format-admin", async (_request, response, next) => {
  try {
    const batPath = path.join(scriptsDir, "disks", "batch", "format-drive.bat");
    execFile("cmd.exe", ["/c", "start", "", batPath], { windowsHide: false }, (error) => {
      if (error) {
        return response.status(200).json({ ok: false, error: error.message });
      }
      response.status(200).json({ ok: true });
    });
  } catch (error) {
    next(error);
  }
});

// Execute Batch script that opens a CMD window (non-blocking via 'start')
app.get("/test-bat", async (_request, response) => {
  response.status(200).json({ ok: true, message: "No debug batch configured" });
});

// Réseau: lancer le gestionnaire DNS Cloudflare (nécessite admin)
app.get("/network/cloudflare-dns-admin", async (_request, response, next) => {
  try {
    const batPath = path.join(scriptsDir, "networks", "batch", "cloudflare-dns-manager.bat");
    execFile(
      "cmd.exe",
      ["/c", "start", "", batPath],
      { windowsHide: false },
      (error) => {
        if (error) {
          return response.status(200).json({ ok: false, error: error.message });
        }
        response.status(200).json({ ok: true });
      }
    );
  } catch (error) {
    next(error);
  }
});

// Applications: lancer le gestionnaire de paquets (Windows winget + Linux package manager)
app.get("/apps/winget-update-admin", async (_request, response, next) => {
  try {
    const isLinux = process.platform === "linux";
    
    if (isLinux) {
      // Linux: lancer le gestionnaire de paquets
      const scriptPath = path.join(scriptsDir, "linux", "applications", "package-update-manager.sh");
      execFile(
        "xterm",
        ["-e", "bash", scriptPath],
        { windowsHide: false },
        (error) => {
          if (error) {
            return response.status(200).json({ ok: false, error: error.message });
          }
          response.status(200).json({ ok: true });
        }
      );
    } else {
      // Windows: utiliser le lanceur winget
      const batPath = path.join(scriptsDir, "applications", "batch", "winget-update-admin.bat");
      execFile(
        "cmd.exe",
        ["/c", "start", "", batPath],
        { windowsHide: false },
        (error) => {
          if (error) {
            return response.status(200).json({ ok: false, error: error.message });
          }
          response.status(200).json({ ok: true });
        }
      );
    }
  } catch (error) {
    next(error);
  }
});

// Maintenance: outil tout-en-un (Windows + Linux)
app.get("/maintenance/tool-admin", async (_request, response, next) => {
  try {
    const isLinux = process.platform === "linux";
    
    if (isLinux) {
      // Linux: lancer l'outil de maintenance système
      const scriptPath = path.join(scriptsDir, "linux", "maintenance", "system-maintenance.sh");
      execFile(
        "xterm",
        ["-e", "bash", scriptPath],
        { windowsHide: false },
        (error) => {
          if (error) {
            return response.status(200).json({ ok: false, error: error.message });
          }
          response.status(200).json({ ok: true });
        }
      );
    } else {
      // Windows: utiliser l'outil de maintenance Windows
      const batPath = path.join(scriptsDir, "maintenance", "batch", "windows-maintenance-admin.bat");
      execFile(
        "cmd.exe",
        ["/c", "start", "", batPath],
        { windowsHide: false },
        (error) => {
          if (error) {
            return response.status(200).json({ ok: false, error: error.message });
          }
          response.status(200).json({ ok: true });
        }
      );
    }
  } catch (error) {
    next(error);
  }
});

// Systeme: basculer le menu contextuel classique Windows 11 (nécessite admin)
app.get("/system/context-menu-classic-admin", async (_request, response, next) => {
  try {
    // Utilise le lanceur qui force l'UAC puis exécute le toggle
    const batPath = path.join(scriptsDir, "systeme", "batch", "context-menu-classic-admin.bat");
    execFile(
      "cmd.exe",
      ["/c", "start", "", batPath],
      { windowsHide: false },
      (error) => {
        if (error) {
          return response.status(200).json({ ok: false, error: error.message });
        }
        response.status(200).json({ ok: true });
      }
    );
  } catch (error) {
    next(error);
  }
});

// BitLocker router mounted at /bitlocker
const bitlocker = Router();

bitlocker.get("/status", async (request, response, next) => {
  try {
    const wantUi = String(request?.query?.ui ?? "").toLowerCase();

    if (wantUi === "1" || wantUi === "true") {
      try {
        execFile(
          "cmd.exe",
          [
            "/c",
            "start",
            "",
            "powershell.exe",
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-NoExit",
            "-Command",
            "manage-bde -status",
          ],
          { windowsHide: false },
          () => { /* window started */ }
        );
      } catch { /* ignore UI start failures */ }
    }

    exec("manage-bde -status", { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        return response.status(200).json({ ok: false, stdout: stdout?.toString() || "", stderr: stderr?.toString() || error.message });
      }
      response.status(200).json({ ok: true, stdout: stdout?.toString() || "" });
    });
  } catch (error) {
    next(error);
  }
});

bitlocker.get("/status/:letter", async (request, response, next) => {
  try {
    const letter = String(request?.params?.letter || "").trim().toUpperCase();
    if (!/^[A-Z]$/.test(letter)) {
      return response.status(400).json({ ok: false, error: "Invalid drive letter" });
    }
    const wantUi = String(request?.query?.ui ?? "").toLowerCase();

    if (wantUi === "1" || wantUi === "true") {
      try {
        execFile(
          "cmd.exe",
          [
            "/c",
            "start",
            "",
            "powershell.exe",
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-NoExit",
            "-Command",
            `manage-bde -status ${letter}:`,
          ],
          { windowsHide: false },
          () => { /* window started */ }
        );
      } catch { /* ignore UI start failures */ }
    }

    exec(`manage-bde -status ${letter}:`, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        return response.status(200).json({ ok: false, stdout: stdout?.toString() || "", stderr: stderr?.toString() || error.message });
      }
      response.status(200).json({ ok: true, stdout: stdout?.toString() || "" });
    });
  } catch (error) {
    next(error);
  }
});

bitlocker.post("/off", async (request, response, next) => {
  try {
    const letter = String(request?.body?.letter || "").trim().toUpperCase();
    if (!/^[A-Z]$/.test(letter)) {
      return response.status(400).json({ ok: false, error: "Invalid drive letter" });
    }
    const wantUi = String(request?.query?.ui ?? "").toLowerCase();
    const command = `manage-bde -off ${letter}:`;

    if (wantUi === "1" || wantUi === "true") {
      try {
        execFile(
          "cmd.exe",
          [
            "/c",
            "start",
            "",
            "powershell.exe",
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-NoExit",
            "-Command",
            command,
          ],
          { windowsHide: false },
          () => { /* window started */ }
        );
      } catch { /* ignore UI start failures */ }
    }

    exec(command, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        return response.status(200).json({ ok: false, stdout: stdout?.toString() || "", stderr: stderr?.toString() || error.message });
      }
      response.status(200).json({ ok: true, stdout: stdout?.toString() || "" });
    });
  } catch (error) {
    next(error);
  }
});

app.use("/bitlocker", bitlocker);

// Compatibility fallback routes (in case mounting is bypassed)
app.get("/bitlocker-status", async (_request, response, next) => {
  try {
    exec("manage-bde -status", { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        return response.status(200).json({ ok: false, stdout: stdout?.toString() || "", stderr: stderr?.toString() || error.message });
      }
      response.status(200).json({ ok: true, stdout: stdout?.toString() || "" });
    });
  } catch (error) {
    next(error);
  }
});

app.get("/drives", async (_request, response, next) => {
  try {
    // Use PowerShell to list logical drives and their drive types
    const cmd = 'powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-PSDrive -PSProvider FileSystem | Select-Object Name, Root | ConvertTo-Json -Compress"';
    exec(cmd, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        return response.status(200).json({ ok: false, stdout: stdout?.toString() || "", stderr: stderr?.toString() || error.message });
      }
      response.status(200).json({ ok: true, stdout: stdout?.toString() || "" });
    });
  } catch (error) {
    next(error);
  }
});

// Compatibility: allow calling /bitlocker/drives directly without relying on router mount
app.get("/bitlocker/drives", async (request, response, next) => {
  try {
    const psScript = path.join(scriptsDir, "disks", "powershells", "list-drives.ps1");
    const wantUi = String(request?.query?.ui ?? "").toLowerCase();

    if (wantUi === "1" || wantUi === "true") {
      try {
        execFile(
          "cmd.exe",
          ["/c", "start", "", "powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-NoExit", "-File", psScript],
          { windowsHide: false },
          () => { /* window started */ }
        );
      } catch { /* ignore UI start failures */ }
    }

    execFile(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", psScript],
      { windowsHide: true },
      (error, stdout, stderr) => {
        if (error) {
          return response.status(200).json({ ok: false, stdout: stdout?.toString() || "", stderr: stderr?.toString() || error.message });
        }
        const wantRaw = String(request?.query?.raw ?? "").toLowerCase();
        if (wantRaw === "1" || wantRaw === "true") {
          try {
            const parsed = JSON.parse(stdout?.toString() || "[]");
            const asArray = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
            return response.status(200).json(asArray);
          } catch {
            return response.status(200).json([]);
          }
        }
        response.status(200).json({ ok: true, stdout: stdout?.toString() || "" });
      }
    );
  } catch (error) {
    next(error);
  }
});

// Direct command fallback: returns parsed JSON array without relying on script files
app.get("/list-drives", async (request, response, next) => {
  try {
    const wantUi = String(request?.query?.ui ?? "").toLowerCase();
    const commandOnly = 'Get-PSDrive -PSProvider FileSystem | Select-Object Name, Root, Free, Used | ConvertTo-Json -Compress';

    if (wantUi === "1" || wantUi === "true") {
      try {
        execFile(
          "cmd.exe",
          [
            "/c",
            "start",
            "",
            "powershell.exe",
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-NoExit",
            "-Command",
            commandOnly,
          ],
          { windowsHide: false },
          () => { /* window started */ }
        );
      } catch { /* ignore UI start failures */ }
    }

    const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -Command "${commandOnly}"`;
    exec(cmd, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        return response.status(200).json({ ok: false, stdout: stdout?.toString() || "", stderr: stderr?.toString() || error.message });
      }
      try {
        const parsed = JSON.parse(stdout?.toString() || "[]");
        const asArray = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
        return response.status(200).json(asArray);
      } catch {
        return response.status(200).json([]);
      }
    });
  } catch (error) {
    next(error);
  }
});

// Drives listing under /bitlocker as well
bitlocker.get("/drives", async (request, response, next) => {
  try {
    const psScript = path.join(scriptsDir, "disks", "powershells", "list-drives.ps1");
    const wantUi = String(request?.query?.ui ?? "").toLowerCase();

    // Optionnel: ouvrir une fenêtre PowerShell visible pour debug/UX
    if (wantUi === "1" || wantUi === "true") {
      try {
        execFile(
          "cmd.exe",
          [
            "/c",
            "start",
            "",
            "powershell.exe",
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-NoExit",
            "-File",
            psScript,
          ],
          { windowsHide: false },
          () => { /* window started */ }
        );
      } catch { /* ignore UI start failures */ }
    }
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
        return response.status(200).json({ ok: false, stdout: stdout?.toString() || "", stderr: stderr?.toString() || error.message });
      }
      const wantRaw = String(request?.query?.raw ?? "").toLowerCase();
      if (wantRaw === "1" || wantRaw === "true") {
        try {
          const parsed = JSON.parse(stdout?.toString() || "[]");
          const asArray = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
          return response.status(200).json(asArray);
        } catch {
          return response.status(200).json([]);
        }
      }
      response.status(200).json({ ok: true, stdout: stdout?.toString() || "" });
      }
    );
  } catch (error) {
    next(error);
  }
});

// Not found handler (must be after defined routes)
app.use((_request, response) => {
  response.status(404).json({ error: "Not Found" });
});

// Centralized error handler to avoid leaking stack traces
// Express error middleware requires 4 params; disable unused var for _next
// eslint-disable-next-line no-unused-vars
app.use((error, _request, response, _next) => {
  const isProduction = env.NODE_ENV === "production";
  const message = isProduction ? "Internal Server Error" : error?.message || "Internal Server Error";
  response.status(500).json({ error: message });
});

// Start the HTTP server with automatic port fallback when busy
// - Tries env.PORT (or 3000) then increments until a free port is found
// - Adds graceful shutdown handlers
// - Special handling for O2Switch/Passenger
const HOST = env.HOST || "0.0.0.0";
const BASE_PORT = Number(env.PORT) || 3000;
const PORT_STRICT = String(env.PORT_STRICT || "1") === "1";
const IS_PASSENGER = env.PORT === "passenger" || env.PASSENGER_APP_ENV;

async function isPortFree(host, port) {
  // Lightweight port check using a temporary server
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once("error", () => resolve(false))
      .once("listening", () => tester.close(() => resolve(true)))
      .listen(port, host);
  });
}

async function listenWithRetry(host, startPort, maxAttempts = 20) {
  let port = startPort;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    // eslint-disable-next-line no-await-in-loop
    const free = await isPortFree(host, port);
    if (free) {
      return new Promise((resolve, reject) => {
        const server = app.listen(port, host, () => {
          console.log(`Serveur démarré sur http://${host}:${port}`);
          resolve(server);
        });
        server.on("error", reject);
      });
    }
    port += 1;
  }
  throw new Error(`Aucun port libre trouvé à partir de ${startPort}`);
}

let httpServer;
(async () => {
  try {
    if (IS_PASSENGER) {
      // Mode O2Switch/Passenger: pas de listen() nécessaire
      httpServer = app;
      console.log("Serveur configuré pour O2Switch/Passenger");
    } else if (PORT_STRICT) {
      // Mode strict: utilise exactement BASE_PORT, échoue si occupé
      httpServer = await new Promise((resolve, reject) => {
        const server = app
          .listen(BASE_PORT, HOST, () => {
            console.log(`Serveur démarré sur http://${HOST}:${BASE_PORT}`);
            resolve(server);
          })
          .on("error", reject);
      });
    } else {
      // Mode fallback: cherche un port libre à partir de BASE_PORT
      httpServer = await listenWithRetry(HOST, BASE_PORT);
    }
  } catch (error) {
    console.error("[BOOT] Échec démarrage:", error?.message || error);
    process.exit(1);
  }
})();

// Graceful shutdown
function shutdown(signal) {
  console.log(`[SHUTDOWN] Signal ${signal} reçu, arrêt en cours...`);
  if (httpServer && httpServer.close) {
    try {
      httpServer.close(() => {
        console.log("[SHUTDOWN] Serveur arrêté proprement.");
        process.exit(0);
      });
      // Force exit si bloqué
      setTimeout(() => process.exit(0), 3000).unref();
    } catch {
      process.exit(0);
    }
  } else {
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));



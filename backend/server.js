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
import fs from "fs";

// Create and configure the application instance
const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger (method, path, status)
app.use((request, response, next) => {
  const start = Date.now();
  const { method, url, query, body } = request;
  
  const logMessage = `[HTTP] ${method} ${url} - Query: ${JSON.stringify(query)}`;
  console.log(logMessage);
  logToFile(logMessage);
  
  if (body && Object.keys(body).length > 0) {
    const bodyLog = `[HTTP] ${method} ${url} - Body: ${JSON.stringify(body)}`;
    console.log(bodyLog);
    logToFile(bodyLog);
  }
  
  response.on("finish", () => {
    const ms = Date.now() - start;
    const finishLog = `[HTTP] ${method} ${url} → ${response.statusCode} (${ms}ms)`;
    console.log(finishLog);
    logToFile(finishLog);
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

// Debug endpoint pour O2Switch
app.get("/debug", (_request, response) => {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    host: env.HOST,
    passengerAppEnv: env.PASSENGER_APP_ENV,
    isPassenger: IS_PASSENGER,
    platform: process.platform,
    scriptsDir: path.join(__dirname, "scripts"),
    allEnvVars: Object.keys(env).filter(key => key.includes('PASSENGER') || key.includes('NODE'))
  };
  
  console.log("[DEBUG] Endpoint /debug appelé:", debugInfo);
  response.json(debugInfo);
});

// Endpoint pour afficher les logs dans la console du navigateur
app.get("/logs", (_request, response) => {
  try {
    const logPath = path.join(__dirname, "app.log");
    let logs = "";
    
    if (fs.existsSync(logPath)) {
      logs = fs.readFileSync(logPath, 'utf8');
    } else {
      logs = "Fichier de log non trouvé - Render ne permet pas l'écriture de fichiers";
    }
    
    response.setHeader('Content-Type', 'text/plain');
    response.send(logs);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
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
  console.log(`[SCRIPT] Lancement script: ${scriptName}, UI: ${openUi}, Linux: ${isLinux}`);
  
  if (isLinux) {
    const scriptPath = path.join(scriptsDir, "linux", "disks", scriptName);
    console.log(`[SCRIPT] Chemin Linux: ${scriptPath}`);
    
    if (openUi) {
      console.log(`[SCRIPT] Ouverture UI Linux avec xterm`);
      try {
        execFile(
          "xterm",
          ["-e", "bash", scriptPath],
          { windowsHide: false },
          (error) => {
            if (error) {
              console.error(`[SCRIPT] Erreur UI Linux:`, error);
            } else {
              console.log(`[SCRIPT] UI Linux démarrée avec succès`);
            }
          }
        );
      } catch (error) {
        console.error(`[SCRIPT] Exception UI Linux:`, error);
      }
    }
    
    console.log(`[SCRIPT] Exécution script Linux en arrière-plan`);
    return new Promise((resolve) => {
      execFile(
        "bash",
        [scriptPath],
        { windowsHide: true },
        (error, stdout, stderr) => {
          if (error) {
            console.error(`[SCRIPT] Erreur exécution Linux:`, error);
            console.error(`[SCRIPT] Stderr Linux:`, stderr?.toString());
            resolve({ ok: false, error: error.message, stderr: stderr?.toString() || "" });
          } else {
            console.log(`[SCRIPT] Script Linux exécuté avec succès`);
            console.log(`[SCRIPT] Stdout Linux:`, stdout?.toString());
            resolve({ ok: true, stdout: stdout?.toString() || "" });
          }
        }
      );
    });
  } else {
    // Windows PowerShell
    const psScript = path.join(scriptsDir, "disks", "powershells", scriptName);
    console.log(`[SCRIPT] Chemin Windows: ${psScript}`);
    
    if (openUi) {
      console.log(`[SCRIPT] Ouverture UI Windows avec PowerShell`);
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
          (error) => {
            if (error) {
              console.error(`[SCRIPT] Erreur UI Windows:`, error);
            } else {
              console.log(`[SCRIPT] UI Windows démarrée avec succès`);
            }
          }
        );
      } catch (error) {
        console.error(`[SCRIPT] Exception UI Windows:`, error);
      }
    }
    
    console.log(`[SCRIPT] Exécution script Windows en arrière-plan`);
    return new Promise((resolve) => {
      execFile(
        "powershell.exe",
        ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", psScript],
        { windowsHide: true },
        (error, stdout, stderr) => {
          if (error) {
            console.error(`[SCRIPT] Erreur exécution Windows:`, error);
            console.error(`[SCRIPT] Stderr Windows:`, stderr?.toString());
            resolve({ ok: false, error: error.message, stderr: stderr?.toString() || "" });
          } else {
            console.log(`[SCRIPT] Script Windows exécuté avec succès`);
            console.log(`[SCRIPT] Stdout Windows:`, stdout?.toString());
            resolve({ ok: true, stdout: stdout?.toString() || "" });
          }
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
    
    console.log(`[API] /disk/chkdsk - UI: ${ui}, Linux: ${isLinux}, Script: ${scriptName}`);
    
    const result = await launchScript(scriptName, ui === "1" || ui === "true", isLinux);
    
    console.log(`[API] /disk/chkdsk - Résultat:`, result);
    
    if (!result.ok) {
      console.error(`[API] /disk/chkdsk - Erreur:`, result.error);
      return response.status(500).json({ 
        ok: false, 
        error: result.error || "Script execution failed",
        stderr: result.stderr || ""
      });
    }
    
    response.status(200).json(result);
  } catch (error) {
    console.error(`[API] /disk/chkdsk - Exception:`, error);
    next(error);
  }
});

app.get("/disk/defrag", async (request, response, next) => {
  try {
    const ui = String(request?.query?.ui ?? "").toLowerCase();
    const isLinux = process.platform === "linux";
    const scriptName = isLinux ? "list-drives.sh" : "defrag-drive.ps1";
    
    console.log(`[API] /disk/defrag - UI: ${ui}, Linux: ${isLinux}, Script: ${scriptName}`);
    
    const result = await launchScript(scriptName, ui === "1" || ui === "true", isLinux);
    
    console.log(`[API] /disk/defrag - Résultat:`, result);
    
    if (!result.ok) {
      console.error(`[API] /disk/defrag - Erreur:`, result.error);
      return response.status(500).json({ 
        ok: false, 
        error: result.error || "Script execution failed",
        stderr: result.stderr || ""
      });
    }
    
    response.status(200).json(result);
  } catch (error) {
    console.error(`[API] /disk/defrag - Exception:`, error);
    next(error);
  }
});

// DiskPart: format drive (interactive)
app.get("/disk/format", async (request, response, next) => {
  try {
    const ui = String(request?.query?.ui ?? "").toLowerCase();
    const isLinux = process.platform === "linux";
    const scriptName = isLinux ? "list-drives.sh" : "format-drive.ps1";
    
    console.log(`[API] /disk/format - UI: ${ui}, Linux: ${isLinux}, Script: ${scriptName}`);
    
    const result = await launchScript(scriptName, ui === "1" || ui === "true", isLinux);
    
    console.log(`[API] /disk/format - Résultat:`, result);
    
    if (!result.ok) {
      console.error(`[API] /disk/format - Erreur:`, result.error);
      return response.status(500).json({ 
        ok: false, 
        error: result.error || "Script execution failed",
        stderr: result.stderr || ""
      });
    }
    
    response.status(200).json(result);
  } catch (error) {
    console.error(`[API] /disk/format - Exception:`, error);
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
    // En production (O2Switch/Passenger ou Render), les scripts système ne peuvent pas s'exécuter
    if (IS_PASSENGER || IS_RENDER) {
      return response.status(200).json({ 
        ok: true, 
        message: "Scripts système non disponibles en production",
        note: "Les scripts de modification DNS nécessitent un accès administrateur"
      });
    }

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
    // En production (O2Switch/Passenger ou Render), les scripts système ne peuvent pas s'exécuter
    if (IS_PASSENGER || IS_RENDER) {
      return response.status(200).json({ 
        ok: true, 
        message: "Scripts système non disponibles en production",
        note: "Les scripts de gestion de paquets nécessitent un accès système complet"
      });
    }

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
            return response.status(500).json({ ok: false, error: error.message });
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
    console.log(`[API] /maintenance/tool-admin - IS_PASSENGER: ${IS_PASSENGER}, IS_RENDER: ${IS_RENDER}`);
    
    // En production (O2Switch/Passenger ou Render), les scripts système ne peuvent pas s'exécuter
    if (IS_PASSENGER || IS_RENDER) {
      console.log(`[API] /maintenance/tool-admin - Mode production, scripts non disponibles`);
      return response.status(200).json({ 
        ok: true, 
        message: "Scripts système non disponibles en production",
        note: "Les scripts de maintenance nécessitent un accès système complet"
      });
    }

    const isLinux = process.platform === "linux";
    console.log(`[API] /maintenance/tool-admin - Linux: ${isLinux}`);
    
    if (isLinux) {
      // Linux: lancer l'outil de maintenance système
      const scriptPath = path.join(scriptsDir, "linux", "maintenance", "system-maintenance.sh");
      console.log(`[API] /maintenance/tool-admin - Chemin Linux: ${scriptPath}`);
      
      execFile(
        "xterm",
        ["-e", "bash", scriptPath],
        { windowsHide: false },
        (error) => {
          if (error) {
            console.error(`[API] /maintenance/tool-admin - Erreur Linux:`, error);
            return response.status(500).json({ ok: false, error: error.message });
          }
          console.log(`[API] /maintenance/tool-admin - Script Linux lancé avec succès`);
          response.status(200).json({ ok: true });
        }
      );
    } else {
      // Windows: utiliser l'outil de maintenance Windows
      const batPath = path.join(scriptsDir, "maintenance", "batch", "windows-maintenance-admin.bat");
      console.log(`[API] /maintenance/tool-admin - Chemin Windows: ${batPath}`);
      
      execFile(
        "cmd.exe",
        ["/c", "start", "", batPath],
        { windowsHide: false },
        (error) => {
          if (error) {
            console.error(`[API] /maintenance/tool-admin - Erreur Windows:`, error);
            return response.status(200).json({ ok: false, error: error.message });
          }
          console.log(`[API] /maintenance/tool-admin - Script Windows lancé avec succès`);
          response.status(200).json({ ok: true });
        }
      );
    }
  } catch (error) {
    console.error(`[API] /maintenance/tool-admin - Exception:`, error);
    next(error);
  }
});

// Systeme: basculer le menu contextuel classique Windows 11 (nécessite admin)
app.get("/system/context-menu-classic-admin", async (_request, response, next) => {
  try {
    // En production (O2Switch/Passenger ou Render), les scripts système ne peuvent pas s'exécuter
    if (IS_PASSENGER || IS_RENDER) {
      return response.status(200).json({ 
        ok: true, 
        message: "Scripts système non disponibles en production",
        note: "Les scripts de modification du système nécessitent un accès administrateur"
      });
    }

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
const IS_RENDER = env.RENDER || env.NODE_ENV === "production";

// Fonction de log personnalisée
function logToFile(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  // Log dans la console
  console.log(message);
  
  // Log dans un fichier (si possible)
  try {
    fs.appendFileSync(path.join(__dirname, "app.log"), logMessage);
  } catch (error) {
    // Ignore les erreurs d'écriture de fichier sur Render
    console.error("Erreur écriture log:", error.message);
  }
}

// Debug: Afficher toutes les variables d'environnement pour O2Switch
logToFile("[DEBUG] Variables d'environnement:");
logToFile(`[DEBUG] NODE_ENV: ${env.NODE_ENV}`);
logToFile(`[DEBUG] PORT: ${env.PORT}`);
logToFile(`[DEBUG] HOST: ${env.HOST}`);
logToFile(`[DEBUG] PASSENGER_APP_ENV: ${env.PASSENGER_APP_ENV}`);
logToFile(`[DEBUG] IS_PASSENGER: ${IS_PASSENGER}`);
logToFile(`[DEBUG] process.platform: ${process.platform}`);
logToFile(`[DEBUG] __dirname: ${__dirname}`);
logToFile(`[DEBUG] scriptsDir: ${path.join(__dirname, "scripts")}`);

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
      console.log("[BOOT] Serveur configuré pour O2Switch/Passenger");
      console.log("[BOOT] Application Express prête à recevoir les requêtes");
    } else {
      // Mode Render: utilise le port défini par Render
      const port = env.PORT || 3000;
      httpServer = await new Promise((resolve, reject) => {
        const server = app
          .listen(port, HOST, () => {
            console.log(`[BOOT] Serveur démarré sur http://${HOST}:${port}`);
            resolve(server);
          })
          .on("error", reject);
      });
    }
    
    console.log("[BOOT] Serveur backend démarré avec succès");
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



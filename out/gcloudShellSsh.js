"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
function getSSHConfig() {
    try {
        // Run gcloud command to get the dry-run output
        const command = "gcloud cloud-shell ssh --authorize-session --dry-run";
        const output = (0, child_process_1.execSync)(command, { encoding: 'utf-8' });
        // Extract relevant details using RegExp
        const hostMatch = output.match(/(\S+)@(\d+\.\d+\.\d+\.\d+)/);
        const keyMatch = output.match(/-i '([^']+)/);
        const portMatch = output.match(/-P (\d+)/);
        if (hostMatch && keyMatch && portMatch) {
            const username = hostMatch[1];
            const hostIp = hostMatch[2];
            let identityFile = keyMatch[1].replace(/\.ppk$/, ""); // Remove .ppk suffix if present
            const port = parseInt(portMatch[1], 10);
            return { username, hostIp, identityFile, port };
        }
        else {
            return null;
        }
    }
    catch (error) {
        vscode.window.showErrorMessage("Failed to extract SSH connection details.");
        return null;
    }
}
function updateSSHConfig(sshConfig) {
    const sshConfigPath = path.join(os.homedir(), '.ssh', 'config');
    if (!fs.existsSync(sshConfigPath)) {
        fs.writeFileSync(sshConfigPath, '');
    }
    let configContent = fs.readFileSync(sshConfigPath, 'utf8');
    const hostEntry = configContent.includes('Host google-cloud-shell');
    const sshConfigString = `
Host google-cloud-shell
    HostName ${sshConfig.hostIp}
    User ${sshConfig.username}
    IdentityFile ${sshConfig.identityFile}
    Port ${sshConfig.port}
    StrictHostKeyChecking no
    UserKnownHostsFile=/dev/null
    ServerAliveInterval 60
    ServerAliveCountMax 3
`.trim();
    if (hostEntry) {
        configContent = configContent.replace(/Host google-cloud-shell[\s\S]*?StrictHostKeyChecking no/g, sshConfigString);
    }
    else {
        configContent += `\n\n${sshConfigString}`;
    }
    fs.writeFileSync(sshConfigPath, configContent, { mode: 0o600 });
}
//# sourceMappingURL=gcloudShellSsh.js.map
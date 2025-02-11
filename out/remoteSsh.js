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
exports.connectSsh = connectSsh;
exports.getConfigString = getConfigString;
const vscode = __importStar(require("vscode"));
function connectSsh(sshConfig) {
    // Create the SSH command
    const sshCommand = `ssh -i ${sshConfig.identityFile} -p ${sshConfig.port} ${sshConfig.username}@${sshConfig.hostIp}`;
    // Run the command
    const terminal = vscode.window.createTerminal("Google Cloud Shell");
    terminal.sendText(sshCommand);
    terminal.show();
}
function getConfigString(sshConfig) {
    // Get SSH config details
    if (!sshConfig) {
        vscode.window.showErrorMessage("Failed to extract SSH connection details.");
        return null;
    }
    // Create the string
    // Note: The UserKnownHostsFile and StrictHostKeyChecking options are used to disable host key checking
    // This is necessary since the IP address of the Cloud Shell instance changes every time
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
    return sshConfigString;
}
//# sourceMappingURL=remoteSsh.js.map
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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const gcloudShell = __importStar(require("./gcloud"));
const core = __importStar(require("./core"));
async function showCommand(sshConfigProvider) {
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Fetching SSH Configuration...",
        cancellable: false
    }, async (progress, token) => {
        // Get SSH config details
        const sshConfig = await sshConfigProvider.getSshConfig();
        if (!sshConfig) {
            vscode.window.showErrorMessage("Failed to extract SSH connection details.");
            return;
        }
        const sshCommand = core.getCommand(sshConfig);
        // Display the details for the user to copy
        vscode.window.showInformationMessage(sshCommand, "Copy to Clipboard").then((result) => {
            if (result === "Copy to Clipboard") {
                vscode.env.clipboard.writeText(sshCommand);
                vscode.window.showInformationMessage("SSH command copied to clipboard.");
            }
        });
    });
}
async function showConfig(sshConfigProvider) {
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Fetching SSH Configuration...",
        cancellable: false
    }, async (progress, token) => {
        // Get SSH config details
        const sshConfig = await sshConfigProvider.getSshConfig();
        if (!sshConfig) {
            vscode.window.showErrorMessage("Failed to extract SSH connection details.");
            return;
        }
        const sshConfigString = core.getConfigString(sshConfig);
        // Display the details for the user to copy
        vscode.window.showInformationMessage(sshConfigString, "Copy to Clipboard").then((result) => {
            if (result === "Copy to Clipboard") {
                vscode.env.clipboard.writeText(sshConfigString);
                vscode.window.showInformationMessage("SSH configuration copied to clipboard.");
            }
        });
    });
}
async function addHost(configProvider) {
    await showCommand(configProvider);
    // Connect to host in config
    vscode.commands.executeCommand('opensshremotes.addNewSshHost');
}
function activate(context) {
    const getConfigGcloud = vscode.commands.registerCommand('remote-cloud-shell.get-config-gcloud', () => {
        showConfig(new gcloudShell.GcloudConfigProvider());
    });
    const getCommandGcloud = vscode.commands.registerCommand('remote-cloud-shell.get-command-gcloud', () => {
        showCommand(new gcloudShell.GcloudConfigProvider());
    });
    const addHostGcloud = vscode.commands.registerCommand('remote-cloud-shell.add-host-gcloud', () => {
        addHost(new gcloudShell.GcloudConfigProvider());
    });
    context.subscriptions.push(getConfigGcloud);
    context.subscriptions.push(getCommandGcloud);
    context.subscriptions.push(addHostGcloud);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map
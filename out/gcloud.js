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
exports.GcloudConfigProvider = void 0;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
class GcloudConfigProvider {
    async getSshConfig() {
        return this._getSshConfig();
    }
    _getSshConfig() {
        // Run gcloud command to get the dry-run output
        const command = "gcloud cloud-shell ssh --authorize-session --dry-run";
        let output = null;
        try {
            output = (0, child_process_1.execSync)(command, { encoding: 'utf-8' });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to run gcloud command. Make sure you have gcloud SDK installed and authenticated. Error: ${error.message}`);
            return null;
        }
        // Extract relevant details using RegExp
        const hostMatch = output.match(/(\S+)@(\d+\.\d+\.\d+\.\d+)/);
        const keyMatch = output.match(/-i '([^']+)/);
        const portMatch = output.match(/-P (\d+)/);
        if (hostMatch && keyMatch && portMatch) {
            const username = hostMatch[1];
            const hostIp = hostMatch[2];
            let identityFile = keyMatch[1].replace(/\.ppk$/, ""); // Remove .ppk suffix if present
            // Convert Windows path to unix path
            identityFile = identityFile.replace(/\\/g, "/");
            const port = parseInt(portMatch[1], 10);
            return { username, hostIp, identityFile, port };
        }
        else {
            return null;
        }
    }
}
exports.GcloudConfigProvider = GcloudConfigProvider;
//# sourceMappingURL=gcloud.js.map
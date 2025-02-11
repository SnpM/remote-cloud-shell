import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execSync } from 'child_process';
import {SshConfig, SshConfigProvider} from './core';

export class GcloudConfigProvider implements SshConfigProvider {
    async getSshConfig(): Promise<SshConfig | null> {
        return this._getSshConfig();
    }
    _getSshConfig(): SshConfig | null {
        // Run gcloud command to get the dry-run output
        const command = "gcloud cloud-shell ssh --authorize-session --dry-run";
        let output = null;
        try {
            output = execSync(command, { encoding: 'utf-8' });
        }
        catch (error : any) {
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
        } else {
            return null;
        }
    }
}


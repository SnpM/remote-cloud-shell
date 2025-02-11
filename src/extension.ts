import * as vscode from 'vscode';
import * as gcloudShell from './gcloud';
import { SshConfig, SshConfigProvider } from './core';
import * as core from './core';

async function showCommand(sshConfigProvider: SshConfigProvider) {
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

async function showConfig(sshConfigProvider: SshConfigProvider) {
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

async function addHost(configProvider: SshConfigProvider) {
	await showCommand(configProvider);
    // Connect to host in config
    vscode.commands.executeCommand('opensshremotes.addNewSshHost');
}

export function activate(context: vscode.ExtensionContext) {
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
export function deactivate() {}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommand = getCommand;
exports.getConfigString = getConfigString;
function getCommand(sshConfig) {
    // Create the SSH command
    const sshCommand = `ssh -i ${sshConfig.identityFile} -p ${sshConfig.port} ${sshConfig.username}@${sshConfig.hostIp} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ServerAliveInterval=60 -o ServerAliveCountMax=3`;
    return sshCommand;
}
function getConfigString(sshConfig) {
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
//# sourceMappingURL=core.js.map
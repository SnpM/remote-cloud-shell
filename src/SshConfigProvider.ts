export interface SshConfigProvider {
    getSshConfig(): Promise<string>;
}
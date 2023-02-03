import * as vscode from 'vscode';

const configPath = 'demojockey';
const pathsConfigPath = `${configPath}.paths`;

function getConfig(config: string = configPath): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration(config);
}

export function getRepoPath(repo: string): string {
  return getConfig(pathsConfigPath).get(repo, '');
}

function getBoolean(name: string): boolean {
  const result = getConfig().get<boolean>(name);
  if (result === undefined) {
    console.warn(`No boolean config found named ${name}`);
    return false;
  }
  else { return result; }
}

export function doFlatten(): boolean { return getBoolean('flatten'); };
export function doOverwrite(): boolean { return getBoolean('overwrite'); };
export function doRename(): boolean { return getBoolean('rename'); };


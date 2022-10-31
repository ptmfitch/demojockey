import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function getPathsConfig(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration('demojockey.paths');
} 

const ignoreFiles = ['LICENSE', 'README.md', '.DS_Store', '.git', '.gitignore', '99-G4'];
export async function listDirs(path: string, filter: Array<string> = ignoreFiles): Promise<string[]> {
  return (await vscode.workspace.fs.readDirectory(vscode.Uri.parse(path)))
    .map(tuple => tuple[0])
    .filter(dir => !filter.includes(dir));
}

export function workspaceRootPath(): string {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0].uri.path;
  } else {
    throw new vscode.FileSystemError('Could not find working folder, open a folder and try again');
  }
}

function openThenShowFile(filePath: string): Thenable<vscode.TextEditor> {
  return vscode.workspace.openTextDocument(filePath).then((td: vscode.TextDocument) => {
    return vscode.window.showTextDocument(td, 1, false);
  }, (_) => {
    throw new vscode.FileSystemError(`Could not open ${filePath}`);
  });
}

export async function copyDirThenOpenReadme(source: vscode.Uri, target: vscode.Uri): Promise<vscode.TextEditor> {
      
  const readmeFilename = 'README.md';
  const readmePath = path.join(target.fsPath, readmeFilename);

  const doOverwrite = vscode.workspace.getConfiguration('demojockey').get('overwrite', false);

  return vscode.workspace.fs.copy(source, target, {overwrite: doOverwrite}).then(_ => {
    return openThenShowFile(readmePath);
  }, (_) => {
    throw new vscode.FileSystemError('Could not copy files, it may already exist (overwrite configurable in Settings (⌘,))');
  }); 

}

function writeThenOpenFile(filePath: string, fileText: string): Thenable<vscode.TextEditor> {
  fs.writeFileSync(filePath, fileText, 'utf8');
  return openThenShowFile(filePath);
}

export function createThenOpenConnectionString(clusterName: string, connectionString: string): Thenable<vscode.TextEditor> {
  const connectionStringPath = path.join(workspaceRootPath(), 'clusters', clusterName);
  return writeThenOpenFile(connectionStringPath, connectionString);
}

export function repoAccessErrorMessage(repo: string): string { 
  return `Could not access local ${repo} repository, please configure in Settings (⌘,)`;
}

export function logAndShowError(message: string): void {
  console.error(message);
  vscode.window.showErrorMessage(message);
}

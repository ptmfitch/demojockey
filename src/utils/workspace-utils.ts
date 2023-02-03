import * as vscode from 'vscode';
import * as path from 'path';
import * as config from './config';

const ignoreFiles = ['LICENSE', 'README.md', '.DS_Store', '.git', '.gitignore', '99-G4'];
export async function listDirs(path: string, filter: Array<string> = ignoreFiles): Promise<string[]> {
  return (await vscode.workspace.fs.readDirectory(vscode.Uri.parse(path)))
    .map(tuple => tuple[0])
    .filter(dir => !filter.includes(dir));
}

function getWorkspaceRootPath(): string {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0].uri.path;
  } else {
    throw new vscode.FileSystemError('Could not find working folder, open a folder and try again');
  }
}

export const mappingsPath: string = path.join(getWorkspaceRootPath(), '.demojockey');

export function getTargetDir(repo: string): string {
  const doFlatten: boolean = config.doFlatten();
  // Shared dir for all repos
  if (doFlatten) {
    return path.join(getWorkspaceRootPath(), 'proofs');
  }
  // Dir per repo
  return path.join(getWorkspaceRootPath(), repo, 'proofs');
}

export async function copyDir(sourcePath: string, targetPath: string, doOverwrite: boolean): Promise<void> {
  return vscode.workspace.fs.copy(
    vscode.Uri.parse(sourcePath), 
    vscode.Uri.parse(targetPath), 
    { overwrite: doOverwrite }
  );
}

function openThenShowFile(filePath: string): Thenable<vscode.TextEditor> {
  return vscode.workspace.openTextDocument(filePath).then((td: vscode.TextDocument) => {
    return vscode.window.showTextDocument(td, 1, false);
  }, (_) => {
    throw new vscode.FileSystemError(`Could not open ${filePath}`);
  });
}

async function copyProof(sourcePath: string, targetPath: string): Promise<void> {
  return copyDir(
    path.join(sourcePath),
    path.join(targetPath),
    config.doOverwrite()
  );
}

async function showReadme(targetPath: string): Promise<vscode.TextEditor> {
  return openThenShowFile(
    path.join(targetPath, 'README.md')
  );
}

export async function copyDirThenShowReadme(
  sourcePath: string, 
  targetPath: string, 
): Promise<vscode.TextEditor> {
  return copyProof(sourcePath, targetPath).then(_ => {
    return showReadme(targetPath);
  }, _ => {
    throw new vscode.FileSystemError('Could not copy files, it may already exist (overwrite configurable in Settings (⌘,))');
  }); 
}

export function repoAccessErrorMessage(repo: string): string { 
  return `Could not access local ${repo} repository, please configure in Settings (⌘,)`;
}

export function logAndShowError(message: string): void {
  console.error(message);
  vscode.window.showErrorMessage(message);
}

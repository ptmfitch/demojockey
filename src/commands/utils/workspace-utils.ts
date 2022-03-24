import * as vscode from 'vscode';

const djConfig = vscode.workspace.getConfiguration('demojockey');
export const pathsConfig = vscode.workspace.getConfiguration('demojockey.paths');

const ignoreFiles = ['LICENSE', 'README.md', '.DS_Store', '.git', '.gitignore', '99-G4'];
export async function listDirs(path: string, filter: Array<string> = ignoreFiles): Promise<string[]> {
  return (await vscode.workspace.fs.readDirectory(vscode.Uri.parse(path)))
    .map(tuple => tuple[0])
    .filter(dir => !filter.includes(dir));
}

export function copyDirThenOpenReadme(source: vscode.Uri, target: vscode.Uri): void {
      
  const readmeFilename = 'README.md';
  const readmePath = vscode.Uri.parse(`${target}/${readmeFilename}`).fsPath;

  const doOverwrite = djConfig.get('overwrite', false);

  vscode.workspace.fs.copy(source, target, {overwrite: doOverwrite}).then(_ => {
    vscode.workspace.openTextDocument(readmePath).then((td: vscode.TextDocument) => {
      vscode.window.showTextDocument(td, 1, false);
    }, (_) => {
      const message = `Could not open ${readmePath}`;
      vscode.window.showErrorMessage(message);
    });
  }, (_) => {
    const message = 'Could not copy files, it may already exist (overwrite configurable in Settings (⌘,))';
    vscode.window.showErrorMessage(message);
  }); 

}

export const workingFolderErrorMessage = 'Could not find working folder, open a folder and try again';

export function repoAccessErrorMessage(repo: string): string { 
  return `Could not access local ${repo} repository, please configure in Settings (⌘,)`;
}

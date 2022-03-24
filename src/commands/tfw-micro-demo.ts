import * as vscode from 'vscode';
import * as WorkspaceUtils from './utils/workspace-utils';

const repo = 'tfw-micro-demos';

const microDemoPath = WorkspaceUtils.pathsConfig.get(repo, '');

export async function command() {

  if (!microDemoPath) {
    vscode.window.showErrorMessage(WorkspaceUtils.repoAccessErrorMessage(repo));
    return;
  }
  const microDemosList = WorkspaceUtils.listDirs(microDemoPath);

  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showErrorMessage(WorkspaceUtils.workingFolderErrorMessage);
    return;
  }
  const targetPath = `${vscode.workspace.workspaceFolders[0].uri.path}/${repo}`;

  const selectedMicroDemo = await vscode.window.showQuickPick(microDemosList, {
    placeHolder: 'Select a TFW Micro Demo',
  });
  if (!selectedMicroDemo) { return; }
  const sourceProofDir: vscode.Uri = vscode.Uri.parse(`${microDemoPath}/${selectedMicroDemo}`);
  const targetProofDir: vscode.Uri = vscode.Uri.parse(`${targetPath}/${selectedMicroDemo}`);

  WorkspaceUtils.copyDirThenOpenReadme(sourceProofDir, targetProofDir);

  vscode.window.showInformationMessage(`Selected ${selectedMicroDemo}`);

}

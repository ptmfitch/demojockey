import * as vscode from 'vscode';
import * as WorkspaceUtils from './utils/workspace-utils';
// import * as Telemetry from './telemetry/realm-telemetry';
import * as path from 'path';

const repo = 'tfw-micro-demos';

const microDemoPath = WorkspaceUtils.getPathsConfig().get(repo, '');

export async function command() {

  if (!microDemoPath) {
    vscode.window.showErrorMessage(WorkspaceUtils.repoAccessErrorMessage(repo));
    return;
  }
  const microDemosList = WorkspaceUtils.listDirs(microDemoPath);

  let targetPath;
  try { 
    targetPath = path.join(WorkspaceUtils.workspaceRootPath(), repo); 
  } catch (e) {
    WorkspaceUtils.logAndShowError((e as Error).message);
    return;
  }

  const selectedMicroDemo = await vscode.window.showQuickPick(microDemosList, {
    placeHolder: 'Select a TFW Micro Demo',
  });
  if (!selectedMicroDemo) { return; }
  const sourceProofDir: vscode.Uri = vscode.Uri.parse(path.join(microDemoPath, selectedMicroDemo));
  const targetProofDir: vscode.Uri = vscode.Uri.parse(path.join(targetPath, selectedMicroDemo));

  if (await WorkspaceUtils.copyDirThenOpenReadme(sourceProofDir, targetProofDir)) {
    // Telemetry.sendTelemetryEvent('tfw-micro-demo', {demo: selectedMicroDemo});
    vscode.window.showInformationMessage(`Selected ${selectedMicroDemo}`);
  }
  
}

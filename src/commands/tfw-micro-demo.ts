import * as vscode from 'vscode';
import * as WorkspaceUtils from '../utils/workspace-utils';
import * as config from '../utils/config';
import * as path from 'path';
import * as StorageUtils from '../utils/storage-utils';

const repo = 'tfw-micro-demos';
const microDemoPath = config.getRepoPath(repo);

export async function command() {

  if (!microDemoPath) {
    vscode.window.showErrorMessage(WorkspaceUtils.repoAccessErrorMessage(repo));
    return;
  }
  const microDemosList = WorkspaceUtils.listDirs(microDemoPath);

  let targetDir;
  try {
    targetDir = WorkspaceUtils.getTargetDir(repo);
  } catch (e) {
    WorkspaceUtils.logAndShowError((e as Error).message);
    return;
  }

  const selectedProof = await vscode.window.showQuickPick(microDemosList, {
    placeHolder: 'Select a TFW Micro Demo',
  });
  if (!selectedProof) { return; }

  const sourcePath: string = path.join(microDemoPath, selectedProof);
  const targetPath: string = path.join(targetDir, selectedProof);

  if (await WorkspaceUtils.copyDirThenShowReadme(sourcePath, targetPath)) {
    StorageUtils.updateOneDirectoryMapping(sourcePath, targetPath, WorkspaceUtils.mappingsPath);
    vscode.window.showInformationMessage(`Selected ${selectedProof}`);
  }
  
}

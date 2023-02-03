import * as vscode from 'vscode';
import * as WorkspaceUtils from '../utils/workspace-utils';
import * as StorageUtils from '../utils/storage-utils';

export async function command() {

  const mappings = StorageUtils.loadDirectoryMappings(WorkspaceUtils.mappingsPath);

  const proofsList = Array.from(mappings.values());

  const selectedProof = await vscode.window.showQuickPick(proofsList, {
    placeHolder: 'Select a proof',
  });
  if (!selectedProof) { return; }

  let targetPath: string = '';
  mappings.forEach((v, k) => {
    if (v === selectedProof) {
      targetPath = k;
    }
  });
  if (targetPath === '') { return; };

  WorkspaceUtils.copyDir(selectedProof, targetPath, true);
  vscode.window.showInformationMessage(`Applied changes from ${selectedProof} to ${targetPath}`);


}

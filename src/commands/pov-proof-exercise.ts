import * as vscode from 'vscode';
import * as WorkspaceUtils from '../utils/workspace-utils';
import * as StorageUtils from '../utils/storage-utils';
import * as config from '../utils/config';
import * as path from 'path';

const repo = 'pov-proof-exercises';

const proofsDir = 'proofs';
const proofsRepo = config.getRepoPath(repo);
const proofsPath = `${proofsRepo}/${proofsDir}`;

const readmePath = `${proofsRepo}/README.md`;
const readmeText = StorageUtils.loadDataFromFile(readmePath);

const proofNameRegex = /\[([A-Z-]+)\]\(proofs\/\d{2}\)/g;
const proofNameMatches = Array.from(readmeText.matchAll(proofNameRegex));

function povProofNoToFriendlyName(proofNo: string): string {
  if (!proofNameMatches) { return proofNo; }

  // Index of proofNameMatch is proofNo - 1
  // i.e. proofNo 01 is proofNameMatches[0]
  const proofIndex = parseInt(proofNo) - 1;
  if (!proofNameMatches[proofIndex]) { return proofNo; }
      
  return `${proofNo} ${proofNameMatches[proofIndex][1]}`;
}

function friendlyNameToPovProofDir(friendlyName: string, friendlyDir: boolean): string {
  // Use human readable proof names
  // e.g. 01 FLEXIBLE -> FLEXIBLE
  if (friendlyDir) {
    return friendlyName.slice(3);
  }
  // Use default numbering from repo
  // e.g. 01 FLEXIBLE -> 01
  return friendlyName.slice(0, 2);
}

export async function command() {

  if (!proofsRepo) {
    vscode.window.showErrorMessage(WorkspaceUtils.repoAccessErrorMessage(repo));
    return;
  }
  const proofsList = (await WorkspaceUtils.listDirs(proofsPath)).map(proofNo => povProofNoToFriendlyName(proofNo));

  let targetDir;
  try {
    targetDir = WorkspaceUtils.getTargetDir(repo);
  } catch (e) {
    WorkspaceUtils.logAndShowError((e as Error).message);
    return;
  }

  const selectedProof = await vscode.window.showQuickPick(proofsList, {
    placeHolder: 'Select a POV Proof Exercise',
  });
  if (!selectedProof) { return; }

  const sourcePath: string = path.join(proofsPath, friendlyNameToPovProofDir(selectedProof, false));
  const targetPath: string = path.join(targetDir, friendlyNameToPovProofDir(selectedProof, config.doRename()));

  if (await WorkspaceUtils.copyDirThenShowReadme(sourcePath, targetPath)) {
    StorageUtils.updateOneDirectoryMapping(sourcePath, targetPath, WorkspaceUtils.mappingsPath);
    vscode.window.showInformationMessage(`Selected ${selectedProof}`);
  }

}

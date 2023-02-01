import * as vscode from 'vscode';
import * as fs from 'fs';
import * as WorkspaceUtils from './utils/workspace-utils';
import * as path from 'path';

const repo = 'pov-proof-exercises';

const proofsDir = 'proofs';
const proofsRepo = WorkspaceUtils.getPathsConfig().get(repo, '');
const proofsPath = `${proofsRepo}/${proofsDir}`;

const readmePath = `${proofsRepo}/README.md`;
const readmeText = fs.readFileSync(readmePath, 'utf8');

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

  const doRename = WorkspaceUtils.getBoolean('rename');

  let targetPath;
  try {
    targetPath = WorkspaceUtils.getTargetPath(repo);
  } catch (e) {
    WorkspaceUtils.logAndShowError((e as Error).message);
    return;
  }

  const selectedProof = await vscode.window.showQuickPick(proofsList, {
    placeHolder: 'Select a POV Proof Exercise',
  });
  if (!selectedProof) { return; }
  const sourceProofDir: string = friendlyNameToPovProofDir(selectedProof, false);
  const targetProofDir: string = friendlyNameToPovProofDir(selectedProof, doRename);
  const sourceProofUri: vscode.Uri = vscode.Uri.parse(path.join(proofsPath, sourceProofDir));
  const targetProofUri: vscode.Uri = vscode.Uri.parse(path.join(targetPath, targetProofDir));

  if (await WorkspaceUtils.copyDirThenOpenReadme(sourceProofUri, targetProofUri)) {
    vscode.window.showInformationMessage(`Selected ${selectedProof}`);
  };

}

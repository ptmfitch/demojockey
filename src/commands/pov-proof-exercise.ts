import * as vscode from 'vscode';
import * as fs from 'fs';
import * as WorkspaceUtils from './utils/workspace-utils';
// import * as Telemetry from './telemetry/realm-telemetry';
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

function friendlyNameToPovProofDir(friendlyName: string): string {
  // Proof dir is first 2 chars of friendlyName
  // e.g. 01 FLEXIBLE is dir 01
  return friendlyName.slice(0, 2);
}

export async function command() {

  if (!proofsRepo) {
    vscode.window.showErrorMessage(WorkspaceUtils.repoAccessErrorMessage(repo));
    return;
  }
  const proofsList = (await WorkspaceUtils.listDirs(proofsPath)).map(proofNo => povProofNoToFriendlyName(proofNo));

  let targetPath;
  try { 
    targetPath = path.join(WorkspaceUtils.workspaceRootPath(), repo, proofsDir); 
  } catch (e) {
    WorkspaceUtils.logAndShowError((e as Error).message);
    return;
  }
   
  const selectedProof = await vscode.window.showQuickPick(proofsList, {
    placeHolder: 'Select a POV Proof Exercise',
  });
  if (!selectedProof) { return; }
  const selectedProofDir = friendlyNameToPovProofDir(selectedProof);
  const sourceProofDir: vscode.Uri = vscode.Uri.parse(path.join(proofsPath, selectedProofDir));
  const targetProofDir: vscode.Uri = vscode.Uri.parse(path.join(targetPath, selectedProofDir));

  if (await WorkspaceUtils.copyDirThenOpenReadme(sourceProofDir, targetProofDir)) {
    // Telemetry.sendTelemetryEvent('pov-proof-exercise', {demo: selectedProof});
    vscode.window.showInformationMessage(`Selected ${selectedProof}`);
  };

}

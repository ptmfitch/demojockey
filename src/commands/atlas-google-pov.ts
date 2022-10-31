import * as vscode from 'vscode';
import * as fs from 'fs';
import * as WorkspaceUtils from './utils/workspace-utils';
// import * as Telemetry from './telemetry/realm-telemetry';
import * as path from 'path';

const repo = 'atlas-google-pov';
  
const proofsDir = 'proofs';
const proofsRepo = WorkspaceUtils.getPathsConfig().get(repo, '');
const proofsPath = `${proofsRepo}/${proofsDir}`;

const readmePath = `${proofsRepo}/README.md`;
const readmeText = fs.readFileSync(readmePath, 'utf8');

const proofNameRegex = /\[([A-Z-+ ]+)\]\(proofs\/([\w-]+)\)/g;
const proofNameMatches = Array.from(readmeText.matchAll(proofNameRegex));

function gcpProofDirToFriendlyName(proofDir: string): string {
  if (!proofNameMatches) { return proofDir; }

  // Get the matching proofName based on the second capture group
  // e.g. 00-XX => [PROOF-Name](proofs/00-XX)
  const proofNameMatch = proofNameMatches.find(match => match[2] === proofDir);
  if (!proofNameMatch) { return proofDir; }
  
  // Friendly name format is 00 PROOF-NAME
  return `${proofDir.slice(0, 2)} ${proofNameMatch[1]}`;
}

function friendlyNameToGcpProofDir(friendlyName: string): string {
  if (!proofNameMatches) { return friendlyName; }

  // Get the matching proofName based on the first capture group
  // Friendly name format is 00 PROOF-NAME
  // Remove the first 3 characters to get just the text
  const proofNameMatch = proofNameMatches.find(match => match[1] === friendlyName.slice(3));
  if (!proofNameMatch) { return friendlyName; }

  return proofNameMatch[2];
}

export async function command() {

  if (!proofsRepo) {
    vscode.window.showErrorMessage(WorkspaceUtils.repoAccessErrorMessage(repo));
    return;
  }
  const proofsList = (await WorkspaceUtils.listDirs(proofsPath)).map(proofNo => gcpProofDirToFriendlyName(proofNo));

  let targetPath;
  try { 
    targetPath = path.join(WorkspaceUtils.workspaceRootPath(), repo, proofsDir); 
  } catch (e) {
    WorkspaceUtils.logAndShowError((e as Error).message);
    return;
  }


  const selectedProof = await vscode.window.showQuickPick(proofsList, {
    placeHolder: 'Select an Atlas Google POV',
  });
  if (!selectedProof) { return; }
  const selectedProofDir = friendlyNameToGcpProofDir(selectedProof);
  const sourceProofDir: vscode.Uri = vscode.Uri.parse(path.join(proofsPath, selectedProofDir));
  const targetProofDir: vscode.Uri = vscode.Uri.parse(path.join(targetPath, selectedProofDir));

  if (await WorkspaceUtils.copyDirThenOpenReadme(sourceProofDir, targetProofDir)) {
    // Telemetry.sendTelemetryEvent('atlas-google-pov', {demo: selectedProof});
    vscode.window.showInformationMessage(`Selected ${selectedProof}`);
  }

}

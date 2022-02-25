import * as vscode from 'vscode';
import * as fs from 'fs';

const djConfig = vscode.workspace.getConfiguration('demojockey');
const pathsConfig = vscode.workspace.getConfiguration('demojockey.paths');

const ignoreFiles = [
  'LICENSE', 'README.md', '.DS_Store', '.git', '.gitignore', '99-G4'
];

async function listDirs(path: string, filter: Array<string> = ignoreFiles): Promise<string[]> {
  return (await vscode.workspace.fs.readDirectory(vscode.Uri.parse(path)))
    .map(tuple => tuple[0])
    .filter(dir => !filter.includes(dir));
}

function copyDirThenOpenReadme(source: vscode.Uri, target: vscode.Uri, overwrite: boolean): void {
      
  const readmeFilename = 'README.md';
  const readmePath = vscode.Uri.parse(`${target}/${readmeFilename}`).fsPath;

  vscode.workspace.fs.copy(source, target, {overwrite: overwrite}).then(_ => {
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

function repoAccessErrorMessage(repo: string): string { 
  return `Could not access local ${repo} repository, please configure in Settings (⌘,)`;
}
const workingFolderErrorMessage = 'Could not find working folder, open a folder and try again';

export function activate(context: vscode.ExtensionContext) {

  let povProofCommand = vscode.commands.registerCommand('demojockey.povProofExercise', async () => {

    const repo = 'pov-proof-exercises';

    const proofsDir = 'proofs';
    const proofsRepo = pathsConfig.get(repo, '');
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

    const doOverwrite = djConfig.get('overwrite', false);

    if (!proofsRepo) {
      vscode.window.showErrorMessage(repoAccessErrorMessage(repo));
      return;
    }
    const proofsList = (await listDirs(proofsPath)).map(proofNo => povProofNoToFriendlyName(proofNo));

    if (!vscode.workspace.workspaceFolders) {
      vscode.window.showErrorMessage(workingFolderErrorMessage);
      return;
    }
    const targetPath = `${vscode.workspace.workspaceFolders[0].uri.path}/${repo}/${proofsDir}`;

    const selectedProof = await vscode.window.showQuickPick(proofsList, {
      placeHolder: 'Select a POV Proof Exercise',
    });
    if (!selectedProof) { return; }
    const selectedProofDir = friendlyNameToPovProofDir(selectedProof);
    const sourceProofDir: vscode.Uri = vscode.Uri.parse(`${proofsPath}/${selectedProofDir}`);
    const targetProofDir: vscode.Uri = vscode.Uri.parse(`${targetPath}/${selectedProofDir}`);

    copyDirThenOpenReadme(sourceProofDir, targetProofDir, doOverwrite);

    vscode.window.showInformationMessage(`Selected ${selectedProof}`);

  });

  let gcpProofCommand = vscode.commands.registerCommand('demojockey.atlasGooglePov', async () => {

    const repo = 'atlas-google-pov';
    
    const proofsDir = 'proofs';
    const proofsRepo = pathsConfig.get(repo, '');
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

    const doOverwrite = djConfig.get('overwrite', false);

    if (!proofsRepo) {
      vscode.window.showErrorMessage(repoAccessErrorMessage(repo));
      return;
    }
    const proofsList = (await listDirs(proofsPath)).map(proofNo => gcpProofDirToFriendlyName(proofNo));

    if (!vscode.workspace.workspaceFolders) {
      vscode.window.showErrorMessage(workingFolderErrorMessage);
      return;
    }
    const targetPath = `${vscode.workspace.workspaceFolders[0].uri.path}/${repo}/${proofsDir}`;

    const selectedProof = await vscode.window.showQuickPick(proofsList, {
      placeHolder: 'Select an Atlas Google POV',
    });
    if (!selectedProof) { return; }
    const selectedProofDir = friendlyNameToGcpProofDir(selectedProof);
    const sourceProofDir: vscode.Uri = vscode.Uri.parse(`${proofsPath}/${selectedProofDir}`);
    const targetProofDir: vscode.Uri = vscode.Uri.parse(`${targetPath}/${selectedProofDir}`);

    copyDirThenOpenReadme(sourceProofDir, targetProofDir, doOverwrite);

    vscode.window.showInformationMessage(`Selected ${selectedProof}`);

  });

  let microDemoCommand = vscode.commands.registerCommand('demojockey.tfwMicroDemo', async () => {

    const repo = 'tfw-micro-demos';
    
    const microDemoPath = pathsConfig.get(repo, '');
    
    const doOverwrite = djConfig.get('overwrite', false);

    if (!microDemoPath) {
      vscode.window.showErrorMessage(repoAccessErrorMessage(repo));
      return;
    }
    const microDemosList = listDirs(microDemoPath);

    if (!vscode.workspace.workspaceFolders) {
      vscode.window.showErrorMessage(workingFolderErrorMessage);
      return;
    }
    const targetPath = `${vscode.workspace.workspaceFolders[0].uri.path}/${repo}`;

    const selectedMicroDemo = await vscode.window.showQuickPick(microDemosList, {
      placeHolder: 'Select a TFW Micro Demo',
    });
    if (!selectedMicroDemo) { return; }
    const sourceProofDir: vscode.Uri = vscode.Uri.parse(`${microDemoPath}/${selectedMicroDemo}`);
    const targetProofDir: vscode.Uri = vscode.Uri.parse(`${targetPath}/${selectedMicroDemo}`);

    copyDirThenOpenReadme(sourceProofDir, targetProofDir, doOverwrite);

    vscode.window.showInformationMessage(`Selected ${selectedMicroDemo}`);

  });

	context.subscriptions.push(povProofCommand, gcpProofCommand, microDemoCommand);

}

export function deactivate() {}

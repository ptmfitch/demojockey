import * as vscode from 'vscode';
import * as fs from 'fs';

const ignoreFiles = [
  'LICENSE', 'README.md', '.DS_Store', '.git', '.gitignore'
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

export function activate(context: vscode.ExtensionContext) {

  let proofPointCommand = vscode.commands.registerCommand('demojockey.povProofExercise', async () => {

    const djConfig = vscode.workspace.getConfiguration('demojockey');
    const pathsConfig = vscode.workspace.getConfiguration('demojockey.paths');
    
    const proofsDir = 'proofs';
    const proofsRepo = pathsConfig.get('pov-proof-exercises', '');
    const proofsPath = `${proofsRepo}/${proofsDir}`;

    const readmePath = `${proofsRepo}/README.md`;
    const readmeText = fs.readFileSync(readmePath, 'utf8');

    const proofNameRegex = /\[[(A-Z-)]+\]\(proofs\/\d{2}\)/g;
    const proofNames = readmeText.match(proofNameRegex);

    function proofNoToFriendlyName(proofNo: string): string {
      if (!proofNames) { return proofNo; }

      const proofIndex = parseInt(proofNo) - 1;
      if (!proofNames[proofIndex]) { return proofNo; }

      const proofNameRegexGroup = /\[([(A-Z-)]+)\]\(proofs\/\d{2}\)/;
      const match = proofNames[proofIndex].match(proofNameRegexGroup);
      if (!match || match.length > 2) { return proofNo; }
      
      return `${proofNo} ${match[1]}`;
    }

    function friendlyNameToProofDir(friendlyName: string): string {
      return friendlyName.slice(0, 2);
    }
    
    const targetDir = 'pov-proof-exercises/proofs';
    const doOverwrite = djConfig.get('overwrite', false);

    if (!proofsRepo) {
      const message = 'Could not access local pov-proof-exercises repository, please configure in Settings (⌘,)';
      vscode.window.showErrorMessage(message);
      return;
    }
    const proofsList = (await listDirs(proofsPath)).map(proofNo => proofNoToFriendlyName(proofNo));

    if (!vscode.workspace.workspaceFolders) {
      const message = 'Could not find working folder, open a folder and try again';
      vscode.window.showErrorMessage(message);
      return;
    }
    const targetPath = `${vscode.workspace.workspaceFolders[0].uri.path}/${targetDir}`;

    const selectedProof = await vscode.window.showQuickPick(proofsList, {
      placeHolder: 'Select a POV Proof Exercise',
    });
    if (!selectedProof) { return; }
    const selectedProofDir = friendlyNameToProofDir(selectedProof);
    vscode.window.showInformationMessage(`Selected ${selectedProof}`);
    const sourceProofDir: vscode.Uri = vscode.Uri.parse(`${proofsPath}/${selectedProofDir}`);
    const targetProofDir: vscode.Uri = vscode.Uri.parse(`${targetPath}/${selectedProofDir}`);

    copyDirThenOpenReadme(sourceProofDir, targetProofDir, doOverwrite);

  });

  let microDemoCommand = vscode.commands.registerCommand('demojockey.tfwMicroDemo', async () => {

    const djConfig = vscode.workspace.getConfiguration('demojockey');
    const pathsConfig = vscode.workspace.getConfiguration('demojockey.paths');
    
    const microDemoPath = pathsConfig.get('tfw-micro-demos', '');
    
    const targetDir = 'tfw-micro-demos';
    const doOverwrite = djConfig.get('overwrite', false);

    if (!microDemoPath) {
      const message = 'Could not access local tfw-micro-demos repository, please configure in Settings (⌘,)';
      vscode.window.showErrorMessage(message);
      return;
    }
    const microDemosList = listDirs(microDemoPath);

    if (!vscode.workspace.workspaceFolders) {
      const message = 'Could not find working folder, open a folder and try again';
      vscode.window.showErrorMessage(message);
      return;
    }
    const targetPath = `${vscode.workspace.workspaceFolders[0].uri.path}/${targetDir}`;

    const selectedMicroDemo = await vscode.window.showQuickPick(microDemosList, {
      placeHolder: 'Select a TFW Micro Demo',
    });
    if (!selectedMicroDemo) { return; }
    vscode.window.showInformationMessage(`Selected ${selectedMicroDemo}`);
    const sourceProofDir: vscode.Uri = vscode.Uri.parse(`${microDemoPath}/${selectedMicroDemo}`);
    const targetProofDir: vscode.Uri = vscode.Uri.parse(`${targetPath}/${selectedMicroDemo}`);

    copyDirThenOpenReadme(sourceProofDir, targetProofDir, doOverwrite);

  });

	context.subscriptions.push(proofPointCommand);
  context.subscriptions.push(microDemoCommand);
}

export function deactivate() {}

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

  let proofPointCommand = vscode.commands.registerCommand('demojockey.proofPoint', async () => {

    const djConfig = vscode.workspace.getConfiguration('demojockey');
    const pathsConfig = vscode.workspace.getConfiguration('demojockey.paths');
    
    const proofsDir = 'proofs';
    const proofsRepo = pathsConfig.get('pov-proof-exercises', '');
    const proofsPath = `${proofsRepo}/${proofsDir}`;
    
    const targetDir = 'pov-proof-exercises/proofs';
    const doOverwrite = djConfig.get('overwrite', false);

    async function listProofs(path: string) {
      return (await vscode.workspace.fs.readDirectory(vscode.Uri.parse(path)))
        .map(tuple => tuple[0])
        .filter(dir => dir !== '.DS_Store');
    }

    function copyProofThenOpenReadme(source: vscode.Uri, target: vscode.Uri, overwrite: boolean) {
      
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
        const message = 'Could not copy proof, it may already exist (overwrite configurable in Settings (⌘,))';
        vscode.window.showErrorMessage(message);
      }); 

    }

    if (!proofsRepo) {
      const message = 'Could not access local pov-proof-exercises repository, please configure in Settings (⌘,)';
      vscode.window.showErrorMessage(message);
      return;
    }
    const proofsList = listProofs(proofsPath);

    if (!vscode.workspace.workspaceFolders) {
      const message = 'Could not find working folder, open a folder and try again';
      vscode.window.showErrorMessage(message);
      return;
    }
    const targetPath = `${vscode.workspace.workspaceFolders[0].uri.path}/${targetDir}`;

    const selectedProof = await vscode.window.showQuickPick(proofsList, {
      placeHolder: 'Select a Proof Point',
    });
    if (!selectedProof) { return; }
    vscode.window.showInformationMessage(`Selected ${selectedProof}`);
    const sourceProofDir: vscode.Uri = vscode.Uri.parse(`${proofsPath}/${selectedProof}`);
    const targetProofDir: vscode.Uri = vscode.Uri.parse(`${targetPath}/${selectedProof}`);

    copyProofThenOpenReadme(sourceProofDir, targetProofDir, doOverwrite);

  });

	context.subscriptions.push(proofPointCommand);
}

export function deactivate() {}

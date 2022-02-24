import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

  const prfsPath = '/src/pov-proof-exercises/proofs';
  const trgtPath = '/pov-proof-exercises/proofs';

  let disposable = vscode.commands.registerCommand('demojockey.proofPoint', async () => {

    if (vscode.workspace.workspaceFolders === undefined) {
      vscode.window.showErrorMessage("Working folder not found, open a folder and try again");
      return;
    }
    var rootPath = vscode.workspace.workspaceFolders[0].uri.path;

    if (vscode.extensions.getExtension('ptmfitch.demojockey') !== undefined) {

      var extnPath = vscode.extensions.getExtension('ptmfitch.demojockey')?.extensionUri.path;

      // List proof directories from the repo
      var proofs = (await vscode.workspace.fs.readDirectory(vscode.Uri.parse(extnPath + prfsPath))).map(t => t[0]);

      // User input to select the directory
      const result = await vscode.window.showQuickPick(proofs, {
        placeHolder: 'Select a Proof Point',
      });
      vscode.window.showInformationMessage(`Selected ${result}`);
      
      // Copy the directory into the project
      var source: vscode.Uri = vscode.Uri.parse(extnPath + `${prfsPath}/${result}`);
      var target: vscode.Uri = vscode.Uri.parse(rootPath + `${trgtPath}/${result}`);
      vscode.workspace.fs.copy(source, target, {overwrite: false}).then(_ => {

        // Open the README.md of the newly copied proof
        let rdmePath = vscode.Uri.parse(`${target}/README.md`).fsPath;
        vscode.workspace.openTextDocument(rdmePath).then((td: vscode.TextDocument) => {
          vscode.window.showTextDocument(td, 1, false);
        }, (error) => {
          vscode.window.showErrorMessage(error);
        });

      }, (_) => {
        vscode.window.showErrorMessage('Could not copy proof, maybe it already exists');
      });

    } else {
      vscode.window.showErrorMessage("Extension path not found, try reinstalling");
      return;
    }    

  });

	context.subscriptions.push(disposable);
}

export function deactivate() {}

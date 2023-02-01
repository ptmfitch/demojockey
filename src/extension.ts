import * as vscode from 'vscode';
import * as PovProofExercise from './commands/pov-proof-exercise';
import * as AtlasGcpPov from './commands/atlas-google-pov';
import * as TfwMicroDemo from './commands/tfw-micro-demo';

export function activate(context: vscode.ExtensionContext) {

  let povProofCommand = vscode.commands.registerCommand('demojockey.povProofExercise', PovProofExercise.command);
  let gcpProofCommand = vscode.commands.registerCommand('demojockey.atlasGooglePov', AtlasGcpPov.command);
  let microDemoCommand = vscode.commands.registerCommand('demojockey.tfwMicroDemo', TfwMicroDemo.command);

	context.subscriptions.push(povProofCommand, gcpProofCommand, microDemoCommand);

}

export function deactivate() {}

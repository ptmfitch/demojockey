import * as vscode from 'vscode';
import * as PovProofExercise from './commands/pov-proof-exercise';
import * as AtlasGcpPov from './commands/atlas-google-pov';
import * as TfwMicroDemo from './commands/tfw-micro-demo';
import * as ApplyChanges from './commands/apply-changes';

export function activate(context: vscode.ExtensionContext) {

  let povProofCommand = vscode.commands.registerCommand('demojockey.povProofExercise', PovProofExercise.command);
  let gcpProofCommand = vscode.commands.registerCommand('demojockey.atlasGooglePov', AtlasGcpPov.command);
  let microDemoCommand = vscode.commands.registerCommand('demojockey.tfwMicroDemo', TfwMicroDemo.command);
  let applyChangesCommand = vscode.commands.registerCommand('demojockey.applyChanges', ApplyChanges.command);

	context.subscriptions.push(povProofCommand, gcpProofCommand, microDemoCommand, applyChangesCommand);

}

export function deactivate() {}

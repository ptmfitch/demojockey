import * as vscode from 'vscode';
import * as PovProofExercise from './commands/pov-proof-exercise';
import * as AtlasGcpPov from './commands/atlas-google-pov';
import * as TfwMicroDemo from './commands/tfw-micro-demo';
import * as CreateCluster from './commands/create-cluster';

export function activate(context: vscode.ExtensionContext) {

  let povProofCommand = vscode.commands.registerCommand('demojockey.povProofExercise', PovProofExercise.command);
  let gcpProofCommand = vscode.commands.registerCommand('demojockey.atlasGooglePov', AtlasGcpPov.command);
  let microDemoCommand = vscode.commands.registerCommand('demojockey.tfwMicroDemo', TfwMicroDemo.command);
  let createClusterCommand = vscode.commands.registerCommand('demojockey.createCluster', CreateCluster.command);

	context.subscriptions.push(povProofCommand, gcpProofCommand, microDemoCommand, createClusterCommand);

}

export function deactivate() {}

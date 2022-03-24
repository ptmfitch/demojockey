import * as vscode from 'vscode';
import * as AtlasAdminAPI from './utils/atlas-admin-api';
import * as AtlasAuth from './utils/atlas-auth';

function validateClusterName(clusterName: string): string | undefined | null | Thenable<string|undefined|null> {
  const invalidNameRegex = /[^A-z0-9\-]+/g;
  return clusterName.match(invalidNameRegex) ? 
    'Cluster names can only contain ASCII letters, numbers, and hyphens' :
    null;
}

export async function command() {
    
  const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${AtlasAdminAPI.getProjectId()}/clusters`;

  const instanceSizeName = await vscode.window.showQuickPick(['M2', 'M5', 'M10', 'M20'], {
    placeHolder: 'Select an instance size'
  });
  if (!instanceSizeName) { return; }
  const providerName = await vscode.window.showQuickPick(['AWS', 'AZURE', 'GCP'], {
    placeHolder: 'Select a provider'
  });
  if (!providerName) { return; }
  const zoneName = await vscode.window.showQuickPick(AtlasAdminAPI.listZones(providerName, instanceSizeName), {
    placeHolder: 'Select a region'
  });
  if (!zoneName) { return; }
  const regionName = await vscode.window.showQuickPick(AtlasAdminAPI.listRegions(zoneName, providerName, instanceSizeName), {
    placeHolder: 'Select a region'
  });
  if (!regionName) { return; }
  const clusterName = await vscode.window.showInputBox({prompt: "Name your cluster", validateInput: validateClusterName});
  if (!clusterName) { return; }

  const data = AtlasAdminAPI.clusterSettings(instanceSizeName, providerName, regionName);
  
  const response = await AtlasAuth.axios.request({
    url: url,
    method: 'POST',
    data: data
  }).then((response) => {
    return response;
  }, (error) => {
    return error;
  });

  if (response.status >= 200 && response.status <= 300) {
    vscode.window.showInformationMessage('Cluster created');
  } else {
    vscode.window.showErrorMessage(response.statusText);
  }
}

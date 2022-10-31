// import * as vscode from 'vscode';
// import * as AtlasAdminAPI from './utils/atlas-admin-api';
// import * as Workspace from './utils/workspace-utils';
// import * as Telemetry from './telemetry/realm-telemetry';

// export async function command() {

//   console.log('Initiating create-cluster command');

//   const instanceSizeName = await vscode.window.showQuickPick(['M2', 'M5', 'M10', 'M20'], {
//     placeHolder: 'Select an instance size'
//   });
//   if (!instanceSizeName) { 
//     Workspace.logAndShowError('No instance size selected');
//     return; 
//   }
//   console.log(`User selected instance size ${instanceSizeName}`);

//   const providerName = await vscode.window.showQuickPick(['AWS', 'AZURE', 'GCP'], {
//     placeHolder: 'Select a provider'
//   });
//   if (!providerName) { 
//     Workspace.logAndShowError('No provider selected');
//     return; 
//   }
//   console.log(`User selected provider ${providerName}`);

//   const zoneName = await vscode.window.showQuickPick(AtlasAdminAPI.listZones(providerName, instanceSizeName), {
//     placeHolder: 'Select a zone'
//   });
//   if (!zoneName) {
//     Workspace.logAndShowError('No zone selected');
//     return; 
//   }
//   console.log(`User selected zone ${zoneName}`);

//   const regionName = await vscode.window.showQuickPick(AtlasAdminAPI.listRegions(zoneName, providerName, instanceSizeName), {
//     placeHolder: 'Select a region'
//   });
//   if (!regionName) { 
//     Workspace.logAndShowError('No region selected');
//     return; 
//   }
//   console.log(`User selected region ${regionName}`);

//   const clusterName = await AtlasAdminAPI.inputClusterName();
//   if (!clusterName) { 
//     Workspace.logAndShowError('No cluster name inputted');
//     return; 
//   }
//   console.log(`User inputted cluster name ${clusterName}`);

//   try {
//     const connectionString = await AtlasAdminAPI.postCluster(instanceSizeName, providerName, regionName, clusterName);
//     Workspace.createThenOpenConnectionString(clusterName, connectionString);
//     Telemetry.sendTelemetryEvent("create-cluster", {
//       instanceSize: instanceSizeName,
//       provider: providerName,
//       region: regionName
//     });
//   } catch (e) {
//     Workspace.logAndShowError((e as Error).message);
//     return;
//   }
  
//   console.log('Completed create-cluster command');

// }

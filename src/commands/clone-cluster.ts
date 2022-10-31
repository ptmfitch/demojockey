// import * as vscode from 'vscode';
// import * as AtlasAdminAPI from './utils/atlas-admin-api';
// import * as Workspace from './utils/workspace-utils';
// import * as Telemetry from './telemetry/realm-telemetry';

// export async function command() {

//   console.log('Initiating clone-cluster command');

//   const clusterList: AtlasAdminAPI.Cluster[] = await AtlasAdminAPI.getClusters();
//   const clusterNames: string[] = clusterList.map(cluster => cluster.name);

//   if (clusterNames.length === 0) {
//     Workspace.logAndShowError('No clusters found');
//     return;
//   }

//   const sourceClusterName: string | undefined = await vscode.window.showQuickPick(clusterNames, {
//     placeHolder: 'Select an existing cluster to clone'
//   });
//   if (!sourceClusterName) { 
//     Workspace.logAndShowError('No cluster selected');
//     return; 
//   }
//   console.log(`User selected cluster ${sourceClusterName}`);

//   let targetClusterName = await AtlasAdminAPI.inputClusterName(clusterNames);
//   console.log(`User inputted cluster name ${targetClusterName}`);

//   const providerSettings = clusterList.find(c => c.name === sourceClusterName)?.providerSettings;
//   if (!providerSettings) { 
//     Workspace.logAndShowError(`No provider settings found matching cluster name ${sourceClusterName}`);
//     return; 
//   }

//   const instanceSizeName = providerSettings.instanceSizeName;
//   const providerName = providerSettings.backingProviderName ? providerSettings.backingProviderName : providerSettings.providerName;
//   const regionName = providerSettings.regionName;

//   try {
//     AtlasAdminAPI.postCluster(instanceSizeName, providerName, regionName, targetClusterName).then((connectionString) => {
//       Workspace.createThenOpenConnectionString(targetClusterName, connectionString);
//       Telemetry.sendTelemetryEvent("clone-cluster", {
//         instanceSize: instanceSizeName,
//         provider: providerName,
//         region: regionName
//       });
//     });
//   } catch (e) {
//     Workspace.logAndShowError((e as Error).message);
//     return;
//   }

//   console.log('Completed clone-cluster command');
  
// }

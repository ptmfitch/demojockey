// import axios from 'axios';
// import * as vscode from 'vscode';

// const telemetryUrl = 'https://eu-west-1.aws.data.mongodb-api.com/app/demo-jockey-mwbfl/endpoint/telemetry';

// const telemetryConf = vscode.workspace.getConfiguration('demojockey');

// function doSendTelemetry() { return telemetryConf.get('sendTelemetry'); };

// function getExtensionVersion() { return vscode.extensions.getExtension('ptmfitch.demojockey')?.packageJSON.version; }

// export async function sendTelemetryEvent(event: string, metadata: Object) {
  
//   if (!doSendTelemetry()) { 
//     console.log('Did not send telemetry event');
//     return; 
//   }
  
//   const data = {
//     timestamp: new Date(),
//     event: event,
//     machineId: vscode.env.machineId,
//     version: getExtensionVersion(),
//     metadata: metadata
//   };
//   console.log(`Sending telemetry event ${data}`);

//   axios.request({
//     method: 'post',
//     url: telemetryUrl,
//     headers: {
//       // eslint-disable-next-line @typescript-eslint/naming-convention
//       'Content-Type': 'application/json'
//     },
//     data: data
//   });
//   console.log('Sent telemetry event');

// }

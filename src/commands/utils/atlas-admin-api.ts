import * as vscode from 'vscode';

const atlasConfig = vscode.workspace.getConfiguration('demojockey.atlas');

// https://docs.atlas.mongodb.com/reference/amazon-aws/#synopsis
const awsZones = ['Americas', 'Asia Pacific', 'Europe', 'Middle East and Africa'];
const awsAmRegions = ['US_EAST_2', 'US_WEST_2', 'CA_CENTRAL_1', 'US_EAST_2', 'US_WEST_1', 'SA_EAST_1'];
const awsAmRegionsShared = ['US_EAST_2', 'US_WEST_2', 'SA_EAST_1'];
const awsApRegions = ['AP_SOUTHEAST_1', 'AP_SOUTH_1', 'AP_EAST_1', 'AP_SOUTHEAST_2', 'AP_NORTHEAST_1', 'AP_NORTHEAST_2', 'AP_NORTHEAST_3'];
const awsApRegionsShared = ['AP_SOUTHEAST_1', 'AP_SOUTH_1', 'AP_EAST_1', 'AP_SOUTHEAST_2', 'AP_NORTHEAST_1', 'AP_NORTHEAST_2'];
const awsEuRegions = ['EU_WEST_1', 'EU_CENTRAL_1', 'EU_NORTH_1', 'EU_WEST_2', 'EU_WEST_3', 'EU_SOUTH_1'];
const awsEuRegionsShared = ['EU_WEST_1', 'EU_CENTRAL_1', 'EU_NORTH_1', 'EU_WEST_3'];
const awsMeAfRegions = ['ME_SOUTH_1', 'AF_SOUTH_1'];

// https://docs.atlas.mongodb.com/reference/microsoft-azure/#synopsis
const azureZones = ['Americas', 'Europe', 'Asia Pacific', 'Africa', 'Middle East'];
const azureZonesShared = ['Americas', 'Europe', 'Asia Pacific'];
const azureAmRegions = ['US_CENTRAL', 'US_EAST', 'US_EAST_2', 'US_NORTH_CENTRAL', 'US_WEST', 'US_SOUTH_CENTRAL', 'US_WEST_2', 'WEST_CENTRAL_US', 'BRAZIL_SOUTH', 'CANADA_EAST', 'CANADA_CENTRAL'];
const azureAmRegionsShared = ['US_EAST_2', 'US_WEST', 'CANADA_CENTRAL'];
const azureEuRegions = ['EUROPE_NORTH', 'EUROPE_WEST', 'UK_SOUTH', 'UK_WEST', 'FRANCE_CENTRAL', 'GERMANY_WEST_CENTRAL', 'GERMANY_NORTH', 'SWITZERLAND_NORTH', 'SWITZERLAND_WEST', 'NORWAY_EAST'];
const azureEuRegionsShared = ['EUROPE_NORTH'];
const azureApRegions = ['ASIA_EAST', 'ASIA_SOUTH_EAST', 'AUSTRALIA_EAST', 'AUSTRALIA_SOUTH_EAST', 'INDIA_CENTRAL', 'INDIA_SOUTH', 'INDIA_WEST', 'JAPAN_EAST', 'JAPAN_WEST', 'KOREA_CENTRAL', 'KOREA_SOUTH'];
const azureApRegionsShared = ['INDIA_CENTRAL'];
const azureAfRegions = ['SOUTH_AFRICA_NORTH'];
const azureMeRegions = ['UAE_NORTH', 'UAE_CENTRAL'];

// https://docs.atlas.mongodb.com/reference/google-gcp/#synopsis
const gcpZones = ['Americas', 'Asia Pacific', 'Europe'];
const gcpAmRegions = ['CENTRAL_US', 'EASTERN_US', 'US_EAST_4', 'NORTH_AMERICA_NORTHEAST_1', 'NORTH_AMERICA_NORTHEAST_2', 'SOUTH_AMERICA_EAST_1', 'WESTERN_US', 'US_WEST_2', 'US-WEST_3', 'US-WEST_4'];
const gcpAmRegionsShared = ['CENTRAL_US'];
const gcpApRegions = ['EASTERN_ASIA_PACIFIC', 'ASIA_EAST_2', 'NORTHEASTERN_ASIA_PACIFIC', 'ASIA_NORTHEAST_2', 'ASIA_NORTHEAST_3', 'SOUTHEASTERN_ASIA_PACIFIC', 'ASIA_SOUTH_1', 'ASIA_SOUTH_2', 'AUSTRALIA_SOUTHEAST_1', 'AUSTRALIA_SOUTHEAST_2', 'ASIA-SOUTHEAST_2'];
const gcpApRegionsShared = ['EASTERN_ASIA_PACIFIC', 'NORTHEASTERN_ASIA_PACIFIC', 'ASIA_NORTHEAST_3', 'ASIA_SOUTH_1', 'ASIA-SOUTHEAST_2'];
const gcpEuRegions = ['WESTERN_EUROPE', 'EUROPE_NORTH_1', 'EUROPE_WEST_2', 'EUROPE_WEST_3', 'EUROPE_WEST_4', 'EUROPE_WEST_6', 'EUROPE_CENTRAL_2'];
const gcpEuRegionsShared = ['WESTERN_EUROPE'];

function isSharedInstance(instanceSizeName: string): boolean {
  // You can only have one M0 per
  // project so that's not an
  // option when using this plugin
  const sharedTiers = ['M2', 'M5'];
  return sharedTiers.includes(instanceSizeName);
}

export function listZones(providerName: string, instanceSizeName: string): Array<string> {
  switch(providerName) {
    case 'AWS':
      return awsZones;
    case 'AZURE':
      return isSharedInstance(instanceSizeName) ? azureZonesShared : azureZones;
    case 'GCP':
      return gcpZones;
    default:
      throw new Error(`Could not list zones, invalid provider selected: ${providerName}`);
  }
}

function listAWSRegions(zoneName: string, isSharedInstance: boolean): Array<string> {
  switch(zoneName) {
    case 'Americas':
      return isSharedInstance ? awsAmRegionsShared : awsAmRegions;
    case 'Asia Pacific':
      return isSharedInstance ? awsApRegionsShared : awsApRegions;
    case 'Europe':
      return isSharedInstance ? awsEuRegionsShared : awsEuRegions;
    // All Middle East and Africa regions
    // support M2 & M5 tier clusters
    case 'Middle East and Africa':
      return awsMeAfRegions;
    default:
      throw new Error(`Could not list regions, invalid zone selected: ${zoneName}`);
  }
}

function listAzureRegions(zoneName: string, isSharedInstance: boolean): Array<string> {
  switch(zoneName) {
    case 'Americas':
      return isSharedInstance ? azureAmRegionsShared : azureAmRegions;
    case 'Europe':
      return isSharedInstance ? azureEuRegionsShared : azureEuRegions;
    case 'Asia Pacific':
      return isSharedInstance ? azureApRegionsShared : azureApRegions;
    // Africa and Middle East regions won't
    // appear when isSharedInstance == true,
    // they're filtered out at zone stage
    case 'Africa':
      return azureAfRegions;
    case 'Middle East':
      return azureMeRegions;
    default:
      throw new Error(`Could not list regions, invalid zone selected: ${zoneName}`);
  }
}

function listGCPRegions(zoneName: string, isSharedInstance: boolean): Array<string> {
  switch(zoneName) {
    case 'Americas':
      return isSharedInstance ? gcpAmRegionsShared : gcpAmRegions;
    case 'Asia Pacific':
      return isSharedInstance ? gcpApRegionsShared : gcpApRegions;
    case 'Europe':
      return isSharedInstance ? gcpEuRegionsShared : gcpEuRegions;
    default:
      throw new Error(`Could not list regions, invalid zone selected: ${zoneName}`);
  }
}

export function listRegions(zoneName: string, providerName: string, instanceSizeName: string): Array<string> {
  let regions: Array<string> = [];
  switch(providerName) {
    case 'AWS':
      regions = listAWSRegions(zoneName, isSharedInstance(instanceSizeName));
      break;
    case 'AZURE':
      regions = listAzureRegions(zoneName, isSharedInstance(instanceSizeName));
      break;
    case 'GCP':
      regions = listGCPRegions(zoneName, isSharedInstance(instanceSizeName));
      break;
    default:
      throw new Error(`Could not list regions, invalid provider selected: ${providerName}`);
  }
  return regions;
}

export function clusterSettings(instanceSizeName: string, providerName: string, regionName: string): Object {
  return isSharedInstance(instanceSizeName) ? {
    'name': 'test',
    'providerSettings': {
      'backingProviderName': providerName,
      'instanceSizeName': instanceSizeName,
      'providerName': 'TENANT',
      'regionName': regionName
    }
  } : {
    'name': 'test',
    'providerSettings': {
      'instanceSizeName': instanceSizeName,
      'providerName': providerName,
      'regionName': regionName
    }
  };
}

export function getProjectId() { return atlasConfig.get('project-id', ''); }

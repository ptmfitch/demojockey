import * as fs from 'fs';

export function loadDataFromFile(path: string, encoding: BufferEncoding = 'utf-8'): string {
  console.debug(`Loading data from file ${path}`);
  try {
    const data = fs.readFileSync(path, encoding);
    return data;
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      console.warn(`File not found at ${path}`);
      return '';
    } else {
      throw err;
    }
  }
}

function writeDataToFile(data: string, path: string) {
  console.debug(`Writing data to file ${path}`);
  fs.writeFileSync(path, data);
}

function stringToMappings(data: string): Map<string, string> {
  if (data === '') { return new Map(); };
  var mappings = new Map();
  data.split('\n').forEach((s) => {
    const [source, target] = s.split('|');
    if (source !== '') {
      mappings.set(source, target);
    }
  });
  return mappings;
}

function mappingsToString(mappings: Map<string, string>): string {
  var data = '';
  mappings.forEach((target, source) => {
    if (source !== '') {
      data = data.concat(`${source}|${target}\n`);
    }
  });
  return data;
}

export function loadDirectoryMappings(mappingFilePath: string): Map<string, string> {
  const data = loadDataFromFile(mappingFilePath);
  return stringToMappings(data);
}

function updateDirectoryMappings(mappings: Map<string, string>, mappingFilePath: string) {
  const data = mappingsToString(mappings);
  writeDataToFile(data, mappingFilePath);
}

export function updateOneDirectoryMapping(sourceDir: string, targetDir: string, mappingFilePath: string) {
  var mappings = loadDirectoryMappings(mappingFilePath);
  mappings.set(sourceDir, targetDir);
  updateDirectoryMappings(mappings, mappingFilePath);
}

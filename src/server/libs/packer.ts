import fs from 'fs';
import childProcess from 'child_process';
import rmdir from 'rmrf';
import * as util from 'util';
import { getTmpDirSync } from './tmpDir';

const execAsync = util.promisify(childProcess.exec);

export const packerBuild = async (
  builders: any[],
  provisioners: any[],
  extraFiles: { fileName: string; fileContent: string }[],
) => {
  const tmpDir = getTmpDirSync('packer');
  fs.mkdirSync(tmpDir);

  // write extra files
  extraFiles.forEach((ef) => {
    fs.writeFileSync(tmpDir + `/${ef.fileName}`, ef.fileContent, 'utf-8');
  });

  // write packer.json
  fs.writeFileSync(
    tmpDir + '/packer.json',
    JSON.stringify({
      builders,
      provisioners,
    }),
    'utf-8',
  );

  // run packer build
  const { stdout, stderr } = await execAsync('packer build packer.json', {
    cwd: tmpDir,
  });
  console.log(stdout, stderr);

  await rmdir(tmpDir);
};

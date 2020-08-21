import fs from 'fs';
import childProcess from 'child_process';
import rmdir from 'rmrf';
import * as util from 'util';
import { getTmpDirSync } from './tmpDir';

const execAsync = util.promisify(childProcess.exec);

export const packerBuild = async (builders: any[], provisioners: any[]) => {
  const tmpDir = getTmpDirSync('packer');
  fs.mkdirSync(tmpDir);

  fs.writeFileSync(
    tmpDir + '/packer.json',
    JSON.stringify({
      builders,
      provisioners,
    }),
    'utf-8',
  );
  const { stdout, stderr } = await execAsync('packer build packer.json', {
    cwd: tmpDir,
  });
  console.log(stdout, stderr);

  await rmdir(tmpDir);
};

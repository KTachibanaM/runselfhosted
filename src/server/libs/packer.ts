import fs from 'fs';
import { ChildProcess, spawn } from 'child_process';
import rmdir from 'rmrf';
import { getTmpDirSync } from './tmp-dir';

// https://2ality.com/2018/05/child-process-streams.html
const onExit = (childProcess: ChildProcess): Promise<void> => {
  return new Promise((resolve, reject) => {
    childProcess.once('exit', (code: number, _: string) => {
      if (code === 0) {
        resolve(undefined);
      } else {
        reject(new Error('Exit with error code: ' + code));
      }
    });
    childProcess.once('error', (err: Error) => {
      reject(err);
    });
  });
};

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
  const p = spawn('packer', ['build', 'packer.json'], {
    cwd: tmpDir,
    stdio: [process.stdin, process.stdout, process.stderr],
  });
  await onExit(p);

  await rmdir(tmpDir);
};

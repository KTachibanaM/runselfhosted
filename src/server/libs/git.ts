import rmdir from 'rmrf';
import git from 'simple-git';
import { getTmpDirSync } from './tmp-dir';
import { readFileSync } from 'fs';

export const getGitHash = async (gitUrl: string, gitBranch: string) => {
  const tmpDir = getTmpDirSync('git');

  await git().clone(gitUrl, tmpDir);
  const gitCommit = await git(tmpDir).revparse(['--verify', gitBranch]);

  await rmdir(tmpDir);
  return gitCommit;
};

export const getGitRepoFileContent = async (gitUrl: string, gitHash: string, filePath: string) => {
  const tmpDir = getTmpDirSync('git');

  await git().clone(gitUrl, tmpDir);
  await git(tmpDir).checkout(gitHash);
  const fileContent = readFileSync(tmpDir + '/' + filePath, 'utf-8');

  await rmdir(tmpDir);
  return fileContent;
};

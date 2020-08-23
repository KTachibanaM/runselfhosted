import rmdir from 'rmrf';
import git from 'simple-git';
import { getTmpDirSync } from './tmp-dir';

export const getGitHash = async (gitUrl: string, gitBranch: string) => {
  const tmpDir = getTmpDirSync('git');

  await git().clone(gitUrl, tmpDir);
  const gitCommit = await git(tmpDir).revparse(['--verify', gitBranch]);

  await rmdir(tmpDir);
  return gitCommit;
};

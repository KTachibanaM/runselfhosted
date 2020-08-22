import { getApps, setState, setNextGitHash } from './db';
import { getGitHash } from './libs/git';
import { workQueue } from './work';

export const unstableStateClock = () => {
  console.log('Running unstable state clock');
  getApps().forEach(async (a) => {
    if (a.state === 'pending-provision') {
      if (!a.nextGitHash) {
        const gitHash = await getGitHash(a.gitUrl, a.gitBranch);
        setNextGitHash(a.id, gitHash);
      }
      workQueue.add({
        work: 'provision',
        appId: a.id,
      });
      setState(a.id, 'provisioning');
    } else if (a.state === 'provisioning') {
      console.log(`app ${a.slug} is still provisioning`);
    } else if (a.state === 'provisioned') {
    } else {
      console.log(`Unhandled unstable state ${a.state} for app ${a.slug}`);
    }
  });
};

export const stableStateClock = () => {
  // TODO: should be able to adjust per app
  getApps().forEach(async (a) => {
    if (a.state === 'provisioned') {
      const gitHash = await getGitHash(a.gitUrl, a.gitBranch);
      if (gitHash !== a.currentGitHash) {
        setNextGitHash(a.id, gitHash);
        setState(a.id, 'pending-provision');
      }
    } else if (a.state === 'pending-provision' || a.state === 'provisioning') {
    } else {
      console.log(`Unhandled stable state ${a.state} for app ${a.slug}`);
    }
  });
};

import { getApps, setState, setCurrentGitHash, setNextGitHash, setStateState } from './db';
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
      setState(a.id, 'building-image');
    } else if (a.state === 'building-image') {
      if (a.stateState === 'pending') {
        workQueue.add({
          work: 'buildImage',
          appId: a.id,
        });
        setStateState(a.id, 'started');
      } else if (a.stateState === 'started') {
        console.log(`building-image is still running for app ${a.slug}`);
      } else if (a.stateState === 'finished') {
        setState(a.id, 'provisioning-infra');
        setStateState(a.id, 'pending');
      }
    } else if (a.state === 'provisioning-infra') {
      if (a.stateState === 'pending') {
        workQueue.add({
          work: 'provisionInfra',
          appId: a.id,
        });
        setStateState(a.id, 'started');
      } else if (a.stateState === 'started') {
        console.log(`provisioning-infra is still running for app ${a.slug}`);
      } else if (a.stateState === 'finished') {
        setCurrentGitHash(a.id, a.nextGitHash);
        setState(a.id, 'provisioned');
        setStateState(a.id, 'pending');
      }
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
    } else if (a.state === 'pending-provision' || a.state === 'building-image' || a.state === 'provisioning-infra') {
    } else {
      console.log(`Unhandled stable state ${a.state} for app ${a.slug}`);
    }
  });
};

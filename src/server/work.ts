import { buildImage } from './works/buildImage';
import { provisionInfra } from './works/provisionInfra';
import Queue from 'bull';
import { setStateState } from './db';

const WorkMaxDurationMs = 1000 * 60 * 60;

export const Works = ['buildImage', 'provisionInfra'] as const;
export type Work = typeof Works[number];

export interface WorkQueueItem {
  work: Work;
  appId: string;
}

export const work = async ({ work, appId }: WorkQueueItem) => {
  if (work === 'buildImage') {
    await buildImage(appId);
    setStateState(appId, 'finished');
  } else if (work === 'provisionInfra') {
    await provisionInfra(appId);
    setStateState(appId, 'finished');
  } else {
    console.log(`Unknown work type ${work}`);
  }
};

export const workQueue = Queue<WorkQueueItem>('runselfhosted-work', null, {
  settings: {
    lockDuration: WorkMaxDurationMs,
  },
});

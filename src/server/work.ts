import Queue from 'bull';
import { provisioning } from './provisioning/provisioning';

const WorkMaxDurationMs = 1000 * 60 * 60;

export const Works = ['provision'] as const;
export type Work = typeof Works[number];

export interface WorkQueueItem {
  work: Work;
  appId: string;
}

export const work = async ({ work, appId }: WorkQueueItem) => {
  try {
    if (work === 'provision') {
      await provisioning(appId);
    } else {
      console.log(`Unknown work type ${work}`);
    }
  } catch (e) {
    console.error('Work errored!');
    console.error(e);
  }
};

export const workQueue = Queue<WorkQueueItem>('runselfhosted-work', null, {
  settings: {
    lockDuration: WorkMaxDurationMs,
  },
});

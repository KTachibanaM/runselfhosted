import { work, workQueue } from './work';

workQueue.process(async (job) => {
  await work(job.data);
  return true;
});

const PollMs = 1000 * 10;
const PollMaxCount = 60;

export const booleanPolling = async (pollingFunc: () => Promise<boolean>) => {
  let pollCount = 0;
  return new Promise((resolve, reject) => {
    const poll = async () => {
      if (pollCount > PollMaxCount) {
        return reject();
      }
      if (await pollingFunc()) {
        return resolve();
      }
      pollCount++;
      setTimeout(poll, PollMs);
    };
    poll();
  });
};

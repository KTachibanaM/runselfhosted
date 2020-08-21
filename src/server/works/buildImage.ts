import { packerBuild } from '../libs/packer';
import { getAppById, getInfraById } from '../db';

export const buildImage = async (appId: string) => {
  console.log(`Building image for app ${appId}`);
  const app = getAppById(appId);
  await packerBuild(
    [
      {
        type: 'digitalocean',
        // eslint-disable-next-line @typescript-eslint/camelcase
        api_token: getInfraById(app.infraId).token,
        image: 'docker-18-04',
        region: 'sfo2',
        size: '512mb',
        // eslint-disable-next-line @typescript-eslint/camelcase
        ssh_username: 'root',
        // eslint-disable-next-line @typescript-eslint/camelcase
        snapshot_name: `runselfhosted-${app.id}-${app.nextGitHash}`,
      },
    ],
    [
      {
        type: 'shell',
        inline: ['touch /tmp/hello-from-run-selfhosted.txt'],
      },
    ],
  );
};

import { packerBuild } from '../libs/packer';
import { getAppById, getInfraById } from '../db';
import { AppModel } from '../../shared/AppModel';
import * as fs from 'fs';

export const getImageName = (app: AppModel) => {
  return `runselfhosted-${app.slug}-${app.nextGitHash}`;
};

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
        // TODO: customize
        region: 'sfo2',
        size: '512mb',
        // eslint-disable-next-line @typescript-eslint/camelcase
        ssh_username: 'root',
        // eslint-disable-next-line @typescript-eslint/camelcase
        snapshot_name: getImageName(app),
      },
    ],
    [
      {
        type: 'shell',
        scripts: ['configure.sh'],
      },
    ],
    [
      {
        fileName: 'configure.sh',
        fileContent: fs.readFileSync('resources/configure.sh', 'utf-8'),
      },
    ],
  );
};

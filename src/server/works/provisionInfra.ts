import { getAppById, getInfraById } from '../db';
import DigitalOcean from 'do-wrapper';
import { getImageName } from './buildImage';
import { AppModel } from '../../shared/AppModel';

const DropletActivePollMs = 1000 * 10;
const DropletActivePollMax = 60;

const getDropletName = (app: AppModel) => {
  return `runselfhosted-${app.slug}`;
};

export const provisionInfra = async (appId: string) => {
  console.log(`Provisioning infra for app ${appId}`);
  const app = getAppById(appId);
  const api = new DigitalOcean(getInfraById(app.infraId).token, 999);

  // get image id
  const imageName = getImageName(app);
  const imagesRes = await api.images.getAll('');
  const images = imagesRes['images'].filter((i) => i.name === imageName);
  if (images.length === 0 || images.length > 1) {
    console.log(`Expecting to get one and only one image for app ${appId}`);
    return;
  }
  const image = images[0];
  const imageId = image['id'];

  // provision
  const dropletRes = await api.droplets.create({
    name: getDropletName(app),
    // TODO: customize
    region: 'sfo2',
    // TODO: customize
    size: '512mb',
    image: imageId,
    // TODO: use existing public keys
    // eslint-disable-next-line @typescript-eslint/camelcase
    ssh_keys: [],
    backups: false,
    ipv6: false,
    // eslint-disable-next-line @typescript-eslint/camelcase
    private_networking: false,
    // eslint-disable-next-line @typescript-eslint/camelcase
    user_data: '',
    monitoring: true,
    volumes: [],
    tags: '',
  });
  const dropletId = dropletRes['droplet']['id'];

  const isDropletActive = async (): Promise<boolean> => {
    const dRes = await api.droplets.getById(dropletId);
    return dRes['droplet']['status'] === 'active';
  };

  let dropletActivePoll = 0;
  return new Promise((resolve, reject) => {
    (function waitForDropletActive() {
      if (dropletActivePoll > DropletActivePollMax) {
        return reject();
      }
      if (isDropletActive()) {
        return resolve();
      }
      dropletActivePoll++;
      setTimeout(waitForDropletActive, DropletActivePollMs);
    })();
  });
};

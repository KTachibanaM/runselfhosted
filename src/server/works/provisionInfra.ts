import { getAppById, getInfraById } from '../db';
import DigitalOcean from 'do-wrapper';
import { getImageName } from './buildImage';

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
  await api.droplets.create({
    name: `runselfhosted-${app.id}`,
    // TODO: customize
    region: 'sfo2',
    // TODO: customize
    size: '512mb',
    image: imageId,
    // TODO :\
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

  // TODO: pull for active status
};

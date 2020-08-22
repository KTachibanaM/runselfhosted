import { getAppById, getInfraById, setCurrentGitHash, setState } from '../db';
import { packerBuild } from '../libs/packer';
import fs from 'fs';
import DigitalOcean from 'do-wrapper';
import { AppModel } from '../../shared/AppModel';

const DropletStatusPollMs = 1000 * 10;
const DropletStatusPollMax = 60;

const getImageName = (app: AppModel) => {
  return `runselfhosted-${app.slug}-${app.nextGitHash}`;
};

const getDropletName = (app: AppModel) => {
  return `runselfhosted-${app.slug}`;
};

export const provisioning = async (appId: string) => {
  const app = getAppById(appId);

  console.log(`Building image for app ${app.slug}`);
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

  const api = new DigitalOcean(getInfraById(app.infraId).token, 999);

  // get image id
  const imageName = getImageName(app);
  const imagesRes = await api.images.getAll('');
  const images = imagesRes['images'].filter((i) => i.name === imageName);
  if (images.length === 0 || images.length > 1) {
    console.log(`Expecting to get one and only one image for app ${app.slug}`);
    return;
  }
  const image = images[0];
  const imageId = image['id'];

  // provision
  console.log(`Provisioning droplet for app ${app.slug}`);
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

  const isDropletInStatus = async (status: string) => {
    const dRes = await api.droplets.getById(dropletId);
    return dRes['droplet']['status'] === status;
  };

  const waitForDropletStatus = async (status: string) => {
    let dropletStatusPollCount = 0;
    return new Promise((resolve, reject) => {
      const waitForDropletStatus = async () => {
        if (dropletStatusPollCount > DropletStatusPollMax) {
          return reject();
        }
        if (await isDropletInStatus(status)) {
          return resolve();
        }
        dropletStatusPollCount++;
        setTimeout(waitForDropletStatus, DropletStatusPollMs);
      };
      waitForDropletStatus();
    });
  };
  await waitForDropletStatus('active');

  // remove image
  console.log(`Removing image for app ${app.slug}`);
  await api.images.deleteById(imageId);

  // deprovision old droplets
  console.log(`Deprovisioning old droplet for app ${app.slug}`);
  const dropletsRes = await api.droplets.getAll('');
  const oldDroplets = dropletsRes['droplets'].filter((d) => d.name === getDropletName(app) && d.id !== dropletId);
  for (const d of oldDroplets) {
    await api.droplets.deleteById(d.id);
  }

  setCurrentGitHash(app.id, app.nextGitHash);
  setState(app.id, 'provisioned');
};

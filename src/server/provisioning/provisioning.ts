import { getAppById, getInfraById, setCurrentGitHash, setState, setWebAddress } from '../db';
import { packerBuild } from '../libs/packer';
import fs from 'fs';
import DigitalOcean from 'do-wrapper';
import { AppModel } from '../../shared/AppModel';
import { booleanPolling } from '../libs/boolean-polling';
import fetch from 'node-fetch';
import { getGitRepoFileContent } from '../libs/git';

const getImageName = (app: AppModel) => {
  return `runselfhosted-${app.slug}-${app.nextGitHash}`;
};

const getDropletName = (app: AppModel) => {
  return `runselfhosted-${app.slug}`;
};

interface ConfigureScript {
  gitUrl: string;
  gitHash: string;
  dockerContext: string;
  dockerComposePath: string;
  dockerComposeContent: string;
  serverName: string;
  webPort: number;
}

const configureScript = (config: ConfigureScript) => {
  return fs
    .readFileSync('resources/configure.sh', 'utf-8')
    .replace(/RUNSELFHOSTED_GIT_URL/g, config.gitUrl)
    .replace(/RUNSELFHOSTED_GIT_HASH/g, config.gitHash)
    .replace(/RUNSELFHOSTED_DOCKER_CONTEXT/g, config.dockerContext)
    .replace(/RUNSELFHOSTED_DOCKER_COMPOSE_PATH/g, config.dockerComposePath)
    .replace(/RUNSELFHOSTED_DOCKER_COMPOSE_CONTENT/g, config.dockerComposeContent)
    .replace(/RUNSELFHOSTED_SERVER_NAME/g, config.serverName)
    .replace(/RUNSELFHOSTED_WEB_PORT/g, config.webPort.toString());
};

export const provisioning = async (appId: string) => {
  const app = getAppById(appId);
  const dropletName = getDropletName(app);
  const api = new DigitalOcean(getInfraById(app.infraId).token, 999);

  // reserve floating IP
  const floatingIpsRes = await api.floatingIPs.getAll('');
  const floatingIps = floatingIpsRes['floating_ips'].filter(
    (ip) => ip.droplet !== null && ip.droplet.name === dropletName,
  );
  let floatingIp;
  if (floatingIps.length === 0) {
    console.log(`Reserving an floating IP for app ${app.slug} `);
    // TODO: customize region
    const floatingIpRes = await api.floatingIPs.assignRegion('sfo2');
    floatingIp = floatingIpRes['floating_ip'];
  } else if (floatingIps.length > 1) {
    console.log(`Getting more than one floating IPs for app ${app.slug}`);
    return;
  } else {
    floatingIp = floatingIps[0];
  }

  // TODO: read actual repo and change
  const dockerComposePath = 'docker-compose.yml';
  const config: ConfigureScript = {
    gitUrl: app.gitUrl,
    gitHash: app.nextGitHash,
    dockerContext: '.',
    dockerComposePath: dockerComposePath,
    dockerComposeContent: await getGitRepoFileContent(app.gitUrl, app.nextGitHash, dockerComposePath),
    serverName: floatingIp.ip,
    webPort: 1200,
  };

  // build image
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
        // TODO: customize
        size: 's-1vcpu-1gb',
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
        fileContent: configureScript(config),
      },
    ],
  );

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
    name: dropletName,
    // TODO: customize
    region: 'sfo2',
    // TODO: customize
    size: 's-1vcpu-1gb',
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
    return booleanPolling(() => {
      return isDropletInStatus(status);
    });
  };
  await waitForDropletStatus('active');

  // remove image
  console.log(`Removing image for app ${app.slug}`);
  await api.images.deleteById(imageId);

  const isFloatingIpActionCompleted = async (floatingIp: string, actionId: string) => {
    const aRes = await api.floatingIPs.getAction(floatingIp, actionId);
    return aRes['action']['status'] === 'completed';
  };

  const waitForFloatingIpActionComplete = async (floatingIp: string, actionId: string) => {
    return booleanPolling(() => {
      return isFloatingIpActionCompleted(floatingIp, actionId);
    });
  };

  // reassign floating IP
  console.log(`Reassigning floating IP ${floatingIp.ip} to app ${app.slug}`);
  if (floatingIp.droplet) {
    // eslint-disable-next-line @typescript-eslint/camelcase,@typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const unassignAction = await api.floatingIPs.requestAction(floatingIp.ip, {
      type: 'unassign',
      // eslint-disable-next-line @typescript-eslint/camelcase
      droplet_id: dropletId,
    });
    const actionId = unassignAction['action']['id'];
    await waitForFloatingIpActionComplete(floatingIp.ip, actionId);
  }
  // eslint-disable-next-line @typescript-eslint/camelcase,@typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/camelcase
  await api.floatingIPs.requestAction(floatingIp.ip, { type: 'assign', droplet_id: dropletId });

  // deprovision old droplets
  console.log(`Deprovisioning old droplet for app ${app.slug}`);
  const dropletsRes = await api.droplets.getAll('');
  const oldDroplets = dropletsRes['droplets'].filter((d) => d.name === dropletName && d.id !== dropletId);
  for (const d of oldDroplets) {
    await api.droplets.deleteById(d.id);
  }

  const webAddress = `http://${floatingIp.ip}`;

  const isWebAddressAlive = async () => {
    const res = await fetch(webAddress);
    return res.status === 200;
  };

  const waitForWebAddressAlive = async () => {
    return booleanPolling(isWebAddressAlive);
  };

  // wait for web address to be alive
  await waitForWebAddressAlive();

  setWebAddress(app.id, webAddress);
  setCurrentGitHash(app.id, app.nextGitHash);
  setState(app.id, 'provisioned');
};

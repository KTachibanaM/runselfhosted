import axios from 'axios';
import { AppModel } from '../../shared/AppModel';
import { InfrastructureModel } from '../../shared/InfrastructureModel';

export function getApps() {
  return axios.get(`/api/apps`).then((res) => res.data as AppModel[]);
}

export function getAppById(appId: string) {
  return axios.get(`/api/apps/${appId}`).then((res) => res.data as AppModel);
}

export function createApp(slug: string, gitUrl: string, gitBranch: string, infraId: string) {
  return axios
    .post(`/api/apps`, {
      slug,
      gitUrl,
      gitBranch,
      infraId,
    })
    .then((res) => res.data as { status: string; id: string });
}

export function redeployAppNewVersion(appId: string) {
  return axios.post(`/api/apps/${appId}/redeployNewVersion`).then((res) => res.data as { status: string });
}

export function getInfras() {
  return axios.get(`/api/infras`).then((res) => res.data as InfrastructureModel[]);
}

export function getInfraById(infraId: string) {
  return axios.get(`/api/infras/${infraId}`).then((res) => res.data as InfrastructureModel);
}

export function createInfra(slug: string, provider: string, token: string) {
  return axios
    .post(`/api/infras`, {
      slug,
      provider,
      token,
    })
    .then((res) => res.data as { status: string; id: string });
}

import fs from 'fs';
import { AppModel, State, StateState } from '../shared/AppModel';
import { InfrastructureModel } from '../shared/InfrastructureModel';

const AppsJson = 'apps.temp.json';

export const getApps = (): AppModel[] => {
  if (!fs.existsSync(AppsJson)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(AppsJson, 'utf-8')) as AppModel[];
};

export const getAppById = (appId: string): AppModel | undefined => {
  const apps = getApps();
  for (let i = 0; i < apps.length; ++i) {
    if (apps[i].id === appId) {
      return apps[i];
    }
  }
  return undefined;
};

const setField = (appId: string, field: string, value: any) => {
  setApps(
    getApps().map((a) => {
      if (a.id !== appId) {
        return a;
      }
      a[field] = value;
      return a;
    }),
  );
};

export const setState = (appId: string, newState: State) => {
  setField(appId, 'state', newState);
};

export const setNextGitHash = (appId: string, gitHash: string) => {
  setField(appId, 'nextGitHash', gitHash);
};

export const setCurrentGitHash = (appId: string, gitHash: string) => {
  setField(appId, 'currentGitHash', gitHash);
};

export const setStateState = (appId: string, stateState: StateState) => {
  setField(appId, 'stateState', stateState);
};

export const setApps = (apps: AppModel[]) => {
  return fs.writeFileSync(AppsJson, JSON.stringify(apps));
};

const InfrasJson = 'infras.temp.json';

export const getInfras = (): InfrastructureModel[] => {
  if (!fs.existsSync(InfrasJson)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(InfrasJson, 'utf-8')) as InfrastructureModel[];
};

export const getInfraById = (infraId: string): InfrastructureModel | undefined => {
  const infras = getInfras();
  for (let i = 0; i < infras.length; ++i) {
    if (infras[i].id === infraId) {
      return infras[i];
    }
  }
  return undefined;
};

export const setInfras = (infras: InfrastructureModel[]) => {
  return fs.writeFileSync(InfrasJson, JSON.stringify(infras));
};

// TODO: add removing-image
// TODO: add deprovisioning-prev-infra
// TODO: add reserving-ip and/or attaching-domain
export const States = ['pending-provision', 'building-image', 'provisioning-infra', 'provisioned'] as const;
export type State = typeof States[number];
export const InitialState: State = 'pending-provision';

export const StateStates = ['pending', 'started', 'finished'];
export type StateState = typeof StateStates[number];
export const InitialStateState = 'pending';

export interface AppModel {
  id: string;
  slug: string;
  gitUrl: string;
  gitBranch: string;
  infraId: string;
  state: State;
  stateState: StateState;
  currentGitHash: string;
  nextGitHash: string;
}

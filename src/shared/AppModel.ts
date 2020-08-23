export const States = ['pending-provision', 'provisioning', 'provisioned'] as const;
export type State = typeof States[number];
export const InitialState: State = 'pending-provision';

export interface AppModel {
  id: string;
  slug: string;
  gitUrl: string;
  gitBranch: string;
  infraId: string;
  state: State;
  currentGitHash: string;
  nextGitHash: string;
  webAddress: string;
}

export const Providers = ['digitalocean', 'linode'] as const;
export type Provider = typeof Providers[number];

export interface InfrastructureModel {
  id: string;
  slug: string;
  provider: Provider;
  token: string;
}

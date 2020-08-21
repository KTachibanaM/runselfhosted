export const Providers = ['digitalocean'] as const;
export type Provider = typeof Providers[number];

export interface InfrastructureModel {
  id: string;
  slug: string;
  provider: Provider;
  token: string;
}

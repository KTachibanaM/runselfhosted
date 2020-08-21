export const provisionInfra = async (appId: string) => {
  console.log(`Pretending to be provisioning infra for app ${appId}`);
  await new Promise((resolve) => setTimeout(resolve, 1000 * 60));
};

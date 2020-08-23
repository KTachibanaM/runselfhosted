export const disableRestartForAllServices = (dockerCompose: any): any => {
  const res = { ...dockerCompose };
  Object.keys(res['services']).forEach((serviceName) => {
    res['services'][serviceName]['restart'] = 'no';
  });
  return res;
};

export const addServiceBuild = (
  dockerCompose: any,
  serviceName: string,
  dockerFilepath: string,
  dockerContext: string,
): any => {
  const res = { ...dockerCompose };
  res['services'][serviceName]['build'] = { dockerfile: dockerFilepath, context: dockerContext };
  return res;
};

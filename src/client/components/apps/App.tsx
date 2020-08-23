import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { AppModel } from '../../../shared/AppModel';
import { getAppById, redeployAppNewVersion } from '../../utils/api-facade';
import { NavLink } from 'react-router-dom';
import { Button } from '@material-ui/core';

interface Props {
  appId: string;
}

export const App: React.FunctionComponent<Props> = ({ appId }) => {
  const [app, setApp] = useState<AppModel | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getAppById(appId)
      .then((app) => setApp(app))
      .catch((error) => setError(error));
  }, []);

  if (error !== null) {
    return <div>{error.toString()}</div>;
  }

  if (app === null) {
    return <div>Loading...</div>;
  }

  const webAddress = app.webAddress ? (
    <a href={app.webAddress} target='_blank' rel='noreferrer'>
      {app.webAddress}
    </a>
  ) : (
    'N/A'
  );

  return (
    <Card>
      <CardHeader title={app.slug} />
      <CardContent>
        <Typography>Id: {app.id}</Typography>
        <Typography>{`Git: ${app.gitUrl} (${app.gitBranch})`}</Typography>
        <Typography>
          Infrastructure: <NavLink to={`/infras/${app.infraId}`}>{app.infraId}</NavLink>
        </Typography>
        <Typography>State: {app.state}</Typography>
        <Typography>Web address: {webAddress}</Typography>
        <Button
          color='secondary'
          variant='contained'
          onClick={(e) => {
            e.preventDefault();
            redeployAppNewVersion(app.id);
          }}
        >
          Redeploy new version
        </Button>
      </CardContent>
    </Card>
  );
};

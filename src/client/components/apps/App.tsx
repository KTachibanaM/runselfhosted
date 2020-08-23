import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { AppModel } from '../../../shared/AppModel';
import { getAppById, redeployAppNewVersion } from '../../utils/api-facade';
import { Button } from '@material-ui/core';
import { AppState } from './AppState';
import { AppWebAddress } from './AppWebAddres';
import { AppGit } from './AppGit';
import { AppInfra } from './AppInfra';

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

  return (
    <Card>
      <CardHeader title={app.slug} />
      <CardContent>
        <Typography>Id: {app.id}</Typography>
        <Typography>
          Git: <AppGit gitUrl={app.gitUrl} gitBranch={app.gitBranch} />
        </Typography>
        <Typography>
          Infrastructure: <AppInfra infraId={app.infraId} />
        </Typography>
        <Typography>
          State: <AppState state={app.state} />
        </Typography>
        <Typography>
          Web address: <AppWebAddress webAddress={app.webAddress} />
        </Typography>
        <Button
          color='secondary'
          variant='contained'
          onClick={(e) => {
            e.preventDefault();
            redeployAppNewVersion(app.id);
          }}
        >
          Deploy new version
        </Button>
      </CardContent>
    </Card>
  );
};

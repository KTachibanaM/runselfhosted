import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { AppModel } from '../../../shared/AppModel';
import { getAppById } from '../../utils/api-facade';
import { NavLink } from 'react-router-dom';

interface Props {
  appId: string;
}

export const App: React.FunctionComponent<Props> = ({ appId }) => {
  const [app, setApp] = useState<AppModel | null>(null);

  useEffect(() => {
    getAppById(appId).then((app) => setApp(app));
  }, []);

  if (app === null) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader title={app.slug} />
      <CardContent>
        <Typography>Id: {app.id}</Typography>
        <Typography>Git URL: {app.gitUrl}</Typography>
        <Typography>Git Branch: {app.gitBranch}</Typography>
        <Typography>
          Infrastructure: <NavLink to={`/infras/${app.infraId}`}>{app.infraId}</NavLink>
        </Typography>
        <Typography>State: {app.state}</Typography>
      </CardContent>
    </Card>
  );
};

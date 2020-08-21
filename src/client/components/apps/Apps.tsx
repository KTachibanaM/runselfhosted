import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { AppModel } from '../../../shared/AppModel';
import { getApps, getInfras } from '../../utils/api-facade';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { InfrastructureModel } from '../../../shared/InfrastructureModel';
import { Table } from '@material-ui/core';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import { UnstableStateRefreshMs } from '../../../shared/config';

interface State {
  apps: AppModel[];
  infras: InfrastructureModel[];
  isLoading: boolean;
  interval?: number;
}

export class Apps extends React.Component<any, State> {
  constructor(props) {
    super(props);
    this.state = {
      apps: [],
      infras: [],
      isLoading: true,
    };
  }

  public componentDidMount() {
    this.loadData();
    const interval = setInterval(this.loadData, UnstableStateRefreshMs / 2);
    this.setState({ interval });
  }

  public componentWillUnmount() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
  }

  public loadData = async () => {
    const [apps, infras] = await Promise.all([getApps(), getInfras()]);
    this.setState({ apps, infras, isLoading: false });
  };

  public renderAppsTable = () => {
    if (this.state.infras.length === 0) {
      return (
        <div>
          Looks like you haven&#39;t created any infrastructure, <NavLink to='/infras/create'>create one now</NavLink>.
        </div>
      );
    }

    if (this.state.apps.length === 0) {
      return (
        <div>
          No apps, <NavLink to='/apps/create'>create one now</NavLink>.
        </div>
      );
    }

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Git URL</TableCell>
              <TableCell>Git Branch</TableCell>
              <TableCell>Infrastructure</TableCell>
              <TableCell>State</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.apps.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <NavLink to={`/apps/${app.id}`}>{app.slug}</NavLink>
                </TableCell>
                <TableCell>{app.gitUrl}</TableCell>
                <TableCell>{app.gitBranch}</TableCell>
                <TableCell>
                  <NavLink to={`/infras/${app.infraId}`}>{app.infraId}</NavLink>
                </TableCell>
                <TableCell>{app.state}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  public render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <Card>
        <CardHeader
          title='Apps'
          action={
            <Button
              variant='contained'
              color='secondary'
              startIcon={<AddCircleIcon />}
              component={NavLink}
              to='/apps/create'
            >
              Create
            </Button>
          }
        />
        <CardContent>{this.renderAppsTable()}</CardContent>
      </Card>
    );
  }
}

import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { NavLink } from 'react-router-dom';
import { InfrastructureModel } from '../../../shared/InfrastructureModel';
import { getInfras } from '../../utils/api-facade';
import { Table } from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';

interface State {
  infras: InfrastructureModel[];
  isLoading: boolean;
}

export class Infras extends React.Component<any, State> {
  constructor(props) {
    super(props);
    this.state = {
      infras: [],
      isLoading: true,
    };
  }

  public renderInfrasTable = () => {
    if (this.state.infras.length === 0) {
      return (
        <div>
          No infrastructure, <NavLink to='/infras/create'>create one now</NavLink>.
        </div>
      );
    }
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Provider</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.infras.map((infra) => (
              <TableRow key={infra.id}>
                <TableCell>
                  <NavLink to={`/infras/${infra.id}`}>{infra.slug}</NavLink>
                </TableCell>
                <TableCell>{infra.provider}</TableCell>
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
          title='Infrastructures'
          action={
            <Button
              variant='contained'
              color='secondary'
              startIcon={<AddCircleIcon />}
              component={NavLink}
              to='/infras/create'
            >
              Create
            </Button>
          }
        />
        <CardContent>{this.renderInfrasTable()}</CardContent>
      </Card>
    );
  }

  public async componentDidMount() {
    const infras = await getInfras();
    this.setState({ infras, isLoading: false });
  }
}

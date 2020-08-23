import React from 'react';
import { State } from '../../../shared/AppModel';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

interface Props {
  state: State;
}

export const AppState: React.FC<Props> = (props) => {
  const { state } = props;
  if (state === 'pending-provision' || state === 'provisioning') {
    return (
      <React.Fragment>
        <CircularProgress size='1rem' /> {state}
      </React.Fragment>
    );
  } else if (state === 'provisioned') {
    return (
      <React.Fragment>
        <CheckCircleIcon style={{ color: 'green' }} /> {state}
      </React.Fragment>
    );
  } else if (state === 'provision-errored') {
    return (
      <React.Fragment>
        <ErrorIcon style={{ color: 'green' }} /> {state}
      </React.Fragment>
    );
  } else {
    return <React.Fragment>{state}</React.Fragment>;
  }
};

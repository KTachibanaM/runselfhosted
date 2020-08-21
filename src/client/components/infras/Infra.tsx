import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect } from 'react';
import { InfrastructureModel } from '../../../shared/InfrastructureModel';
import { getInfraById } from '../../utils/api-facade';

interface Props {
  infraId: string;
}

export const Infra: React.FunctionComponent<Props> = ({ infraId }) => {
  const [infra, setInfra] = useState<InfrastructureModel | null>(null);
  useEffect(() => {
    getInfraById(infraId).then((i) => setInfra(i));
  }, []);

  if (infra === null) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader title={infra.slug} />
      <CardContent>
        <Typography>Id: {infra.id}</Typography>
        <Typography>Provider: {infra.provider}</Typography>
      </CardContent>
    </Card>
  );
};

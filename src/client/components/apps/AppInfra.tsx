import React, { useEffect, useState } from 'react';
import { InfrastructureModel } from '../../../shared/InfrastructureModel';
import { getInfraById } from '../../utils/api-facade';
import { NavLink } from 'react-router-dom';

interface Props {
  infraId: string;
}

export const AppInfra: React.FC<Props> = (props) => {
  const { infraId } = props;
  const [infra, setInfra] = useState<InfrastructureModel | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getInfraById(infraId).then(setInfra).catch(setError);
  }, []);

  if (infra === null) {
    if (error === null) {
      return <div>Loading...</div>;
    }
    return <NavLink to={`/infras/${infraId}`}>{infraId}</NavLink>;
  }
  return <NavLink to={`/infras/${infraId}`}>{infra.slug}</NavLink>;
};

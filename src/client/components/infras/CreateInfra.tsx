import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormGroup from '@material-ui/core/FormGroup';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { createInfra } from '../../utils/api-facade';
import { CardHeader } from '@material-ui/core';
import { Provider, Providers } from '../../../shared/InfrastructureModel';

export const CreateInfra: React.FunctionComponent<any> = () => {
  const [slug, setSlug] = useState('');
  const [provider, setProvider] = useState<Provider>(Providers[0]);
  const [token, setToken] = useState('');
  const history = useHistory();

  return (
    <Card>
      <CardHeader title='Create an infrastructure' />
      <CardContent>
        <FormGroup>
          <FormControl required margin='normal'>
            <InputLabel>Name</InputLabel>
            <Input
              value={slug}
              onChange={(e) => {
                e.preventDefault();
                setSlug(e.target.value);
              }}
            />
          </FormControl>
          <FormControl required margin='normal'>
            <InputLabel>Provider</InputLabel>
            <Select
              value={provider}
              onChange={(e) => {
                e.preventDefault();
                setProvider(e.target.value as Provider);
              }}
            >
              {Providers.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl required margin='normal'>
            <InputLabel>Token</InputLabel>
            <Input
              value={token}
              onChange={(e) => {
                e.preventDefault();
                setToken(e.target.value);
              }}
            />
          </FormControl>
          <FormControl>
            <Button
              color='primary'
              variant='contained'
              onClick={(e) => {
                e.preventDefault();
                createInfra(slug, provider, token).then(() => {
                  history.goBack();
                });
              }}
            >
              Submit
            </Button>
          </FormControl>
        </FormGroup>
      </CardContent>
    </Card>
  );
};

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import { createApp, getInfras } from '../../utils/api-facade';
import { InfrastructureModel } from '../../../shared/InfrastructureModel';

export const CreateApp: React.FunctionComponent<any> = () => {
  const [slug, setSlug] = useState('');
  const [gitUrl, setGitUrl] = useState('https://...');
  const [gitBranch, setGitBranch] = useState('master');
  const [infras, setInfras] = useState<InfrastructureModel[]>([]);
  const [infraId, setInfraId] = useState('');
  const history = useHistory();

  useEffect(() => {
    getInfras().then((infras) => setInfras(infras));
  }, []);

  return (
    <Card>
      <CardHeader title='Create an app' />
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
            <InputLabel>Git URL</InputLabel>
            <Input
              value={gitUrl}
              onChange={(e) => {
                e.preventDefault();
                setGitUrl(e.target.value);
              }}
            />
          </FormControl>
          <FormControl required margin='normal'>
            <InputLabel>Git Branch</InputLabel>
            <Input
              value={gitBranch}
              onChange={(e) => {
                e.preventDefault();
                setGitBranch(e.target.value);
              }}
            />
          </FormControl>
          <FormControl required margin='normal'>
            <InputLabel>Infrastructure</InputLabel>
            <Select
              value={infraId}
              onChange={(e) => {
                e.preventDefault();
                setInfraId(e.target.value as string);
              }}
            >
              {infras.map((i) => (
                <MenuItem key={i.id} value={i.id}>
                  {i.slug}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            color='primary'
            variant='contained'
            onClick={(e) => {
              e.preventDefault();
              createApp(slug, gitUrl, gitBranch, infraId).then(() => {
                history.goBack();
              });
            }}
          >
            Submit
          </Button>
        </FormGroup>
      </CardContent>
    </Card>
  );
};

import bodyParser from 'body-parser';
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getApps, getAppById, setApps, getInfras, setInfras, getInfraById, setState, setNextGitHash } from '../db';
import { InitialState } from '../../shared/AppModel';

export function apiRouter() {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/api/apps', (req, res) => {
    res.json(getApps());
  });

  router.get('/api/apps/:appId', (req, res) => {
    const { appId } = req.params;
    res.json(getAppById(appId));
  });

  router.post('/api/apps', (req, res) => {
    const { slug, gitUrl, gitBranch, infraId } = req.body;
    const id = uuidv4();
    setApps([
      ...getApps(),
      {
        id,
        slug,
        gitUrl,
        gitBranch,
        infraId,
        state: InitialState,
        currentGitHash: '',
        nextGitHash: '',
        webAddress: '',
      },
    ]);
    res.json({ status: 'ok', id });
  });

  router.post('/api/apps/:appId/redeployNewVersion', (req, res) => {
    const { appId } = req.params;
    setState(appId, 'pending-provision');
    setNextGitHash(appId, '');
    res.json({ status: 'ok' });
  });

  router.get('/api/infras', (req, res) => {
    res.json(getInfras());
  });

  router.get('/api/infras/:infraId', (req, res) => {
    const { infraId } = req.params;
    res.json(getInfraById(infraId));
  });

  router.post('/api/infras', (req, res) => {
    const { slug, provider, token } = req.body;
    const id = uuidv4();
    setInfras([
      ...getInfras(),
      {
        id,
        slug,
        provider,
        token,
      },
    ]);
    res.json({ status: 'ok', id });
  });

  return router;
}

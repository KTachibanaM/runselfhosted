import bodyParser from 'body-parser';
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getApps, getAppById, setApps, getInfras, setInfras, getInfraById } from '../db';
import { InitialState, InitialStateState } from '../../shared/AppModel';

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
        stateState: InitialStateState,
        currentGitHash: '',
        nextGitHash: '',
      },
    ]);
    res.json({ status: 'ok', id });
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

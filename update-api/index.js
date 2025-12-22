import express from 'express';
import fetch from 'node-fetch';
import http from 'http';

const app = express();
const port = Number(process.env.PORT || 3000);
const socketPath = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
const authToken = process.env.UPDATE_API_TOKEN;
const registry = process.env.DOCKER_REGISTRY || 'docker.io';
const repo = process.env.DOCKER_REPO || 'gmbh';

const agent = new http.Agent({ socketPath });

const services = [
  { id: 'gmbh-api', label: 'API', image: 'mutefire/gmbh-api', hubName: 'gmbh-api' },
  { id: 'gmbh-printer-api', label: 'Printer API', image: 'mutefire/gmbh-printer-api', hubName: 'gmbh-printer-api' },
  { id: 'gmbh-fake-printer', label: 'Fake Printer', image: 'mutefire/gmbh-fake-printer', hubName: 'gmbh-fake-printer' },
  { id: 'gmbh-update-api', label: 'Update API', image: 'mutefire/gmbh-update-api', hubName: 'gmbh-update-api' }
];

const ensureAuth = (req, res, next) => {
  if (!authToken) {
    return res.status(503).json({ error: 'UPDATE_API_TOKEN not configured' });
  }
  const token = req.header('x-update-token');
  if (!token || token !== authToken) {
    return res.status(401).json({ error: 'invalid token' });
  }
  next();
};

const dockerRequest = async (path, options = {}) => {
  const response = await fetch(`http://localhost${path}`, {
    agent,
    ...options
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `docker request ${path} failed with ${response.status}`);
  }
  return response;
};

const listContainers = async () => {
  const resp = await dockerRequest('/containers/json');
  return resp.json();
};

const latestRegistryTag = async (service) => {
  const url = `https://hub.docker.com/v2/repositories/${repo}/${service.hubName}/tags/?page_size=1&ordering=last_updated`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      return null;
    }
    const data = await resp.json();
    return data.results?.[0]?.name || null;
  } catch (error) {
    return null;
  }
};

const buildStatus = async (containers) => {
  const statuses = await Promise.all(services.map(async (service) => {
    const container = containers.find((entry) => entry.Image.includes(service.image));
    const tag = container?.Image?.includes(':') ? container.Image.split(':').pop() : null;
    const available = await latestRegistryTag(service);
    return {
      id: service.id,
      label: service.label,
      currentVersion: tag,
      availableVersion: available,
      status: container ? 'running' : 'missing',
      containerId: container?.Id || null,
      image: service.image
    };
  }));
  return statuses;
};

const pullImage = async (service, tag = 'latest') => {
  const path = `/images/create?fromImage=${encodeURIComponent(service.image)}&tag=${encodeURIComponent(tag)}`;
  const resp = await dockerRequest(path, { method: 'POST' });
  return resp.text();
};

const restartContainersForService = async (service, containers) => {
  const targets = containers.filter((entry) => entry.Image.includes(service.image));
  const results = [];
  for (const container of targets) {
    try {
      await dockerRequest(`/containers/${container.Id}/restart?timeout=10`, { method: 'POST' });
      results.push({ containerId: container.Id, status: 'restarted' });
    } catch (error) {
      results.push({ containerId: container.Id, status: 'error', error: error.message });
    }
  }
  return results;
};

app.use(express.json());
app.use(ensureAuth);

app.get('/images', async (req, res) => {
  try {
    const containers = await listContainers();
    const statuses = await buildStatus(containers);
    res.json({ services: statuses, registry, repo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/images/:serviceId/pull', async (req, res) => {
  const service = services.find((entry) => entry.id === req.params.serviceId);
  if (!service) {
    return res.status(404).json({ error: 'service not registered' });
  }
  const tag = req.body?.tag || req.query?.tag || 'latest';
  try {
    const output = await pullImage(service, tag);
    const containers = await listContainers();
    const restart = await restartContainersForService(service, containers);
    res.json({ service: service.id, tag, output, restart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Update API listening on port ${port}`);
});

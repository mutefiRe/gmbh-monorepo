import { Router, type Request, type Response } from 'express';

const router = Router();
const updateApiUrl = process.env.UPDATE_API_URL?.replace(/\/$/, '');
const updateApiToken = process.env.UPDATE_API_TOKEN;
const updateEnabled = Boolean(updateApiUrl);

async function proxyRequest(path: string, init: any = {}) {
  if (!updateApiUrl) {
    throw new Error('update api not configured');
  }
  const headers = { ...(init.headers || {}) } as Record<string, string>;
  if (updateApiToken) {
    headers['x-update-token'] = updateApiToken;
  }
  const response = await fetch(`${updateApiUrl}${path}`, {
    ...init,
    headers
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `update api request ${path} failed with ${response.status}`);
  }
  const payload = await response.text();
  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
}

router.get('/', async (_req: Request, res: Response) => {
  if (!updateEnabled) {
    res.status(404).send({ errors: { msg: 'update api not configured' } });
    return;
  }
  try {
    const data = await proxyRequest('/images');
    res.send(data);
  } catch (error: any) {
    res.status(502).send({ errors: { msg: error.message } });
  }
});

router.post('/:serviceId/pull', async (req: Request, res: Response) => {
  if (!updateEnabled) {
    res.status(404).send({ errors: { msg: 'update api not configured' } });
    return;
  }
  const tag = req.body?.tag || req.query?.tag;
  try {
    const data = await proxyRequest(`/images/${req.params.serviceId}/pull`, {
      method: 'POST',
      body: tag ? JSON.stringify({ tag }) : undefined,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    res.send(data);
  } catch (error: any) {
    res.status(502).send({ errors: { msg: error.message } });
  }
});

module.exports = router;

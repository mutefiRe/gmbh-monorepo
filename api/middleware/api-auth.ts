import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
const config = require('../config/config');
import db from '../models';

export type AuthenticatedRequest = Request & { decoded?: unknown };

export default async function apiAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.path === '/healthz') {
    return next();
  }
  if (req.path.startsWith('/docs') || req.path.startsWith('/openapi.json')) {
    return next();
  }

  const authHeader = (req.headers?.authorization as string | undefined) || '';
  const bearerToken = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : undefined;
  const token = bearerToken
    || (req.body as any)?.token
    || (req.query as any)?.token
    || (req.headers?.['x-access-token'] as string | undefined)
    || (req.cookies as any)?.['x-gmbh-token'];

  if (!token) {
    res.status(401).send({
      errors: { msg: 'auth.tokenError' }
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.secret);
    req.decoded = decoded;
    const role = (decoded as any)?.role;
    if (role === 'waiter') {
      const setting = await db.Setting.findOne();
      const activeEventId = setting?.activeEventId || null;
      const tokenEventId = (decoded as any)?.eventId || null;
      if (activeEventId && tokenEventId && activeEventId !== tokenEventId) {
        res.status(401).send({ errors: { msg: 'auth.eventChanged' } });
        return;
      }
    }
    next();
  } catch (error) {
    res.status(401).send({
      errors: { msg: 'auth.tokenError' }
    });
  }
}

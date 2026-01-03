function eventReadOnly(req, res, next) {
  if (req.activeEventId && req.eventId && req.eventId !== req.activeEventId) {
    const method = req.method.toUpperCase();
    const role = req.decoded && req.decoded.role;
    // Only allow read-only access for inactive events.
    if (role !== 'admin' && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      res.status(403).send({ errors: { msg: 'event is inactive' } });
      return;
    }
  }
  next();
}

module.exports = eventReadOnly;

const incidentService = require('../services/incidentService');

const validSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const validateText = (value, field, maxLength) => {
  if (typeof value !== 'string' || !value.trim()) {
    return `${field} must be a non-empty string`;
  }
  if (value.trim().length > maxLength) return `${field} must not exceed ${maxLength} characters`;
  return null;
};

const canAccess = (user, incident) => user.role === 'ADMIN' || incident.reportedById === user.id || incident.reportedBy?.id === user.id;

const list = async (req, res, next) => {
  try {
    const { status, severity, search } = req.query;
    const incidents = await incidentService.list({ status, severity, search, viewer: req.user });
    res.json(incidents);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { title, description, severity } = req.body;

    if (!title || !description || !severity) {
      return res.status(400).json({ error: 'Title, description, and severity are required' });
    }

    const titleError = validateText(title, 'Title', 200);
    const descriptionError = validateText(description, 'Description', 5000);
    if (titleError || descriptionError) return res.status(400).json({ error: titleError || descriptionError });
    if (!validSeverities.includes(severity)) {
      return res.status(400).json({ error: `Severity must be one of: ${validSeverities.join(', ')}` });
    }

    const incident = await incidentService.create({
      title: title.trim(),
      description: description.trim(),
      severity,
      reportedById: req.user.id,
    });
    res.status(201).json(incident);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const incident = await incidentService.getById(req.params.id);
    if (!incident || !canAccess(req.user, incident)) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json(incident);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const existing = await incidentService.getById(req.params.id);
    if (!existing || !canAccess(req.user, existing)) return res.status(404).json({ error: 'Incident not found' });

    const { status, severity, title, description } = req.body;
    if (status && !validStatuses.includes(status)) return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    if (severity && !validSeverities.includes(severity)) return res.status(400).json({ error: `Severity must be one of: ${validSeverities.join(', ')}` });
    if (title) {
      const error = validateText(title, 'Title', 200);
      if (error) return res.status(400).json({ error });
    }
    if (description) {
      const error = validateText(description, 'Description', 5000);
      if (error) return res.status(400).json({ error });
    }
    if (req.user.role !== 'ADMIN' && status) return res.status(403).json({ error: 'Only administrators can update incident status' });
    if (!status && !severity && !title && !description) return res.status(400).json({ error: 'At least one permitted field is required' });

    const incident = await incidentService.update(req.params.id, {
      status,
      severity,
      title: title?.trim(),
      description: description?.trim(),
    });
    res.json(incident);
  } catch (error) {
    next(error);
  }
};

const stats = async (_req, res, next) => {
  try {
    const statistics = await incidentService.getStats();
    res.json(statistics);
  } catch (error) {
    next(error);
  }
};

module.exports = { list, create, getById, update, stats };

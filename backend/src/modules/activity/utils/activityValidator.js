const HttpError = require('../../../utils/httpError');

const ALLOWED_FIELDS = ['action', 'info'];
const MAX_LENGTH = 200;

function validateCreateActivity(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new HttpError(400, 'Body must be a JSON object.');
  }

  const unknownFields = Object.keys(payload).filter(
    (field) => !ALLOWED_FIELDS.includes(field)
  );

  if (unknownFields.length > 0) {
    throw new HttpError(400, 'Body contains unsupported fields.', {
      unsupportedFields: unknownFields,
    });
  }

  const normalized = {};

  for (const field of ALLOWED_FIELDS) {
    if (!Object.hasOwn(payload, field)) {
      continue;
    }

    if (typeof payload[field] !== 'string') {
      throw new HttpError(400, `"${field}" must be a string.`);
    }

    const trimmed = payload[field].trim();
    if (!trimmed) {
      continue;
    }

    if (trimmed.length > MAX_LENGTH) {
      throw new HttpError(400, `"${field}" is too long.`);
    }

    normalized[field] = trimmed;
  }

  if (!normalized.action && !normalized.info) {
    throw new HttpError(400, 'Provide action or info.');
  }

  return normalized;
}

module.exports = {
  validateCreateActivity,
};
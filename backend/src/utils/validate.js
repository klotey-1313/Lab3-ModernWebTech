import { config } from "../config/config.js";

export const categories = config.incidents.categories;
export const severities = config.incidents.severities;

export function validateCreateIncident(body) {
  const errors = [];

  if (!body.title || body.title.length < config.incidents.validation.minTitleLength) {
    errors.push("Invalid title");
  }
  if (!body.description || body.description.length < config.incidents.validation.minDescriptionLength) {
    errors.push("Invalid description");
  }
  if (!categories.includes(body.category)) {
    errors.push("Invalid category");
  }
  if (!severities.includes(body.severity)) {
    errors.push("Invalid severity");
  }

  return {
    ok: errors.length === 0,
    errors,
    value: {
      title: body.title,
      description: body.description,
      category: body.category,
      severity: body.severity
    }
  };
}

export function validateStatusChange(current, next) {
  const transitions = config.incidents.statusTransitions;

  if (!transitions[current] || !transitions[current].includes(next)) {
    return { ok: false, error: "Invalid status transition" };
  }

  return { ok: true, next };
}

import { randomUUID } from "crypto";

const incidents = [];

export function listAll() {
  return incidents;
}

export function findById(id) {
  return incidents.find(i => i.id === id);
}

export function createIncident(data) {
  const incident = {
    id: randomUUID(),
    ...data,
    status: "OPEN",
    reportedAt: new Date().toISOString()
  };
  incidents.push(incident);
  return incident;
}

export function updateStatus(id, status) {
  const incident = findById(id);
  if (!incident) return null;
  incident.status = status;
  return incident;
}

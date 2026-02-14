import fs from "fs/promises";
import { config } from "../config/config.js";

const DATA_FILE = config.storage.incidentsFile;

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(config.storage.dataDir, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

async function readIncidents() {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

async function writeIncidents(incidents) {
  await fs.writeFile(DATA_FILE, JSON.stringify(incidents, null, 2));
}

export async function getAllIncidents() {
  return await readIncidents();
}

export async function getIncidentById(id) {
  const incidents = await readIncidents();
  return incidents.find(i => i.id === id);
}

export async function createIncident(data) {
  const incidents = await readIncidents();
  const newIncident = {
    id: crypto.randomUUID(),
    ...data,
    status: "OPEN",
    reportedAt: new Date().toISOString()
  };
  incidents.push(newIncident);
  await writeIncidents(incidents);
  return newIncident;
}

export async function updateIncidentStatus(id, status) {
  const incidents = await readIncidents();
  const index = incidents.findIndex(i => i.id === id);
  if (index === -1) return null;
  
  incidents[index].status = status;
  await writeIncidents(incidents);
  return incidents[index];
}

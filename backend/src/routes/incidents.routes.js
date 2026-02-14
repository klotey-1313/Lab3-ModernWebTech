import express from "express";
import multer from "multer";

import {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncidentStatus
} from "../services/incidents.service.js";
import { parseCsvBuffer } from "../utils/csv.js";
import { validateCreateIncident, validateStatusChange } from "../utils/validate.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", async (req, res) => {
  try {
    const incidents = await getAllIncidents();
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve incidents" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const incident = await getIncidentById(req.params.id);
    if (!incident) return res.status(404).json({ error: "Incident not found" });
    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve incident" });
  }
});

router.post("/", async (req, res) => {
  const result = validateCreateIncident(req.body);
  if (!result.ok) {
    return res.status(400).json({ error: result.errors });
  }

  try {
    const incident = await createIncident(result.value);
    res.status(201).json(incident);
  } catch (error) {
    res.status(500).json({ error: "Failed to create incident" });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const incident = await getIncidentById(req.params.id);
    if (!incident) return res.status(404).json({ error: "Incident not found" });

    const check = validateStatusChange(incident.status, req.body.status);
    if (!check.ok) return res.status(400).json({ error: check.error });

    const updated = await updateIncidentStatus(incident.id, check.next);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update incident status" });
  }
});

router.post("/bulk-upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const rows = await parseCsvBuffer(req.file.buffer);
    let created = 0;
    let skipped = 0;

    for (const row of rows) {
      const result = validateCreateIncident(row);
      if (result.ok) {
        await createIncident(result.value);
        created++;
      } else {
        skipped++;
      }
    }

    res.json({
      totalRows: rows.length,
      created,
      skipped
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to process CSV file" });
  }
});

export default router;

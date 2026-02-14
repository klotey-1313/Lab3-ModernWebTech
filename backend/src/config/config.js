import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || "localhost"
  },
  
  storage: {
    dataDir: path.join(__dirname, "../../data"),
    incidentsFile: path.join(__dirname, "../../data/incidents.json")
  },
  
  incidents: {
    categories: ["IT", "SAFETY", "FACILITIES", "OPERATIONS", "QUALITY", "OTHER"],
    severities: ["LOW", "MEDIUM", "HIGH"],
    statuses: ["OPEN", "INVESTIGATING", "RESOLVED", "ARCHIVED"],
    
    statusTransitions: {
      OPEN: ["INVESTIGATING", "ARCHIVED"],
      INVESTIGATING: ["RESOLVED"],
      RESOLVED: ["ARCHIVED"],
      ARCHIVED: ["OPEN"]
    },
    
    validation: {
      minTitleLength: 5,
      minDescriptionLength: 10
    }
  },
  
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["text/csv"]
  }
};
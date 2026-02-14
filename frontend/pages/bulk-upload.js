import { useRouter } from "next/router";
import { useState } from "react";
import ErrorBanner from "../components/ErrorBanner";
import Layout from "../components/Layout";
import { bulkUploadCsv } from "../services/api";

export default function BulkUpload() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      setErr("Please select a CSV file");
      return;
    }

    try {
      setUploading(true);
      setErr("");
      const data = await bulkUploadCsv(file);
      setResult(data);
    } catch (error) {
      setErr(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Layout title="Bulk Upload Incidents">
      <ErrorBanner message={err} />
      
      <form onSubmit={handleUpload}>
        <div>
          <label>CSV File:</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={uploading}
          />
        </div>
        
        <button type="submit" disabled={uploading || !file}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {result && (
        <div className="result">
          <h3>Upload Complete</h3>
          <p>Total rows: {result.totalRows}</p>
          <p>Created: {result.created}</p>
          <p>Skipped: {result.skipped}</p>
        </div>
      )}
    </Layout>
  );
}

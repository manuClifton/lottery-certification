import { useState } from "react";
import { certifyDraw } from "../../services/apiClient";

function CertifyDrawPage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Please select a TXT file");
      return;
    }

    try {
      setLoading(true);
      const data = await certifyDraw(file);
      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>Certify Draw (Private)</h2>
      <p>Upload a TXT draw file to certify it on-chain.</p>
      <form onSubmit={handleSubmit} className="form-grid">
        <label htmlFor="drawFile">TXT file</label>
        <input
          id="drawFile"
          type="file"
          accept=".txt,text/plain"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Certifying..." : "Certify"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result success">
          <p>
            <strong>File:</strong> {result.fileName}
          </p>
          <p>
            <strong>Hash:</strong> {result.drawHash}
          </p>
          <p>
            <strong>Transaction:</strong> {result.transactionHash}
          </p>
        </div>
      )}
    </section>
  );
}

export default CertifyDrawPage;

import { useState } from "react";
import { verifyDraw } from "../../services/apiClient";
import { exportVerificationPdf } from "../../utils/pdf";

function VerifyDrawPage() {
  const [drawHash, setDrawHash] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!drawHash.trim()) {
      setError("Draw hash is required");
      return;
    }

    try {
      setLoading(true);
      const data = await verifyDraw(drawHash.trim());
      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>Public Draw Verification</h2>
      <p>Anyone can verify if a draw hash was certified on-chain.</p>
      <form onSubmit={handleSubmit} className="form-grid">
        <label htmlFor="drawHash">Draw hash</label>
        <input
          id="drawHash"
          value={drawHash}
          onChange={(event) => setDrawHash(event.target.value)}
          placeholder="Paste SHA256 hash"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result success">
          <p>
            <strong>Status:</strong> {result.certified ? "Certified" : "Not found"}
          </p>
          <p>
            <strong>Hash:</strong> {result.drawHash}
          </p>
          <p>
            <strong>Transaction:</strong> {result.transactionHash || "N/A"}
          </p>
          <button
            type="button"
            onClick={() => exportVerificationPdf(result)}
            className="secondary"
          >
            Export PDF
          </button>
        </div>
      )}
    </section>
  );
}

export default VerifyDrawPage;

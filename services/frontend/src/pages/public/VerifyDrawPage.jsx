import { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { verifyDraw } from "../../services/apiClient";
import { withMinimumDelay } from "../../utils/loading";
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
      setError("El hash del sorteo es obligatorio");
      return;
    }

    try {
      setLoading(true);
      const data = await withMinimumDelay(verifyDraw(drawHash.trim()), 1500);
      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800">Verificacion publica de sorteo</h2>
      <p className="mt-2 text-sm text-slate-600">
        Cualquier usuario puede consultar si un hash fue certificado.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <label htmlFor="drawHash" className="block text-sm font-medium text-slate-700">
          Hash del sorteo
        </label>
        <input
          id="drawHash"
          value={drawHash}
          onChange={(event) => setDrawHash(event.target.value)}
          placeholder="Pega aqui el SHA256"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Verificar
        </button>
      </form>

      {loading && (
        <div className="mt-4">
          <LoadingSpinner label="Consultando certificacion..." />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      {result && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm">
            <strong>Estado:</strong> {result.certified ? "Certificado" : "No encontrado"}
          </p>
          <p className="mt-1 text-sm break-all">
            <strong>Hash:</strong> {result.drawHash}
          </p>
          <p className="mt-1 text-sm break-all">
            <strong>Hash de transaccion:</strong> {result.transactionHash || "N/D"}
          </p>
          <button
            type="button"
            onClick={() => exportVerificationPdf(result, "verificacion-sorteo.pdf")}
            className="mt-3 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Descargar PDF
          </button>
        </div>
      )}
    </section>
  );
}

export default VerifyDrawPage;

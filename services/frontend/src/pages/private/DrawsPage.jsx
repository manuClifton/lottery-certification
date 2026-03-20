import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getDraws } from "../../services/apiClient";
import { withMinimumDelay } from "../../utils/loading";
import { exportVerificationPdf } from "../../utils/pdf";

function DrawsPage() {
  const [draws, setDraws] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadDraws() {
      try {
        const data = await withMinimumDelay(getDraws(), 1500);
        if (mounted) {
          setDraws(data);
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDraws();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800">Sorteos certificados</h2>

      {loading && (
        <div className="mt-4">
          <LoadingSpinner label="Cargando sorteos certificados..." />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      {!loading && !error && draws.length === 0 && (
        <p className="mt-4 text-sm text-slate-600">No hay sorteos certificados todavia.</p>
      )}

      {!loading && draws.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-700">
                <th className="px-2 py-3">ID</th>
                <th className="px-2 py-3">Archivo</th>
                <th className="px-2 py-3">Hash del sorteo</th>
                <th className="px-2 py-3">Hash de transaccion</th>
                <th className="px-2 py-3">PDF</th>
              </tr>
            </thead>
            <tbody>
              {draws.map((draw) => (
                <tr key={draw.id} className="border-b border-slate-100 align-top">
                  <td className="px-2 py-3">{draw.id}</td>
                  <td className="px-2 py-3">{draw.fileName}</td>
                  <td className="max-w-[220px] break-all px-2 py-3">{draw.drawHash}</td>
                  <td className="max-w-[220px] break-all px-2 py-3">{draw.transactionHash}</td>
                  <td className="px-2 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        exportVerificationPdf(
                          {
                            drawHash: draw.drawHash,
                            certified: true,
                            transactionHash: draw.transactionHash,
                            fileName: draw.fileName,
                            createdAt: draw.createdAt
                          },
                          `sorteo-${draw.id}.pdf`
                        )
                      }
                      className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-900"
                    >
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default DrawsPage;

import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { certifyDraw } from "../../services/apiClient";
import { withMinimumDelay } from "../../utils/loading";
import { createVerificationPdfUrl, exportVerificationPdf } from "../../utils/pdf";

const ETAPAS = [
  "Procesando archivo TXT",
  "Calculando hash del sorteo",
  "Enviando transaccion al contrato",
  "Confirmando certificacion"
];

function CertifyDrawPage() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [etapaActiva, setEtapaActiva] = useState(-1);
  const [previewData, setPreviewData] = useState({
    drawHash: "Pendiente",
    transactionHash: "Pendiente",
    status: "Sin iniciar"
  });
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (!loading) {
      return undefined;
    }

    setEtapaActiva(0);
    const intervalId = setInterval(() => {
      setEtapaActiva((current) => {
        if (current >= ETAPAS.length - 1) {
          return current;
        }
        return current + 1;
      });
    }, 350);

    return () => {
      clearInterval(intervalId);
    };
  }, [loading]);

  const stageProgress = useMemo(() => {
    return ETAPAS.map((label, index) => ({
      label,
      done: index <= etapaActiva
    }));
  }, [etapaActiva]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setPreviewData({
      drawHash: "Pendiente",
      transactionHash: "Pendiente",
      status: "Sin iniciar"
    });

    if (!file) {
      setError("Selecciona un archivo TXT");
      return;
    }

    try {
      setLoading(true);
      setPreviewData({
        drawHash: "Calculando...",
        transactionHash: "Pendiente",
        status: "En proceso"
      });

      const pseudoHash = `0x${Math.random().toString(16).slice(2).padEnd(64, "0").slice(0, 64)}`;
      const pseudoTx = `0x${Math.random().toString(16).slice(2).padEnd(64, "a").slice(0, 64)}`;

      setTimeout(() => {
        setPreviewData((current) => ({
          ...current,
          drawHash: pseudoHash
        }));
      }, 450);

      setTimeout(() => {
        setPreviewData((current) => ({
          ...current,
          transactionHash: pseudoTx
        }));
      }, 900);

      const data = await withMinimumDelay(certifyDraw(file), 1500);
      setResult(data);
      setPreviewData({
        drawHash: data.drawHash,
        transactionHash: data.transactionHash,
        status: "Certificado"
      });

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      setPdfUrl(
        createVerificationPdfUrl({
          ...data,
          certified: true
        })
      );
    } catch (requestError) {
      setError(requestError.message);
      setPreviewData((current) => ({ ...current, status: "No certificado" }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Certificar sorteo</h2>
        <p className="mt-2 text-sm text-slate-600">
          Sube el TXT del sorteo para registrar la certificacion en blockchain.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="drawFile" className="mb-1 block text-sm font-medium text-slate-700">
              Archivo TXT
            </label>
            <input
              id="drawFile"
              type="file"
              accept=".txt,text/plain"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Certificar
          </button>
        </form>

        {loading && (
          <div className="mt-4 space-y-3">
            <LoadingSpinner label="Certificando sorteo..." />
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm font-semibold text-blue-900">Etapas del proceso</p>
              <ul className="mt-2 space-y-1 text-sm text-blue-900">
                {stageProgress.map((item) => (
                  <li key={item.label}>
                    {item.done ? "OK" : "..."} {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
          <p className="break-all">
            <strong>Hash del sorteo:</strong> {previewData.drawHash}
          </p>
          <p className="mt-1 break-all">
            <strong>Hash de transaccion:</strong> {previewData.transactionHash}
          </p>
          <p className="mt-1">
            <strong>Estado:</strong> {previewData.status}
          </p>
        </div>

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      </div>

      {result && pdfUrl && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-emerald-800">Vista previa del PDF</h3>
            <button
              type="button"
              onClick={() =>
                exportVerificationPdf({ ...result, certified: true }, "certificacion-sorteo.pdf")
              }
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Descargar PDF
            </button>
          </div>

          <iframe
            title="Vista previa PDF"
            src={pdfUrl}
            className="h-[520px] w-full rounded-lg border border-emerald-200"
          />
        </div>
      )}
    </section>
  );
}

export default CertifyDrawPage;

import { useMemo, useState } from "react";
import logoLoteria from "../../assets/images/loteria.png";
import logoMinibingo from "../../assets/images/logoMinibingo512.jpg";
import logoQuiniela from "../../assets/images/logoQuiniela.png";
import logoRebingo from "../../assets/images/logoRebingo512.jpg";
import logoTelebingo from "../../assets/images/logoTelebingo.jpeg";
import LoadingSpinner from "../../components/LoadingSpinner";
import { verifyDrawByCriteria } from "../../services/apiClient";
import { withMinimumDelay } from "../../utils/loading";
import { exportVerificationPdf } from "../../utils/pdf";

const GAME_OPTIONS = [
  { id: "quiniela", name: "Quiniela", logo: logoQuiniela },
  { id: "telebingo", name: "Telebingo", logo: logoTelebingo },
  { id: "minibingo", name: "Minibingo", logo: logoMinibingo },
  { id: "rebingo", name: "Rebingo", logo: logoRebingo }
];

const SHIFT_OPTIONS = [
  { id: "matutina", name: "Matutina" },
  { id: "vespertina", name: "Vespertina" },
  { id: "nocturna", name: "Nocturna" }
];

function VerifyDrawPage() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedShift, setSelectedShift] = useState("matutina");
  const [selectedDate, setSelectedDate] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedGameData = useMemo(
    () => GAME_OPTIONS.find((option) => option.id === selectedGame) || null,
    [selectedGame]
  );

  const isQuiniela = selectedGame === "quiniela";

  function clearSelection() {
    setSelectedGame(null);
    setSelectedShift("matutina");
    setSelectedDate("");
    setResult(null);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!selectedGame) {
      setError("Selecciona un tipo de sorteo");
      return;
    }

    if (!selectedDate) {
      setError("La fecha es obligatoria");
      return;
    }

    const payload = {
      gameType: selectedGame,
      date: selectedDate
    };

    if (isQuiniela) {
      payload.shift = selectedShift;
    }

    try {
      setLoading(true);
      const data = await withMinimumDelay(verifyDrawByCriteria(payload), 1200);
      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
      <section className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-0 shadow-sm">
        <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-800">Verificacion de sorteo por juego y fecha</h2>
        <p className="mt-2 text-sm text-slate-600">
          Selecciona el tipo de juego y fecha para consultar si existe un sorteo certificado.
        </p>

        {!selectedGame && (
          <div className="game-button-container mt-5">
            {GAME_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className="game-button"
                onClick={() => {
                  setSelectedGame(option.id);
                  setResult(null);
                  setError("");
                }}
              >
                <img src={option.logo} alt={option.name} />
                <span className="game-button-label">{option.name}</span>
              </button>
            ))}
          </div>
        )}

        {selectedGameData && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="game-button is-selected">
                <img src={selectedGameData.logo} alt={selectedGameData.name} />
                <span className="game-button-label">{selectedGameData.name}</span>
              </div>
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-900 transition hover:bg-blue-100"
              >
                Cambiar juego
              </button>
            </div>

            {isQuiniela && (
              <div>
                <label htmlFor="shift" className="block text-sm font-medium text-slate-700">
                  Turno
                </label>
                <select
                  id="shift"
                  value={selectedShift}
                  onChange={(event) => setSelectedShift(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  {SHIFT_OPTIONS.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="drawDate" className="block text-sm font-medium text-slate-700">
                Fecha del sorteo
              </label>
              <input
                id="drawDate"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Verificar
            </button>
          </form>
        )}

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
            <p className="mt-1 text-sm">
              <strong>Juego:</strong> {selectedGameData?.name || "N/D"}
            </p>
            {isQuiniela && (
              <p className="mt-1 text-sm">
                <strong>Turno:</strong>{" "}
                {SHIFT_OPTIONS.find((shift) => shift.id === selectedShift)?.name || "N/D"}
              </p>
            )}
            <p className="mt-1 text-sm">
              <strong>Fecha:</strong> {selectedDate || "N/D"}
            </p>
            <p className="mt-1 text-sm break-all">
              <strong>Hash del sorteo:</strong> {result.drawHash || "N/D"}
            </p>
            <p className="mt-1 text-sm break-all">
              <strong>Hash de transaccion:</strong> {result.transactionHash || "N/D"}
            </p>
            <button
              type="button"
              onClick={() => exportVerificationPdf(result, "verificacion-sorteo.pdf")}
              className="mt-3 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Descargar PDF
            </button>
          </div>
        )}
        </div>
      </section>

  );
}

export default VerifyDrawPage;

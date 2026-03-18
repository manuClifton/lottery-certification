import { useEffect, useState } from "react";
import { getDraws } from "../../services/apiClient";
import { exportVerificationPdf } from "../../utils/pdf";

function DrawsPage() {
  const [draws, setDraws] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadDraws() {
      try {
        const data = await getDraws();
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
    <section className="card">
      <h2>Certified Draws (Private)</h2>
      {loading && <p>Loading draws...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && draws.length === 0 && <p>No certified draws yet.</p>}

      {!loading && draws.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>File</th>
                <th>Hash</th>
                <th>Transaction</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {draws.map((draw) => (
                <tr key={draw.id}>
                  <td>{draw.id}</td>
                  <td>{draw.fileName}</td>
                  <td className="truncate">{draw.drawHash}</td>
                  <td className="truncate">{draw.transactionHash}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        exportVerificationPdf({
                          drawHash: draw.drawHash,
                          certified: true,
                          transactionHash: draw.transactionHash
                        })
                      }
                    >
                      Export
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

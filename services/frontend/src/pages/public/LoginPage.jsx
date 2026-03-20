import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/loteria.png";
import LoadingSpinner from "../../components/LoadingSpinner";
import { withMinimumDelay } from "../../utils/loading";

function LoginPage({ onLogin, isAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard/certify", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Usuario y contrasena son obligatorios");
      return;
    }

    try {
      setLoading(true);
      await withMinimumDelay(onLogin(username, password), 1500);
      navigate("/dashboard/certify", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto mt-16 w-full max-w-md rounded-2xl bg-gradient-to-b from-blue-900 to-slate-900 p-8 text-white shadow-2xl">
      <div className="mb-6 flex justify-center">
        <img src={logo} alt="Loteria" className="h-14 w-auto" />
      </div>
      <h2 className="text-center text-2xl font-bold">Ingreso administrativo</h2>
      <p className="mt-2 text-center text-sm text-blue-100">
        Accede para certificar y administrar sorteos.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="username" className="mb-1 block text-sm text-blue-100">
            Usuario
          </label>
          <input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-slate-900"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm text-blue-100">
            Contrasena
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-sky-400 px-4 py-2 font-semibold text-blue-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Ingresar
        </button>
      </form>

      {loading && (
        <div className="mt-4">
          <LoadingSpinner label="Validando credenciales..." />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
    </section>
  );
}

export default LoginPage;

import logo from "../assets/images/loteria.png";
import { Link, Outlet, useLocation } from "react-router-dom";

function AdminLayout({ onLogout }) {
  const location = useLocation();

  function linkClass(path) {
    const active = location.pathname === path;
    return active
      ? "rounded-full bg-white/30 px-4 py-2 text-sm font-semibold text-white"
      : "rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-blue-900 transition hover:bg-white";
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-blue-300  bg-blue-900 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center">
            <img src={logo} alt="Loteria" className="h-16 w-auto rounded" />
          </div>
          <nav className="flex flex-wrap items-center justify-end gap-2">
            <Link to="/dashboard/certify" className={linkClass("/dashboard/certify")}>
              Certificar
            </Link>
            <Link to="/dashboard/draws" className={linkClass("/dashboard/draws")}>
              Sorteos
            </Link>
            <Link to="/verify" className={linkClass("/verify")}>
              Verificar
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-950"
            >
              Cerrar sesion
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;

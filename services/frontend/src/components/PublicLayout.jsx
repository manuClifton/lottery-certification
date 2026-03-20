import logo from "../assets/images/loteria.png";
import { Outlet } from "react-router-dom";

function PublicLayout({ children }) {
  return (
        <div className="min-h-screen bg-slate-100">
          <header className="border-b border-blue-300  bg-blue-900 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center">
                <img src={logo} alt="Loteria" className="h-16 w-auto rounded" />
              </div>
              <nav className="flex flex-wrap items-center justify-end gap-2">

              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl px-4 py-8">
            {children || <Outlet />}
          </main>
        </div>
  );
}

export default PublicLayout;

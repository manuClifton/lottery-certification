import { Outlet } from "react-router-dom";

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-blue-50 to-slate-100 px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        {children || <Outlet />}
      </div>
    </div>
  );
}

export default PublicLayout;

import { Link, Outlet } from "react-router-dom";

function Layout({ isAuthenticated, onLogout }) {
  return (
    <div className="app-shell">
      <header className="header">
        <div>
          <p className="eyebrow">Lottery Certification</p>
          <h1>Certification Console</h1>
        </div>
        <nav className="nav">
          <Link to="/verify">Verify Draw</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard/certify">Certify</Link>
              <Link to="/dashboard/draws">Certified Draws</Link>
              <button type="button" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Admin Login</Link>
          )}
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

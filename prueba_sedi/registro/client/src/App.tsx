import { Routes, Route, Link } from "react-router-dom";
import Home from "./paginas/Home";
import Admin from "./paginas/Admin";
import Login from "./paginas/Login";
import PrivateRoute from "./componentes/PrivateRoute";
import { useAuth } from "./contextos/AuthContext";

export default function App() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <nav className="bg-violet-600 text-white p-4 flex justify-between">
        <Link to="/" className="font-bold">KIVO Store</Link>
        <div className="space-x-4">
          <Link to="/">Inicio</Link>
          <Link to="/admin">Admin</Link>
          {isAuthenticated ? (
            <button onClick={logout} className="bg-red-500 px-2 py-1 rounded">
              Cerrar sesión
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";

interface Palabra { id_palabra: number; palabra: string; }

export function App() {
  const [lista, setLista] = useState<Palabra[]>([]);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API}/palabras`)
      .then(res => res.json())
      .then((data: Palabra[]) => setLista(data))
      .catch(console.error);
  }, []);

  // … aquí va tu formulario y la lógica de envío …

  return (
    <main>
      {/* … formulario para añadir … */}
      <table>
        <thead>
          <tr><th>ID</th><th>Palabra</th></tr>
        </thead>
        <tbody>
          {lista.map(r => (
            <tr key={r.id_palabra}>
              <td>{r.id_palabra}</td>
              <td>{r.palabra}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

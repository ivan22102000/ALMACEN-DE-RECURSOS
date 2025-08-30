
import { useState, useEffect } from "react";

interface Palabra { 
  id_palabra: number;
  palabra: string;
}

export function App() {
  const [lista, setLista] = useState<Palabra[]>([]);
  const [nueva, setNueva] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchPalabras();
  }, []);

  async function fetchPalabras() {
    const res = await fetch(`${API}/palabras`);
    const data: Palabra[] = await res.json();
    setLista(data);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!nueva.trim()) return;
    await fetch(`${API}/palabras`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ palabra: nueva })
    });
    setNueva("");
    fetchPalabras();
  }

  async function handleDelete(id: number) {
    await fetch(`${API}/palabras/${id}`, { method: "DELETE" });
    fetchPalabras();
  }

  function startEdit(row: Palabra) {
    setEditId(row.id_palabra);
    setEditText(row.palabra);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (editId === null || !editText.trim()) return;
    await fetch(`${API}/palabras/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ palabra: editText })
    });
    cancelEdit();
    fetchPalabras();
  }

  function cancelEdit() {
    setEditId(null);
    setEditText("");
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Gestión de Palabras</h1>

      {/* Formulario de Agregar */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={nueva}
          onChange={e => setNueva(e.target.value)}
          placeholder="Nueva palabra"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
        >
          Agregar
        </button>
      </form>

      {/* Tabla con acciones */}
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Palabra</th>
            <th className="border px-3 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lista.map(row => (
            <tr
              key={row.id_palabra}
              className={row.id_palabra % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="border px-3 py-2 text-center">{row.id_palabra}</td>
              
              {/* Modo edición in-place */}
              <td className="border px-3 py-2">
                {editId === row.id_palabra ? (
                  <form onSubmit={handleUpdate} className="flex">
                    <input
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="flex-1 border rounded px-2"
                    />
                  </form>
                ) : (
                  row.palabra
                )}
              </td>

              <td className="border px-3 py-2 space-x-2 text-center">
                {editId === row.id_palabra ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(row)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(row.id_palabra)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Borrar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

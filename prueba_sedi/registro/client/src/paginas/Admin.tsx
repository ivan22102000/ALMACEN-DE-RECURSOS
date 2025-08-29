export default function Admin() {
  const productos = [
    { id: 1, nombre: "Camiseta KIVO", stock: 12, precio: 25 },
    { id: 2, nombre: "Gorra KIVO", stock: 8, precio: 15 },
    { id: 3, nombre: "Mochila KIVO", stock: 5, precio: 40 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <table className="w-full border-collapse bg-white shadow">
        <thead>
          <tr className="bg-violet-600 text-white">
            <th className="p-2">ID</th>
            <th className="p-2">Producto</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.nombre}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2">${p.precio}</td>
              <td className="p-2 space-x-2">
                <button className="bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

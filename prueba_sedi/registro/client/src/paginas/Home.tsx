export default function Home() {
  return (
    <div className="text-center">
      <nav className="bg-violet-600 text-white p-4 flex justify-between">
        <h1 className="font-bold">KIVO Store</h1>
        <div className="space-x-4">
          <a href="/">Inicio</a>
          <a href="/admin">Admin</a>
          <a href="/login">Login</a>
        </div>
      </nav>

      <section className="p-8">
        <h2 className="text-4xl font-bold text-violet-700 mb-4">Bienvenido a KIVO Store</h2>
        <p className="text-gray-600 mb-6">
          Aquí irá el catálogo de productos y el sistema de fichas.
        </p>

        <img
          src="https://copilot.microsoft.com/th/id/BCO.c7f3ad4e-5177-44e3-8404-ae3375e42589.png"
          alt="Ilustración de KIVO Store"
          className="mx-auto w-full max-w-md rounded-lg shadow-lg"
        />
      </section>
    </div>
  );
}

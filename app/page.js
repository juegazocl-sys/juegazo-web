export default function HomePage() {
  return (
    <main>
      <section className="panel">
        <p className="status">Proyecto nuevo de migracion</p>
        <h1>Juegazo listo para Vercel + Supabase</h1>
        <p>
          Esta base esta separada del proyecto actual. El siguiente paso es cargar el
          export real de Shopify en <code>imports/shopify</code> y ejecutar la auditoria.
        </p>
        <h2>Checklist tecnico</h2>
        <ul>
          <li>Repo GitHub nuevo para esta carpeta.</li>
          <li>Proyecto Vercel nuevo apuntando a este repo.</li>
          <li>Proyecto Supabase existente con migracion SQL aplicada.</li>
          <li>Variables de entorno configuradas en Vercel.</li>
        </ul>
      </section>
    </main>
  );
}


export async function GET() {
  return Response.json({
    ok: true,
    service: "juegazo-migration",
    ts: new Date().toISOString()
  });
}


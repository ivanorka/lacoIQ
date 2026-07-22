const readinessURL = "https://millena.ai/api/v1/ready";

export default async function keepWarm() {
  const startedAt = Date.now();
  const response = await fetch(readinessURL, {
    headers: {
      "Cache-Control": "no-cache",
      "User-Agent": "millena-keep-warm/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Readiness ping failed with HTTP ${response.status}`);
  }

  console.log(JSON.stringify({
    event: "keep_warm_success",
    target: readinessURL,
    status: response.status,
    durationMs: Date.now() - startedAt,
  }));

  return new Response(null, { status: 204 });
}

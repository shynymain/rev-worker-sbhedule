const headers = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return json({ ok: true });
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/api/health") {
      return json({ ok: true, service: "rev-worker-schedule", message: "schedule worker ok" });
    }

    if (url.pathname === "/api/schedule") {
      return json({
        ok: true,
        service: "rev-worker-schedule",
        races: [],
        message: "schedule API ok. races配列はフロントまたは後続実装で反映。"
      });
    }

    return json({ ok: false, error: "not_found", path: url.pathname }, 404);
  }
};

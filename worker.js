export default {
  async fetch(request) {
    const url = new URL(request.url);
    const headers = {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type"
    };
    if (request.method === "OPTIONS") return new Response(JSON.stringify({ ok: true }), { headers });
    if (url.pathname === "/api/health") return new Response(JSON.stringify({ ok: true, service: "rev-worker-schedule" }), { headers });
    if (url.pathname === "/api/schedule") {
      return new Response(JSON.stringify({ ok: true, races: [
        { id:"20260501_tokyo_11", race:{ date:"2026/05/01", place:"東京", raceNo:"11", raceName:"テストレース", grade:"G2", condition:"3歳以上", surface:"芝", distance:"1600m", headcount:"16" }, horses:[] }
      ] }), { headers });
    }
    return new Response(JSON.stringify({ ok:false, error:"not found" }), { status:404, headers });
  }
};

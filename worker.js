export default {
  async fetch(request) {
    const url = new URL(request.url);

    const headers = {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type"
    };

    if (request.method === "OPTIONS") {
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    if (url.pathname === "/" || url.pathname === "/api/schedule") {
      return new Response(JSON.stringify({
        ok: true,
        races: [
          {
            date: "2026/04/30",
            place: "東京",
            raceNo: "11",
            raceName: "テストレース",
            grade: "G2",
            surface: "芝",
            distance: "1800m",
            headcount: 12,
            horses: [
              { no: "5", name: "テストホースA", last1: "1", last2: "4", last3: "9", odds: "3.2", popularity: "2" },
              { no: "14", name: "テストホースB", last1: "5", last2: "5", last3: "5", odds: "5.6", popularity: "4" }
            ]
          }
        ]
      }), { headers });
    }

    return new Response(JSON.stringify({
      ok: false,
      error: "not found"
    }), { status: 404, headers });
  }
};

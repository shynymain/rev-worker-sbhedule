const headers = {
  "content-type": "application/json;charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type"
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/api/health") {
      return new Response(JSON.stringify({
        ok: true,
        worker: "schedule",
        endpoint: "/api/schedule"
      }), { headers });
    }

    if (url.pathname !== "/api/schedule") {
      return new Response(JSON.stringify({ ok: false, error: "not found" }), {
        status: 404,
        headers
      });
    }

    const races = [
      {
        id: "2026-05-01_TOKYO_11",
        source: "schedule-worker",
        status: "before_result",
        race: {
          date: "2026/05/01",
          place: "東京",
          raceNo: "11",
          raceName: "自動テストS型",
          grade: "G2",
          condition: "3歳以上",
          age: "3歳以上",
          surface: "芝",
          distance: "1600m",
          headcount: "6"
        },
        horses: [
          { frame: "1", no: "1", name: "サンプルワン", last1: "1", last2: "4", last3: "9", odds: "4.8" },
          { frame: "2", no: "2", name: "サンプルツー", last1: "2", last2: "2", last3: "1", odds: "3.1" },
          { frame: "3", no: "5", name: "ファイブライン", last1: "5", last2: "5", last3: "5", odds: "6.5" },
          { frame: "4", no: "7", name: "ミドルスター", last1: "2", last2: "8", last3: "5", odds: "9.2" },
          { frame: "5", no: "9", name: "ゴーケイ", last1: "1", last2: "5", last3: "9", odds: "12.8" },
          { frame: "7", no: "14", name: "ラインフォーティーン", last1: "3", last2: "1", last3: "1", odds: "15.4" }
        ],
        result: {}
      }
    ];

    return new Response(JSON.stringify({
      ok: true,
      count: races.length,
      races,
      generatedAt: new Date().toISOString()
    }), { headers });
  }
};

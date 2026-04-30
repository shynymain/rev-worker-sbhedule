const headers = {
  "content-type": "application/json;charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type"
};

const races = [8, 9, 10, 11, 12].map((no, idx) => ({
  race: {
    date: "2026/05/02",
    place: "東京",
    raceNo: String(no),
    raceName: `${no}R 実データ枠`,
    grade: no === 11 ? "G2" : (no === 10 ? "3勝" : "2勝"),
    condition: no === 11 ? "別定" : "定量",
    surface: "芝",
    distance: no === 10 ? "1800m" : "1600m",
    headcount: no === 10 ? "18" : "12"
  },
  horses: Array.from({ length: no === 10 ? 18 : 12 }, (_, i) => ({
    frame: String(Math.ceil((i + 1) / 2.25)).slice(0, 1),
    no: String(i + 1),
    name: `サンプル${no}_${i + 1}`,
    last1: [1,5,9,4,6,8,3,2,7,1,4,9,6,5,8,2,3,7][i % 18],
    last2: [4,1,5,9,4,6,8,3,2,7,1,4,9,6,5,8,2,3][i % 18],
    last3: [9,4,1,5,9,4,6,8,3,2,7,1,4,9,6,5,8,2][i % 18],
    odds: String((2.1 + i * 1.7 + idx / 10).toFixed(1))
  }))
}));

export default {
  async fetch(req) {
    if (req.method === "OPTIONS") return new Response("{}", { headers });
    return new Response(JSON.stringify({ ok: true, races }), { headers });
  }
};

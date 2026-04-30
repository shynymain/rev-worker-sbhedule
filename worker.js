const headers = {
  "content-type": "application/json;charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type"
};

const last1 = [1,5,9,4,6,8,3,2,7,1,4,9,6,5,8,2,3,7];
const last2 = [4,1,5,9,4,6,8,3,2,7,1,4,9,6,5,8,2,3];
const last3 = [9,4,1,5,9,4,6,8,3,2,7,1,4,9,6,5,8,2];

function gradeOf(no) {
  if (no === 11) return "G2";
  if (no === 10 || no === 12) return "3勝";
  if (no >= 8) return "2勝";
  if (no >= 5) return "1勝";
  return "未勝利";
}

function headcountOf(no) {
  if (no === 10 || no === 11 || no === 12) return 18;
  if (no >= 8) return 16;
  return 12;
}

const races = Array.from({ length: 12 }, (_, idx) => {
  const no = idx + 1;
  const headcount = headcountOf(no);
  return {
    race: {
      date: "2026/05/02",
      place: "東京",
      raceNo: String(no),
      raceName: `${no}R 実データ枠`,
      grade: gradeOf(no),
      condition: no === 11 ? "別定" : "定量",
      surface: "芝",
      distance: no === 10 ? "1800m" : (no === 11 ? "2400m" : "1600m"),
      headcount: String(headcount)
    },
    horses: Array.from({ length: headcount }, (_, i) => ({
      frame: String(Math.min(8, Math.ceil((i + 1) / Math.ceil(headcount / 8)))),
      no: String(i + 1),
      name: `サンプル${no}_${i + 1}`,
      last1: String(last1[i % last1.length]),
      last2: String(last2[i % last2.length]),
      last3: String(last3[i % last3.length]),
      odds: String((2.1 + i * 1.7 + idx / 10).toFixed(1))
    }))
  };
});

export default {
  async fetch(req) {
    if (req.method === "OPTIONS") return new Response("{}", { headers });
    return new Response(JSON.stringify({ ok: true, races }), { headers });
  }
};

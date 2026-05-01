const headers = {
  "content-type": "application/json;charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type"
};

function race(id, date, place, raceNo, raceName, grade, distance, headcount, horses){
  return {
    id,
    source: "jra-style-schedule",
    status: "before_result",
    race: {
      date, place, raceNo, raceName, grade,
      condition: "3歳以上",
      age: "3歳以上",
      surface: "芝",
      distance,
      headcount: String(headcount)
    },
    horses,
    result: {}
  };
}

const sampleHorses = [
  {frame:"1",no:"1",name:"サンプルワン",last1:"1",last2:"4",last3:"9",odds:"4.8"},
  {frame:"2",no:"2",name:"サンプルツー",last1:"2",last2:"2",last3:"1",odds:"3.1"},
  {frame:"3",no:"5",name:"ファイブライン",last1:"5",last2:"5",last3:"5",odds:"6.5"},
  {frame:"4",no:"7",name:"ミドルスター",last1:"2",last2:"8",last3:"5",odds:"9.2"},
  {frame:"5",no:"9",name:"ゴーケイ",last1:"1",last2:"5",last3:"9",odds:"12.8"},
  {frame:"6",no:"11",name:"サードライン",last1:"3",last2:"4",last3:"8",odds:"18.6"},
  {frame:"7",no:"14",name:"ラインフォーティーン",last1:"3",last2:"1",last3:"1",odds:"15.4"},
  {frame:"8",no:"16",name:"ラストスター",last1:"6",last2:"1",last3:"2",odds:"22.1"}
];

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return new Response(JSON.stringify({ ok:true }), { headers });
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/api/health") {
      return new Response(JSON.stringify({ ok:true, worker:"rev-worker-schedule", endpoint:"/api/schedule" }), { headers });
    }

    if (url.pathname !== "/api/schedule") {
      return new Response(JSON.stringify({ ok:false, error:"not found" }), { status:404, headers });
    }

    // JRA風：今週分の対象レースをまとめて返す。本物データ取得APIへ差し替える場合も、このJSON形式を維持。
    const races = [
      race("2026-05-02_TOKYO_10","2026/05/02","東京","10","府中ステークス","3勝クラス","芝2000m",16,sampleHorses),
      race("2026-05-02_TOKYO_11","2026/05/02","東京","11","青葉賞","G2","芝2400m",18,sampleHorses),
      race("2026-05-03_KYOTO_11","2026/05/03","京都","11","天皇賞春","G1","芝3200m",18,sampleHorses),
      race("2026-05-03_NIIGATA_11","2026/05/03","新潟","11","谷川岳ステークス","OP","芝1600m",14,sampleHorses)
    ];

    return new Response(JSON.stringify({
      ok: true,
      mode: "jra-style-weekly",
      count: races.length,
      races,
      generatedAt: new Date().toISOString()
    }), { headers });
  }
};

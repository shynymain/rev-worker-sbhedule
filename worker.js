const headers = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type"
};
const json = data => new Response(JSON.stringify(data), { headers });
function sampleRaces(){
  const today = new Date().toISOString().slice(0,10);
  const base = [
    ["東京","11","東京メインS","OP","芝","1600m",16],
    ["京都","11","京都ステークス","G2","芝","2200m",14],
    ["新潟","11","新潟特別","3勝","芝","1800m",15]
  ];
  return base.map((b,i)=>({
    id:`${today}_${b[0]}_${b[1]}`,
    race:{date:today,place:b[0],raceNo:b[1],raceName:b[2],grade:b[3],condition:"3歳以上",surface:b[4],distance:b[5],headcount:String(b[6])},
    horses:Array.from({length:b[6]},(_,n)=>({no:String(n+1),frame:String(Math.ceil((n+1)/2)),name:`サンプル馬${n+1}`,last1:String((n%9)+1),last2:String(((n+2)%9)+1),last3:String(((n+4)%9)+1),odds:String((2.1+n*1.7).toFixed(1)),popularity:String(n+1)}))
  }));
}
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return json({ok:true});
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "/api/health") return json({ok:true, service:"rev-worker", routes:["/api/schedule","/api/results","/api/advice"]});
    if (url.pathname === "/api/schedule") return json({ok:true, races: sampleRaces()});
    if (url.pathname === "/api/results") {
      const races = sampleRaces().map((r,idx)=>({id:r.id,race:r.race,result:{firstNo:"1",secondNo:"2",thirdNo:"3",umarenPay:idx===0?"1200":"0",sanrenpukuPay:idx===0?"4800":"0"}}));
      return json({ok:true, races});
    }
    if (url.pathname === "/api/advice") return json({ok:true, advice:"現在ルール維持。S型のみ強め、通常型は軽め。"});
    return json({ok:false, error:"not found", path:url.pathname});
  }
};

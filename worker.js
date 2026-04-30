export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "") {
      return Response.json({ ok:true, service:"Rev Schedule Worker v3", endpoint:"/api/schedule" });
    }
    if (url.pathname !== "/api/schedule") return Response.json({ ok:false, error:"not found" }, {status:404});
    const today = new Date();
    const dates = nextWeekend(today);
    const places = ["東京", "京都", "新潟"];
    const races = [];
    for (const date of dates) {
      for (const place of places) {
        for (let no=8; no<=12; no++) {
          races.push(makeRace(date, place, no));
        }
      }
    }
    return json({ ok:true, source:"jra-style-generated", races });
  }
};
function nextWeekend(base){const d=new Date(base); const day=d.getDay(); const sat=new Date(d); sat.setDate(d.getDate()+((6-day+7)%7)); const sun=new Date(sat); sun.setDate(sat.getDate()+1); return [fmt(sat),fmt(sun)];}
function fmt(d){return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;}
function makeRace(date, place, raceNo){const grade = raceNo===11 ? (["東京","京都"].includes(place)?"G2":"G3") : (raceNo>=10?"3勝":"2勝"); const headcount = raceNo===11?16:14; const horses=[]; for(let i=1;i<=headcount;i++){horses.push({frame:String(Math.ceil(i/2)), no:String(i), name:`${place}${raceNo}R_${i}`, last1:String((i*3)%9+1), last2:String((i*5)%9+1), last3:String((i*7)%9+1), odds:String((2+i*1.7).toFixed(1)), popularity:String(i)});} return { raceId:`${date}_${place}_${raceNo}R`.replaceAll('/',''), date, place, raceNo:String(raceNo), raceName:`${place}${raceNo}R`, grade, condition:grade, surface:"芝", distance: raceNo===11?"1800m":"1600m", age:"3歳以上", headcount:String(headcount), horses };}
function json(obj){return new Response(JSON.stringify(obj),{headers:{"content-type":"application/json; charset=utf-8","access-control-allow-origin":"*"}})}
// test

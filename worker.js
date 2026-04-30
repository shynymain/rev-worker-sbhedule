export default {
  async fetch(request) {
    const headers = cors();
    if (request.method === 'OPTIONS') return new Response('ok', { headers });
    const url = new URL(request.url);
    if (url.pathname !== '/api/schedule') return json({ ok:false, error:'not found', path:url.pathname }, 404, headers);
    const today = new Date();
    const races = sampleSchedule(today);
    return json({ ok:true, source:'worker-schedule', count:races.length, races }, 200, headers);
  }
}
function cors(){return {'content-type':'application/json; charset=utf-8','access-control-allow-origin':'*','access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type'};}
function json(data,status=200,headers=cors()){return new Response(JSON.stringify(data,null,2),{status,headers});}
function ymd(d){return d.toISOString().slice(0,10);}
function sampleSchedule(base){
  const d1 = new Date(base); d1.setDate(base.getDate()+((6-base.getDay()+7)%7));
  const d2 = new Date(d1); d2.setDate(d1.getDate()+1);
  const places=['東京','京都','新潟'];
  const races=[];
  [d1,d2].forEach((d,di)=>places.forEach(place=>{
    for(let r=8;r<=12;r++) races.push({date:ymd(d),place,raceNo:String(r),raceName:`${place}${r}R`,grade:r===11?(di?'G2':'G1'):(r===10?'3勝':'2勝'),surface:'芝',condition:'定量',headcount:'18',horses:[]});
  }));
  return races;
}

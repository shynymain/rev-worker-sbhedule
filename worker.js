const headers={
  "content-type":"application/json;charset=utf-8",
  "access-control-allow-origin":"*",
  "access-control-allow-methods":"GET,POST,OPTIONS",
  "access-control-allow-headers":"content-type"
};

const VENUES = ["東京","京都","新潟","中山","阪神","中京","札幌","函館","福島","小倉"];
const VENUE_CODES = {"札幌":"01","函館":"02","福島":"03","新潟":"04","東京":"05","中山":"06","中京":"07","京都":"08","阪神":"09","小倉":"10"};

function json(data){return new Response(JSON.stringify(data),{headers})}
function pad(n){return String(n).padStart(2,"0")}
function ymdSlash(d){return `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())}`}
function ymdCompact(s){return String(s).replace(/\D/g,"")}
function normalizeDate(s){
  if(!s) return "";
  const m=String(s).match(/(\d{4})\D?(\d{1,2})\D?(\d{1,2})/);
  if(!m) return "";
  return `${m[1]}/${pad(m[2])}/${pad(m[3])}`;
}
function thisWeekend(){
  const now=new Date();
  const day=now.getUTCDay(); // Worker UTC. Broad enough: next Sat/Sun.
  const diffSat=(6-day+7)%7;
  const sat=new Date(now); sat.setUTCDate(now.getUTCDate()+diffSat);
  const sun=new Date(sat); sun.setUTCDate(sat.getUTCDate()+1);
  return [ymdSlash(sat),ymdSlash(sun)];
}
function stripTags(s){return String(s||"").replace(/<script[\s\S]*?<\/script>/gi,"").replace(/<style[\s\S]*?<\/style>/gi,"").replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;/g," ").replace(/&amp;/g,"&").replace(/\s+/g," ").trim()}
async function fetchText(url){
  const res=await fetch(url,{headers:{"user-agent":"Mozilla/5.0 RevRaceBot"}});
  if(!res.ok) throw new Error(`${res.status} ${url}`);
  const buf=await res.arrayBuffer();
  // JRA pages can be Shift_JIS. Try utf-8 first; fallback shift_jis.
  let txt=new TextDecoder("utf-8").decode(buf);
  if((txt.match(/\uFFFD/g)||[]).length>20){
    try{txt=new TextDecoder("shift_jis").decode(buf)}catch(e){}
  }
  return txt;
}
async function calendarRaces(date){
  const compact=ymdCompact(date);
  const y=compact.slice(0,4),m=String(Number(compact.slice(4,6)));
  const url=`https://www.jra.go.jp/keiba/calendar${y}/${y}/${m}/${compact.slice(4)}.html`;
  const html=await fetchText(url);
  const text=stripTags(html);
  const races=[];
  // Parse text windows by venue and race number. This is intentionally permissive.
  for(const place of VENUES){
    if(!text.includes(place)) continue;
    const placeStart=text.indexOf(place);
    const nextStarts=VENUES.filter(v=>v!==place).map(v=>text.indexOf(v,placeStart+place.length)).filter(i=>i>placeStart);
    const end=nextStarts.length?Math.min(...nextStarts):text.length;
    const chunk=text.slice(placeStart,end);
    for(let no=1;no<=12;no++){
      const rToken=`${no}レース`;
      let idx=chunk.indexOf(rToken);
      if(idx<0) idx=chunk.indexOf(`${no}R`);
      if(idx<0) continue;
      const nextIdx=[...Array(13-no)].map((_,k)=>chunk.indexOf(`${no+k+1}レース`,idx+1)).filter(i=>i>idx)[0] || chunk.length;
      const w=chunk.slice(idx,nextIdx);
      const nameMatch=w.match(/(?:レース|R)\s*([^\d]{2,40}?)(?:\s+[34]歳|サラ系|芝|ダ|障|オープン|未勝利|１勝|1勝|２勝|2勝|３勝|3勝)/);
      const distMatch=w.match(/(芝|ダート|ダ|障害|障)\s*([0-9]{3,4})/);
      const headMatch=w.match(/([0-9]{1,2})頭/);
      const gradeMatch=w.match(/G[ⅠⅡⅢI]+|リステッド|L|オープン|3勝|２勝|2勝|1勝|未勝利|新馬/);
      const condMatch=w.match(/(定量|別定|ハンデ|馬齢)/);
      let raceName=(nameMatch&&nameMatch[1]?nameMatch[1]:"").trim();
      if(!raceName || raceName.length>35) raceName=`${no}R`;
      races.push({race:{date:normalizeDate(date),place,raceNo:String(no),raceName,grade:gradeMatch?gradeMatch[0]:"",condition:condMatch?condMatch[0]:"",surface:distMatch?(distMatch[1].replace("ダート","ダ")):"",distance:distMatch?`${distMatch[2]}m`:"",headcount:headMatch?headMatch[1]:""},horses:[]});
    }
  }
  return races;
}
function fallbackRaces(date, placeFilter=""){
  const places=placeFilter?[placeFilter]:["東京","京都","新潟"];
  const names=["未勝利","未勝利","未勝利","未勝利","1勝クラス","1勝クラス","1勝クラス","2勝クラス","特別","3勝クラス","メインレース","2勝クラス"];
  return places.flatMap(place=>Array.from({length:12},(_,i)=>({race:{date:normalizeDate(date),place,raceNo:String(i+1),raceName:`${names[i]}`,grade:i===10?"OP":(i>=9?"3勝":(i>=7?"2勝":(i>=4?"1勝":"未勝利"))),condition:i===10?"別定":"定量",surface:i%3===0?"ダ":"芝",distance:i%3===0?"1800m":"1600m",headcount:""},horses:[]})));
}
async function addEntryHorses(races){
  // Horse extraction from JRA DB is best-effort. If URL pattern or page structure changes, race shell remains saved.
  return races.map(r=>{
    const n=Number(r.race.headcount||0);
    if(!r.horses || r.horses.length===0){
      r.horses=Array.from({length:n||18},(_,i)=>({frame:String(Math.min(8,Math.ceil((i+1)/2))),no:String(i+1),name:"",last1:"",last2:"",last3:"",odds:""}));
    }
    return r;
  });
}
async function getSchedule(req){
  const url=new URL(req.url);
  const place=url.searchParams.get("place")||"";
  let dates=[];
  const date=url.searchParams.get("date");
  if(date) dates=[normalizeDate(date)];
  else dates=thisWeekend();

  let all=[], usedSource="jra_calendar";
  for(const d of dates){
    try{
      const got=await calendarRaces(d);
      all.push(...got);
    }catch(e){
      usedSource="fallback_calendar";
      all.push(...fallbackRaces(d,place));
    }
  }
  if(place) all=all.filter(r=>r.race.place.includes(place));
  all=await addEntryHorses(all);
  return json({ok:true,source:usedSource,dates,races:all,warnings:usedSource==="fallback_calendar"?["JRAページ取得に失敗したため、枠だけのフォールバックを返しました。"]:[]});
}
export default{async fetch(req){if(req.method==="OPTIONS")return new Response("{}",{headers});try{return await getSchedule(req)}catch(e){return json({ok:false,error:String(e),races:[]})}}};
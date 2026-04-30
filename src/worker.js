const cors = {"access-control-allow-origin":"*","access-control-allow-methods":"GET,POST,OPTIONS","access-control-allow-headers":"content-type"};
function json(data){ return new Response(JSON.stringify(data,null,2),{headers:{"content-type":"application/json;charset=utf-8",...cors}}); }
const sample = {
  race:{date:"2026-04-30",place:"東京",raceName:"Worker完全自動S",grade:"G2",surface:"芝",condition:"別定",distance:"1600",headcount:12},
  horses:[
    {no:1,frame:1,name:"ラインソース",last1:1,last2:4,last3:9,odds:6.2},
    {no:2,frame:2,name:"ファイブコア",last1:5,last2:5,last3:5,odds:3.4},
    {no:3,frame:3,name:"ナインリンク",last1:3,last2:2,last3:4,odds:13.8},
    {no:4,frame:4,name:"ミドルアクシス",last1:6,last2:1,last3:4,odds:8.5},
    {no:5,frame:5,name:"センターライン",last1:2,last2:5,last3:8,odds:5.1},
    {no:6,frame:5,name:"トライコネクト",last1:7,last2:8,last3:9,odds:19.1},
    {no:7,frame:6,name:"サイドブリッジ",last1:9,last2:1,last3:4,odds:10.4},
    {no:8,frame:6,name:"ワイドメイン",last1:4,last2:4,last3:1,odds:22.9},
    {no:9,frame:7,name:"オッズスター",last1:1,last2:2,last3:3,odds:2.7},
    {no:10,frame:7,name:"アナザーライン",last1:8,last2:1,last3:4,odds:15.6},
    {no:11,frame:8,name:"ラストクロス",last1:2,last2:3,last3:4,odds:31.2},
    {no:12,frame:8,name:"ネクストファイブ",last1:1,last2:8,last3:5,odds:7.9}
  ]
};
export default { async fetch(req, env){ if(req.method==="OPTIONS") return new Response(null,{headers:cors}); if(req.method==="GET") return json(sample); if(req.method==="POST"){ const body=await req.json().catch(()=>({})); return json({ok:true,saved:body}); } return json({ok:false,error:"method not allowed"}); }};

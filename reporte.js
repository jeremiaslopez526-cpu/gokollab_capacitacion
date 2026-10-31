import {list,get} from '@vercel/blob';
import {timingSafeEqual} from 'node:crypto';
const keys={module1:[0,1,2],module2:[0,1,2],module3:[1,1,2]};
const auth=(provided,expected)=>{
 if(!expected||!provided)return false;
 const a=Buffer.from(String(provided)),b=Buffer.from(String(expected));
 return a.length===b.length && timingSafeEqual(a,b);
};
const csvCell=v=>'"'+String(v??'').replaceAll('"','""')+'"';
export default async function handler(req,res){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Método no permitido'})}
 if(!process.env.ADMIN_PASSWORD||!process.env.BLOB_READ_WRITE_TOKEN)return res.status(503).json({error:'Falta configurar el panel en Vercel'});
 if(!auth(req.body?.password,process.env.ADMIN_PASSWORD))return res.status(401).json({error:'Contraseña incorrecta'});
 try {
  const records=[];let cursor,iterations=0;
  do {
    const page=await list({prefix:'resultados/',limit:1000,cursor});
    for(const b of page.blobs){
      const result=await get(b.pathname,{access:'private'});
      if(!result||result.statusCode!==200)continue;
      try {const r=JSON.parse(await new Response(result.stream).text());if(Object.hasOwn(keys,r.module)&&['answer','complete'].includes(r.type)) records.push(r)}catch(e){console.warn('registro inválido',b.pathname)}
    }
    cursor=page.hasMore?page.cursor:null; iterations++;
  }while(cursor&&iterations<100);
  const answers=records.filter(r=>r.type==='answer');
  const completes=records.filter(r=>r.type==='complete');
  // Estadísticas basadas directamente en cada respuesta individual guardada.
  // No se filtra por intento ni se requieren cuestionarios completos.
  const modules=Object.keys(keys).map(id=>{
    const moduleAnswers=answers.filter(r=>r.module===id);
    const questions=keys[id].map((correctOption,i)=>{
      const responses=moduleAnswers.filter(r=>r.question===i+1);
      // El acierto se calcula con la clave oficial, independientemente del campo almacenado.
      const correct=responses.filter(r=>r.answer===correctOption).length;
      const incorrect=responses.length-correct;
      return {number:i+1,total:responses.length,correct,incorrect,
        rate:responses.length?Math.round(correct/responses.length*1000)/10:null};
    });
    const total=questions.reduce((sum,q)=>sum+q.total,0);
    const correct=questions.reduce((sum,q)=>sum+q.correct,0);
    return {id,answers:total,correct,incorrect:total-correct,
      rate:total?Math.round(correct/total*1000)/10:null,questions};
  });
  res.setHeader('Cache-Control','private, no-store');
  if(req.body?.format==='csv'){
    const header=['Fecha','Tipo','Modulo','Sesion aleatoria','Pregunta','Respuesta (A/B/C)','Correcta','Intento','Respuestas','Aciertos','Aprobado'];
    const lines=records.sort((a,b)=>(a.receivedAt||'').localeCompare(b.receivedAt||'')).map(r=>[r.receivedAt,r.type,r.module,r.session,r.question||'',Number.isInteger(r.answer)?'ABC'[r.answer]:'',r.correct??'',r.attempt||'',r.answers?.map(v=>'ABC'[v]).join(' / ')||'',r.score??'',r.passed??''].map(csvCell).join(','));
    res.setHeader('Content-Type','text/csv; charset=utf-8');res.setHeader('Content-Disposition','attachment; filename="gokollab-resultados.csv"');return res.status(200).send('\uFEFF'+[header.map(csvCell).join(','),...lines].join('\r\n'));
  }
  return res.status(200).json({updatedAt:new Date().toISOString(),totalAnswers:answers.length,totalCompleted:completes.length,modules,truncated:!!cursor});
 }catch(e){console.error('reporte',e);return res.status(500).json({error:'No se pudieron consultar los resultados'});}
}

import {put, head} from '@vercel/blob';
import {createHash} from 'node:crypto';
const keys={module1:[0,1,2],module2:[0,1,2],module3:[1,1,2]};
const send=(res,status,data)=>res.status(status).json(data);
const uuid=/^[a-zA-Z0-9-]{8,100}$/;
export default async function handler(req,res){
 if(req.method!== 'POST'){res.setHeader('Allow','POST');return send(res,405,{error:'Método no permitido'})}
 if(!process.env.BLOB_READ_WRITE_TOKEN)return send(res,503,{error:'Blob no configurado'});
 try{
  const p=req.body||{};
  if(!['answer','complete'].includes(p.type)||!Object.hasOwn(keys,p.module)||!uuid.test(String(p.session||''))||!uuid.test(String(p.eventId||'')))return send(res,400,{error:'Datos inválidos'});
  let record={type:p.type,module:p.module,session:p.session,eventId:p.eventId,receivedAt:new Date().toISOString()};
  if(p.type==='answer'){
   if(!Number.isInteger(p.question)||p.question<1||p.question>3||!Number.isInteger(p.answer)||p.answer<0||p.answer>2)return send(res,400,{error:'Respuesta inválida'});
   record.question=p.question;record.answer=p.answer;record.correct=p.answer===keys[p.module][p.question-1];
  }else{
   if(!Array.isArray(p.answers)||p.answers.length!==3||p.answers.some(v=>!Number.isInteger(v)||v<0||v>2)||!Number.isInteger(p.attempt)||p.attempt<1||p.attempt>10000)return send(res,400,{error:'Cuestionario inválido'});
   record.attempt=p.attempt;record.answers=p.answers;
   record.score=p.answers.reduce((sum,v,i)=>sum+Number(v===keys[p.module][i]),0);
   record.passed=record.score>=2;
  }
  const path='resultados/'+p.module+'/'+createHash('sha256').update(p.eventId).digest('hex')+'.json';
  // Registros inmutables: una petición repetida no reemplaza otra respuesta.
  try {await put(path,JSON.stringify(record),{access:'private',contentType:'application/json',addRandomSuffix:false,allowOverwrite:false});}
  catch(err){
    // Si la solicitud se reintentó, comprobar si ya se guardó ese ID.
    if(err?.name==='BlobAlreadyExistsError'||err?.name==='BlobPreconditionFailedError'||/already exists|already exist|precondition/i.test(err?.message||''))return send(res,200,{ok:true,duplicate:true});
    throw err;
  }
  res.setHeader('Cache-Control','no-store');return send(res,200,{ok:true});
 }catch(e){console.error('guardar respuesta',e);return send(res,500,{error:'No se pudo guardar la respuesta'})}
}

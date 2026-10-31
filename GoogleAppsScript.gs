/** GoKollab Training · Recolección anónima, Google Apps Script.
 * Instalar en Extensiones > Apps Script, desde la planilla de resultados.
 * Ejecutar inicializar() una vez; luego implementar aplicación web como propietario.
 * No almacena nombres, emails, IP, cookies ni identificadores persistentes.
 * IMPORTANTE: una URL pública no puede impedir que terceros envíen datos falsos.
 */
const RESPUESTAS = { module1:[0,1,2], module2:[0,1,2], module3:[0,1,2] };
const CABECERAS=['Fecha servidor','Módulo','N.º de intento local','Respuesta 1 (A/B/C)','Respuesta 2 (A/B/C)','Respuesta 3 (A/B/C)','Acierto 1','Acierto 2','Acierto 3','Puntaje','Aprobado','ID de envío'];
function inicializar(){
 const ss=SpreadsheetApp.getActiveSpreadsheet();
 const r=ss.getSheetByName('Respuestas')||ss.insertSheet('Respuestas');
 if(!r.getLastRow())r.appendRow(CABECERAS);
 r.setFrozenRows(1);
 const s=ss.getSheetByName('Resumen')||ss.insertSheet('Resumen');
 s.clear();
 s.getRange('A1').setValue('GOKOLLAB · INDICADORES DE APRENDIZAJE');
 s.getRange('A3:H3').setValues([['Módulo','Intentos','Primeros intentos','Aprobados (primer intento)','% aprobación (primer intento)','% acierto pregunta 1','% acierto pregunta 2','% acierto pregunta 3']]);
 for(let i=4;i<=6;i++){
  s.getRange(i,1).setValue('module'+(i-3));
  const a='$A'+i;
  s.getRange(i,2).setFormula(`=COUNTIF(Respuestas!B:B,${a})`);
  s.getRange(i,3).setFormula(`=COUNTIFS(Respuestas!B:B,${a},Respuestas!C:C,1)`);
  s.getRange(i,4).setFormula(`=COUNTIFS(Respuestas!B:B,${a},Respuestas!C:C,1,Respuestas!K:K,TRUE)`);
  s.getRange(i,5).setFormula(`=IFERROR(D${i}/C${i},0)`);
  for(let j=6;j<=8;j++){
   const col=['G','H','I'][j-6];
   s.getRange(i,j).setFormula(`=IFERROR(AVERAGE(FILTER(Respuestas!${col}2:${col},Respuestas!B2:B=${a},Respuestas!C2:C=1)),0)`);
  }
 }
 s.getRange('E4:H6').setNumberFormat('0.0%');
 s.getRange('A8').setValue('Nota: los porcentajes se calculan sobre intentos, no personas únicas. La primera vez se determina por navegador y puede reiniciarse si se borran los datos.');
 s.getRange('A9').setValue('Criterio sugerido: 80% de aprobación de primeros intentos. No demuestra por sí solo autonomía práctica.');
 s.setFrozenRows(3);s.autoResizeColumns(1,8);
}
function doPost(e){
 try{
  const obj=JSON.parse((e.postData&&e.postData.contents)||'{}');
  if(obj.schema!==1||!Object.prototype.hasOwnProperty.call(RESPUESTAS,obj.module))throw Error('módulo');
  if(!Array.isArray(obj.answers)||obj.answers.length!==3||!obj.answers.every(x=>Number.isInteger(x)&&x>=0&&x<=2))throw Error('respuestas');
  if(!Number.isInteger(obj.attempt)||obj.attempt<1||obj.attempt>999999)throw Error('intento');
  if(typeof obj.nonce!=='string'||obj.nonce.length>100||obj.nonce.length<8)throw Error('id');
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try{
   const ss=SpreadsheetApp.getActiveSpreadsheet();const sheet=ss.getSheetByName('Respuestas');
   if(!sheet)throw Error('Ejecutar inicializar');
   // Mitiga reintentos duplicados de un mismo envío, no ataques maliciosos.
   const last=sheet.getLastRow();
   if(last>=2){const ids=sheet.getRange(Math.max(2,last-99),12,Math.min(100,last-1),1).getValues().flat();if(ids.includes(obj.nonce))return response_('duplicado');}
   const hits=obj.answers.map((v,i)=>v===RESPUESTAS[obj.module][i]);
   const score=hits.filter(Boolean).length;
   sheet.appendRow([new Date(),obj.module,obj.attempt,...obj.answers.map(x=>'ABC'[x]),...hits.map(x=>x?1:0),score,score>=2,obj.nonce]);
   return response_('ok');
  }finally{lock.releaseLock();}
 }catch(err){return response_('error');}
}
function response_(s){return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.TEXT);}

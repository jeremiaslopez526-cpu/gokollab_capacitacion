/** GoKollab · Panel PRIVADO. Crear este archivo en el MISMO proyecto de Apps Script.
 * Importante: el proyecto ya tiene doPost en GoogleAppsScript.gs. Este archivo agrega doGet.
 * Implementar NUEVA implementación como aplicación web, Ejecutar como YO,
 * Acceso: SOLO YO. Si la opción no existe para tu tipo de cuenta, no publiques el panel.
 * El doPost existente permanece público mediante su implementación anterior.
 */
function doGet(e) {
  const html=HtmlService.createTemplateFromFile('PanelAdmin');
  return html.evaluate().setTitle('GoKollab · Reporte privado');
}
function obtenerReportePrivado(){
 const ss=SpreadsheetApp.getActiveSpreadsheet();
 const sh=ss.getSheetByName('Respuestas');
 if(!sh)throw new Error('Falta hoja Respuestas; ejecutá inicializar');
 const rows=sh.getDataRange().getValues().slice(1);
 const modules=['module1','module2','module3'];
 const out={actualizado:new Date().toISOString(),total:rows.length,modulos:[],preguntas:[]};
 for(const m of modules){
  const all=rows.filter(r=>String(r[1])===m);
  const first=all.filter(r=>Number(r[2])===1);
  const approved=first.filter(r=>r[10]===true || String(r[10]).toLowerCase()==='true').length;
  const pct=(n,d)=>d?Math.round(n/d*1000)/10:null;
  out.modulos.push({id:m,intentos:all.length,primeros:first.length,aprobados:approved,tasa:pct(approved,first.length),promedio:pct(first.reduce((s,r)=>s+Number(r[9]||0),0),first.length*3)});
  for(let i=0;i<3;i++)out.preguntas.push({modulo:m,numero:i+1,aciertos:first.reduce((s,r)=>s+(Number(r[6+i])===1?1:0),0),total:first.length,tasa:pct(first.reduce((s,r)=>s+(Number(r[6+i])===1?1:0),0),first.length)});
 }
 return out;
}

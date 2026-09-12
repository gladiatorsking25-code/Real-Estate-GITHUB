/* ============================================================
   Google Sheets live sync for SABIR AMIN REAL ESTATE
   Reads each tab as CSV via the public gviz endpoint (CORS-enabled),
   parses it, and maps it to the app's data model.
   Read-only: the Sheet is the source of truth.
   ============================================================ */
window.SARE_SHEETS = (function () {
'use strict';

function gvizUrl(id, sheet){
  return 'https://docs.google.com/spreadsheets/d/' + id +
         '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(sheet) + '&headers=1';
}

/* Robust CSV parser (handles quotes, escaped quotes, commas & newlines in fields) */
function parseCSV(text){
  var rows=[], row=[], field='', i=0, inQ=false, n=text.length;
  while(i<n){
    var c=text[i];
    if(inQ){
      if(c==='"'){ if(text[i+1]==='"'){ field+='"'; i+=2; continue; } inQ=false; i++; continue; }
      field+=c; i++; continue;
    }
    if(c==='"'){ inQ=true; i++; continue; }
    if(c===','){ row.push(field); field=''; i++; continue; }
    if(c==='\r'){ i++; continue; }
    if(c==='\n'){ row.push(field); rows.push(row); row=[]; field=''; i++; continue; }
    field+=c; i++;
  }
  if(field.length || row.length){ row.push(field); rows.push(row); }
  return rows;
}
function toObjects(text){
  var rows=parseCSV(text);
  if(!rows.length) return [];
  var hdr=rows[0].map(function(h){return String(h).trim();});
  var out=[];
  for(var r=1;r<rows.length;r++){
    var vals=rows[r];
    if(vals.every(function(v){return String(v).trim()==='';})) continue;
    var o={};
    for(var c=0;c<hdr.length;c++){ if(hdr[c]) o[hdr[c]]=vals[c]!=null?vals[c]:''; }
    out.push(o);
  }
  return out;
}

function s(v){ return v==null?'':String(v).trim(); }
function num(v){ if(v==null||v==='') return 0; var n=parseFloat(String(v).replace(/[, ]+/g,'')); return isNaN(n)?0:n; }
function intg(v){ return Math.round(num(v)); }
function phone(v){ return s(v).replace(/[^\d]/g,''); }
function get(o){ for(var i=1;i<arguments.length;i++){ if(o[arguments[i]]!=null && o[arguments[i]]!=='') return o[arguments[i]]; } return ''; }

async function fetchTab(id, name){
  var r = await fetch(gvizUrl(id, name), {cache:'no-store'});
  if(!r.ok) throw new Error('HTTP '+r.status+' for '+name);
  var txt = await r.text();
  if(/^\s*<|DOCTYPE html/i.test(txt)) throw new Error('Sheet not public or not found: '+name);
  return toObjects(txt);
}
async function tryTab(id, name){ try{ return await fetchTab(id, name); }catch(e){ return null; } }

/* Map raw tab rows to the app model */
function mapProperties(rows){
  return (rows||[]).map(function(r,i){
    var owner=num(r.OwnerRent), ten=num(r.TenantRent), maint=num(r.Maintenance);
    var pf=num(r.Profit); if(!pf) pf=ten-owner-maint;
    return {
      id:'p'+(s(r.S_No)||(i+1)),
      unit:s(r.Location), type:s(r.Flat)||'Studio',
      ownerName:s(r.OwnerName), ownerContact:phone(r.OwnerContact),
      tenantName:s(r.TenantName), tenantContact:phone(r.TenantContact),
      ownerRent:owner, tenantRent:ten, security:s(r.SecurityCheque),
      contractFrom:s(r.TContractFrom), contractTo:s(r.TContractTo),
      ownerContract:s(r.OwnerContract), maintenance:maint,
      coordinates:s(r.Coordinates), mapLink:s(r.GoogleMap),
      driveLink:s(r.DriveFolderLink), readyToMove:s(r.ReadyToMove).toLowerCase()==='yes',
      ownership:s(r.Property)||'Personnel', monthlyProfit:pf, notes:''
    };
  }).filter(function(p){ return p.unit || p.ownerName; });
}
function mapRent(rows){
  return (rows||[]).map(function(r){
    return { id:'r'+s(r.ID||r.Id), unit:s(r.StudioId), date:s(r.PaymentDate),
      amount:num(r.Amount), ownership:s(r.Ownership)||'Personnel',
      month:intg(r.Month), year:intg(r.Year), maintenance:num(r.Maintenance), profit:num(r.Profit) };
  }).filter(function(x){ return x.unit; });
}
function mapDebts(rows){
  return (rows||[]).map(function(r){
    var amt=num(r.Amount), paid=num(get(r,'PaidAmount','Paid'));
    var bal=(r.Balance!=null&&r.Balance!=='')?num(r.Balance):Math.max(amt-paid,0);
    return { id:'d'+s(r.ID||r.Id), type:s(r.Type)||'Receivable', person:s(r.Person),
      amount:amt, paid:paid, balance:bal, date:s(r.Date), dueDate:s(r.DueDate),
      reason:s(r.Reason), status:s(r.Status)||(bal<=0?'Paid Off':paid>0?'Partial':'Active'),
      lastPayment:s(r.LastPayment), history:s(r.History) };
  }).filter(function(x){ return x.person; });
}
function mapTasks(rows){
  return (rows||[]).map(function(r){
    var done=s(get(r,'IsCompleted','Completed')).toLowerCase();
    return { id:'t'+s(r.Id||r.ID), description:s(r.Description),
      dueDate:s(r.DueDate), done:(done==='1'||done==='true'||done==='yes'), createdAt:s(r.CreatedAt) };
  }).filter(function(x){ return x.description; });
}
function mapTransactions(rows){
  return (rows||[]).map(function(r){
    var tt=s(r.TransactionType).toLowerCase();
    var type=/exp|debit|out|payout|-/.test(tt)?'expense':'income';
    return { id:'tx'+s(r.ID||r.Id||Math.random().toString(36).slice(2)), type:type,
      amount:num(r.Amount), date:s(get(r,'TransactionDate','Date')), account:s(r.AccountName),
      category:s(get(r,'Category','AccountType')), description:s(r.Description) };
  }).filter(function(x){ return x.amount; });
}
function mapRecurring(rows){
  return (rows||[]).map(function(r){
    return { id:'re'+s(r.ID||r.Id), name:s(get(r,'AccountName','Name')), amount:num(r.Amount),
      frequency:s(r.Frequency)||'Monthly', accountType:s(r.AccountType)||'Personnel' };
  }).filter(function(x){ return x.name || x.amount; });
}
function mapAccounts(company, personnel){
  var c=(company||[]).map(function(a){ return {id:'c'+s(a.ID||a.Id),name:s(get(a,'AccountName','Name')),budget:num(a.Budget),balance:num(a.CurrentBalance)}; }).filter(function(a){return a.name;});
  var p=(personnel||[]).map(function(a){ return {id:'pa'+s(a.ID||a.Id),name:s(get(a,'Name','AccountName')),budget:num(a.Budget),balance:num(a.CurrentBalance)}; }).filter(function(a){return a.name;});
  if(!c.length) c=[{id:'c1',name:'Company',budget:0,balance:0}];
  if(!p.length) p=[{id:'pa1',name:'Personnel',budget:0,balance:0}];
  return {company:c, personnel:p};
}

/* Public: fetch everything and return an app-model object (no users, no config) */
async function fetchAll(id){
  var names=['Table','RentRecords','DebtTracker','pending actions','Transactions',
             'RecurringExpenses','CompanyAccounts','PersonnelAccounts','Studios'];
  // Verify the doc is reachable first (throws clearly if private)
  var table = await fetchTab(id, 'Table');
  var res = await Promise.all(names.slice(1).map(function(n){ return tryTab(id,n); }));
  var rent=res[0], debts=res[1], tasks=res[2], tx=res[3], recur=res[4], comp=res[5], pers=res[6], studios=res[7];
  return {
    properties: mapProperties(table),
    rentRecords: mapRent(rent),
    debts: mapDebts(debts),
    tasks: mapTasks(tasks),
    transactions: mapTransactions(tx),
    recurringExpenses: mapRecurring(recur),
    accounts: mapAccounts(comp, pers),
    studios: (studios||[]).map(function(r){ return s(get(r,'StudioId','Studio','Unit')); }).filter(Boolean),
    monthlyProfits: [], monthlySummary: []
  };
}

/* Extract a spreadsheet id from a full URL or raw id */
function extractId(input){
  var s=String(input||'').trim();
  var m=s.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if(m) return m[1];
  if(/^[a-zA-Z0-9_-]{20,}$/.test(s)) return s;
  return '';
}

return { fetchAll: fetchAll, extractId: extractId, parseCSV: parseCSV };
})();

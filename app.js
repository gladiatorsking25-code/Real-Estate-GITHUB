/* ============================================================
   SABIR AMIN REAL ESTATE — Property Management App
   Vanilla JS, no build step. Data persists in localStorage.
   ============================================================ */
(function () {
'use strict';

/* ---------- Constants ---------- */
var APP_VERSION = '1.7.0';
var STORE_KEY = 'SARE_DB_v1';
var SESSION_KEY = 'SARE_SESSION';
var CUR = 'AED';
var PALETTE = ['#16305B','#f2a83c','#12a670','#2f7dd1','#e23b2e','#7c5cd6','#0fb5b0','#f59e0b','#3f51b5','#e07a5f'];
var MONTHS = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ---------- SVG icons ---------- */
var IC = {
  dashboard:'<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>',
  building:'<path d="M3 21h18M5 21V5a2 2 0 012-2h6a2 2 0 012 2v16M15 21V9h4a2 2 0 012 2v10M8 7h2M8 11h2M8 15h2"/>',
  users:'<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>',
  contract:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M9 13h6M9 17h4"/>',
  wallet:'<path d="M20 12V8H6a2 2 0 010-4h12v4M4 6v12a2 2 0 002 2h14v-4M18 12a2 2 0 000 4h4v-4h-4z"/>',
  cash:'<path d="M2 7h20v10H2zM12 12a2 2 0 100-4 2 2 0 000 4zM6 9v6M18 9v6" />',
  hand:'<path d="M18 11V6a2 2 0 00-4 0M14 10V4a2 2 0 00-4 0v2M10 10.5V6a2 2 0 00-4 0v8M18 8a2 2 0 014 0v6a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-6.2-2.7L2.5 16.5a2 2 0 013-2.6L7 15.5"/>',
  folder:'<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>',
  check:'<path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>',
  settings:'<path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
  phone:'<path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/>',
  mail:'<path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"/><path d="M22 6l-10 7L2 6"/>',
  map:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>',
  whatsapp:'<path d="M20.5 3.5A11 11 0 003.6 17.6L2 22l4.5-1.5A11 11 0 1020.5 3.5z"/><path d="M8.5 7.5c.5-.2 1 .3 1.3 1l.5 1c.1.4 0 .7-.3 1-.4.4-.4.6-.2 1a6 6 0 002.7 2.7c.4.2.6.2 1-.2.3-.3.6-.4 1-.3l1 .5c.7.3 1.2.8 1 1.3-.4 1.2-1.8 1.9-3 1.6a10 10 0 01-7-7c-.3-1.2.4-2.6 1.5-3z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  edit:'<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  trash:'<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M10 11v6M14 11v6"/>',
  logout:'<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alert:'<path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/>',
  trend:'<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
  download:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  upload:'<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  home:'<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/>',
  key:'<path d="M21 2l-2 2m-7.6 7.6a5 5 0 11-7 7 5 5 0 017-7zm0 0L15 8m0 0l3 3 3-3-3-3"/>',
  doc:'<path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/>',
  chevron:'<path d="M9 18l6-6-6-6"/>',
  refresh:'<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0114.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0020.5 15"/>',
  sheet:'<path d="M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>'
};
function icon(name, cls){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="'+(cls||'')+'">'+(IC[name]||'')+'</svg>'; }

/* ---------- Utilities ---------- */
function $(s, r){ return (r||document).querySelector(s); }
function $$(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
function uid(p){ return (p||'x') + Date.now().toString(36) + Math.floor(Math.random()*1e4).toString(36); }
function money(n){ n = Number(n)||0; return CUR+' '+Math.round(n).toLocaleString('en-US'); }
function moneyShort(n){ n=Number(n)||0; var a=Math.abs(n); if(a>=1e6) return (n/1e6).toFixed(1)+'M'; if(a>=1e3) return Math.round(n/1e3)+'k'; return Math.round(n)+''; }
function num(n){ return (Number(n)||0).toLocaleString('en-US'); }
function todayISO(){ return new Date().toISOString().slice(0,10); }

function parseDate(v){
  if(!v) return null;
  if(v instanceof Date) return v;
  var s = String(v).trim();
  if(!s) return null;
  var m;
  if((m = s.match(/^(\d{4})-(\d{2})-(\d{2})/))) return new Date(+m[1], +m[2]-1, +m[3]);
  if((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/))){ var y=+m[3]; if(y<100)y+=2000; return new Date(y, +m[2]-1, +m[1]); }
  var d = new Date(s); return isNaN(d) ? null : d;
}
function fmtDate(v){ var d = parseDate(v); if(!d) return '—'; return d.getDate().toString().padStart(2,'0')+' '+MONTHS[d.getMonth()+1]+' '+d.getFullYear(); }
function daysUntil(v){ var d = parseDate(v); if(!d) return null; var t=new Date(); t.setHours(0,0,0,0); d.setHours(0,0,0,0); return Math.round((d-t)/86400000); }

function phoneLinks(raw){
  var digits = String(raw||'').replace(/[^\d]/g,'');
  if(!digits) return null;
  var intl = digits;
  if(digits.length===9 && digits[0]==='5') intl = '971'+digits;
  else if(digits.length===10 && digits[0]==='0') intl = '971'+digits.slice(1);
  else if(digits.indexOf('971')===0) intl = digits;
  var disp = digits.length===9 ? '0'+digits.slice(0,2)+' '+digits.slice(2,5)+' '+digits.slice(5) : digits;
  return { display: disp, tel:'tel:+'+intl, wa:'https://wa.me/'+intl, raw:digits };
}

/* ---------- State ---------- */
var DB = null;
var STATE = { view:'dashboard', user:null, filters:{}, search:'' };

function defaultData(){
  var s = window.SARE_SEED || {};
  return JSON.parse(JSON.stringify({
    meta: s.meta || {company:'SABIR AMIN REAL ESTATE LLC SPC', currency:'AED'},
    properties: s.properties || [],
    rentRecords: s.rentRecords || [],
    debts: s.debts || [],
    tasks: s.tasks || [],
    transactions: s.transactions || [],
    recurringExpenses: s.recurringExpenses || [],
    accounts: s.accounts || {company:[], personnel:[]},
    studios: s.studios || [],
    cheques: s.cheques || [],
    utilities: s.utilities || [],
    suppliers: s.suppliers || [],
    invoices: s.invoices || [],
    users: s.users || [{username:'admin',password:'123',role:'admin'}]
  }));
}
/* older saved data may not have the newer registers */
function ensureArrays(){
  ['properties','rentRecords','debts','tasks','transactions','recurringExpenses',
   'studios','cheques','utilities','suppliers','invoices','users'].forEach(function(k){
    if(!Array.isArray(DB[k])) DB[k]=[];
  });
  if(!DB.accounts) DB.accounts={company:[],personnel:[]};
}
function load(){
  try{ var raw = localStorage.getItem(STORE_KEY); if(raw){ DB = JSON.parse(raw); migrateMeta(); return; } }catch(e){}
  DB = defaultData(); migrateMeta(); save();
}
function migrateMeta(){
  DB.meta = DB.meta || {};
  ensureArrays();
  var seedMeta = (window.SARE_SEED && window.SARE_SEED.meta) || {};
  if(!DB.meta.sheetId) DB.meta.sheetId = seedMeta.sheetId || '';
  if(DB.meta.autoSync===undefined) DB.meta.autoSync = seedMeta.autoSync!==undefined?seedMeta.autoSync:true;
  if(DB.meta.writeUrl===undefined) DB.meta.writeUrl = seedMeta.writeUrl || '';
  if(DB.meta.writeSecret===undefined || DB.meta.writeSecret==='') DB.meta.writeSecret = seedMeta.writeSecret || 'sabir-sync-2026';
}
function save(){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(DB)); }catch(e){ toast('Storage full or blocked','err'); } }

/* ---------- Derived helpers ---------- */
function isOccupied(p){ return !!(p.tenantName && String(p.tenantName).trim()); }
function contractStatus(p){
  var dl = daysUntil(p.contractTo);
  if(dl===null) return {key:'none', label:'No contract', cls:'grey', days:null};
  if(dl < 0) return {key:'expired', label:'Expired', cls:'red', days:dl};
  if(dl <= 60) return {key:'expiring', label:'Expiring', cls:'gold', days:dl};
  return {key:'active', label:'Active', cls:'green', days:dl};
}
function recordProfit(r){
  if(r.profit !== undefined && r.profit !== null && r.profit !== 0 && r.profit !== '') return Number(r.profit);
  var p = getProp(r.unit);
  if(p) return (Number(r.amount)||0) - (Number(p.ownerRent)||0) - (Number(r.maintenance)||0);
  return 0;
}
function getProp(unit){
  unit = String(unit||'').trim().toLowerCase();
  return DB.properties.filter(function(p){ return String(p.unit).trim().toLowerCase()===unit; })[0] || null;
}
function rentFor(month, year){ return DB.rentRecords.filter(function(r){ return r.month===month && r.year===year; }); }
function curMonth(){ return new Date().getMonth()+1; }
function curYear(){ return new Date().getFullYear(); }

function sameUnit(a,b){ return String(a||'').trim().toLowerCase()===String(b||'').trim().toLowerCase(); }
function isRentPaid(unit, m, y){
  return DB.rentRecords.some(function(r){ return r.month===m && r.year===y && sameUnit(r.unit, unit); });
}
/* When a tenancy financially begins. Never guess earlier than we can evidence:
   contract start → else the earliest recorded payment → else this month only. */
function tenancyStartMonth(p){
  var start=parseDate(p.contractFrom);
  if(start) return new Date(start.getFullYear(), start.getMonth(), 1);
  var best=null;
  DB.rentRecords.forEach(function(r){
    if(!sameUnit(r.unit,p.unit) || !r.year) return;
    var v=r.year*12+((r.month||1)-1);
    if(best===null || v<best.v) best={v:v, y:r.year, m:r.month||1};
  });
  if(best) return new Date(best.y, best.m-1, 1);
  var t=new Date(); return new Date(t.getFullYear(), t.getMonth(), 1);
}
/* Every month whose rent is past its due date and still unpaid, for the last N months. */
function arrearsList(lookbackMonths){
  lookbackMonths = lookbackMonths||3;
  var today=new Date(); today.setHours(0,0,0,0);
  var out=[];
  DB.properties.filter(isOccupied).forEach(function(p){
    var rent=Number(p.tenantRent)||0; if(!rent) return;
    var startMonth = tenancyStartMonth(p);
    for(var i=lookbackMonths-1;i>=0;i--){
      var d=new Date(today.getFullYear(), today.getMonth()-i, 1);
      if(startMonth && d<startMonth) continue;          // before this tenancy began
      var m=d.getMonth()+1, y=d.getFullYear();
      var due=effectiveDueDate(p,m,y);
      if(due>today) continue;                            // not due yet
      if(isRentPaid(p.unit,m,y)) continue;               // already paid
      out.push({p:p, m:m, y:y, amount:rent, due:due, days:Math.round((today-due)/86400000), dueKnown:!!rentDueDate(p,m,y)});
    }
  });
  out.sort(function(a,b){ return b.days-a.days; });
  return out;
}
/* ---------- Accounting helpers ---------- */
/* Security deposit parsed from the sheet's "SecurityCheque" free text, e.g. "2000 cheque" */
function depositOf(p){
  var s=String(p.security||'').trim();
  if(!s || /^(no|none|nil|-)$/i.test(s)) return {amount:0, method:'None', raw:s};
  var m=s.match(/([\d][\d,]*(?:\.\d+)?)/);
  var amt=m?parseFloat(m[1].replace(/,/g,'')):0;
  var method = /cheque|check|chq/i.test(s)?'Cheque' : /cash/i.test(s)?'Cash'
             : /transfer|bank/i.test(s)?'Bank transfer' : (amt?'Other':'None');
  return {amount:amt, method:method, raw:s};
}
function depositsHeld(){ return DB.properties.filter(isOccupied).reduce(function(s,p){return s+depositOf(p).amount;},0); }

/* Statement of account for one tenant: rent charged vs paid, month by month */
function tenantLedger(p, months){
  months=months||12;
  var today=new Date(); today.setHours(0,0,0,0);
  var startM = tenancyStartMonth(p);
  var rows=[], charged=0, paidTot=0;
  for(var i=months-1;i>=0;i--){
    var d=new Date(today.getFullYear(), today.getMonth()-i, 1);
    if(startM && d<startM) continue;
    var m=d.getMonth()+1, y=d.getFullYear();
    var due=effectiveDueDate(p,m,y);
    if(due>today) continue;                        // not yet chargeable
    var rent=Number(p.tenantRent)||0;
    var recs=DB.rentRecords.filter(function(r){ return r.month===m && r.year===y && sameUnit(r.unit,p.unit); });
    var got=recs.reduce(function(s,r){ return s+(Number(r.amount)||0); },0);
    charged+=rent; paidTot+=got;
    rows.push({m:m,y:y,due:due,rent:rent,paid:got,recs:recs,balance:rent-got});
  }
  return {rows:rows, charged:charged, paid:paidTot, balance:charged-paidTot};
}

/* Receivables aging per tenant: 1-30 / 31-60 / 61-90 / 90+ days overdue */
function agingReport(months){
  var arr=arrearsList(months||6), by={};
  arr.forEach(function(x){
    var k=x.p.id;
    if(!by[k]) by[k]={p:x.p,b30:0,b60:0,b90:0,b90p:0,total:0,oldest:0,months:0};
    var t=by[k]; t.total+=x.amount; t.months++; if(x.days>t.oldest) t.oldest=x.days;
    if(x.days<=30) t.b30+=x.amount; else if(x.days<=60) t.b60+=x.amount;
    else if(x.days<=90) t.b90+=x.amount; else t.b90p+=x.amount;
  });
  return Object.keys(by).map(function(k){return by[k];}).sort(function(a,b){return b.oldest-a.oldest;});
}
/* Rent falling due within the next N days (not yet paid) */
function upcomingDue(days){
  var today=new Date(); today.setHours(0,0,0,0);
  var end=new Date(today.getTime()+days*86400000);
  var out=[];
  DB.properties.filter(isOccupied).forEach(function(p){
    for(var i=0;i<=1;i++){
      var d=new Date(today.getFullYear(), today.getMonth()+i, 1);
      var m=d.getMonth()+1, y=d.getFullYear();
      var due=rentDueDate(p,m,y); if(!due) continue;     // unknown start date — can't schedule it
      if(due>=today && due<=end && !isRentPaid(p.unit,m,y))
        out.push({p:p,m:m,y:y,due:due,amount:Number(p.tenantRent)||0,inDays:Math.round((due-today)/86400000)});
    }
  });
  return out.sort(function(a,b){return a.due-b.due;});
}
function expiringList(days){
  return DB.properties.filter(isOccupied).map(function(p){ return {p:p, dl:daysUntil(p.contractTo)}; })
    .filter(function(x){ return x.dl!==null && x.dl<=days; })
    .sort(function(a,b){ return a.dl-b.dl; });
}
function receivablesOutstanding(){ return DB.debts.filter(function(d){return d.type==='Receivable' && d.status!=='Paid Off';}).reduce(function(s,d){return s+(Number(d.balance)||0);},0); }
function payablesOutstanding(){ return DB.debts.filter(function(d){return d.type==='Payable' && d.status!=='Paid Off';}).reduce(function(s,d){return s+(Number(d.balance)||0);},0); }
function openTasks(){ return DB.tasks.filter(function(t){return !t.done;}); }

/* ============================================================
   CHARTS (inline SVG)
   ============================================================ */
function barChart(data, opts){
  opts = opts || {};
  var W = 720, H = opts.height||240, pad = {l:44,r:14,t:14,b:34};
  var max = Math.max.apply(null, data.map(function(d){return d.value;}).concat([1]));
  var niceMax = niceCeil(max);
  var iw = W-pad.l-pad.r, ih = H-pad.t-pad.b;
  var bw = iw/data.length;
  var g = '';
  // gridlines
  for(var i=0;i<=4;i++){ var y=pad.t+ih*(i/4); var val=niceMax*(1-i/4);
    g += '<line x1="'+pad.l+'" y1="'+y+'" x2="'+(W-pad.r)+'" y2="'+y+'" stroke="#eef1f6"/>';
    g += '<text x="'+(pad.l-8)+'" y="'+(y+4)+'" text-anchor="end" font-size="10" fill="#9aa7bd">'+moneyShort(val)+'</text>';
  }
  data.forEach(function(d,idx){
    var bh = ih*(d.value/niceMax);
    var x = pad.l+bw*idx+bw*0.18, w=bw*0.64, y=pad.t+ih-bh;
    var col = d.color || opts.color || '#16305B';
    g += '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+Math.max(bh,0)+'" rx="4" fill="'+col+'"><title>'+esc(d.label)+': '+money(d.value)+'</title></rect>';
    if(opts.showVals && d.value>0) g += '<text x="'+(x+w/2)+'" y="'+(y-5)+'" text-anchor="middle" font-size="9.5" font-weight="700" fill="#3a4a63">'+moneyShort(d.value)+'</text>';
    g += '<text x="'+(x+w/2)+'" y="'+(H-pad.b+16)+'" text-anchor="middle" font-size="10" fill="#7688a0">'+esc(d.label)+'</text>';
  });
  return '<svg class="chart" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid meet">'+g+'</svg>';
}
function niceCeil(n){ if(n<=0)return 1; var p=Math.pow(10,Math.floor(Math.log10(n))); var f=n/p; var nf=f<=1?1:f<=2?2:f<=5?5:10; return nf*p; }

function donut(data, opts){
  opts = opts||{}; var size=opts.size||180, r=size/2, rin=r*0.62, cx=r, cy=r;
  var total = data.reduce(function(s,d){return s+d.value;},0)||1;
  var a0=-Math.PI/2, g='';
  data.forEach(function(d,i){
    var frac=d.value/total, a1=a0+frac*Math.PI*2;
    var large=frac>0.5?1:0;
    var x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1);
    var xi0=cx+rin*Math.cos(a1),yi0=cy+rin*Math.sin(a1),xi1=cx+rin*Math.cos(a0),yi1=cy+rin*Math.sin(a0);
    if(frac>0) g+='<path d="M'+x0+' '+y0+' A'+r+' '+r+' 0 '+large+' 1 '+x1+' '+y1+' L'+xi0+' '+yi0+' A'+rin+' '+rin+' 0 '+large+' 0 '+xi1+' '+yi1+' Z" fill="'+(d.color||PALETTE[i%PALETTE.length])+'"><title>'+esc(d.label)+': '+d.value+'</title></path>';
    a0=a1;
  });
  var big = opts.center!=null?opts.center:total;
  g+='<text x="'+cx+'" y="'+(cy-2)+'" text-anchor="middle" font-size="26" font-weight="800" fill="#16233b">'+big+'</text>';
  if(opts.centerSub) g+='<text x="'+cx+'" y="'+(cy+16)+'" text-anchor="middle" font-size="11" fill="#7688a0">'+esc(opts.centerSub)+'</text>';
  return '<svg viewBox="0 0 '+size+' '+size+'" style="max-width:'+size+'px">'+g+'</svg>';
}
function legend(items){ return '<div class="legend">'+items.map(function(it){return '<div class="li"><i style="background:'+it.color+'"></i>'+esc(it.label)+(it.value!=null?' · <b>'+it.value+'</b>':'')+'</div>';}).join('')+'</div>'; }

/* ============================================================
   COMPONENTS
   ============================================================ */
function kpi(o){
  return '<div class="kpi">'+
    (o.trend?'<span class="trend '+o.trend.dir+'">'+o.trend.txt+'</span>':'')+
    '<div class="ic '+o.tint+'">'+icon(o.icon)+'</div>'+
    '<div class="val">'+o.val+'</div><div class="lbl">'+o.lbl+'</div></div>';
}
function statusChip(st){ return '<span class="chip '+st.cls+'">'+(st.days!=null && st.key!=='none'?(st.key==='expired'?Math.abs(st.days)+'d ago':st.days+'d'):st.label)+'</span>'; }

var toastTimer;
function toast(msg, kind){
  var t = document.createElement('div');
  t.className='toast '+(kind||'');
  t.innerHTML=(kind==='ok'?icon('check'):kind==='err'?icon('alert'):icon('clock'))+'<span>'+esc(msg)+'</span>';
  $('#toasts').appendChild(t);
  setTimeout(function(){ t.style.opacity='0'; t.style.transform='translateX(30px)'; setTimeout(function(){t.remove();},300); }, 2600);
}

var modalStack=[];
function openModal(title, bodyHTML, footerHTML, opts){
  opts=opts||{};
  var ov=document.createElement('div'); ov.className='overlay';
  ov.innerHTML='<div class="modal '+(opts.lg?'lg':'')+'"><div class="modal-h"><h3>'+esc(title)+'</h3><button class="x" data-close>&times;</button></div>'+
    '<div class="modal-b">'+bodyHTML+'</div>'+(footerHTML?'<div class="modal-f">'+footerHTML+'</div>':'')+'</div>';
  document.body.appendChild(ov); modalStack.push(ov);
  ov.addEventListener('mousedown', function(e){ if(e.target===ov) closeModal(); });
  ov.querySelector('[data-close]').addEventListener('click', closeModal);
  if(opts.onOpen) opts.onOpen(ov);
  return ov;
}
function closeModal(){ var m=modalStack.pop(); if(m) m.remove(); }
document.addEventListener('keydown', function(e){ if(e.key==='Escape' && modalStack.length) closeModal(); });

function confirmDialog(msg, onYes, danger){
  openModal('Please confirm', '<p style="margin:4px 0 8px;font-size:14.5px">'+esc(msg)+'</p>',
    '<button class="btn ghost" data-no>Cancel</button><button class="btn '+(danger?'red':'primary')+'" data-yes>Confirm</button>',
    {onOpen:function(ov){ ov.querySelector('[data-no]').onclick=closeModal; ov.querySelector('[data-yes]').onclick=function(){ closeModal(); onYes(); }; }});
}

/* Build a form modal. fields: [{name,label,type,value,options,required,full,step,placeholder}] */
function formModal(title, fields, onSubmit, opts){
  opts=opts||{};
  var body='<form id="fm"><div class="form-grid">'+ fields.map(function(f){
    if(f.type==='hr') return '<div class="full" style="border-top:1px solid var(--line);margin:6px 0 12px"></div>';
    var cls='field'+(f.full?' full':'');
    var inner='';
    var val = f.value==null?'':f.value;
    if(f.type==='select'){
      inner='<select name="'+f.name+'"'+(f.required?' required':'')+'>'+ (f.options||[]).map(function(o){
        var ov=typeof o==='object'?o.value:o, ol=typeof o==='object'?o.label:o;
        return '<option value="'+esc(ov)+'"'+(String(ov)===String(val)?' selected':'')+'>'+esc(ol)+'</option>';
      }).join('')+'</select>';
    } else if(f.type==='textarea'){
      inner='<textarea name="'+f.name+'" placeholder="'+esc(f.placeholder||'')+'">'+esc(val)+'</textarea>';
    } else {
      inner='<input name="'+f.name+'" type="'+(f.type||'text')+'"'+(f.step?' step="'+f.step+'"':'')+(f.required?' required':'')+' value="'+esc(val)+'" placeholder="'+esc(f.placeholder||'')+'">';
    }
    return '<div class="'+cls+'"><label>'+esc(f.label)+(f.required?' *':'')+'</label>'+inner+'</div>';
  }).join('')+'</div></form>';
  var footer='<button class="btn ghost" data-close-f>Cancel</button><button class="btn primary" id="fmSubmit">'+(opts.submitText||'Save')+'</button>';
  var ov=openModal(title, body, footer, {lg:opts.lg, onOpen:function(ov){
    ov.querySelector('[data-close-f]').onclick=closeModal;
    var form=ov.querySelector('#fm');
    function submit(){
      var data={}; var ok=true;
      $$('[name]', form).forEach(function(el){ data[el.name]=el.value.trim(); if(el.required && !el.value.trim()) ok=false; });
      if(!ok){ toast('Please fill required fields','err'); return; }
      onSubmit(data);
    }
    ov.querySelector('#fmSubmit').onclick=submit;
    form.addEventListener('submit', function(e){ e.preventDefault(); submit(); });
    var first=form.querySelector('[name]'); if(first) first.focus();
  }});
  return ov;
}

function emptyState(txt, sub){ return '<div class="empty">'+icon('folder')+'<p>'+esc(txt)+'</p>'+(sub?'<p class="text-muted" style="font-weight:400;font-size:12.5px">'+esc(sub)+'</p>':'')+'</div>'; }

/* ============================================================
   NAVIGATION
   ============================================================ */
var NAV = [
  {id:'dashboard', label:'Dashboard', icon:'dashboard', roles:['admin','agent','accountant']},
  {sep:'Portfolio'},
  {id:'properties', label:'Properties', icon:'building', roles:['admin','agent']},
  {id:'tenants', label:'Tenants', icon:'users', roles:['admin','agent']},
  {id:'contracts', label:'Contracts', icon:'contract', roles:['admin','agent']},
  {id:'documents', label:'Documents', icon:'folder', roles:['admin','agent','accountant']},
  {sep:'Money'},
  {id:'rent', label:'Rent Payments', icon:'cash', roles:['admin','agent','accountant']},
  {id:'accounting', label:'Accounting', icon:'doc', roles:['admin','accountant']},
  {id:'pnl', label:'Profit & Loss', icon:'trend', roles:['admin','accountant']},
  {id:'finance', label:'Finance', icon:'wallet', roles:['admin','accountant']},
  {id:'debts', label:'Debts & Dues', icon:'hand', roles:['admin','accountant']},
  {sep:'Manage'},
  {id:'tasks', label:'Tasks', icon:'check', roles:['admin','agent','accountant']},
  {id:'settings', label:'Settings', icon:'settings', roles:['admin']}
];
var MOBILE = ['dashboard','properties','rent','finance','tasks'];

function allowed(id){
  var item = NAV.filter(function(n){return n.id===id;})[0];
  if(!item) return true;
  return !item.roles || item.roles.indexOf(STATE.user.role)>=0;
}
function renderNav(){
  var role = STATE.user.role;
  $('#nav').innerHTML = NAV.map(function(n){
    if(n.sep) return '<div class="nav-sep">'+n.sep+'</div>';
    if(n.roles && n.roles.indexOf(role)<0) return '';
    var badge='';
    if(n.id==='tasks'){ var ot=openTasks().length; if(ot) badge='<span class="badge">'+ot+'</span>'; }
    if(n.id==='contracts'){ var ex=expiringList(30).length; if(ex) badge='<span class="badge">'+ex+'</span>'; }
    return '<div class="nav-item'+(STATE.view===n.id?' active':'')+'" data-nav="'+n.id+'">'+icon(n.icon)+'<span>'+n.label+'</span>'+badge+'</div>';
  }).join('');
  $('#mobileNav').innerHTML = MOBILE.filter(allowed).map(function(id){
    var n=NAV.filter(function(x){return x.id===id;})[0];
    return '<button data-nav="'+id+'" class="'+(STATE.view===id?'active':'')+'">'+icon(n.icon)+'<span>'+n.label.split(' ')[0]+'</span></button>';
  }).join('');
  var u=STATE.user;
  $('#sideUser').innerHTML='<div class="av">'+esc((u.username||'?')[0].toUpperCase())+'</div>'+
    '<div class="nm"><b>'+esc(u.username)+'</b><span>'+esc(u.role)+'</span></div>'+
    '<button id="lockBtn" title="Lock app">'+icon('key')+'</button>'+
    '<button id="logoutBtn" title="Sign out">'+icon('logout')+'</button>';
  $('#logoutBtn').onclick=logout;
  var lb=$('#lockBtn'); if(lb) lb.onclick=lockApp;
}

function navigate(view){
  if(!allowed(view)) view='dashboard';
  STATE.view=view;
  $$('[data-nav]').forEach(function(el){ el.classList.toggle('active', el.getAttribute('data-nav')===view); });
  closeDrawer();
  renderView();
  $('.content').scrollTop=0; window.scrollTo(0,0);
}

/* ============================================================
   VIEWS
   ============================================================ */
var TITLES = {
  dashboard:['Dashboard','Your company at a glance'],
  properties:['Properties','Studios & units portfolio'],
  tenants:['Tenants','Current occupants & contacts'],
  contracts:['Contracts','Tenancy agreements & renewals'],
  documents:['Documents','Files, IDs & contact directory'],
  rent:['Rent Payments','Collection & rent roll'],
  accounting:['Accounting','Management dashboard & registers'],
  pnl:['Profit & Loss','Full accounting statement'],
  finance:['Finance','Income, expenses & profit'],
  debts:['Debts & Dues','Receivables & payables'],
  tasks:['Tasks','Reminders & pending actions'],
  settings:['Settings','Data, users & preferences']
};
function renderView(){
  var t = TITLES[STATE.view]||['',''];
  $('#pageTitle').textContent=t[0]; $('#pageSub').textContent=t[1];
  renderNav();
  var host=$('#view');
  var fn = ({dashboard:viewDashboard, properties:viewProperties, tenants:viewTenants, contracts:viewContracts,
    documents:viewDocuments, rent:viewRent, accounting:viewAccounting, pnl:viewPnl, finance:viewFinance,
    debts:viewDebts, tasks:viewTasks, settings:viewSettings})[STATE.view];
  host.innerHTML = fn ? fn() : '';
  if(fn && fn.after) fn.after();
  wireView();
}

/* ---------- DASHBOARD ---------- */
function viewDashboard(){
  var props=DB.properties, occ=props.filter(isOccupied), vac=props.length-occ.length;
  var m=curMonth(), y=curYear();
  var thisMonth=rentFor(m,y);
  var collected=thisMonth.reduce(function(s,r){return s+(Number(r.amount)||0);},0);
  var expected=occ.reduce(function(s,p){return s+(Number(p.tenantRent)||0);},0);
  var profit=thisMonth.reduce(function(s,r){return s+recordProfit(r);},0);
  var recv=receivablesOutstanding();
  var exp30=expiringList(30), exp60=expiringList(60);

  // monthly collection last 10 months
  var series=[]; var d=new Date(y,m-1,1);
  for(var i=9;i>=0;i--){ var dd=new Date(d.getFullYear(),d.getMonth()-i,1); var mm=dd.getMonth()+1,yy=dd.getFullYear();
    var v=rentFor(mm,yy).reduce(function(s,r){return s+(Number(r.amount)||0);},0);
    series.push({label:MONTHS[mm]+(mm===1||i===9?" '"+String(yy).slice(2):''), value:v}); }

  // profit by owner
  var byOwner={}; props.forEach(function(p){ byOwner[p.ownerName]=(byOwner[p.ownerName]||0)+(Number(p.monthlyProfit)||0); });
  var ownerRows=Object.keys(byOwner).map(function(k){return {label:k,value:byOwner[k]};}).sort(function(a,b){return b.value-a.value;}).slice(0,6);

  var recent=DB.rentRecords.slice().sort(function(a,b){
    var d=(parseDate(b.date)||0)-(parseDate(a.date)||0); if(d) return d;
    return (parseFloat(String(b.id).replace(/\D/g,''))||0)-(parseFloat(String(a.id).replace(/\D/g,''))||0);
  }).slice(0,6);

  var html='';
  if(!props.length && !DB.rentRecords.length){
    var hasSheet=DB.meta && DB.meta.sheetId;
    var msg = syncing ? '<b style="color:var(--navy);font-size:15px">Loading live data from your Google Sheet…</b><div class="text-muted" style="font-size:12.5px">One moment while we fetch your units, tenants and payments.</div>'
      : hasSheet ? '<b style="color:var(--navy);font-size:15px">Connected to your Google Sheet</b><div class="text-muted" style="font-size:12.5px">Click Sync to load your live units, tenants, rent and finances.</div>'
      : '<b style="color:var(--navy);font-size:15px">Welcome! Load your data to get started</b><div class="text-muted" style="font-size:12.5px">Connect your Google Sheet in Settings, or import a backup file.</div>';
    var btn = syncing ? '' : hasSheet ? '<button class="btn primary" data-welcome-sync>'+icon('refresh')+'Sync now</button>' : '<button class="btn primary" data-welcome-import>'+icon('upload')+'Import file</button>';
    html+='<div class="card pad" style="background:linear-gradient(135deg,#eef3fb,#fdf4e4);border-color:#dbe6f7;margin-bottom:18px"><div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">'+
      '<div style="width:46px;height:46px;border-radius:13px;background:var(--navy);color:#fff;display:grid;place-items:center;flex:none">'+icon(syncing?'refresh':'building')+'</div>'+
      '<div style="flex:1;min-width:200px">'+msg+'</div>'+btn+'</div></div>';
  }
  // KPI row
  html+='<div class="grid kpis">'+
    kpi({icon:'building',tint:'tint-navy',val:props.length,lbl:'Total Units'})+
    kpi({icon:'users',tint:'tint-green',val:occ.length,lbl:'Occupied · '+Math.round(occ.length/(props.length||1)*100)+'%',trend:{dir:'up',txt:vac+' vacant'}})+
    kpi({icon:'cash',tint:'tint-gold',val:money(collected),lbl:'Collected · '+MONTHS[m]+' '+y})+
    kpi({icon:'trend',tint:(profit>=0?'tint-blue':'tint-red'),val:money(profit),lbl:'Net Profit · '+MONTHS[m]})+
  '</div>';
  // secondary strip
  html+='<div class="grid kpis mt">'+
    kpi({icon:'hand',tint:'tint-red',val:money(recv),lbl:'Receivables Outstanding'})+
    kpi({icon:'clock',tint:'tint-gold',val:exp60.length,lbl:'Contracts expiring ≤60 days'})+
    kpi({icon:'cash',tint:'tint-purple',val:money(Math.max(expected-collected,0)),lbl:'Pending to collect · '+MONTHS[m]})+
    kpi({icon:'check',tint:'tint-blue',val:openTasks().length,lbl:'Open Tasks'})+
  '</div>';

  // ---- Rent arrears ----
  var arr=arrearsList(3);
  var arrTotal=arr.reduce(function(s,x){return s+x.amount;},0);
  var aA=arr.filter(function(x){return x.days<=7;}), aB=arr.filter(function(x){return x.days>7&&x.days<=30;}), aC=arr.filter(function(x){return x.days>30;});
  html+='<div class="card pad mt"'+(arr.length?' style="border-color:#f3c6c2"':'')+'><div class="card-h">'+
    '<h3>Rent Arrears</h3><span class="sub">unpaid & past due · last 3 months</span>'+
    '<div class="right"><button class="btn sm ghost" data-nav="rent">Rent roll '+icon('chevron')+'</button></div></div>';
  if(!arr.length) html+=emptyState('No arrears — everything due has been collected 🎉');
  else{
    html+='<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:14px">'+
      '<div><div style="font-size:26px;font-weight:800;color:var(--red);line-height:1">'+money(arrTotal)+'</div>'+
      '<div class="text-muted" style="font-size:12px;font-weight:600">'+arr.length+' unpaid month'+(arr.length>1?'s':'')+' across '+uniq(arr.map(function(x){return x.p.unit;})).length+' units</div></div>'+
      '<div style="display:flex;gap:7px;flex-wrap:wrap;margin-left:auto">'+
        (aA.length?'<span class="chip gold">≤7 days · '+aA.length+'</span>':'')+
        (aB.length?'<span class="chip red">8–30 days · '+aB.length+'</span>':'')+
        (aC.length?'<span class="chip red" style="background:#e23b2e;color:#fff">30+ days · '+aC.length+'</span>':'')+
      '</div></div>';
    html+=arr.slice(0,7).map(function(x){ var tc=phoneLinks(x.p.tenantContact);
      var cls = x.days>30?'red':x.days>7?'red':'gold';
      return '<div class="lrow"><div class="av '+(x.days>7?'tint-red':'tint-gold')+'">'+esc((x.p.tenantName||'?')[0].toUpperCase())+'</div>'+
        '<div class="gr"><b>'+esc(x.p.unit)+' · '+esc(x.p.tenantName)+'</b>'+
        '<span>'+MONTHS[x.m]+' '+x.y+' · '+(x.dueKnown?('was due '+x.due.getDate()+' '+MONTHS[x.m]):'month ended, still unpaid')+'</span></div>'+
        '<span class="chip '+cls+'">'+x.days+'d late</span>'+
        '<span class="amt neg" style="min-width:92px;text-align:right">'+money(x.amount)+'</span>'+
        (tc?'<button class="btn sm" data-remind-arrear="'+esc(x.p.unit)+'::'+x.m+'::'+x.y+'" title="WhatsApp reminder">'+icon('whatsapp')+'</button>':'')+
      '</div>';
    }).join('');
    if(arr.length>7) html+='<p class="text-muted" style="font-size:12px;margin:10px 0 0">+ '+(arr.length-7)+' more — see the Rent roll</p>';
  }
  html+='</div>';

  // charts row
  html+='<div class="grid cols-3 mt">';
  html+='<div class="card pad span-2"><div class="card-h"><h3>Rent Collection</h3><span class="sub">Last 10 months</span></div>'+barChart(series,{showVals:true,color:'#16305B',height:240})+'</div>';
  html+='<div class="card pad"><div class="card-h"><h3>Occupancy</h3></div><div class="center">'+
    donut([{label:'Occupied',value:occ.length,color:'#12a670'},{label:'Vacant',value:vac,color:'#e6ebf3'}],{center:occ.length+'/'+props.length,centerSub:'occupied'})+'</div>'+
    legend([{label:'Occupied',color:'#12a670',value:occ.length},{label:'Vacant',color:'#c7d0de',value:vac}])+'</div>';
  html+='</div>';

  // lists row: coming studios + recent payments
  html+='<div class="grid cols-2 mt">';
  html+='<div class="card pad"><div class="card-h"><h3>Coming Studios</h3><span class="sub">Contracts ending soon</span><div class="right"><button class="btn sm ghost" data-nav="contracts">View all '+icon('chevron')+'</button></div></div>';
  if(exp60.length){ html+='<div>'+exp60.slice(0,6).map(function(x){
      var p=x.p, cls=x.dl<0?'red':x.dl<=30?'gold':'blue';
      return '<div class="lrow" data-prop="'+esc(p.id)+'" style="cursor:pointer"><div class="av tint-navy">'+icon('home')+'</div>'+
        '<div class="gr"><b>'+esc(p.unit)+' · '+esc(p.tenantName)+'</b><span>ends '+fmtDate(p.contractTo)+'</span></div>'+
        '<span class="chip '+cls+'">'+(x.dl<0?Math.abs(x.dl)+'d overdue':x.dl+'d left')+'</span></div>';
    }).join('')+'</div>'; }
  else html+=emptyState('No contracts expiring in 60 days','You are all set');
  html+='</div>';

  html+='<div class="card pad"><div class="card-h"><h3>Recent Payments</h3><div class="right"><button class="btn sm ghost" data-nav="rent">View all '+icon('chevron')+'</button></div></div>';
  html+= recent.length? '<div>'+recent.map(function(r){
      var rp=getProp(r.unit);
      return '<div class="lrow"><div class="av tint-green">'+icon('cash')+'</div>'+
        '<div class="gr"><b>'+esc(r.unit)+(rp&&rp.tenantName?' · '+esc(rp.tenantName):'')+'</b>'+
        '<span>'+fmtDate(r.date)+' · for '+MONTHS[r.month]+' '+r.year+'</span></div>'+
        '<span class="amt pos">'+money(r.amount)+'</span></div>';
    }).join('')+'</div>' : emptyState('No payments yet');
  html+='</div></div>';

  // owners + receivables
  html+='<div class="grid cols-2 mt">';
  html+='<div class="card pad"><div class="card-h"><h3>Profit by Owner</h3><span class="sub">Current monthly</span></div>'+
    (ownerRows.length? ownerRows.map(function(o,i){
      var maxv=ownerRows[0].value||1;
      return '<div style="margin:11px 0"><div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:5px"><b>'+esc(o.label||'—')+'</b><span class="num '+(o.value<0?'neg':'')+'">'+money(o.value)+'</span></div><div class="bar"><i style="width:'+Math.max(o.value/maxv*100,2)+'%;background:'+PALETTE[i%PALETTE.length]+'"></i></div></div>';
    }).join('') : emptyState('No data'))+'</div>';
  var topRecv=DB.debts.filter(function(d){return d.type==='Receivable'&&d.status!=='Paid Off';}).sort(function(a,b){return b.balance-a.balance;}).slice(0,6);
  html+='<div class="card pad"><div class="card-h"><h3>Outstanding Receivables</h3><div class="right"><button class="btn sm ghost" data-nav="debts">View all '+icon('chevron')+'</button></div></div>'+
    (topRecv.length? topRecv.map(function(d){ var od=daysUntil(d.dueDate); var overdue=od!==null&&od<0;
      return '<div class="lrow"><div class="av '+(overdue?'tint-red':'tint-gold')+'">'+esc((d.person||'?')[0].toUpperCase())+'</div>'+
      '<div class="gr"><b>'+esc(d.person)+'</b><span>'+esc(d.reason||'—')+(overdue?' · <span style="color:var(--red)">overdue</span>':'')+'</span></div>'+
      '<span class="amt neg">'+money(d.balance)+'</span></div>';
    }).join('') : emptyState('Nothing outstanding'))+'</div>';
  html+='</div>';

  return html;
}

/* ---------- PROPERTIES ---------- */
function viewProperties(){
  var owners=uniq(DB.properties.map(function(p){return p.ownerName;})).filter(Boolean);
  var f=STATE.filters.prop||(STATE.filters.prop={status:'all',owner:'all',view:'cards'});
  var q=(STATE.search||'').toLowerCase();
  var list=DB.properties.filter(function(p){
    if(f.owner!=='all' && p.ownerName!==f.owner) return false;
    var st=contractStatus(p);
    if(f.status==='occupied' && !isOccupied(p)) return false;
    if(f.status==='vacant' && isOccupied(p)) return false;
    if(f.status==='expiring' && st.key!=='expiring' && st.key!=='expired') return false;
    if(q){ var hay=(p.unit+' '+p.ownerName+' '+p.tenantName+' '+p.type).toLowerCase(); if(hay.indexOf(q)<0) return false; }
    return true;
  });

  var html='<div class="toolbar">'+
    '<div class="seg" data-seg="status">'+segBtns(['all','occupied','vacant','expiring'], f.status)+'</div>'+
    '<select class="mini" data-filter="owner"><option value="all">All owners</option>'+owners.map(function(o){return '<option'+(f.owner===o?' selected':'')+'>'+esc(o)+'</option>';}).join('')+'</select>'+
    '<div class="grow"></div>'+
    '<div class="seg" data-seg="view">'+segBtns([['cards','Cards'],['table','Table']], f.view)+'</div>'+
    '<button class="btn primary" data-add-prop>'+icon('plus')+'Add Unit</button>'+
  '</div>';

  html+='<p class="text-muted" style="margin:-6px 0 14px;font-size:12.5px">Showing <b>'+list.length+'</b> of '+DB.properties.length+' units</p>';

  if(!list.length) return html+emptyState('No units match your filters');

  if(f.view==='table'){
    html+='<div class="table-wrap"><table><thead><tr><th>Unit</th><th>Type</th><th>Owner</th><th>Tenant</th><th class="num">Owner Rent</th><th class="num">Tenant Rent</th><th class="num">Profit</th><th>Contract</th><th></th></tr></thead><tbody>'+
      list.map(function(p){ var st=contractStatus(p);
        return '<tr data-prop="'+esc(p.id)+'" style="cursor:pointer"><td><span class="u-code">'+esc(p.unit)+'</span></td><td>'+esc(p.type)+'</td><td>'+esc(p.ownerName)+'</td>'+
        '<td>'+(isOccupied(p)?esc(p.tenantName):'<span class="chip grey">Vacant</span>')+'</td>'+
        '<td class="num">'+num(p.ownerRent)+'</td><td class="num">'+num(p.tenantRent)+'</td><td class="num '+(p.monthlyProfit<0?'neg':'pos')+'">'+num(p.monthlyProfit)+'</td>'+
        '<td>'+statusChip(st)+'</td><td class="right">'+icon('chevron','')+'</td></tr>';
      }).join('')+'</tbody></table></div>';
  } else {
    html+='<div class="grid prop-grid">'+list.map(propCard).join('')+'</div>';
  }
  return html;
}
function propCard(p){
  var st=contractStatus(p), occ=isOccupied(p);
  return '<div class="prop-card" data-prop="'+esc(p.id)+'">'+
    '<div class="hd"><div class="code">'+esc(p.unit)+'</div><div class="type">'+esc(p.type)+' · '+esc(p.ownership||'Personnel')+'</div>'+
      '<div class="st">'+(occ?statusChip(st):'<span class="chip grey">Vacant</span>')+'</div></div>'+
    '<div class="bd">'+
      '<div class="prop-row">'+icon('users')+'<span>'+(occ?'<b>'+esc(p.tenantName)+'</b>':'<span class="text-muted">No tenant</span>')+'</span></div>'+
      '<div class="prop-row">'+icon('home')+'<span>Owner: <b>'+esc(p.ownerName||'—')+'</b></span></div>'+
      '<div class="prop-row">'+icon('clock')+'<span>'+(p.contractTo?'Ends '+fmtDate(p.contractTo):'No contract')+'</span></div>'+
    '</div>'+
    '<div class="ft"><div class="rent">'+money(p.tenantRent||0)+' <small>/mo</small></div>'+
      '<div class="pf '+(p.monthlyProfit<0?'neg':'pos')+'">'+(p.monthlyProfit>=0?'+':'')+money(p.monthlyProfit||0)+'</div></div>'+
  '</div>';
}
function propDetail(p){
  var st=contractStatus(p), occ=isOccupied(p);
  var oc=phoneLinks(p.ownerContact), tc=phoneLinks(p.tenantContact);
  function d(k,v){ return '<div class="ditem"><div class="k">'+k+'</div><div class="v">'+(v||'—')+'</div></div>'; }
  var body='<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">'+
      '<div style="width:52px;height:52px;border-radius:14px;background:var(--navy);color:#fff;display:grid;place-items:center">'+icon('home')+'</div>'+
      '<div><div style="font-size:20px;font-weight:800;color:var(--navy)">'+esc(p.unit)+'</div>'+
      '<div class="text-muted" style="font-size:12.5px">'+esc(p.type)+' · '+esc(p.ownership||'Personnel')+' · '+(occ?statusChip(st):'<span class="chip grey">Vacant</span>')+'</div></div></div>';

  body+='<div class="detail-grid">'+
    d('Owner', esc(p.ownerName))+ d('Tenant', occ?esc(p.tenantName):'Vacant')+
    d('Owner Rent', money(p.ownerRent))+ d('Tenant Rent', money(p.tenantRent))+
    d('Monthly Profit', '<span class="'+(p.monthlyProfit<0?'neg':'pos')+'">'+money(p.monthlyProfit)+'</span>')+ d('Maintenance', money(p.maintenance))+
    d('Contract From', fmtDate(p.contractFrom))+ d('Contract To', fmtDate(p.contractTo)+(st.days!=null?' <span class="chip '+st.cls+'" style="margin-left:6px">'+(st.days<0?Math.abs(st.days)+'d ago':st.days+'d left')+'</span>':''))+
    d('Owner Contract', fmtDate(p.ownerContract))+ d('Security / Cheque', esc(p.security))+
  '</div>';

  // contacts
  body+='<div class="mt"><div class="k" style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;margin-bottom:6px">Contacts</div>';
  body+='<div class="contact-actions">';
  if(tc){ body+='<span style="font-size:12.5px;font-weight:700;align-self:center">Tenant:</span>'+
    '<a class="ca call" href="'+tc.tel+'">'+icon('phone')+tc.display+'</a>'+
    '<a class="ca wa" href="'+tc.wa+'" target="_blank">'+icon('whatsapp')+'WhatsApp</a>'; }
  if(oc){ body+='<span style="font-size:12.5px;font-weight:700;align-self:center;margin-left:6px">Owner:</span>'+
    '<a class="ca call" href="'+oc.tel+'">'+icon('phone')+oc.display+'</a>'; }
  if(!tc && !oc) body+='<span class="text-muted">No contacts saved</span>';
  body+='</div></div>';

  // links
  body+='<div class="contact-actions mt">';
  if(p.driveLink) body+='<a class="ca" style="color:var(--gold)" href="'+esc(p.driveLink)+'" target="_blank">'+icon('folder')+'Documents (Drive)</a>';
  var coords=p.coordinates||p.mapLink;
  if(coords){ var mq= /^https?:/.test(coords)?coords:'https://www.google.com/maps?q='+encodeURIComponent(coords);
    body+='<a class="ca map" href="'+esc(mq)+'" target="_blank">'+icon('map')+'View on Map</a>'; }
  body+='</div>';
  if(p.notes) body+='<div class="mt"><div class="k" style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase">Notes</div><div class="v" style="font-size:13.5px">'+esc(p.notes)+'</div></div>';

  var footer='';
  if(STATE.user.role!=='accountant'){
    footer='<button class="btn red ghost" data-del style="color:var(--red)">'+icon('trash')+'Delete</button>'+
    '<div class="grow" style="flex:1"></div>'+
    '<button class="btn" data-edit>'+icon('edit')+'Edit</button>'+
    '<button class="btn green" data-pay>'+icon('cash')+'Record Rent</button>';
  }
  openModal('Unit Details', body, footer, {lg:true, onOpen:function(ov){
    var e=ov.querySelector('[data-edit]'); if(e) e.onclick=function(){ closeModal(); editProperty(p); };
    var pay=ov.querySelector('[data-pay]'); if(pay) pay.onclick=function(){ closeModal(); recordRent(p.unit); };
    var del=ov.querySelector('[data-del]'); if(del) del.onclick=function(){ confirmDialog('Delete unit '+p.unit+'? This cannot be undone.', function(){ DB.properties=DB.properties.filter(function(x){return x.id!==p.id;}); save(); closeModal(); toast('Unit deleted','ok'); renderView(); var k=numKey(p.id,'p'); if(k) syncWrite([{action:'delete', sheet:'Table', keyCol:'S_No', key:k}]); }, true); };
  }});
}
function propFields(p){
  p=p||{};
  return [
    {name:'unit',label:'Unit / Studio Code',value:p.unit,required:true,placeholder:'e.g. z16'},
    {name:'type',label:'Type',type:'select',value:p.type||'Studio',options:['Studio','1BHK','2BHK','Room','Shop','Villa','Apartment']},
    {name:'ownership',label:'Ownership',type:'select',value:p.ownership||'Personnel',options:['Personnel','Company']},
    {name:'ownerName',label:'Owner Name',value:p.ownerName},
    {name:'ownerContact',label:'Owner Contact',value:p.ownerContact,placeholder:'05x xxx xxxx'},
    {name:'tenantName',label:'Tenant Name',value:p.tenantName,placeholder:'Leave blank if vacant'},
    {name:'tenantContact',label:'Tenant Contact',value:p.tenantContact},
    {name:'ownerRent',label:'Owner Rent (AED)',type:'number',value:p.ownerRent},
    {name:'tenantRent',label:'Tenant Rent (AED)',type:'number',value:p.tenantRent},
    {name:'askingRent',label:'Asking Rent for ads (AED)',type:'number',value:p.askingRent,placeholder:'used on the flyer'},
    {name:'maintenance',label:'Maintenance (AED)',type:'number',value:p.maintenance||0},
    {name:'security',label:'Security / Cheque',value:p.security,placeholder:'e.g. 2000 cheque'},
    {name:'contractFrom',label:'Contract From',type:'date',value:toDateInput(p.contractFrom)},
    {name:'contractTo',label:'Contract To',type:'date',value:toDateInput(p.contractTo)},
    {name:'ownerContract',label:'Owner Contract Date',type:'date',value:toDateInput(p.ownerContract)},
    {name:'coordinates',label:'Coordinates / Map',value:p.coordinates,placeholder:'lat, lng or maps URL',full:true},
    {name:'driveLink',label:'Documents Drive Link',value:p.driveLink,full:true,placeholder:'https://drive.google.com/...'},
    {name:'notes',label:'Notes',type:'textarea',value:p.notes,full:true}
  ];
}
function addProperty(){
  formModal('Add Unit', propFields(), function(data){
    data.id=uid('p'); data.ownerRent=+data.ownerRent||0; data.tenantRent=+data.tenantRent||0; data.maintenance=+data.maintenance||0; data.askingRent=+data.askingRent||0;
    data.monthlyProfit=data.tenantRent-data.ownerRent-data.maintenance;
    DB.properties.push(data); save(); closeModal(); toast('Unit added','ok'); renderView();
    syncWrite([{action:'append', sheet:'Table', idCol:'S_No', row: propRow(data,true)}], {appended:{obj:data, prefix:'p'}});
  }, {lg:true, submitText:'Add Unit'});
}
function editProperty(p){
  formModal('Edit '+p.unit, propFields(p), function(data){
    Object.assign(p, data); p.ownerRent=+data.ownerRent||0; p.tenantRent=+data.tenantRent||0; p.maintenance=+data.maintenance||0; p.askingRent=+data.askingRent||0;
    p.monthlyProfit=p.tenantRent-p.ownerRent-p.maintenance;
    save(); closeModal(); toast('Saved','ok'); renderView();
    syncWrite([{action:'upsert', sheet:'Table', keyCol:'S_No', key:String(p.id).replace(/^p/,''), row: propRow(p)}]);
  }, {lg:true});
}

/* ---------- TENANTS ---------- */
function viewTenants(){
  var q=(STATE.search||'').toLowerCase();
  var occ=DB.properties.filter(isOccupied).filter(function(p){ if(!q)return true; return (p.tenantName+' '+p.unit+' '+p.tenantContact).toLowerCase().indexOf(q)>=0; });
  var html='<div class="toolbar"><p class="text-muted" style="font-size:12.5px;margin:0"><b>'+occ.length+'</b> active tenants</p></div>';
  if(!occ.length) return html+emptyState('No tenants found');
  html+='<div class="table-wrap"><table><thead><tr><th>Tenant</th><th>Unit</th><th>Contact</th><th class="num">Rent</th><th>Contract Ends</th><th>Security</th><th></th></tr></thead><tbody>'+
    occ.map(function(p){ var st=contractStatus(p); var tc=phoneLinks(p.tenantContact);
      return '<tr data-prop="'+esc(p.id)+'" style="cursor:pointer"><td><b style="color:var(--ink)">'+esc(p.tenantName)+'</b></td>'+
        '<td><span class="u-code">'+esc(p.unit)+'</span></td>'+
        '<td>'+(tc?'<a class="ca call sm" style="padding:4px 9px" href="'+tc.tel+'">'+icon('phone')+tc.display+'</a>':'—')+'</td>'+
        '<td class="num">'+money(p.tenantRent)+'</td>'+
        '<td>'+fmtDate(p.contractTo)+' '+statusChip(st)+'</td>'+
        '<td>'+esc(p.security||'—')+'</td><td class="right">'+icon('chevron')+'</td></tr>';
    }).join('')+'</tbody></table></div>';
  return html;
}

/* ---------- CONTRACTS ---------- */
function viewContracts(){
  var f=STATE.filters.contract||(STATE.filters.contract={status:'all'});
  var rows=DB.properties.filter(isOccupied).map(function(p){return {p:p,st:contractStatus(p)};});
  var counts={all:rows.length,active:0,expiring:0,expired:0};
  rows.forEach(function(r){ if(r.st.key==='active')counts.active++; if(r.st.key==='expiring')counts.expiring++; if(r.st.key==='expired')counts.expired++; });
  var filtered=rows.filter(function(r){ return f.status==='all'||r.st.key===f.status; })
    .sort(function(a,b){ return (a.st.days==null?9e9:a.st.days)-(b.st.days==null?9e9:b.st.days); });

  var html='<div class="toolbar"><div class="seg" data-seg="cstatus">'+
    segBtns([['all','All ('+counts.all+')'],['expiring','Expiring ('+counts.expiring+')'],['expired','Expired ('+counts.expired+')'],['active','Active ('+counts.active+')']], f.status)+'</div>'+
    '<div class="grow"></div><button class="btn gold" data-flyer>'+icon('doc')+'Marketing Flyer</button></div>';

  if(!filtered.length) return html+emptyState('No contracts in this category');
  html+='<div class="table-wrap"><table><thead><tr><th>Unit</th><th>Tenant</th><th>From</th><th>To</th><th>Status</th><th class="num">Tenant Rent</th><th></th></tr></thead><tbody>'+
    filtered.map(function(r){ var p=r.p, st=r.st;
      return '<tr><td><span class="u-code">'+esc(p.unit)+'</span></td><td>'+esc(p.tenantName)+'</td>'+
        '<td>'+fmtDate(p.contractFrom)+'</td><td>'+fmtDate(p.contractTo)+'</td>'+
        '<td><span class="chip '+st.cls+'">'+st.label+(st.days!=null?' · '+(st.days<0?Math.abs(st.days)+'d ago':st.days+'d'):'')+'</span></td>'+
        '<td class="num">'+money(p.tenantRent)+'</td>'+
        '<td class="right" style="white-space:nowrap">'+
          ((st.key==='expiring'||st.key==='expired') && phoneLinks(p.tenantContact)?'<button class="btn sm" data-remind-contract="'+esc(p.id)+'" title="WhatsApp renewal reminder">'+icon('whatsapp')+'</button> ':'')+
          '<button class="btn sm" data-renew="'+esc(p.id)+'">'+icon('edit')+'Renew</button></td></tr>';
    }).join('')+'</tbody></table></div>';
  return html;
}
function renewContract(p){
  formModal('Renew Contract · '+p.unit, [
    {name:'contractFrom',label:'New Contract From',type:'date',value:toDateInput(p.contractFrom),full:true},
    {name:'contractTo',label:'New Contract To',type:'date',value:toDateInput(p.contractTo),full:true},
    {name:'tenantRent',label:'Tenant Rent (AED)',type:'number',value:p.tenantRent,full:true},
    {name:'security',label:'Security / Cheque',value:p.security,full:true}
  ], function(data){
    p.contractFrom=data.contractFrom; p.contractTo=data.contractTo; p.tenantRent=+data.tenantRent||p.tenantRent; p.security=data.security;
    p.monthlyProfit=p.tenantRent-(p.ownerRent||0)-(p.maintenance||0);
    save(); closeModal(); toast('Contract renewed','ok'); renderView();
    syncWrite([{action:'upsert', sheet:'Table', keyCol:'S_No', key:String(p.id).replace(/^p/,''), row: propRow(p)}]);
  }, {submitText:'Save Renewal'});
}

/* ---------- RENT ----------
   Rent is due on the same day of each month as the tenancy start (TContractFrom).
   If TContractFrom is blank we do NOT invent a day — the date shows as "not set",
   and for overdue maths we fall back to month-end so nobody is chased too early. */
function rentDueDay(p){ var d=parseDate(p.contractFrom); return d?d.getDate():null; }
function rentDueDate(p, month, year){
  var day=rentDueDay(p); if(day===null) return null;
  var dim=new Date(year, month, 0).getDate();
  return new Date(year, month-1, Math.min(day, dim));
}
/* Conservative date used for "is it late?" — never earlier than the real due date. */
function effectiveDueDate(p, month, year){
  return rentDueDate(p, month, year) || new Date(year, month, 0); // month-end
}
function viewRent(){
  var f=STATE.filters.rent||(STATE.filters.rent={month:curMonth(),year:curYear()});
  if(!f.roll) f.roll='all';
  var years=uniq(DB.rentRecords.map(function(r){return r.year;})).concat([curYear()]);
  years=uniq(years).sort(function(a,b){return b-a;});
  var recs=rentFor(f.month,f.year);
  var occ=DB.properties.filter(isOccupied);
  var collected=recs.reduce(function(s,r){return s+(Number(r.amount)||0);},0);
  var expected=occ.reduce(function(s,p){return s+(Number(p.tenantRent)||0);},0);
  var profit=recs.reduce(function(s,r){return s+recordProfit(r);},0);
  var paidUnits={}; recs.forEach(function(r){ paidUnits[String(r.unit).trim().toLowerCase()]=r; });

  var html='<div class="toolbar">'+
    '<select class="mini" data-rent="month">'+MONTHS.slice(1).map(function(mn,i){return '<option value="'+(i+1)+'"'+(f.month===i+1?' selected':'')+'>'+mn+'</option>';}).join('')+'</select>'+
    '<select class="mini" data-rent="year">'+years.map(function(y){return '<option'+(f.year===y?' selected':'')+'>'+y+'</option>';}).join('')+'</select>'+
    '<div class="grow"></div>'+
    (STATE.user.role!=='accountant'?'<button class="btn green" data-add-rent>'+icon('plus')+'Record Payment</button>':'')+
  '</div>';

  html+='<div class="grid kpis">'+
    kpi({icon:'cash',tint:'tint-green',val:money(collected),lbl:'Collected'})+
    kpi({icon:'wallet',tint:'tint-navy',val:money(expected),lbl:'Expected (occupied)'})+
    kpi({icon:'clock',tint:'tint-gold',val:money(Math.max(expected-collected,0)),lbl:'Pending'})+
    kpi({icon:'trend',tint:(profit>=0?'tint-blue':'tint-red'),val:money(profit),lbl:'Net Profit'})+
  '</div>';

  // Rent roll (with paid/unpaid filter + due dates)
  var rows=occ.map(function(p){ return {p:p, r:paidUnits[String(p.unit).trim().toLowerCase()]}; });
  var unpaidRows=rows.filter(function(x){return !x.r;});
  var unpaidTotal=unpaidRows.reduce(function(s,x){return s+(Number(x.p.tenantRent)||0);},0);
  var shown=rows.filter(function(x){ return f.roll==='all'||(f.roll==='paid'&&x.r)||(f.roll==='unpaid'&&!x.r); });

  html+='<div class="card pad mt"><div class="card-h"><h3>Rent Roll · '+MONTHS[f.month]+' '+f.year+'</h3>'+
    '<span class="sub">'+Object.keys(paidUnits).length+' of '+occ.length+' paid</span>'+
    '<div class="right"><div class="seg" data-seg="rentroll">'+segBtns([['all','All ('+rows.length+')'],['unpaid','Unpaid ('+unpaidRows.length+')'],['paid','Paid ('+(rows.length-unpaidRows.length)+')']], f.roll)+'</div></div></div>';
  if(unpaidRows.length) html+='<div class="chip red" style="margin-bottom:12px">'+icon('alert')+' '+unpaidRows.length+' unpaid · '+money(unpaidTotal)+' outstanding this month</div>';
  var noStart=occ.filter(function(p){ return rentDueDay(p)===null; });
  if(noStart.length) html+='<div class="card pad" style="background:#fffaf0;border-color:#f0d9a8;box-shadow:none;margin-bottom:14px">'+
    '<div class="prop-row" style="font-size:12.5px;color:#8a5b12;align-items:flex-start">'+icon('alert')+
    '<span><b>'+noStart.length+' unit'+(noStart.length>1?'s have':' has')+' no <code>TContractFrom</code> in the sheet</b>, so the exact rent day is unknown: '+
    noStart.map(function(p){return '<b>'+esc(p.unit)+'</b>';}).join(', ')+
    '. Until it is filled in, rent is only treated as late after month-end. Click “Set start date” on the row, or fill <code>TContractFrom</code> in your Table tab.</span></div></div>';
  if(!shown.length) html+=emptyState(f.roll==='unpaid'?'Everyone has paid for '+MONTHS[f.month]+' 🎉':'No units to show');
  else html+='<div class="table-wrap" style="border:none"><table><thead><tr><th>Unit</th><th>Tenant</th><th class="num">Rent</th><th>Rent due</th><th class="num">Paid</th><th>Status</th><th></th></tr></thead><tbody>'+
    shown.map(function(x){ var p=x.p, r=x.r;
      var due=rentDueDate(p,f.month,f.year);            // null when TContractFrom is blank
      var eff=effectiveDueDate(p,f.month,f.year);
      var od=daysUntil(eff); var overdue=!r && od<0; var tc=phoneLinks(p.tenantContact);
      var status = r ? '<span class="chip green">Paid '+fmtDate(r.date)+'</span>'
        : overdue ? '<span class="chip red">Overdue '+Math.abs(od)+'d</span>'
        : due ? '<span class="chip gold">Due '+due.getDate()+' '+MONTHS[f.month]+'</span>'
        : '<span class="chip grey">Unpaid</span>';
      var dueCell = due
        ? ('<b>'+due.getDate()+' '+MONTHS[f.month]+' '+f.year+'</b><div class="text-muted" style="font-size:10.5px">from '+fmtDate(p.contractFrom)+'</div>')
        : '<button class="btn sm" data-set-start="'+esc(p.id)+'" style="color:#c8801a;border-color:#f0d9a8" title="TContractFrom is empty in the sheet">'+icon('alert')+'Set start date</button>';
      return '<tr'+(overdue?' style="background:#fdf1f0"':'')+'><td><span class="u-code">'+esc(p.unit)+'</span></td>'+
        '<td><b style="color:var(--ink)">'+esc(p.tenantName)+'</b>'+(tc?'<div class="text-muted" style="font-size:11px">'+tc.display+'</div>':'')+'</td>'+
        '<td class="num">'+money(p.tenantRent)+'</td>'+
        '<td>'+dueCell+'</td>'+
        '<td class="num">'+(r?money(r.amount):'—')+'</td>'+
        '<td>'+status+'</td>'+
        '<td class="right" style="white-space:nowrap">'+
          (!r && tc?'<button class="btn sm" data-remind-rent="'+esc(p.unit)+'" title="WhatsApp reminder">'+icon('whatsapp')+'</button> ':'')+
          (STATE.user.role!=='accountant'&&!r?'<button class="btn sm green" data-pay-unit="'+esc(p.unit)+'">'+icon('cash')+'Collect</button>':'')+'</td></tr>';
    }).join('')+'</tbody></table></div>';
  html+='</div>';

  // full history
  var hist=DB.rentRecords.slice().sort(function(a,b){return (parseDate(b.date)||0)-(parseDate(a.date)||0);}).slice(0,40);
  html+='<div class="card pad mt"><div class="card-h"><h3>Payment History</h3><span class="sub">Latest 40 records · '+DB.rentRecords.length+' total</span></div>'+
    '<div class="table-wrap" style="border:none"><table><thead><tr><th>Date</th><th>Unit</th><th>Period</th><th>Method</th><th class="num">Amount</th><th class="num">Profit</th><th></th></tr></thead><tbody>'+
    hist.map(function(r){ return '<tr><td>'+fmtDate(r.date)+'</td><td><span class="u-code">'+esc(r.unit)+'</span></td><td>'+MONTHS[r.month]+' '+r.year+'</td>'+
      '<td>'+(r.method?'<span class="chip grey">'+esc(r.method)+'</span>':'<span class="text-muted">—</span>')+'</td>'+
      '<td class="num pos">'+money(r.amount)+'</td><td class="num '+(recordProfit(r)<0?'neg':'')+'">'+money(recordProfit(r))+'</td>'+
      '<td class="right" style="white-space:nowrap"><button class="btn sm ghost" data-receipt="'+esc(r.id)+'" title="Receipt">'+icon('doc')+'</button>'+
      (STATE.user.role!=='accountant'?'<button class="btn sm ghost" data-del-rent="'+esc(r.id)+'" style="color:var(--red)">'+icon('trash')+'</button>':'')+'</td></tr>';
    }).join('')+'</tbody></table></div></div>';
  return html;
}
function recordRent(unit){
  var f=STATE.filters.rent||{month:curMonth(),year:curYear()};
  var units=DB.properties.map(function(x){return x.unit;});
  var startUnit=unit||units[0];
  var p0=getProp(startUnit);
  var ov=formModal('Record Rent Payment', [
    {name:'unit',label:'Unit',type:'select',value:startUnit,options:units,required:true,full:true},
    {name:'amount',label:'Amount Received (AED)',type:'number',value:p0?p0.tenantRent:'',required:true},
    {name:'maintenance',label:'Maintenance (AED)',type:'number',value:p0?(p0.maintenance||0):0},
    {name:'method',label:'Payment Method',type:'select',value:'Cash',options:['Cash','Bank transfer','Cheque','Card','Online','Other']},
    {name:'date',label:'Payment Date',type:'date',value:todayISO(),required:true},
    {name:'month',label:'Month',type:'select',value:f.month,options:MONTHS.slice(1).map(function(mn,i){return {value:i+1,label:mn};})},
    {name:'year',label:'Year',type:'number',value:f.year}
  ], function(data){
    var prop=getProp(data.unit);
    var rec={ id:uid('r'), unit:data.unit, amount:+data.amount||0, date:data.date, month:+data.month, year:+data.year,
      maintenance:+data.maintenance||0, method:data.method||'', ownership:prop?prop.ownership:'Personnel' };
    rec.profit=(rec.amount)-(prop?Number(prop.ownerRent)||0:0)-(rec.maintenance);
    DB.rentRecords.push(rec); save(); closeModal(); toast('Payment recorded','ok'); renderView();
    syncWrite([{action:'append', sheet:'RentRecords', idCol:'ID', row:{ StudioId:rec.unit, PaymentDate:toSheetDate(rec.date),
      Amount:rec.amount, Ownership:rec.ownership, Month:rec.month, Year:rec.year, Maintenance:rec.maintenance,
      Profit:rec.profit, Method:rec.method }}], {appended:{obj:rec, prefix:'r'}});
  }, {submitText:'Save Payment'});
  // Auto-load the expected rent from the Table when the unit changes
  var sel=ov.querySelector('[name="unit"]'), amt=ov.querySelector('[name="amount"]'), mnt=ov.querySelector('[name="maintenance"]');
  var lbl=amt.closest('.field').querySelector('label');
  function fill(){ var pr=getProp(sel.value); if(pr){ amt.value=pr.tenantRent||''; if(mnt) mnt.value=pr.maintenance||0; if(lbl) lbl.innerHTML='Amount Received (AED) * <span style="color:var(--muted);font-weight:600">· expected '+money(pr.tenantRent||0)+'</span>'; } }
  sel.addEventListener('change', fill); fill();
}

/* Quick fix for a missing tenancy start date — writes TContractFrom back to the sheet */
function setContractStart(p){
  formModal('Tenancy start date · '+p.unit, [
    {name:'contractFrom',label:'Contract start (TContractFrom)',type:'date',value:toDateInput(p.contractFrom),required:true,full:true}
  ], function(data){
    p.contractFrom=data.contractFrom; save(); closeModal();
    toast('Rent day set to the '+parseDate(data.contractFrom).getDate()+'','ok'); renderView();
    syncWrite([{action:'upsert', sheet:'Table', keyCol:'S_No', key:String(p.id).replace(/^p/,''),
      row:{ TContractFrom: toSheetDate(data.contractFrom) }}]);
  }, {submitText:'Save start date'});
}

/* ---------- WhatsApp reminders ---------- */
function waOpen(contact, msg){ var pl=phoneLinks(contact); if(!pl){ toast('No contact number saved for this tenant','err'); return; } window.open(pl.wa+'?text='+encodeURIComponent(msg),'_blank'); }
function remindRent(unit, mm, yy){ var p=getProp(unit); if(!p) return; var f=STATE.filters.rent||{month:curMonth(),year:curYear()};
  var m=mm||f.month, y=yy||f.year;
  var due=rentDueDate(p,m,y), od=daysUntil(due);
  var when = (od!==null && od<0) ? (' is now '+Math.abs(od)+' days overdue (was due '+due.getDate()+' '+MONTHS[m]+')') : ' is due';
  var msg='Dear '+(p.tenantName||'Tenant')+', gentle reminder: your rent of '+money(p.tenantRent||0)+' for '+MONTHS[m]+' '+y+' (unit '+p.unit+')'+when+'. Kindly arrange the payment. Thank you — '+(DB.meta.company||'Sabir Amin Real Estate')+'.';
  waOpen(p.tenantContact, msg); }
function remindContract(pid){ var p=DB.properties.filter(function(x){return x.id===pid;})[0]; if(!p) return; var dl=daysUntil(p.contractTo);
  var when; if(dl==null){ when='ending soon'; } else if(dl<0){ when='expired '+Math.abs(dl)+' days ago'; } else { when='due for renewal in '+dl+' days ('+fmtDate(p.contractTo)+')'; }
  var msg='Dear '+(p.tenantName||'Tenant')+', your tenancy for unit '+p.unit+' is '+when+'. Please let us know if you would like to renew. Thank you — '+(DB.meta.company||'Sabir Amin Real Estate')+'.';
  waOpen(p.tenantContact, msg); }

/* ---------- Marketing flyer for available / expiring studios ---------- */
function fmtShortDate(v){ var d=parseDate(v); if(!d) return ''; var mm=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]; return String(d.getDate()).padStart(2,'0')+'-'+mm+'-'+String(d.getFullYear()).slice(2); }
function studioAdItems(days, includeVacant){
  var out=[];
  DB.properties.forEach(function(p){
    var occ=isOccupied(p), dl=daysUntil(p.contractTo);
    if(!occ){ if(includeVacant) out.push({p:p, status:'Available Now', soon:false, dl:-1}); }
    else if(dl!=null && dl>=0 && dl<=days){ out.push({p:p, status:fmtShortDate(p.contractTo), soon:true, dl:dl}); }
  });
  out.sort(function(a,b){ return a.dl-b.dl; });
  return out;
}
function flyerDialog(){
  formModal('Create Studio Flyer', [
    {name:'days',label:'Include contracts expiring within (days)',type:'number',value:30},
    {name:'includeVacant',label:'Include vacant units',type:'select',value:'yes',options:[{value:'yes',label:'Yes'},{value:'no',label:'No'}]},
    {name:'uplift',label:'Add to rent for units with no Asking Rent (AED)',type:'number',value:(DB.meta.adUplift!=null?DB.meta.adUplift:1000)},
    {name:'phone',label:'Contact number shown on flyer',value:(DB.meta.adPhone||'00971582779984'),full:true},
    {name:'area',label:'Area / location line',value:(DB.meta.adArea||'MBZ Abu Dhabi • Mohammed Bin Zayed City, Abu Dhabi, UAE'),full:true}
  ], function(data){ DB.meta.adPhone=data.phone; DB.meta.adArea=data.area; DB.meta.adUplift=+data.uplift||0; save(); closeModal();
    openFlyer(+data.days||30, data.includeVacant!=='no', data.phone, data.area, +data.uplift||0); }, {submitText:'Generate flyer'});
}
function openFlyer(days, includeVacant, phone, area, uplift){
  var items=studioAdItems(days, includeVacant);
  if(!items.length){ toast('No available or soon-expiring studios to advertise','err'); return; }
  var html=flyerHTML(items, {phone:phone, area:area, uplift:uplift||0});
  var ov=document.createElement('div'); ov.className='overlay flyer-ov';
  ov.innerHTML='<div class="flyer-wrap">'+
    '<div class="flyer-bar"><b>Studio Flyer · '+items.length+' unit'+(items.length>1?'s':'')+'</b>'+
      '<div><button class="btn sm primary" data-f-print>'+icon('doc')+'Print / Save PDF</button>'+
      '<button class="btn sm" data-f-copy>'+icon('download')+'Save HTML</button>'+
      '<button class="btn sm ghost" data-f-close>Close</button></div></div>'+
    '<iframe class="flyer-frame" title="Studio flyer"></iframe></div>';
  document.body.appendChild(ov); modalStack.push(ov);
  var ifr=ov.querySelector('iframe'); ifr.srcdoc=html;
  ov.querySelector('[data-f-close]').onclick=closeModal;
  ov.querySelector('[data-f-print]').onclick=function(){ try{ ifr.contentWindow.focus(); ifr.contentWindow.print(); }catch(e){ toast('Use your browser menu → Print','err'); } };
  ov.querySelector('[data-f-copy]').onclick=function(){ download('studio-flyer-'+todayISO()+'.html', html, 'text/html'); };
  ov.addEventListener('mousedown', function(e){ if(e.target===ov) closeModal(); });
}
function flyerHTML(items, opts){
  var now=new Date();
  var monthYear=['January','February','March','April','May','June','July','August','September','October','November','December'][now.getMonth()]+' '+now.getFullYear();
  var logo='<svg width="70" height="70" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" rx="27" fill="#16305B"/><path d="M28 52 L60 26 L92 52 L81 52 L60 35 L39 52 Z" fill="#E23B2E"/><text x="60" y="84" font-family="Arial" font-size="44" font-weight="800" fill="#fff" text-anchor="middle">SA</text><g fill="#F2A83C"><circle cx="35" cy="99" r="7.5"/><circle cx="35" cy="99" r="2.8" fill="#16305B"/><rect x="41" y="96" width="44" height="6" rx="3"/><rect x="74" y="96" width="6" height="12" rx="3"/><rect x="83" y="96" width="6" height="9" rx="3"/></g></svg>';
  var rows=items.map(function(it){ var p=it.p;
    var rent=Number(p.askingRent)>0 ? Math.round(Number(p.askingRent))
             : Math.round(Number(p.tenantRent||p.ownerRent||0) + (Number(opts.uplift)||0));
    var badge=it.soon?('<span class="status-badge status-soon">'+esc(it.status)+'</span>'):'<span class="status-badge status-available">Available Now</span>';
    return '<tr><td class="col-studio"><div class="studio-name">'+esc(p.unit)+'</div><div class="studio-meta">'+esc(p.type||'Studio')+' • Furnished</div></td>'+
      '<td class="col-rent"><span class="rent-display">'+rent.toLocaleString('en-US')+'<span class="rent-currency">AED</span></span></td>'+
      '<td class="col-status">'+badge+'</td>'+
      '<td class="col-terms"><strong>Agreement:</strong> 200 AED<br><strong>Security:</strong> One month ('+rent.toLocaleString('en-US')+' AED) cheque or cash</td></tr>';
  }).join('');
  var phone=esc(opts.phone||'00971582779984'); var area=esc(opts.area||'Abu Dhabi, UAE');
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Premium Studios — Sabir Amin Real Estate</title>'+
  '<style>@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");*{margin:0;padding:0;box-sizing:border-box}@page{size:A4 portrait;margin:10mm}'+
  'body{font-family:Inter,-apple-system,Segoe UI,Roboto,sans-serif;font-size:9pt;line-height:1.3;color:#1a1a1a;background:#f3f4f6;-webkit-font-smoothing:antialiased}'+
  '.page{max-width:190mm;margin:15px auto;background:#fff;box-shadow:0 4px 6px rgba(0,0,0,.1);padding:15px;min-height:277mm}'+
  '.header{background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:#fff;padding:10px 15px;border-radius:8px;margin-bottom:10px}'+
  '.header-content{display:flex;align-items:center;gap:15px}.logo-container{flex-shrink:0;background:#fff;padding:5px;border-radius:8px}'+
  '.company-name{font-size:16pt;font-weight:700;margin-bottom:2px}.tagline{font-size:9pt;opacity:.95;margin-bottom:4px}'+
  '.contact-info{font-size:10pt;font-weight:600;background:rgba(255,255,255,.2);display:inline-block;padding:3px 10px;border-radius:15px}'+
  '.section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;padding-bottom:4px;border-bottom:2px solid #e5e7eb}'+
  '.section-title{font-size:11pt;font-weight:700;color:#1e3a8a;text-transform:uppercase}.date-badge{background:#f3f4f6;padding:2px 8px;border-radius:10px;font-size:8pt;color:#6b7280;font-weight:600}'+
  '.studio-table{width:100%;border-collapse:separate;border-spacing:0;margin-bottom:8px;font-size:8.5pt}'+
  '.studio-table thead th{background:#f8fafc;color:#1e40af;font-weight:700;text-transform:uppercase;font-size:7.5pt;padding:6px 8px;border-bottom:2px solid #3b82f6;text-align:left}'+
  '.studio-table tbody td{padding:4px 8px;border-bottom:1px solid #e5e7eb;vertical-align:middle}.studio-table tbody tr:nth-child(even){background:#fafbfc}'+
  '.col-rent{text-align:right}.col-terms{font-size:7.5pt;color:#4b5563}.studio-name{font-weight:700;color:#111827;font-size:9pt}.studio-meta{font-size:7.5pt;color:#6b7280}'+
  '.rent-display{font-weight:700;font-size:10pt;color:#059669}.rent-currency{font-size:7.5pt;color:#6b7280;margin-left:2px}'+
  '.status-badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:7pt;font-weight:700;text-transform:uppercase}'+
  '.status-available{background:#d1fae5;color:#065f46;border:1px solid #a7f3d0}.status-soon{background:#fef3c7;color:#92400e;border:1px solid #fde68a}'+
  '.amenities-box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:8px 10px;margin-top:6px}'+
  '.amenities-title{font-weight:700;font-size:8.5pt;color:#1e40af;margin-bottom:5px;text-align:center}'+
  '.amenities-list{display:grid;grid-template-columns:repeat(6,1fr);gap:3px 8px;font-size:7.5pt;text-align:center}'+
  '.amenity-item{color:#374151;background:#f3f4f6;padding:2px 4px;border-radius:4px}'+
  '.footer{margin-top:10px;padding-top:8px;border-top:2px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;font-size:8pt;color:#6b7280}'+
  '.footer-brand{font-weight:700;color:#1e3a8a;font-size:9pt}.highlight-phone{color:#059669;font-weight:700;font-size:10pt}'+
  '.printbar{max-width:190mm;margin:10px auto 0;text-align:center}.printbar button{font:inherit;font-weight:700;background:#1e3a8a;color:#fff;border:none;padding:9px 18px;border-radius:8px;cursor:pointer}'+
  '@media print{.printbar{display:none}.page{margin:0;box-shadow:none;min-height:auto}.header,.studio-table thead th,.status-badge{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>'+
  '<div class="printbar"><button onclick="window.print()">🖨️ Print / Save as PDF</button></div>'+
  '<div class="page"><div class="header"><div class="header-content"><div class="logo-container">'+logo+'</div>'+
  '<div class="header-text"><div class="company-name">PREMIUM FURNISHED STUDIOS</div><div class="tagline">'+area+'</div><div class="contact-info">📞 '+phone+'</div></div></div></div>'+
  '<div class="section-header"><div class="section-title">📋 Available Properties</div><div class="date-badge">'+monthYear+'</div></div>'+
  '<table class="studio-table"><thead><tr><th class="col-studio">Studio Details</th><th class="col-rent">Monthly Rent</th><th class="col-status">Status</th><th class="col-terms">Terms &amp; Conditions</th></tr></thead><tbody>'+rows+'</tbody></table>'+
  '<div class="amenities-box"><div class="amenities-title">✨ STANDARD PREMIUM AMENITIES INCLUDED IN ALL STUDIOS</div><div class="amenities-list">'+
  ['🛏️ Bed Set','🚗 Parking','📺 LED TV','❄️ Fridge','🧺 Washing Machine','🍳 Stove','🔥 Gas Cylinder','🗄️ Wardrobe','🍲 Microwave','🍽️ Kitchen','🚿 Private Bath','📶 Wi-Fi'].map(function(a){return '<div class="amenity-item">'+a+'</div>';}).join('')+
  '</div></div>'+
  '<div class="footer"><div><div class="footer-brand">'+esc(DB.meta.company||'Sabir Amin Real Estate LLC')+'</div><div>Licensed Real Estate Agency</div></div>'+
  '<div style="text-align:right"><div>Call or WhatsApp</div><div class="highlight-phone">📞 '+phone+'</div></div></div></div></body></html>';
}

/* ============================================================
   ACCOUNTING — management dashboard & registers
   ============================================================ */
function viewAccounting(){
  var f=STATE.filters.acc||(STATE.filters.acc={tab:'overview'});
  var html='<div class="toolbar"><div class="seg" data-seg="acctab">'+segBtns([
      ['overview','Overview'],['receivables','Receivables'],['deposits','Deposits'],
      ['cheques','Cheques'],['utilities','Utilities'],['payables','Payables'],
      ['calendar','Due Calendar'],['statements','Statements']], f.tab)+'</div>'+
    '<div class="grow"></div><button class="btn" data-print>'+icon('doc')+'Print</button></div>';

  var m=curMonth(), y=curYear();
  var props=DB.properties, occ=props.filter(isOccupied), vac=props.length-occ.length;
  var expected=occ.reduce(function(s,p){return s+(Number(p.tenantRent)||0);},0);
  var collected=rentFor(m,y).reduce(function(s,r){return s+(Number(r.amount)||0);},0);
  var outstanding=Math.max(expected-collected,0);
  var rate=expected?Math.round(collected/expected*100):0;
  var deposits=depositsHeld();
  var monthTx=DB.transactions.filter(function(t){var d=parseDate(t.date);return d&&d.getFullYear()===y&&(d.getMonth()+1)===m;});
  var monthExp=monthTx.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+(Number(t.amount)||0);},0)
              + DB.recurringExpenses.reduce(function(s,e){return s+(e.frequency==='Monthly'?Number(e.amount)||0:0);},0);
  var netRental=rentFor(m,y).reduce(function(s,r){return s+recordProfit(r);},0)-monthExp;

  if(f.tab==='overview'){
    html+='<div class="card pad" style="background:linear-gradient(135deg,#16305B,#1d3d70);border:none">'+
      '<div style="color:#bcd0ee;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:14px">Management Dashboard · '+MONTHS[m]+' '+y+'</div>'+
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:1px;background:#ffffff20;border-radius:12px;overflow:hidden">'+
      [['Total Studios',props.length,''],['Occupied',occ.length,''],['Vacant',vac,vac?'gold':''],
       ['Rent Expected',money(expected),''],['Rent Collected',money(collected),'green'],
       ['Outstanding',money(outstanding),outstanding?'red':''],['Collection %',rate+'%',rate>=90?'green':rate>=60?'gold':'red'],
       ['Deposits Held',money(deposits),''],['Monthly Expenses',money(monthExp),''],
       ['Net Rental Profit',money(netRental),netRental>=0?'green':'red']
      ].map(function(k){
        var col=k[2]==='green'?'#5ee0a8':k[2]==='red'?'#ff9b90':k[2]==='gold'?'#ffcd75':'#fff';
        return '<div style="background:#16305B;padding:13px 14px">'+
          '<div style="font-size:10.5px;color:#9fb6d8;font-weight:700;text-transform:uppercase;letter-spacing:.4px">'+k[0]+'</div>'+
          '<div style="font-size:18px;font-weight:800;color:'+col+';margin-top:4px;line-height:1.15">'+k[1]+'</div></div>';
      }).join('')+'</div></div>';

    html+='<div class="grid cols-3 mt">'+
      '<div class="card pad"><div class="card-h"><h3>Deposits Held</h3></div>'+
        '<div style="font-size:24px;font-weight:800;color:var(--navy)">'+money(deposits)+'</div>'+
        '<p class="text-muted" style="font-size:12px">Liability owed back to tenants — not income.</p>'+
        '<button class="btn sm block" data-acc-tab="deposits">View register</button></div>'+
      '<div class="card pad"><div class="card-h"><h3>Overdue</h3></div>'+
        '<div style="font-size:24px;font-weight:800;color:var(--red)">'+money(arrearsList(6).reduce(function(s,x){return s+x.amount;},0))+'</div>'+
        '<p class="text-muted" style="font-size:12px">Past due and still unpaid (6-month view).</p>'+
        '<button class="btn sm block" data-acc-tab="receivables">Aging report</button></div>'+
      '<div class="card pad"><div class="card-h"><h3>Due next 30 days</h3></div>'+
        '<div style="font-size:24px;font-weight:800;color:var(--gold)">'+money(upcomingDue(30).reduce(function(s,x){return s+x.amount;},0))+'</div>'+
        '<p class="text-muted" style="font-size:12px">Rent about to fall due.</p>'+
        '<button class="btn sm block" data-acc-tab="calendar">Due calendar</button></div>'+
    '</div>';
    html+='<p class="text-muted mt" style="font-size:12px">Unit-by-unit profitability, landlord payouts and the full P&amp;L are in <b>Profit &amp; Loss</b>.</p>';
  }

  if(f.tab==='receivables'){
    var lb=f.months||(f.months=6);
    var aging=agingReport(lb);
    var tot={b30:0,b60:0,b90:0,b90p:0,total:0};
    aging.forEach(function(t){ tot.b30+=t.b30; tot.b60+=t.b60; tot.b90+=t.b90; tot.b90p+=t.b90p; tot.total+=t.total; });
    html+='<div class="grid kpis">'+
      kpi({icon:'clock',tint:'tint-gold',val:money(tot.b30),lbl:'1–30 days'})+
      kpi({icon:'alert',tint:'tint-red',val:money(tot.b60),lbl:'31–60 days'})+
      kpi({icon:'alert',tint:'tint-red',val:money(tot.b90),lbl:'61–90 days'})+
      kpi({icon:'alert',tint:'tint-red',val:money(tot.b90p),lbl:'Over 90 days'})+
    '</div>';
    html+='<div class="card pad mt"><div class="card-h"><h3>Accounts Receivable Aging</h3><span class="sub">'+aging.length+' tenants · '+money(tot.total)+' outstanding</span>'+
      '<div class="right"><select class="mini" data-acc-months>'+[3,6,12].map(function(n){return '<option value="'+n+'"'+(lb===n?' selected':'')+'>Last '+n+' months</option>';}).join('')+'</select></div></div>'+
      '<div class="card pad" style="background:var(--navy-50);border-color:#dbe6f7;margin-bottom:14px;box-shadow:none"><div class="prop-row" style="font-size:12px;color:var(--navy);align-items:flex-start">'+icon('alert')+
      '<span>Arrears are worked out from months that have <b>no matching row in RentRecords</b>. If a past payment was collected but never entered in the sheet, it will appear here as debt — check the tenant statement before chasing.</span></div></div>';
    if(!aging.length) html+=emptyState('No receivables outstanding 🎉');
    else html+='<div class="table-wrap" style="border:none"><table><thead><tr><th>Tenant</th><th>Unit</th><th class="num">1–30d</th><th class="num">31–60d</th><th class="num">61–90d</th><th class="num">90+d</th><th class="num">Total</th><th>Oldest</th><th></th></tr></thead><tbody>'+
      aging.map(function(t){ return '<tr'+(t.oldest>60?' style="background:#fdf1f0"':'')+'>'+
        '<td><b style="color:var(--ink)">'+esc(t.p.tenantName)+'</b></td><td><span class="u-code">'+esc(t.p.unit)+'</span></td>'+
        '<td class="num">'+(t.b30?money(t.b30):'—')+'</td><td class="num">'+(t.b60?money(t.b60):'—')+'</td>'+
        '<td class="num">'+(t.b90?money(t.b90):'—')+'</td><td class="num '+(t.b90p?'neg':'')+'">'+(t.b90p?money(t.b90p):'—')+'</td>'+
        '<td class="num neg"><b>'+money(t.total)+'</b></td>'+
        '<td><span class="chip '+(t.oldest>60?'red':t.oldest>30?'gold':'grey')+'">'+t.oldest+'d</span></td>'+
        '<td class="right"><button class="btn sm" data-statement="'+esc(t.p.id)+'">Statement</button></td></tr>'; }).join('')+
      '<tr style="background:var(--navy-50)"><td colspan="2"><b>TOTAL</b></td><td class="num"><b>'+money(tot.b30)+'</b></td><td class="num"><b>'+money(tot.b60)+'</b></td>'+
      '<td class="num"><b>'+money(tot.b90)+'</b></td><td class="num"><b>'+money(tot.b90p)+'</b></td><td class="num neg"><b>'+money(tot.total)+'</b></td><td colspan="2"></td></tr>'+
      '</tbody></table></div>';
    html+='</div>';
  }

  if(f.tab==='deposits'){
    var reg=DB.properties.filter(isOccupied).map(function(p){ return {p:p, d:depositOf(p)}; });
    var held=reg.reduce(function(s,x){return s+x.d.amount;},0);
    var missing=reg.filter(function(x){return !x.d.amount;});
    html+='<div class="grid kpis">'+
      kpi({icon:'key',tint:'tint-navy',val:money(held),lbl:'Total deposits held (liability)'})+
      kpi({icon:'users',tint:'tint-green',val:reg.filter(function(x){return x.d.amount;}).length,lbl:'Tenants with a deposit'})+
      kpi({icon:'alert',tint:'tint-red',val:missing.length,lbl:'No deposit recorded'})+
      kpi({icon:'wallet',tint:'tint-gold',val:money(reg.length?held/reg.filter(function(x){return x.d.amount;}).length||0:0),lbl:'Average deposit'})+
    '</div>';
    html+='<div class="card pad mt"><div class="card-h"><h3>Security Deposit Register</h3><span class="sub">held as a liability until refunded</span></div>'+
      '<div class="table-wrap" style="border:none"><table><thead><tr><th>Tenant</th><th>Unit</th><th class="num">Deposit</th><th>Method</th><th>Monthly Rent</th><th>Contract Ends</th><th>As recorded</th></tr></thead><tbody>'+
      reg.map(function(x){ var st=contractStatus(x.p);
        return '<tr'+(!x.d.amount?' style="background:#fffaf0"':'')+'><td><b style="color:var(--ink)">'+esc(x.p.tenantName)+'</b></td>'+
        '<td><span class="u-code">'+esc(x.p.unit)+'</span></td>'+
        '<td class="num '+(x.d.amount?'':'text-muted')+'">'+(x.d.amount?money(x.d.amount):'none')+'</td>'+
        '<td><span class="chip '+(x.d.method==='Cheque'?'blue':x.d.method==='Cash'?'green':'grey')+'">'+esc(x.d.method)+'</span></td>'+
        '<td class="num">'+money(x.p.tenantRent)+'</td>'+
        '<td>'+fmtDate(x.p.contractTo)+' '+statusChip(st)+'</td>'+
        '<td class="text-muted">'+esc(x.d.raw||'—')+'</td></tr>'; }).join('')+
      '</tbody></table></div>'+
      (missing.length?'<div class="chip gold mt-s">'+icon('alert')+' '+missing.length+' tenant(s) have no deposit recorded — add it in the unit\'s Security field</div>':'')+
    '</div>';
  }

  /* ---------- POST-DATED CHEQUE REGISTER ---------- */
  if(f.tab==='cheques'){
    if(!DB.cheques.length && !tabReady('Cheques')) return html+setupNotice('Cheques');
    var today=new Date(); today.setHours(0,0,0,0);
    var chq=DB.cheques.slice().sort(function(a,b){ return (parseDate(a.chequeDate)||9e15)-(parseDate(b.chequeDate)||9e15); });
    var pend=chq.filter(function(c){return /pending|deposited/i.test(c.status);});
    var soon=pend.filter(function(c){ var d=daysUntil(c.chequeDate); return d!==null && d<=7; });
    var bounced=chq.filter(function(c){return /bounce|return/i.test(c.status);});
    var secHeld=chq.filter(function(c){return /security/i.test(c.purpose) && !/cleared|bounce|return/i.test(c.status);});
    html+='<div class="grid kpis">'+
      kpi({icon:'doc',tint:'tint-navy',val:money(pend.reduce(function(s,c){return s+c.amount;},0)),lbl:'Cheques on hand ('+pend.length+')'})+
      kpi({icon:'clock',tint:'tint-gold',val:soon.length,lbl:'To bank within 7 days'})+
      kpi({icon:'alert',tint:'tint-red',val:money(bounced.reduce(function(s,c){return s+c.amount;},0)),lbl:'Bounced ('+bounced.length+')'})+
      kpi({icon:'key',tint:'tint-green',val:money(secHeld.reduce(function(s,c){return s+c.amount;},0)),lbl:'Security cheques held'})+
    '</div>';
    if(soon.length) html+='<div class="chip gold mt">'+icon('alert')+' '+soon.length+' cheque(s) reach their date within 7 days — bank them on time</div>';
    html+='<div class="card pad mt"><div class="card-h"><h3>Post-Dated Cheque Register</h3><span class="sub">'+chq.length+' cheques</span>'+
      '<div class="right"><button class="btn sm primary" data-add-cheque>'+icon('plus')+'Add cheque</button></div></div>';
    if(!chq.length) html+=emptyState('No cheques recorded yet','Add the post-dated cheques you are holding');
    else html+='<div class="table-wrap" style="border:none"><table><thead><tr><th>Cheque date</th><th>Tenant</th><th>Unit</th><th>Cheque #</th><th>Bank</th><th class="num">Amount</th><th>Purpose</th><th>Status</th><th></th></tr></thead><tbody>'+
      chq.map(function(c){ var dl=daysUntil(c.chequeDate); var live=/pending|deposited/i.test(c.status);
        var cls=/cleared/i.test(c.status)?'green':/bounce|return/i.test(c.status)?'red':/deposited/i.test(c.status)?'blue':'gold';
        return '<tr'+(/bounce|return/i.test(c.status)?' style="background:#fdf1f0"':'')+'>'+
          '<td><b>'+fmtDate(c.chequeDate)+'</b>'+(live&&dl!==null?'<div class="text-muted" style="font-size:10.5px">'+(dl<0?Math.abs(dl)+'d ago':dl===0?'today':'in '+dl+'d')+'</div>':'')+'</td>'+
          '<td>'+esc(c.tenant||'—')+'</td><td><span class="u-code">'+esc(c.unit||'—')+'</span></td>'+
          '<td>'+esc(c.chequeNo||'—')+'</td><td>'+esc(c.bank||'—')+'</td>'+
          '<td class="num">'+money(c.amount)+'</td>'+
          '<td><span class="chip grey">'+esc(c.purpose)+'</span></td>'+
          '<td><span class="chip '+cls+'">'+esc(c.status)+'</span></td>'+
          '<td class="right" style="white-space:nowrap">'+
            (live?'<button class="btn sm green" data-chq-clear="'+esc(c.id)+'" title="Mark cleared">'+icon('check')+'</button> '+
                  '<button class="btn sm red" data-chq-bounce="'+esc(c.id)+'" title="Mark bounced">'+icon('alert')+'</button> ':'')+
            '<button class="btn sm ghost" data-chq-edit="'+esc(c.id)+'">'+icon('edit')+'</button></td></tr>';
      }).join('')+'</tbody></table></div>';
    html+='</div>';
  }

  /* ---------- UTILITIES PER UNIT ---------- */
  if(f.tab==='utilities'){
    if(!DB.utilities.length && !tabReady('Utilities')) return html+setupNotice('Utilities');
    var ut=DB.utilities.slice().sort(function(a,b){ return (parseDate(b.billDate)||0)-(parseDate(a.billDate)||0); });
    var thisMo=ut.filter(function(u){ return u.month===m && u.year===y; });
    var unpaidU=ut.filter(function(u){ return !/paid/i.test(u.status); });
    var recoverable=ut.filter(function(u){ return u.recoverable && u.recovered<u.amount; });
    var companyCost=thisMo.filter(function(u){ return !u.recoverable; }).reduce(function(s,u){return s+u.amount;},0);
    html+='<div class="grid kpis">'+
      kpi({icon:'wallet',tint:'tint-navy',val:money(thisMo.reduce(function(s,u){return s+u.amount;},0)),lbl:'Utilities · '+MONTHS[m]+' '+y})+
      kpi({icon:'alert',tint:'tint-red',val:money(unpaidU.reduce(function(s,u){return s+u.amount;},0)),lbl:'Unpaid bills ('+unpaidU.length+')'})+
      kpi({icon:'hand',tint:'tint-gold',val:money(recoverable.reduce(function(s,u){return s+(u.amount-u.recovered);},0)),lbl:'Recoverable from tenants'})+
      kpi({icon:'trend',tint:'tint-purple',val:money(companyCost),lbl:'Company-borne this month'})+
    '</div>';
    // per-unit summary
    var byU={}; ut.forEach(function(u){ var k=u.unit||'(unallocated)'; if(!byU[k]) byU[k]={unit:k,total:0,n:0};
      byU[k].total+=u.amount; byU[k].n++; });
    var uRows=Object.keys(byU).map(function(k){return byU[k];}).sort(function(a,b){return b.total-a.total;});
    html+='<div class="card pad mt"><div class="card-h"><h3>Utility Cost by Unit</h3><span class="sub">all time</span></div>'+
      (uRows.length? uRows.slice(0,8).map(function(r){ var mx=uRows[0].total||1;
        return '<div style="margin:10px 0"><div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:5px"><b>'+esc(r.unit)+'</b><span class="num">'+money(r.total)+' <span class="text-muted">('+r.n+' bills)</span></span></div>'+
        '<div class="bar"><i style="width:'+Math.max(r.total/mx*100,2)+'%;background:var(--purple)"></i></div></div>'; }).join('')
        : emptyState('No utility bills yet'))+'</div>';
    html+='<div class="card pad mt"><div class="card-h"><h3>Utility Bills</h3><span class="sub">'+ut.length+' bills</span>'+
      '<div class="right"><button class="btn sm primary" data-add-util>'+icon('plus')+'Add bill</button></div></div>';
    if(!ut.length) html+=emptyState('No bills recorded','Add electricity, water, internet or gas bills per unit');
    else html+='<div class="table-wrap" style="border:none"><table><thead><tr><th>Bill date</th><th>Unit</th><th>Type</th><th>Provider</th><th>Period</th><th class="num">Amount</th><th>Borne by</th><th>Status</th><th></th></tr></thead><tbody>'+
      ut.slice(0,60).map(function(u){ var paidU=/paid/i.test(u.status);
        return '<tr'+(!paidU?' style="background:#fffaf0"':'')+'><td>'+fmtDate(u.billDate)+'</td>'+
          '<td><span class="u-code">'+esc(u.unit||'—')+'</span></td><td>'+esc(u.type)+'</td>'+
          '<td>'+esc(u.provider||'—')+'</td><td>'+(u.month?MONTHS[u.month]+' '+u.year:'—')+'</td>'+
          '<td class="num">'+money(u.amount)+'</td>'+
          '<td>'+(u.recoverable?'<span class="chip gold">Tenant</span>':'<span class="chip navy">Company</span>')+'</td>'+
          '<td><span class="chip '+(paidU?'green':'red')+'">'+esc(u.status)+'</span></td>'+
          '<td class="right" style="white-space:nowrap">'+(!paidU?'<button class="btn sm green" data-util-paid="'+esc(u.id)+'" title="Mark paid">'+icon('check')+'</button> ':'')+
          '<button class="btn sm ghost" data-util-edit="'+esc(u.id)+'">'+icon('edit')+'</button></td></tr>';
      }).join('')+'</tbody></table></div>';
    html+='</div>';
  }

  /* ---------- SUPPLIERS & ACCOUNTS PAYABLE ---------- */
  if(f.tab==='payables'){
    if(!DB.invoices.length && !DB.suppliers.length && !tabReady('Invoices')) return html+setupNotice('Invoices');
    var inv=DB.invoices.slice().sort(function(a,b){ return (parseDate(a.dueDate)||9e15)-(parseDate(b.dueDate)||9e15); });
    var openInv=inv.filter(function(i){ return i.balance>0; });
    var overdueInv=openInv.filter(function(i){ var d=daysUntil(i.dueDate); return d!==null && d<0; });
    var due7=openInv.filter(function(i){ var d=daysUntil(i.dueDate); return d!==null && d>=0 && d<=7; });
    html+='<div class="grid kpis">'+
      kpi({icon:'wallet',tint:'tint-red',val:money(openInv.reduce(function(s,i){return s+i.balance;},0)),lbl:'Total payable ('+openInv.length+')'})+
      kpi({icon:'alert',tint:'tint-red',val:money(overdueInv.reduce(function(s,i){return s+i.balance;},0)),lbl:'Overdue ('+overdueInv.length+')'})+
      kpi({icon:'clock',tint:'tint-gold',val:money(due7.reduce(function(s,i){return s+i.balance;},0)),lbl:'Due within 7 days'})+
      kpi({icon:'users',tint:'tint-navy',val:DB.suppliers.length,lbl:'Suppliers'})+
    '</div>';
    // supplier balances
    var bySup={};
    inv.forEach(function(i){ var k=i.supplier||'(unknown)'; if(!bySup[k]) bySup[k]={name:k,total:0,balance:0,n:0};
      bySup[k].total+=i.total; bySup[k].balance+=i.balance; bySup[k].n++; });
    var supRows=Object.keys(bySup).map(function(k){return bySup[k];}).sort(function(a,b){return b.balance-a.balance;});
    html+='<div class="grid cols-2 mt">'+
      '<div class="card pad"><div class="card-h"><h3>Supplier Balances</h3><div class="right"><button class="btn sm" data-add-supplier>'+icon('plus')+'Supplier</button></div></div>'+
      (supRows.length? '<div class="table-wrap" style="border:none"><table><thead><tr><th>Supplier</th><th class="num">Invoices</th><th class="num">Billed</th><th class="num">Outstanding</th></tr></thead><tbody>'+
        supRows.map(function(s2){ return '<tr><td><b>'+esc(s2.name)+'</b></td><td class="num">'+s2.n+'</td>'+
        '<td class="num">'+money(s2.total)+'</td><td class="num '+(s2.balance>0?'neg':'pos')+'"><b>'+money(s2.balance)+'</b></td></tr>'; }).join('')+
        '</tbody></table></div>' : emptyState('No supplier invoices yet'))+'</div>'+
      '<div class="card pad"><div class="card-h"><h3>Suppliers</h3></div>'+
      (DB.suppliers.length? DB.suppliers.map(function(s3){
        return '<div class="lrow"><div class="av tint-navy">'+esc((s3.name||'?')[0].toUpperCase())+'</div>'+
        '<div class="gr"><b>'+esc(s3.name)+'</b><span>'+esc(s3.category||'—')+(s3.contact?' · '+esc(s3.contact):'')+'</span></div></div>';
      }).join('') : emptyState('No suppliers','Add the companies you buy from'))+'</div>'+
    '</div>';
    html+='<div class="card pad mt"><div class="card-h"><h3>Supplier Invoices</h3><span class="sub">'+inv.length+' invoices</span>'+
      '<div class="right"><button class="btn sm primary" data-add-invoice>'+icon('plus')+'Add invoice</button></div></div>';
    if(!inv.length) html+=emptyState('No invoices recorded','Add supplier bills to track what you owe');
    else html+='<div class="table-wrap" style="border:none"><table><thead><tr><th>Due</th><th>Supplier</th><th>Invoice #</th><th>Unit</th><th>Category</th><th class="num">Total</th><th class="num">Paid</th><th class="num">Balance</th><th>Status</th><th></th></tr></thead><tbody>'+
      inv.map(function(i){ var dl=daysUntil(i.dueDate); var od=i.balance>0 && dl!==null && dl<0;
        return '<tr'+(od?' style="background:#fdf1f0"':'')+'><td>'+fmtDate(i.dueDate)+
          (od?'<div><span class="chip red">'+Math.abs(dl)+'d overdue</span></div>':'')+'</td>'+
          '<td><b>'+esc(i.supplier||'—')+'</b></td><td>'+esc(i.invoiceNo||'—')+'</td>'+
          '<td><span class="u-code">'+esc(i.unit||'—')+'</span></td><td>'+esc(i.category||'—')+'</td>'+
          '<td class="num">'+money(i.total)+'</td><td class="num pos">'+money(i.paid)+'</td>'+
          '<td class="num '+(i.balance>0?'neg':'pos')+'"><b>'+money(i.balance)+'</b></td>'+
          '<td><span class="chip '+(i.balance<=0?'green':i.paid>0?'gold':'red')+'">'+esc(i.status)+'</span></td>'+
          '<td class="right" style="white-space:nowrap">'+(i.balance>0?'<button class="btn sm green" data-inv-pay="'+esc(i.id)+'" title="Record payment">'+icon('cash')+'</button> ':'')+
          '<button class="btn sm ghost" data-inv-edit="'+esc(i.id)+'">'+icon('edit')+'</button></td></tr>';
      }).join('')+'</tbody></table></div>';
    html+='</div>';
  }

  if(f.tab==='calendar'){
    var up=upcomingDue(30);
    html+='<div class="card pad"><div class="card-h"><h3>Rent Due Calendar</h3><span class="sub">next 30 days · '+money(up.reduce(function(s,x){return s+x.amount;},0))+' expected</span></div>';
    if(!up.length) html+=emptyState('Nothing falls due in the next 30 days');
    else html+='<div class="table-wrap" style="border:none"><table><thead><tr><th>Due date</th><th>In</th><th>Tenant</th><th>Unit</th><th class="num">Amount</th><th>Period</th><th></th></tr></thead><tbody>'+
      up.map(function(x){ var tc=phoneLinks(x.p.tenantContact);
        return '<tr><td><b>'+x.due.getDate()+' '+MONTHS[x.due.getMonth()+1]+'</b></td>'+
        '<td><span class="chip '+(x.inDays<=3?'gold':'grey')+'">'+(x.inDays===0?'today':x.inDays+'d')+'</span></td>'+
        '<td>'+esc(x.p.tenantName)+'</td><td><span class="u-code">'+esc(x.p.unit)+'</span></td>'+
        '<td class="num">'+money(x.amount)+'</td><td>'+MONTHS[x.m]+' '+x.y+'</td>'+
        '<td class="right">'+(tc?'<button class="btn sm" data-remind-arrear="'+esc(x.p.unit)+'::'+x.m+'::'+x.y+'" title="WhatsApp">'+icon('whatsapp')+'</button> ':'')+
        '<button class="btn sm green" data-pay-unit="'+esc(x.p.unit)+'">'+icon('cash')+'</button></td></tr>'; }).join('')+
      '</tbody></table></div>';
    html+='</div>';
  }

  if(f.tab==='statements'){
    html+='<div class="card pad"><div class="card-h"><h3>Tenant Statements of Account</h3><span class="sub">rent charged vs received</span></div>'+
      '<div class="table-wrap" style="border:none"><table><thead><tr><th>Tenant</th><th>Unit</th><th class="num">Charged</th><th class="num">Received</th><th class="num">Balance</th><th class="num">Deposit</th><th></th></tr></thead><tbody>'+
      DB.properties.filter(isOccupied).map(function(p){ var L=tenantLedger(p,12), d=depositOf(p);
        return '<tr'+(L.balance>0?' style="background:#fdf1f0"':'')+'><td><b style="color:var(--ink)">'+esc(p.tenantName)+'</b></td>'+
        '<td><span class="u-code">'+esc(p.unit)+'</span></td>'+
        '<td class="num">'+money(L.charged)+'</td><td class="num pos">'+money(L.paid)+'</td>'+
        '<td class="num '+(L.balance>0?'neg':'pos')+'"><b>'+money(L.balance)+'</b></td>'+
        '<td class="num">'+money(d.amount)+'</td>'+
        '<td class="right"><button class="btn sm" data-statement="'+esc(p.id)+'">Open</button></td></tr>'; }).join('')+
      '</tbody></table></div></div>';
  }
  return html;
}

/* These registers live in sheet tabs that may not exist yet. */
function tabReady(name){ return !!(DB.meta && DB.meta.tabsReady && DB.meta.tabsReady.indexOf(name)>=0); }
function setupNotice(tab){
  return '<div class="card pad" style="background:#fffaf0;border-color:#f0d9a8">'+
    '<div class="card-h">'+icon('alert','')+'<h3 style="color:#8a5b12">One-time setup needed</h3></div>'+
    '<p style="font-size:13px;margin-top:0">This register is stored in a <b>'+esc(tab)+'</b> tab in your Google Sheet, which doesn’t exist yet.</p>'+
    '<ol style="font-size:13px;color:var(--ink-2);padding-left:18px;line-height:1.8;margin:0 0 14px">'+
      '<li>Open your Google Sheet → <b>Extensions → Apps Script</b></li>'+
      '<li>Make sure the latest <code>Code.gs</code> is pasted in, then <b>Save</b></li>'+
      '<li>Pick the function <b>setupAccountingTabs</b> from the dropdown and click <b>Run</b></li>'+
      '<li>Come back here and press <b>Sync</b></li>'+
    '</ol>'+
    '<p class="text-muted" style="font-size:12px;margin-bottom:0">It creates the <b>Cheques</b>, <b>Utilities</b>, <b>Suppliers</b> and <b>Invoices</b> tabs with the right columns. Your existing data is untouched.</p>'+
    '<button class="btn primary mt-s" data-sync-now>'+icon('refresh')+'I\'ve done it — Sync now</button></div>';
}

/* ---------- Cheque register ---------- */
function chequeFields(c){ c=c||{};
  var units=DB.properties.map(function(p){return p.unit;});
  return [
    {name:'tenant',label:'Tenant',value:c.tenant,required:true},
    {name:'unit',label:'Unit',type:'select',value:c.unit||units[0],options:units},
    {name:'chequeNo',label:'Cheque number',value:c.chequeNo},
    {name:'bank',label:'Bank',value:c.bank},
    {name:'chequeDate',label:'Cheque date',type:'date',value:toDateInput(c.chequeDate),required:true},
    {name:'amount',label:'Amount (AED)',type:'number',value:c.amount,required:true},
    {name:'purpose',label:'Purpose',type:'select',value:c.purpose||'Rent',options:['Rent','Security','Other']},
    {name:'status',label:'Status',type:'select',value:c.status||'Pending',options:['Pending','Deposited','Cleared','Bounced','Returned']},
    {name:'notes',label:'Notes',type:'textarea',value:c.notes,full:true}
  ];
}
function chequeRow(c, forAppend){
  var row={ TenantName:c.tenant, Unit:c.unit, ChequeNo:c.chequeNo, Bank:c.bank,
    ChequeDate:toSheetDate(c.chequeDate), Amount:c.amount, Purpose:c.purpose,
    Status:c.status, DepositedDate:toSheetDate(c.depositedDate), Notes:c.notes };
  if(!forAppend) row.ID=String(c.id).replace(/^cq/,'');
  return row;
}
function addCheque(){ formModal('Add Post-Dated Cheque', chequeFields(), function(d){
  var c={id:uid('cq'),tenant:d.tenant,unit:d.unit,chequeNo:d.chequeNo,bank:d.bank,chequeDate:d.chequeDate,
    amount:+d.amount||0,purpose:d.purpose,status:d.status,depositedDate:'',notes:d.notes};
  DB.cheques.push(c); save(); closeModal(); toast('Cheque added','ok'); renderView();
  syncWrite([{action:'append', sheet:'Cheques', idCol:'ID', row:chequeRow(c,true)}], {appended:{obj:c, prefix:'cq'}});
}, {lg:true, submitText:'Add cheque'}); }
function editCheque(c){ formModal('Edit cheque · '+(c.chequeNo||c.tenant), chequeFields(c), function(d){
  Object.assign(c,{tenant:d.tenant,unit:d.unit,chequeNo:d.chequeNo,bank:d.bank,chequeDate:d.chequeDate,
    amount:+d.amount||0,purpose:d.purpose,status:d.status,notes:d.notes});
  save(); closeModal(); toast('Saved','ok'); renderView();
  var k=numKey(c.id,'cq'); if(k) syncWrite([{action:'upsert', sheet:'Cheques', keyCol:'ID', key:k, row:chequeRow(c)}]);
}, {lg:true}); }
function setChequeStatus(c, status){
  c.status=status; if(status==='Cleared'||status==='Deposited') c.depositedDate=todayISO();
  save(); toast('Cheque marked '+status.toLowerCase(), status==='Bounced'?'err':'ok'); renderView();
  var k=numKey(c.id,'cq');
  if(k) syncWrite([{action:'upsert', sheet:'Cheques', keyCol:'ID', key:k,
    row:{Status:c.status, DepositedDate:toSheetDate(c.depositedDate)}}]);
  if(status==='Bounced'){
    confirmDialog('Cheque bounced — add '+money(c.amount)+' to '+c.tenant+' as money they owe you?', function(){
      var d={id:uid('d'),person:c.tenant,type:'Receivable',amount:c.amount,paid:0,balance:c.amount,
        date:todayISO(),dueDate:todayISO(),reason:'Bounced cheque '+(c.chequeNo||'')+' ('+c.unit+')',
        status:'Active',lastPayment:'',history:''};
      DB.debts.push(d); save(); toast('Added to Debts & Dues','ok'); renderView();
      syncWrite([{action:'append', sheet:'DebtTracker', idCol:'ID', row:debtRow(d,true)}], {appended:{obj:d, prefix:'d'}});
    }, true);
  }
}

/* ---------- Utilities ---------- */
function utilFields(u){ u=u||{};
  var units=DB.properties.map(function(p){return p.unit;});
  return [
    {name:'unit',label:'Unit',type:'select',value:u.unit||units[0],options:units},
    {name:'type',label:'Utility',type:'select',value:u.type||'Electricity',options:['Electricity','Water','Internet','Gas','Cooling','Waste','Other']},
    {name:'provider',label:'Provider',value:u.provider,placeholder:'e.g. ADDC, Etisalat'},
    {name:'amount',label:'Amount (AED)',type:'number',value:u.amount,required:true},
    {name:'billDate',label:'Bill date',type:'date',value:toDateInput(u.billDate)||todayISO(),required:true},
    {name:'month',label:'Period month',type:'select',value:u.month||curMonth(),options:MONTHS.slice(1).map(function(mn,i){return {value:i+1,label:mn};})},
    {name:'year',label:'Period year',type:'number',value:u.year||curYear()},
    {name:'status',label:'Status',type:'select',value:u.status||'Unpaid',options:['Unpaid','Paid']},
    {name:'recoverable',label:'Charged back to tenant?',type:'select',value:u.recoverable?'Yes':'No',options:['No','Yes']},
    {name:'notes',label:'Notes',type:'textarea',value:u.notes,full:true}
  ];
}
function utilRow(u, forAppend){
  var row={ Unit:u.unit, Type:u.type, Provider:u.provider, BillDate:toSheetDate(u.billDate),
    Month:u.month, Year:u.year, Amount:u.amount, PaidBy:(u.recoverable?'Tenant':'Company'),
    Status:u.status, Recoverable:(u.recoverable?'Yes':'No'), RecoveredAmount:u.recovered||0, Notes:u.notes };
  if(!forAppend) row.ID=String(u.id).replace(/^ut/,'');
  return row;
}
function addUtility(){ formModal('Add Utility Bill', utilFields(), function(d){
  var u={id:uid('ut'),unit:d.unit,type:d.type,provider:d.provider,amount:+d.amount||0,billDate:d.billDate,
    month:+d.month,year:+d.year,status:d.status,recoverable:d.recoverable==='Yes',recovered:0,
    paidBy:d.recoverable==='Yes'?'Tenant':'Company',notes:d.notes};
  DB.utilities.push(u); save(); closeModal(); toast('Bill added','ok'); renderView();
  syncWrite([{action:'append', sheet:'Utilities', idCol:'ID', row:utilRow(u,true)}], {appended:{obj:u, prefix:'ut'}});
}, {lg:true, submitText:'Add bill'}); }
function editUtility(u){ formModal('Edit bill · '+u.unit+' '+u.type, utilFields(u), function(d){
  Object.assign(u,{unit:d.unit,type:d.type,provider:d.provider,amount:+d.amount||0,billDate:d.billDate,
    month:+d.month,year:+d.year,status:d.status,recoverable:d.recoverable==='Yes',notes:d.notes});
  save(); closeModal(); toast('Saved','ok'); renderView();
  var k=numKey(u.id,'ut'); if(k) syncWrite([{action:'upsert', sheet:'Utilities', keyCol:'ID', key:k, row:utilRow(u)}]);
}, {lg:true}); }

/* ---------- Suppliers & invoices ---------- */
function addSupplier(){ formModal('Add Supplier', [
  {name:'name',label:'Supplier name',required:true,full:true},
  {name:'category',label:'Category',value:'',placeholder:'Maintenance, Furniture, Cleaning…'},
  {name:'contact',label:'Contact'},
  {name:'trn',label:'TRN (tax number)',full:true}
], function(d){
  var s2={id:uid('sp'),name:d.name,category:d.category,contact:d.contact,trn:d.trn,notes:''};
  DB.suppliers.push(s2); save(); closeModal(); toast('Supplier added','ok'); renderView();
  syncWrite([{action:'append', sheet:'Suppliers', idCol:'ID', row:{Name:s2.name,Category:s2.category,Contact:s2.contact,TRN:s2.trn}}], {appended:{obj:s2, prefix:'sp'}});
}); }
function invoiceFields(i){ i=i||{};
  var sups=DB.suppliers.map(function(s2){return s2.name;});
  var units=[''].concat(DB.properties.map(function(p){return p.unit;}));
  return [
    {name:'supplier',label:'Supplier',type:(sups.length?'select':'text'),value:i.supplier||sups[0],options:sups,required:true},
    {name:'invoiceNo',label:'Invoice number',value:i.invoiceNo},
    {name:'invoiceDate',label:'Invoice date',type:'date',value:toDateInput(i.invoiceDate)||todayISO(),required:true},
    {name:'dueDate',label:'Due date',type:'date',value:toDateInput(i.dueDate)},
    {name:'unit',label:'Unit (if for one studio)',type:'select',value:i.unit||'',options:units},
    {name:'category',label:'Category',value:i.category,placeholder:'Maintenance, Furniture…'},
    {name:'amount',label:'Amount before VAT',type:'number',value:i.amount,required:true},
    {name:'vat',label:'VAT',type:'number',value:i.vat||0},
    {name:'paid',label:'Already paid',type:'number',value:i.paid||0},
    {name:'notes',label:'Notes',type:'textarea',value:i.notes,full:true}
  ];
}
function invoiceRow(i, forAppend){
  var row={ SupplierName:i.supplier, InvoiceNo:i.invoiceNo, InvoiceDate:toSheetDate(i.invoiceDate),
    DueDate:toSheetDate(i.dueDate), Unit:i.unit, Category:i.category, Amount:i.amount, VAT:i.vat,
    Total:i.total, PaidAmount:i.paid, Balance:i.balance, Status:i.status, Notes:i.notes };
  if(!forAppend) row.ID=String(i.id).replace(/^inv/,'');
  return row;
}
function recalcInvoice(i){
  i.total=(Number(i.amount)||0)+(Number(i.vat)||0);
  i.balance=Math.max(i.total-(Number(i.paid)||0),0);
  i.status = i.balance<=0?'Paid' : (i.paid>0?'Partial':'Unpaid');
  return i;
}
function addInvoice(){ formModal('Add Supplier Invoice', invoiceFields(), function(d){
  var i=recalcInvoice({id:uid('inv'),supplier:d.supplier,invoiceNo:d.invoiceNo,invoiceDate:d.invoiceDate,
    dueDate:d.dueDate,unit:d.unit,category:d.category,amount:+d.amount||0,vat:+d.vat||0,paid:+d.paid||0,notes:d.notes});
  DB.invoices.push(i); save(); closeModal(); toast('Invoice added','ok'); renderView();
  syncWrite([{action:'append', sheet:'Invoices', idCol:'ID', row:invoiceRow(i,true)}], {appended:{obj:i, prefix:'inv'}});
}, {lg:true, submitText:'Add invoice'}); }
function editInvoice(i){ formModal('Edit invoice '+(i.invoiceNo||''), invoiceFields(i), function(d){
  Object.assign(i,{supplier:d.supplier,invoiceNo:d.invoiceNo,invoiceDate:d.invoiceDate,dueDate:d.dueDate,
    unit:d.unit,category:d.category,amount:+d.amount||0,vat:+d.vat||0,paid:+d.paid||0,notes:d.notes});
  recalcInvoice(i); save(); closeModal(); toast('Saved','ok'); renderView();
  var k=numKey(i.id,'inv'); if(k) syncWrite([{action:'upsert', sheet:'Invoices', keyCol:'ID', key:k, row:invoiceRow(i)}]);
}, {lg:true}); }
function payInvoice(i){ formModal('Pay '+(i.supplier||'invoice'), [
  {name:'amount',label:'Payment amount (AED)',type:'number',value:i.balance,required:true,full:true},
  {name:'date',label:'Payment date',type:'date',value:todayISO(),full:true}
], function(d){
  i.paid=(Number(i.paid)||0)+(+d.amount||0); recalcInvoice(i);
  save(); closeModal(); toast('Payment recorded','ok'); renderView();
  var k=numKey(i.id,'inv');
  if(k) syncWrite([{action:'upsert', sheet:'Invoices', keyCol:'ID', key:k,
    row:{PaidAmount:i.paid, Balance:i.balance, Status:i.status}}]);
}, {submitText:'Record payment'}); }

/* Printable statement of account for one tenant */
function openStatement(pid){
  var p=DB.properties.filter(function(x){return x.id===pid;})[0]; if(!p) return;
  var L=tenantLedger(p,12), d=depositOf(p), st=contractStatus(p);
  var body='<div class="detail-grid" style="margin-bottom:14px">'+
    '<div class="ditem"><div class="k">Tenant</div><div class="v">'+esc(p.tenantName)+'</div></div>'+
    '<div class="ditem"><div class="k">Unit</div><div class="v">'+esc(p.unit)+'</div></div>'+
    '<div class="ditem"><div class="k">Monthly Rent</div><div class="v">'+money(p.tenantRent)+'</div></div>'+
    '<div class="ditem"><div class="k">Deposit Held</div><div class="v">'+money(d.amount)+' <span class="chip grey">'+esc(d.method)+'</span></div></div>'+
    '<div class="ditem"><div class="k">Contract</div><div class="v">'+fmtDate(p.contractFrom)+' → '+fmtDate(p.contractTo)+' '+statusChip(st)+'</div></div>'+
    '<div class="ditem"><div class="k">Rent due each month</div><div class="v">Day '+rentDueDay(p)+'</div></div></div>';
  body+='<div class="table-wrap"><table><thead><tr><th>Period</th><th>Due</th><th class="num">Charged</th><th class="num">Received</th><th class="num">Balance</th><th></th></tr></thead><tbody>'+
    L.rows.map(function(r){
      return '<tr'+(r.balance>0?' style="background:#fdf1f0"':'')+'><td><b>'+MONTHS[r.m]+' '+r.y+'</b></td>'+
      '<td>'+r.due.getDate()+' '+MONTHS[r.m]+'</td><td class="num">'+money(r.rent)+'</td>'+
      '<td class="num pos">'+(r.paid?money(r.paid):'—')+'</td>'+
      '<td class="num '+(r.balance>0?'neg':'')+'">'+(r.balance>0?money(r.balance):'0')+'</td>'+
      '<td class="right">'+(r.recs.length?'<button class="btn sm ghost" data-receipt="'+esc(r.recs[0].id)+'">Receipt</button>':'')+'</td></tr>';
    }).join('')+
    '<tr style="background:var(--navy-50)"><td colspan="2"><b>TOTAL</b></td><td class="num"><b>'+money(L.charged)+'</b></td>'+
    '<td class="num pos"><b>'+money(L.paid)+'</b></td><td class="num '+(L.balance>0?'neg':'pos')+'"><b>'+money(L.balance)+'</b></td><td></td></tr>'+
    '</tbody></table></div>';
  if(L.balance>0) body+='<div class="chip red mt">'+icon('alert')+' Outstanding balance '+money(L.balance)+'</div>';
  openModal('Statement of Account · '+p.tenantName, body,
    '<button class="btn" data-st-print>'+icon('doc')+'Print</button><button class="btn primary" data-st-close>Close</button>',
    {lg:true, onOpen:function(ov){
      ov.querySelector('[data-st-close]').onclick=closeModal;
      ov.querySelector('[data-st-print]').onclick=function(){ window.print(); };
      $$('[data-receipt]',ov).forEach(function(b){ b.onclick=function(){ openReceipt(b.getAttribute('data-receipt')); }; });
    }});
}

/* Printable rent receipt */
function openReceipt(rid){
  var r=DB.rentRecords.filter(function(x){return x.id===rid;})[0]; if(!r){ toast('Payment not found','err'); return; }
  var p=getProp(r.unit);
  var no='RCPT-'+String(r.id).replace(/\D/g,'')+'-'+r.year;
  var logo='<svg width="54" height="54" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="120" rx="27" fill="#16305B"/><path d="M28 52 L60 26 L92 52 L81 52 L60 35 L39 52 Z" fill="#E23B2E"/><text x="60" y="84" font-family="Arial" font-size="44" font-weight="800" fill="#fff" text-anchor="middle">SA</text></svg>';
  var doc='<!DOCTYPE html><html><head><meta charset="utf-8"><title>Receipt '+no+'</title><style>'+
    'body{font-family:Segoe UI,Arial,sans-serif;color:#16233b;padding:26px;max-width:640px;margin:0 auto}'+
    '.hd{display:flex;align-items:center;gap:14px;border-bottom:3px solid #16305B;padding-bottom:12px}'+
    '.hd h1{margin:0;font-size:17px;color:#16305B}.hd p{margin:2px 0 0;font-size:11.5px;color:#6b7a90}'+
    '.t{margin-left:auto;text-align:right}.t b{font-size:19px;color:#E23B2E;letter-spacing:1px}'+
    'table{width:100%;border-collapse:collapse;margin-top:18px;font-size:13.5px}'+
    'td{padding:8px 0;border-bottom:1px solid #e6ebf3}td:last-child{text-align:right;font-weight:700}'+
    '.amt{background:#eef3fb;padding:14px;border-radius:10px;margin-top:18px;display:flex;justify-content:space-between;align-items:center}'+
    '.amt span{font-size:12px;color:#6b7a90;font-weight:700;text-transform:uppercase}.amt b{font-size:23px;color:#12a670}'+
    '.ft{margin-top:26px;display:flex;justify-content:space-between;font-size:11.5px;color:#6b7a90}'+
    '.sig{border-top:1px solid #9aa7bd;padding-top:5px;width:170px;text-align:center}'+
    '@media print{.noprint{display:none}}</style></head><body>'+
    '<div class="hd">'+logo+'<div><h1>'+esc(DB.meta.company||'SABIR AMIN REAL ESTATE LLC SPC')+'</h1><p>Rent Payment Receipt</p></div>'+
    '<div class="t"><b>'+no+'</b><p style="margin:2px 0 0;font-size:11.5px;color:#6b7a90">'+fmtDate(r.date)+'</p></div></div>'+
    '<table><tr><td>Received from</td><td>'+esc((p&&p.tenantName)||'—')+'</td></tr>'+
    '<tr><td>Unit</td><td>'+esc(r.unit)+'</td></tr>'+
    '<tr><td>Rent period</td><td>'+MONTHS[r.month]+' '+r.year+'</td></tr>'+
    '<tr><td>Payment date</td><td>'+fmtDate(r.date)+'</td></tr>'+
    '<tr><td>Payment method</td><td>'+esc(r.method||'—')+'</td></tr>'+
    (r.maintenance?'<tr><td>Maintenance included</td><td>'+money(r.maintenance)+'</td></tr>':'')+
    '</table>'+
    '<div class="amt"><span>Amount received</span><b>'+money(r.amount)+'</b></div>'+
    '<div class="ft"><div>Thank you for your payment.<br>This receipt is computer generated.</div>'+
    '<div class="sig">Authorised signature</div></div>'+
    '<p class="noprint" style="text-align:center;margin-top:22px"><button onclick="window.print()" style="font:inherit;font-weight:700;background:#16305B;color:#fff;border:none;padding:9px 18px;border-radius:8px;cursor:pointer">🖨️ Print / Save as PDF</button></p>'+
    '</body></html>';
  var ov=document.createElement('div'); ov.className='overlay flyer-ov';
  ov.innerHTML='<div class="flyer-wrap"><div class="flyer-bar"><b>Receipt '+no+'</b>'+
    '<div><button class="btn sm primary" data-r-print>'+icon('doc')+'Print / Save PDF</button>'+
    '<button class="btn sm ghost" data-r-close>Close</button></div></div><iframe class="flyer-frame"></iframe></div>';
  document.body.appendChild(ov); modalStack.push(ov);
  var ifr=ov.querySelector('iframe'); ifr.srcdoc=doc;
  ov.querySelector('[data-r-close]').onclick=closeModal;
  ov.querySelector('[data-r-print]').onclick=function(){ try{ ifr.contentWindow.focus(); ifr.contentWindow.print(); }catch(e){ toast('Use the Print button inside the receipt','err'); } };
  ov.addEventListener('mousedown', function(e){ if(e.target===ov) closeModal(); });
}

/* ============================================================
   PROFIT & LOSS  (the accountant's view)
   ============================================================ */
/* What we actually paid the landlord for a collected payment.
   Derived from the sheet's own Profit column so history stays accurate:
   ownerCost = amount - profit - maintenance   (falls back to the unit's owner rent) */
function recordOwnerCost(r){
  var amt=Number(r.amount)||0, mnt=Number(r.maintenance)||0, pf=Number(r.profit)||0;
  if(r.profit!==undefined && r.profit!==null && r.profit!=='' && pf!==0) return amt-pf-mnt;
  var p=getProp(r.unit); return p?(Number(p.ownerRent)||0):0;
}
function pnlMonths(y){
  var out=[];
  for(var mo=1;mo<=12;mo++){
    var rr=rentFor(mo,y);
    var collected=rr.reduce(function(s,r){return s+(Number(r.amount)||0);},0);
    var ownerCost=rr.reduce(function(s,r){return s+recordOwnerCost(r);},0);
    var maint=rr.reduce(function(s,r){return s+(Number(r.maintenance)||0);},0);
    var tx=DB.transactions.filter(function(t){var d=parseDate(t.date);return d&&d.getFullYear()===y&&(d.getMonth()+1)===mo;});
    var manualExp=tx.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+(Number(t.amount)||0);},0);
    var otherInc=tx.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+(Number(t.amount)||0);},0);
    // utilities the company actually bears (not charged back to a tenant)
    var util=(DB.utilities||[]).filter(function(u){
      if(u.recoverable) return false;
      if(u.month && u.year) return u.month===mo && u.year===y;
      var d=parseDate(u.billDate); return d && d.getFullYear()===y && (d.getMonth()+1)===mo;
    }).reduce(function(s,u){return s+(Number(u.amount)||0);},0);
    // supplier invoices dated in this month
    var sup=(DB.invoices||[]).filter(function(i){
      var d=parseDate(i.invoiceDate); return d && d.getFullYear()===y && (d.getMonth()+1)===mo;
    }).reduce(function(s,i){return s+(Number(i.total)||0);},0);
    var opex=manualExp+util+sup;
    var gross=collected-ownerCost-maint;
    out.push({mo:mo,count:rr.length,collected:collected,ownerCost:ownerCost,maint:maint,gross:gross,
      opex:opex,manualExp:manualExp,util:util,sup:sup,otherInc:otherInc,net:gross+otherInc-opex});
  }
  return out;
}
function pnlTotals(months){
  return months.reduce(function(a,m){
    a.collected+=m.collected; a.ownerCost+=m.ownerCost; a.maint+=m.maint;
    a.gross+=m.gross; a.opex+=m.opex; a.otherInc+=m.otherInc; a.net+=m.net; a.count+=m.count;
    a.util+=(m.util||0); a.sup+=(m.sup||0); a.manualExp+=(m.manualExp||0); return a;
  }, {collected:0,ownerCost:0,maint:0,gross:0,opex:0,otherInc:0,net:0,count:0,util:0,sup:0,manualExp:0});
}
function viewPnl(){
  var f=STATE.filters.pnl||(STATE.filters.pnl={year:curYear()});
  var y=f.year;
  var years=uniq(DB.rentRecords.map(function(r){return r.year;}).filter(Boolean).concat([curYear()])).sort(function(a,b){return b-a;});
  var months=pnlMonths(y), T=pnlTotals(months);
  var margin=T.collected?(T.net/T.collected*100):0;

  // current-month collection performance (accurate snapshot)
  var m=curMonth(), cy=curYear();
  var occ=DB.properties.filter(isOccupied);
  var expNow=occ.reduce(function(s,p){return s+(Number(p.tenantRent)||0);},0);
  var gotNow=rentFor(m,cy).reduce(function(s,r){return s+(Number(r.amount)||0);},0);
  var rate=expNow?Math.round(gotNow/expNow*100):0;
  // portfolio run-rate
  var ownerCommit=DB.properties.reduce(function(s,p){return s+(Number(p.ownerRent)||0);},0);
  var potential=expNow-ownerCommit;
  var vacantCost=DB.properties.filter(function(p){return !isOccupied(p);}).reduce(function(s,p){return s+(Number(p.ownerRent)||0);},0);

  var html='<div class="toolbar">'+
    '<select class="mini" data-pnl="year">'+years.map(function(yr){return '<option'+(y===yr?' selected':'')+'>'+yr+'</option>';}).join('')+'</select>'+
    '<div class="grow"></div>'+
    '<button class="btn" data-pnl-csv>'+icon('download')+'Export P&L</button>'+
    '<button class="btn" data-print>'+icon('doc')+'Print</button></div>';

  // headline
  html+='<div class="grid kpis">'+
    kpi({icon:'cash',tint:'tint-green',val:money(T.collected),lbl:'Rent Received · '+y})+
    kpi({icon:'home',tint:'tint-red',val:money(T.ownerCost),lbl:'Paid to Owners · '+y})+
    kpi({icon:'trend',tint:'tint-gold',val:money(T.gross),lbl:'Gross Profit'})+
    kpi({icon:'wallet',tint:(T.net>=0?'tint-blue':'tint-red'),val:money(T.net),lbl:'Net Profit · '+margin.toFixed(1)+'% margin'})+
  '</div>';

  // P&L statement card
  function line(label, val, opts){ opts=opts||{};
    return '<div style="display:flex;justify-content:space-between;padding:'+(opts.big?'11px':'8px')+' 0;'+(opts.top?'border-top:2px solid var(--line);':'border-bottom:1px solid var(--line);')+'">'+
      '<span style="font-weight:'+(opts.big?'800':'600')+';color:'+(opts.big?'var(--navy)':'var(--ink-2)')+';font-size:'+(opts.big?'14.5px':'13.5px')+'">'+label+'</span>'+
      '<span class="num '+(opts.neg?'neg':(opts.pos?'pos':''))+'" style="font-size:'+(opts.big?'15px':'13.5px')+'">'+(opts.neg?'− ':'')+money(Math.abs(val))+'</span></div>';
  }
  html+='<div class="grid cols-2 mt">';
  html+='<div class="card pad"><div class="card-h"><h3>Profit &amp; Loss Statement</h3><span class="sub">'+y+' · '+T.count+' payments</span></div>'+
    line('Rent received from tenants', T.collected, {pos:true})+
    (T.otherInc?line('Other income', T.otherInc, {pos:true}):'')+
    line('Rent paid to owners', T.ownerCost, {neg:true})+
    line('Maintenance', T.maint, {neg:true})+
    line('Gross profit', T.gross, {big:true, top:true})+
    (T.util?line('Utilities (company-borne)', T.util, {neg:true}):'')+
    (T.sup?line('Supplier invoices', T.sup, {neg:true}):'')+
    (T.manualExp?line('Other operating expenses', T.manualExp, {neg:true}):'')+
    ((!T.util&&!T.sup&&!T.manualExp)?line('Operating expenses', 0, {neg:true}):'')+
    line('NET PROFIT', T.net, {big:true, top:true})+
    '<div style="display:flex;justify-content:space-between;padding-top:10px"><span class="text-muted" style="font-size:12.5px">Net margin on rent collected</span>'+
    '<span class="chip '+(margin>=0?'green':'red')+'">'+margin.toFixed(1)+'%</span></div></div>';

  // run-rate + collection
  html+='<div class="card pad"><div class="card-h"><h3>Monthly Run-Rate</h3><span class="sub">current portfolio</span></div>'+
    line('Rent expected from tenants', expNow, {pos:true})+
    line('Rent owed to owners (all '+DB.properties.length+' units)', ownerCommit, {neg:true})+
    line('Potential monthly profit', potential, {big:true, top:true})+
    (vacantCost?'<div class="chip red mt-s">'+icon('alert')+' Vacant units cost you '+money(vacantCost)+'/month</div>':'')+
    '<div class="card-h mt" style="margin-bottom:8px"><h3 style="font-size:13.5px">Collection · '+MONTHS[m]+' '+cy+'</h3></div>'+
    '<div class="bar"><i style="width:'+Math.min(rate,100)+'%;background:'+(rate>=90?'var(--green)':rate>=60?'var(--gold)':'var(--red)')+'"></i></div>'+
    '<div style="display:flex;justify-content:space-between;margin-top:6px;font-size:12.5px"><span class="text-muted">'+money(gotNow)+' of '+money(expNow)+'</span><b>'+rate+'% collected</b></div>'+
    (expNow-gotNow>0?'<div class="chip gold mt-s">'+money(expNow-gotNow)+' still to collect this month</div>':'')+
  '</div></div>';

  // monthly breakdown
  html+='<div class="card pad mt"><div class="card-h"><h3>Month-by-Month · '+y+'</h3></div>'+
    '<div class="table-wrap" style="border:none"><table><thead><tr><th>Month</th><th class="num">Payments</th><th class="num">Received</th><th class="num">To Owners</th><th class="num">Maint.</th><th class="num">Gross</th><th class="num">Expenses</th><th class="num">Net Profit</th><th class="num">Margin</th></tr></thead><tbody>'+
    months.map(function(x){ if(!x.collected && !x.opex && !x.otherInc) return '';
      var mg=x.collected?(x.net/x.collected*100):0;
      return '<tr><td><b>'+MONTHS[x.mo]+'</b></td><td class="num">'+x.count+'</td>'+
      '<td class="num pos">'+money(x.collected)+'</td><td class="num neg">'+money(x.ownerCost)+'</td>'+
      '<td class="num">'+money(x.maint)+'</td><td class="num">'+money(x.gross)+'</td>'+
      '<td class="num neg">'+money(x.opex)+'</td>'+
      '<td class="num '+(x.net<0?'neg':'pos')+'"><b>'+money(x.net)+'</b></td>'+
      '<td class="num">'+mg.toFixed(0)+'%</td></tr>';
    }).join('')+
    '<tr style="background:var(--navy-50)"><td><b>TOTAL</b></td><td class="num"><b>'+T.count+'</b></td>'+
    '<td class="num pos"><b>'+money(T.collected)+'</b></td><td class="num neg"><b>'+money(T.ownerCost)+'</b></td>'+
    '<td class="num"><b>'+money(T.maint)+'</b></td><td class="num"><b>'+money(T.gross)+'</b></td>'+
    '<td class="num neg"><b>'+money(T.opex)+'</b></td><td class="num '+(T.net<0?'neg':'pos')+'"><b>'+money(T.net)+'</b></td>'+
    '<td class="num"><b>'+margin.toFixed(0)+'%</b></td></tr>'+
    '</tbody></table></div></div>';

  html+='<div class="card pad mt"><div class="card-h"><h3>Net Profit by Month</h3><span class="sub">'+y+'</span></div>'+
    barChart(months.map(function(x){return {label:MONTHS[x.mo], value:x.net, color:(x.net<0?'#e23b2e':'#12a670')};}),{height:230,showVals:true})+'</div>';

  // per-studio profitability
  var byUnit={};
  DB.rentRecords.filter(function(r){return r.year===y;}).forEach(function(r){
    var k=String(r.unit).trim(); if(!k) return;
    if(!byUnit[k]) byUnit[k]={unit:k,collected:0,ownerCost:0,maint:0,profit:0,months:0};
    var b=byUnit[k]; b.collected+=Number(r.amount)||0; b.ownerCost+=recordOwnerCost(r);
    b.maint+=Number(r.maintenance)||0; b.profit+=recordProfit(r); b.months++;
  });
  var unitRows=Object.keys(byUnit).map(function(k){return byUnit[k];}).sort(function(a,b){return b.profit-a.profit;});
  var losers=unitRows.filter(function(u){return u.profit<0;});
  html+='<div class="card pad mt"><div class="card-h"><h3>Profit by Studio · '+y+'</h3><span class="sub">'+unitRows.length+' units with income</span></div>'+
    (losers.length?'<div class="chip red" style="margin-bottom:10px">'+icon('alert')+' '+losers.length+' unit'+(losers.length>1?'s are':' is')+' losing money</div>':'')+
    '<div class="table-wrap" style="border:none"><table><thead><tr><th>Unit</th><th>Tenant</th><th class="num">Months</th><th class="num">Received</th><th class="num">To Owner</th><th class="num">Profit</th><th class="num">Margin</th></tr></thead><tbody>'+
    unitRows.map(function(u){ var p=getProp(u.unit); var mg=u.collected?(u.profit/u.collected*100):0;
      return '<tr'+(u.profit<0?' style="background:#fdf1f0"':'')+'><td><span class="u-code">'+esc(u.unit)+'</span></td>'+
        '<td>'+esc((p&&p.tenantName)||'—')+'</td><td class="num">'+u.months+'</td>'+
        '<td class="num pos">'+money(u.collected)+'</td><td class="num neg">'+money(u.ownerCost)+'</td>'+
        '<td class="num '+(u.profit<0?'neg':'pos')+'"><b>'+money(u.profit)+'</b></td>'+
        '<td class="num">'+mg.toFixed(0)+'%</td></tr>';
    }).join('')+'</tbody></table></div></div>';

  // per-owner
  var byOwner={};
  unitRows.forEach(function(u){ var p=getProp(u.unit); var o=(p&&p.ownerName)||'Former / unlisted units';
    if(!byOwner[o]) byOwner[o]={owner:o,units:0,collected:0,ownerCost:0,profit:0};
    var b=byOwner[o]; b.units++; b.collected+=u.collected; b.ownerCost+=u.ownerCost; b.profit+=u.profit; });
  var ownerRows=Object.keys(byOwner).map(function(k){return byOwner[k];}).sort(function(a,b){return b.ownerCost-a.ownerCost;});
  html+='<div class="card pad mt"><div class="card-h"><h3>Landlord Payouts · '+y+'</h3><span class="sub">what you paid each owner</span></div>'+
    '<div class="table-wrap" style="border:none"><table><thead><tr><th>Owner</th><th class="num">Units</th><th class="num">Collected</th><th class="num">Paid to Owner</th><th class="num">Your Profit</th></tr></thead><tbody>'+
    ownerRows.map(function(o){ return '<tr><td><b>'+esc(o.owner)+'</b></td><td class="num">'+o.units+'</td>'+
      '<td class="num pos">'+money(o.collected)+'</td><td class="num neg">'+money(o.ownerCost)+'</td>'+
      '<td class="num '+(o.profit<0?'neg':'pos')+'"><b>'+money(o.profit)+'</b></td></tr>'; }).join('')+
    '</tbody></table></div></div>';
  return html;
}
function exportPnlCSV(){
  var y=(STATE.filters.pnl||{}).year||curYear();
  var months=pnlMonths(y), T=pnlTotals(months);
  var out='SABIR AMIN REAL ESTATE — Profit & Loss '+y+'\nGenerated,'+todayISO()+'\n\n';
  out+=csvRow(['Month','Payments','Rent Received','Paid to Owners','Maintenance','Gross Profit','Operating Expenses','Other Income','Net Profit','Margin %']);
  months.forEach(function(x){ var mg=x.collected?(x.net/x.collected*100):0;
    out+=csvRow([MONTHS[x.mo],x.count,x.collected,x.ownerCost,x.maint,x.gross,x.opex,x.otherInc,x.net,mg.toFixed(1)]); });
  var tm=T.collected?(T.net/T.collected*100):0;
  out+=csvRow(['TOTAL',T.count,T.collected,T.ownerCost,T.maint,T.gross,T.opex,T.otherInc,T.net,tm.toFixed(1)]);
  var byUnit={};
  DB.rentRecords.filter(function(r){return r.year===y;}).forEach(function(r){ var k=String(r.unit).trim(); if(!k)return;
    if(!byUnit[k]) byUnit[k]={collected:0,ownerCost:0,profit:0,months:0};
    byUnit[k].collected+=Number(r.amount)||0; byUnit[k].ownerCost+=recordOwnerCost(r); byUnit[k].profit+=recordProfit(r); byUnit[k].months++; });
  out+='\nPROFIT BY STUDIO\n'+csvRow(['Unit','Tenant','Owner','Months','Received','Paid to Owner','Profit']);
  Object.keys(byUnit).forEach(function(k){ var p=getProp(k); var b=byUnit[k];
    out+=csvRow([k,(p&&p.tenantName)||'',(p&&p.ownerName)||'',b.months,b.collected,b.ownerCost,b.profit]); });
  download('sabir-amin-P&L-'+y+'.csv', out, 'text/csv');
  toast('P&L exported','ok');
}

/* ---------- FINANCE ---------- */
function viewFinance(){
  var f=STATE.filters.fin||(STATE.filters.fin={year:curYear()});
  var y=f.year;
  var years=uniq(DB.rentRecords.map(function(r){return r.year;}).concat(DB.transactions.map(function(t){return parseDate(t.date)?parseDate(t.date).getFullYear():curYear();})).concat([curYear()])).sort(function(a,b){return b-a;});

  // per-month income/expense/profit
  var months=[];
  for(var mo=1;mo<=12;mo++){
    var rr=rentFor(mo,y);
    var rentInc=rr.reduce(function(s,r){return s+(Number(r.amount)||0);},0);
    var rentProfit=rr.reduce(function(s,r){return s+recordProfit(r);},0);
    var tx=DB.transactions.filter(function(t){var d=parseDate(t.date); return d&&d.getFullYear()===y&&(d.getMonth()+1)===mo;});
    var manInc=tx.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+(Number(t.amount)||0);},0);
    var manExp=tx.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+(Number(t.amount)||0);},0);
    months.push({mo:mo,rentInc:rentInc,rentProfit:rentProfit,manInc:manInc,manExp:manExp,net:rentProfit+manInc-manExp});
  }
  var recurMonthly=DB.recurringExpenses.reduce(function(s,e){return s+(e.frequency==='Monthly'?Number(e.amount)||0:0);},0);
  var totIncome=months.reduce(function(s,m){return s+m.rentInc+m.manInc;},0);
  var totRentProfit=months.reduce(function(s,m){return s+m.rentProfit;},0);
  var totManExp=months.reduce(function(s,m){return s+m.manExp;},0);
  var totNet=totRentProfit+months.reduce(function(s,m){return s+m.manInc;},0)-totManExp;

  var html='<div class="toolbar"><select class="mini" data-fin="year">'+years.map(function(yr){return '<option'+(y===yr?' selected':'')+'>'+yr+'</option>';}).join('')+'</select><div class="grow"></div>'+
    '<button class="btn green" data-add-tx="income">'+icon('plus')+'Income</button>'+
    '<button class="btn red" data-add-tx="expense">'+icon('plus')+'Expense</button></div>';

  html+='<div class="grid kpis">'+
    kpi({icon:'cash',tint:'tint-green',val:money(totIncome),lbl:'Total Income · '+y})+
    kpi({icon:'wallet',tint:'tint-red',val:money(totManExp),lbl:'Operating Expenses'})+
    kpi({icon:'trend',tint:(totNet>=0?'tint-blue':'tint-red'),val:money(totNet),lbl:'Net Profit'})+
    kpi({icon:'hand',tint:'tint-gold',val:money(recurMonthly),lbl:'Recurring / month'})+
  '</div>';

  // Income vs Expense chart (grouped as two series via overlay bars)
  html+='<div class="card pad mt"><div class="card-h"><h3>Monthly Performance</h3><span class="sub">Rental profit & net · '+y+'</span></div>'+
    barChart(months.map(function(m){return {label:MONTHS[m.mo],value:m.net,color:(m.net<0?'#e23b2e':'#16305B')};}),{showVals:false,height:230})+
    legend([{label:'Net profit / loss per month',color:'#16305B'}])+'</div>';

  // accounts
  var accs=(DB.accounts.company||[]).map(function(a){return {a:a,type:'Company'};}).concat((DB.accounts.personnel||[]).map(function(a){return {a:a,type:'Personnel'};}));
  html+='<div class="grid cols-2 mt">';
  html+='<div class="card pad"><div class="card-h"><h3>Accounts</h3><div class="right"><button class="btn sm" data-edit-accts>'+icon('edit')+'Adjust</button></div></div>'+
    (accs.length?accs.map(function(x){ return '<div class="lrow"><div class="av tint-navy">'+icon('wallet')+'</div><div class="gr"><b>'+esc(x.a.name)+'</b><span>'+x.type+' account</span></div><span class="amt '+(x.a.balance<0?'neg':'pos')+'">'+money(x.a.balance)+'</span></div>'; }).join('') : emptyState('No accounts'))+'</div>';
  // recurring
  html+='<div class="card pad"><div class="card-h"><h3>Recurring Expenses</h3><div class="right"><button class="btn sm" data-add-recur>'+icon('plus')+'Add</button></div></div>'+
    (DB.recurringExpenses.length?DB.recurringExpenses.map(function(e){ return '<div class="lrow"><div class="av tint-red">'+icon('clock')+'</div><div class="gr"><b>'+esc(e.name)+'</b><span>'+esc(e.frequency)+' · '+esc(e.accountType)+'</span></div><span class="amt neg">'+money(e.amount)+'</span><button class="btn sm ghost" data-del-recur="'+esc(e.id)+'" style="color:var(--red)">'+icon('trash')+'</button></div>'; }).join('') : emptyState('None'))+'</div>';
  html+='</div>';

  // ledger
  var tx=DB.transactions.filter(function(t){var d=parseDate(t.date);return d&&d.getFullYear()===y;}).sort(function(a,b){return (parseDate(b.date)||0)-(parseDate(a.date)||0);});
  html+='<div class="card pad mt"><div class="card-h"><h3>Transactions Ledger</h3><span class="sub">'+tx.length+' entries · '+y+'</span></div>'+
    (tx.length?'<div class="table-wrap" style="border:none"><table><thead><tr><th>Date</th><th>Type</th><th>Category</th><th>Account</th><th>Description</th><th class="num">Amount</th><th></th></tr></thead><tbody>'+
      tx.map(function(t){ return '<tr><td>'+fmtDate(t.date)+'</td><td><span class="chip '+(t.type==='income'?'green':'red')+'">'+t.type+'</span></td><td>'+esc(t.category||'—')+'</td><td>'+esc(t.account||'—')+'</td><td>'+esc(t.description||'—')+'</td>'+
        '<td class="num '+(t.type==='income'?'pos':'neg')+'">'+(t.type==='income'?'+':'-')+money(t.amount)+'</td>'+
        '<td class="right"><button class="btn sm ghost" data-del-tx="'+esc(t.id)+'" style="color:var(--red)">'+icon('trash')+'</button></td></tr>';
      }).join('')+'</tbody></table></div>' : emptyState('No manual transactions','Rent payments are tracked automatically under Rent Payments'))+'</div>';
  return html;
}
function addTransaction(type){
  var accs=(DB.accounts.company||[]).concat(DB.accounts.personnel||[]).map(function(a){return a.name;});
  formModal('Add '+(type==='income'?'Income':'Expense'), [
    {name:'amount',label:'Amount (AED)',type:'number',required:true},
    {name:'date',label:'Date',type:'date',value:todayISO(),required:true},
    {name:'category',label:'Category',value:'',placeholder:type==='income'?'e.g. Commission':'e.g. Maintenance, Salary'},
    {name:'account',label:'Account',type:'select',value:accs[0]||'Sabir',options:accs.length?accs:['Sabir']},
    {name:'description',label:'Description',type:'textarea',value:'',full:true}
  ], function(data){
    var t={id:uid('tx'),type:type,amount:+data.amount||0,date:data.date,category:data.category,account:data.account,description:data.description};
    DB.transactions.push(t);
    adjustAccount(data.account, type==='income'?t.amount:-t.amount);
    save(); closeModal(); toast((type==='income'?'Income':'Expense')+' added','ok'); renderView();
    syncWrite([{action:'append', sheet:'Transactions', idCol:'ID', row:{ AccountName:t.account, AccountType:t.category, TransactionType:t.type, Amount:t.amount, Description:t.description, TransactionDate:toSheetDate(t.date) }}], {appended:{obj:t, prefix:'tx'}});
  }, {submitText:'Add'});
}
function adjustAccount(name, delta){
  var all=(DB.accounts.company||[]).concat(DB.accounts.personnel||[]);
  var a=all.filter(function(x){return x.name===name;})[0];
  if(a) a.balance=(Number(a.balance)||0)+delta;
}

/* ---------- DEBTS ---------- */
function viewDebts(){
  var f=STATE.filters.debt||(STATE.filters.debt={type:'Receivable'});
  var list=DB.debts.filter(function(d){ return f.type==='all'||d.type===f.type; });
  var recv=receivablesOutstanding(), pay=payablesOutstanding();
  var overdue=DB.debts.filter(function(d){var od=daysUntil(d.dueDate);return d.status!=='Paid Off'&&od!==null&&od<0;}).length;

  var html='<div class="grid kpis">'+
    kpi({icon:'hand',tint:'tint-green',val:money(recv),lbl:'Receivable (owed to you)'})+
    kpi({icon:'wallet',tint:'tint-red',val:money(pay),lbl:'Payable (you owe)'})+
    kpi({icon:'trend',tint:'tint-navy',val:money(recv-pay),lbl:'Net Position'})+
    kpi({icon:'alert',tint:'tint-gold',val:overdue,lbl:'Overdue'})+
  '</div>';

  html+='<div class="toolbar mt"><div class="seg" data-seg="dtype">'+segBtns([['Receivable','Receivable'],['Payable','Payable'],['all','All']], f.type)+'</div><div class="grow"></div>'+
    (STATE.user.role!=='accountant'?'':'')+'<button class="btn primary" data-add-debt>'+icon('plus')+'Add Entry</button></div>';

  if(!list.length) return html+emptyState('No entries','Add a receivable or payable to start tracking');
  html+='<div class="table-wrap"><table><thead><tr><th>Person</th><th>Type</th><th>Reason</th><th class="num">Amount</th><th class="num">Balance</th><th>Progress</th><th>Due</th><th></th></tr></thead><tbody>'+
    list.map(function(d){ var od=daysUntil(d.dueDate); var overdue=d.status!=='Paid Off'&&od!==null&&od<0;
      var pct=d.amount>0?Math.min((d.paid/d.amount)*100,100):0;
      return '<tr><td><b style="color:var(--ink)">'+esc(d.person)+'</b></td>'+
        '<td><span class="chip '+(d.type==='Receivable'?'green':'red')+'">'+esc(d.type)+'</span></td>'+
        '<td>'+esc(d.reason||'—')+'</td><td class="num">'+money(d.amount)+'</td>'+
        '<td class="num '+(d.balance>0?'neg':'pos')+'">'+money(d.balance)+'</td>'+
        '<td style="min-width:110px"><div class="bar"><i style="width:'+pct+'%;background:'+(pct>=100?'var(--green)':'var(--gold)')+'"></i></div><span style="font-size:10.5px;color:var(--muted)">'+Math.round(pct)+'% · '+esc(d.status)+'</span></td>'+
        '<td>'+fmtDate(d.dueDate)+(overdue?'<br><span class="chip red">overdue</span>':'')+'</td>'+
        '<td class="right" style="white-space:nowrap">'+(d.balance>0?'<button class="btn sm green" data-debt-pay="'+esc(d.id)+'">'+icon('cash')+'</button> ':'')+
        '<button class="btn sm ghost" data-debt-edit="'+esc(d.id)+'">'+icon('edit')+'</button></td></tr>';
    }).join('')+'</tbody></table></div>';
  return html;
}
function debtFields(d){ d=d||{};
  return [
    {name:'person',label:'Person / Party',value:d.person,required:true},
    {name:'type',label:'Type',type:'select',value:d.type||'Receivable',options:['Receivable','Payable']},
    {name:'amount',label:'Amount (AED)',type:'number',value:d.amount,required:true},
    {name:'paid',label:'Already Paid (AED)',type:'number',value:d.paid||0},
    {name:'date',label:'Date',type:'date',value:toDateInput(d.date)||todayISO()},
    {name:'dueDate',label:'Due Date',type:'date',value:toDateInput(d.dueDate)},
    {name:'reason',label:'Reason',value:d.reason,full:true}
  ];
}
function addDebt(){ formModal('Add Debt Entry', debtFields(), function(data){
  var amt=+data.amount||0, paid=+data.paid||0;
  var d={id:uid('d'),person:data.person,type:data.type,amount:amt,paid:paid,balance:amt-paid,date:data.date,dueDate:data.dueDate,reason:data.reason,
    status:(amt-paid<=0?'Paid Off':paid>0?'Partial':'Active'),lastPayment:paid>0?todayISO():'',history:''};
  DB.debts.push(d); save(); closeModal(); toast('Entry added','ok'); renderView();
  syncWrite([{action:'append', sheet:'DebtTracker', idCol:'ID', row: debtRow(d,true)}], {appended:{obj:d, prefix:'d'}});
}, {submitText:'Add'}); }
function editDebt(d){ formModal('Edit · '+d.person, debtFields(d), function(data){
  d.person=data.person; d.type=data.type; d.amount=+data.amount||0; d.paid=+data.paid||0; d.balance=d.amount-d.paid;
  d.date=data.date; d.dueDate=data.dueDate; d.reason=data.reason;
  d.status=(d.balance<=0?'Paid Off':d.paid>0?'Partial':'Active');
  save(); closeModal(); toast('Saved','ok'); renderView();
  syncWrite([{action:'upsert', sheet:'DebtTracker', keyCol:'ID', key:String(d.id).replace(/^d/,''), row: debtRow(d)}]);
}, {submitText:'Save'}); }
function payDebt(d){ formModal('Record Payment · '+d.person, [
    {name:'amount',label:'Payment Amount (AED)',type:'number',value:d.balance,required:true,full:true},
    {name:'date',label:'Date',type:'date',value:todayISO(),full:true},
    {name:'note',label:'Note',value:'',full:true}
  ], function(data){
    var amt=+data.amount||0; d.paid=(Number(d.paid)||0)+amt; d.balance=Math.max(d.amount-d.paid,0);
    d.status=d.balance<=0?'Paid Off':'Partial'; d.lastPayment=data.date;
    var line=fmtDate(data.date)+': '+(d.type==='Receivable'?'Received ':'Paid ')+num(amt)+' AED'+(data.note?' ('+data.note+')':'')+(d.balance>0?' ('+num(d.balance)+' remaining)':'');
    d.history=(d.history?d.history+' | ':'')+line;
    save(); closeModal(); toast('Payment recorded','ok'); renderView();
    syncWrite([{action:'upsert', sheet:'DebtTracker', keyCol:'ID', key:String(d.id).replace(/^d/,''),
      row:{ PaidAmount:d.paid, Balance:d.balance, Status:d.status, LastPayment:toSheetDate(d.lastPayment), History:d.history }}]);
  }, {submitText:'Record'}); }

/* ---------- DOCUMENTS ---------- */
function viewDocuments(){
  var q=(STATE.search||'').toLowerCase();
  var f=STATE.filters.docs||(STATE.filters.docs={tab:'units'});
  var html='<div class="toolbar"><div class="seg" data-seg="doctab">'+segBtns([['units','Unit Files'],['contacts','Contacts Directory']], f.tab)+'</div></div>';
  html+='<div class="card pad" style="background:var(--navy-50);border-color:#dbe6f7;margin-bottom:16px"><div class="prop-row" style="font-size:12.5px;color:var(--navy)">'+icon('folder')+'<span>Documents (contracts, IDs, cheques) are stored in your Google&nbsp;Drive folders. Open a unit’s folder below, or use the contacts directory for quick calls, WhatsApp and email.</span></div></div>';

  if(f.tab==='units'){
    var list=DB.properties.filter(function(p){ if(!q)return true; return (p.unit+' '+p.ownerName+' '+p.tenantName).toLowerCase().indexOf(q)>=0; });
    html+='<div class="grid prop-grid">'+list.map(function(p){
      return '<div class="card pad"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><div style="width:40px;height:40px;border-radius:11px;background:var(--gold-50);color:#c8801a;display:grid;place-items:center">'+icon('doc')+'</div>'+
        '<div><b style="color:var(--navy)">'+esc(p.unit)+'</b><div class="text-muted" style="font-size:11.5px">'+esc(p.tenantName||'Vacant')+'</div></div></div>'+
        '<div class="prop-row" style="font-size:12px">'+icon('key')+'<span>Security: <b>'+esc(p.security||'—')+'</b></span></div>'+
        '<div class="contact-actions mt-s">'+
          (p.driveLink?'<a class="ca" style="color:var(--gold)" href="'+esc(p.driveLink)+'" target="_blank">'+icon('folder')+'Drive Folder</a>':'<span class="chip grey">No Drive link</span>')+
          (STATE.user.role!=='accountant'?'<button class="btn sm ghost" data-prop="'+esc(p.id)+'">'+icon('edit')+'</button>':'')+
        '</div></div>';
    }).join('')+'</div>';
  } else {
    var contacts=[];
    DB.properties.forEach(function(p){
      if(p.tenantName) contacts.push({name:p.tenantName,role:'Tenant · '+p.unit,phone:p.tenantContact});
      if(p.ownerName) contacts.push({name:p.ownerName,role:'Owner · '+p.unit,phone:p.ownerContact});
    });
    contacts=contacts.filter(function(c){ if(!q)return true; return (c.name+' '+c.role).toLowerCase().indexOf(q)>=0; });
    html+='<div class="table-wrap"><table><thead><tr><th>Name</th><th>Role</th><th>Phone</th><th>Actions</th></tr></thead><tbody>'+
      contacts.map(function(c){ var pl=phoneLinks(c.phone);
        return '<tr><td><b style="color:var(--ink)">'+esc(c.name)+'</b></td><td class="text-muted">'+esc(c.role)+'</td><td>'+(pl?pl.display:'—')+'</td>'+
        '<td><div class="contact-actions" style="margin:0">'+(pl?'<a class="ca call" style="padding:5px 10px" href="'+pl.tel+'">'+icon('phone')+'Call</a><a class="ca wa" style="padding:5px 10px" href="'+pl.wa+'" target="_blank">'+icon('whatsapp')+'</a>':'<span class="text-muted">—</span>')+'</div></td></tr>';
      }).join('')+'</tbody></table></div>';
  }
  return html;
}

/* ---------- TASKS ---------- */
function viewTasks(){
  var open=DB.tasks.filter(function(t){return !t.done;}).sort(function(a,b){return (parseDate(a.dueDate)||9e15)-(parseDate(b.dueDate)||9e15);});
  var done=DB.tasks.filter(function(t){return t.done;});
  function row(t){ var od=daysUntil(t.dueDate); var overdue=!t.done&&od!==null&&od<0;
    return '<div class="lrow"><input type="checkbox" data-task-toggle="'+esc(t.id)+'" '+(t.done?'checked':'')+' style="width:19px;height:19px;accent-color:var(--green);cursor:pointer">'+
      '<div class="gr"><b style="'+(t.done?'text-decoration:line-through;color:var(--muted)':'')+'">'+esc(t.description)+'</b>'+
      '<span>'+(t.dueDate?'Due '+fmtDate(t.dueDate):'No due date')+(overdue?' · <span style="color:var(--red);font-weight:700">overdue</span>':'')+'</span></div>'+
      '<button class="btn sm ghost" data-task-del="'+esc(t.id)+'" style="color:var(--red)">'+icon('trash')+'</button></div>';
  }
  var html='<div class="toolbar"><p class="text-muted" style="margin:0;font-size:12.5px"><b>'+open.length+'</b> open · '+done.length+' done</p><div class="grow"></div><button class="btn primary" data-add-task>'+icon('plus')+'Add Task</button></div>';
  html+='<div class="card pad"><div class="card-h"><h3>Open</h3></div>'+(open.length?open.map(row).join(''):emptyState('All caught up!','No open tasks'))+'</div>';
  if(done.length) html+='<div class="card pad mt"><div class="card-h"><h3>Completed</h3></div>'+done.map(row).join('')+'</div>';
  return html;
}

/* ---------- SETTINGS ---------- */
function viewSettings(){
  var html='';
  // Google Sheet sync (full width, primary)
  html+='<div class="card pad" style="border-color:#cfe0f5;background:linear-gradient(135deg,#f3f7fd,#ffffff)"><div class="card-h">'+icon('sheet','')+'<h3>Google Sheet Sync</h3><span class="chip '+(DB.meta.sheetId?'green':'grey')+'" style="margin-left:6px">'+(DB.meta.sheetId?'Connected':'Not set')+'</span></div>'+
    '<p class="text-muted" style="font-size:12.5px;margin-top:0">The app loads live data from your Google Sheet. Keep managing your data in the Sheet, then <b>Sync</b> to refresh here. Sync <b>replaces</b> the app data with the Sheet.</p>'+
    '<div class="field"><label>Google Sheet link or ID</label><input id="sheetIdInput" value="'+esc(DB.meta.sheetId||'')+'" placeholder="https://docs.google.com/spreadsheets/d/..."></div>'+
    '<label style="display:flex;align-items:center;gap:9px;font-size:13px;font-weight:600;margin:2px 0 14px;color:var(--ink-2)"><input type="checkbox" id="autoSyncChk" '+(DB.meta.autoSync?'checked':'')+' style="width:18px;height:18px;accent-color:var(--navy)"> Auto-sync every time I open the app</label>'+
    '<div style="border-top:1px solid var(--line);margin:4px 0 14px"></div>'+
    '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><b style="font-size:13.5px;color:var(--navy)">Two-way sync — save changes back to the Sheet</b><span class="chip '+(DB.meta.writeUrl?'green':'grey')+'">'+(DB.meta.writeUrl?'On':'Off')+'</span></div>'+
    '<p class="text-muted" style="font-size:12px;margin:0 0 10px">Paste your Apps Script <b>Web App URL</b> so app changes (debt payments, rent, edits, new units) write back to the Sheet automatically. One-time setup steps are in the file <b>apps-script/Code.gs</b>.</p>'+
    '<div class="field"><label>Apps Script Web App URL</label><input id="writeUrlInput" value="'+esc(DB.meta.writeUrl||'')+'" placeholder="https://script.google.com/macros/s/…/exec"></div>'+
    '<div class="field"><label>Secret (must match the value in Code.gs)</label><input id="writeSecretInput" value="'+esc(DB.meta.writeSecret||'')+'"></div>'+
    '<div style="display:flex;gap:9px;flex-wrap:wrap"><button class="btn primary" data-sync-now>'+icon('refresh')+'Sync now</button><button class="btn" data-save-source>'+icon('check')+'Save settings</button><button class="btn" data-test-write>'+icon('refresh')+'Test write-back</button></div>'+
    '<p class="text-muted" style="font-size:11.5px;margin-bottom:0">Last synced: <b>'+(DB.meta.lastSync?fmtDateTime(DB.meta.lastSync):'never')+'</b>. &nbsp;The Sheet must be shared as <b>Anyone with the link → Viewer</b> for reading.</p></div>';

  html+='<div class="grid cols-2 mt">';
  // company
  html+='<div class="card pad"><div class="card-h"><h3>Company</h3></div>'+
    '<div class="ditem"><div class="k">Name</div><div class="v">'+esc(DB.meta.company)+'</div></div>'+
    '<div class="ditem"><div class="k">Currency</div><div class="v">'+esc(DB.meta.currency||'AED')+'</div></div>'+
    '<div class="ditem"><div class="k">Records</div><div class="v">'+DB.properties.length+' units · '+DB.rentRecords.length+' payments · '+DB.debts.length+' debts</div></div>'+
    '</div>';
  // backup
  html+='<div class="card pad"><div class="card-h"><h3>Backup & Export</h3></div>'+
    '<p class="text-muted" style="font-size:12.5px;margin-top:0">Google Sheet is your main source. Use these for offline snapshots or to move data manually.</p>'+
    '<div style="display:flex;flex-direction:column;gap:9px">'+
    '<button class="btn primary block" data-backup>'+icon('download')+'Download Backup (.json)</button>'+
    '<button class="btn block" data-restore>'+icon('upload')+'Restore from Backup</button>'+
    '<button class="btn block" data-export-csv>'+icon('doc')+'Export to CSV (Excel)</button>'+
    '</div><input type="file" id="restoreFile" accept="application/json,.json" class="hide"></div>';
  html+='</div>';

  // App & Security
  var lockMin=autoLockMinutes();
  html+='<div class="card pad mt"><div class="card-h">'+icon('key','')+'<h3>App & Security</h3><span class="chip grey" style="margin-left:6px">v'+APP_VERSION+'</span></div>'+
    '<div class="grid cols-2" style="gap:20px">'+
      '<div>'+
        '<div class="k" style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;margin-bottom:8px">Install</div>'+
        '<button class="btn primary block" data-install>'+icon('download')+'Install app on this device</button>'+
        '<button class="btn block mt-s" data-check-update>'+icon('refresh')+'Check for updates</button>'+
        '<p class="text-muted" style="font-size:11px">Installs like a normal app (home-screen icon, full screen, works offline). Updates apply automatically when you reopen it.</p>'+
      '</div>'+
      '<div>'+
        '<div class="k" style="font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;margin-bottom:8px">Security</div>'+
        '<button class="btn block" data-change-pw>'+icon('key')+'Change my password</button>'+
        '<div class="field mt-s" style="margin-bottom:6px"><label>Auto-lock after inactivity</label><select id="autoLockSel">'+
          [['0','Never'],['5','5 minutes'],['15','15 minutes'],['30','30 minutes'],['60','1 hour']].map(function(o){return '<option value="'+o[0]+'"'+(String(lockMin)===o[0]?' selected':'')+'>'+o[1]+'</option>';}).join('')+
        '</select></div>'+
        '<button class="btn block" data-lock>'+icon('logout')+'Lock now</button>'+
      '</div>'+
    '</div></div>';

  // users
  html+='<div class="card pad mt"><div class="card-h"><h3>Users & Access</h3><div class="right"><button class="btn sm" data-add-user>'+icon('plus')+'Add User</button></div></div>'+
    '<div class="table-wrap" style="border:none"><table><thead><tr><th>Username</th><th>Role</th><th>Password</th><th></th></tr></thead><tbody>'+
    DB.users.map(function(u){ return '<tr><td><b>'+esc(u.username)+'</b></td><td><span class="chip navy">'+esc(u.role)+'</span></td><td class="text-muted">•••••• '+(u.pass?'<span class="chip green" style="margin-left:4px">secured</span>':'<span class="chip gold" style="margin-left:4px">default</span>')+'</td>'+
      '<td class="right"><button class="btn sm ghost" data-user-edit="'+esc(u.username)+'">'+icon('edit')+'</button>'+(u.username!==STATE.user.username?'<button class="btn sm ghost" data-user-del="'+esc(u.username)+'" style="color:var(--red)">'+icon('trash')+'</button>':'')+'</td></tr>'; }).join('')+
    '</tbody></table></div><p class="text-muted" style="font-size:11.5px;margin-bottom:0">Passwords are stored hashed on your device. This login gates the app on-screen; because the data also lives in your Google Sheet, keep the Sheet’s sharing link private too.</p></div>';

  // danger
  html+='<div class="card pad mt" style="border-color:#f6d6d3"><div class="card-h"><h3 style="color:var(--red)">Danger Zone</h3></div>'+
    '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" data-reseed>Reset to original data</button><button class="btn red" data-wipe>Erase all data</button></div></div>';
  return html;
}

/* ============================================================
   EVENT WIRING (per render)
   ============================================================ */
function segBtns(opts, cur){ return opts.map(function(o){ var v=Array.isArray(o)?o[0]:o, l=Array.isArray(o)?o[1]:cap(o); return '<button data-seg-val="'+esc(v)+'" class="'+(String(cur)===String(v)?'on':'')+'">'+esc(l)+'</button>'; }).join(''); }
function cap(s){ return String(s).charAt(0).toUpperCase()+String(s).slice(1); }
function uniq(a){ return a.filter(function(v,i){return a.indexOf(v)===i;}); }
function toDateInput(v){ var d=parseDate(v); if(!d)return ''; return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }

function wireView(){
  var host=$('#view');
  // property open
  $$('[data-prop]', host).forEach(function(el){ el.addEventListener('click', function(e){
    if(e.target.closest('a')) return;
    var id=el.getAttribute('data-prop'); var p=DB.properties.filter(function(x){return x.id===id;})[0];
    if(p){ if(el.hasAttribute('data-prop') && el.tagName==='BUTTON'){ editProperty(p); } else propDetail(p); }
  }); });
  // nav shortcuts inside content
  $$('[data-nav]', host).forEach(function(el){ el.addEventListener('click', function(){ navigate(el.getAttribute('data-nav')); }); });
  var wi=$('[data-welcome-import]',host); if(wi) wi.onclick=pickAndRestore;
  var ws=$('[data-welcome-sync]',host); if(ws) ws.onclick=function(){ syncFromSheet({}); };
  // segmented controls
  $$('[data-seg]', host).forEach(function(seg){ var key=seg.getAttribute('data-seg');
    $$('[data-seg-val]', seg).forEach(function(b){ b.addEventListener('click', function(){
      var v=b.getAttribute('data-seg-val');
      if(key==='status') STATE.filters.prop.status=v;
      if(key==='view') STATE.filters.prop.view=v;
      if(key==='cstatus') STATE.filters.contract.status=v;
      if(key==='dtype') STATE.filters.debt.type=v;
      if(key==='doctab') STATE.filters.docs.tab=v;
      if(key==='rentroll') STATE.filters.rent.roll=v;
      if(key==='acctab') STATE.filters.acc.tab=v;
      renderView();
    }); });
  });
  // owner filter
  var of=$('[data-filter="owner"]',host); if(of) of.onchange=function(){ STATE.filters.prop.owner=of.value; renderView(); };
  // property add
  var ap=$('[data-add-prop]',host); if(ap) ap.onclick=addProperty;
  // contract renew
  $$('[data-renew]',host).forEach(function(b){ b.onclick=function(){ var p=DB.properties.filter(function(x){return x.id===b.getAttribute('data-renew');})[0]; if(p) renewContract(p); }; });
  var fly=$('[data-flyer]',host); if(fly) fly.onclick=flyerDialog;
  // rent
  $$('[data-rent]',host).forEach(function(s){ s.onchange=function(){ STATE.filters.rent[s.getAttribute('data-rent')]=+s.value; renderView(); }; });
  var ar=$('[data-add-rent]',host); if(ar) ar.onclick=function(){ recordRent(); };
  $$('[data-pay-unit]',host).forEach(function(b){ b.onclick=function(){ recordRent(b.getAttribute('data-pay-unit')); }; });
  $$('[data-remind-rent]',host).forEach(function(b){ b.onclick=function(){ remindRent(b.getAttribute('data-remind-rent')); }; });
  $$('[data-remind-arrear]',host).forEach(function(b){ b.onclick=function(){ var a=b.getAttribute('data-remind-arrear').split('::'); remindRent(a[0], +a[1], +a[2]); }; });
  $$('[data-set-start]',host).forEach(function(b){ b.onclick=function(e){ e.stopPropagation();
    var p=DB.properties.filter(function(x){return x.id===b.getAttribute('data-set-start');})[0]; if(p) setContractStart(p); }; });
  $$('[data-remind-contract]',host).forEach(function(b){ b.onclick=function(){ remindContract(b.getAttribute('data-remind-contract')); }; });
  $$('[data-del-rent]',host).forEach(function(b){ b.onclick=function(){ var id=b.getAttribute('data-del-rent'); confirmDialog('Delete this payment record?', function(){ DB.rentRecords=DB.rentRecords.filter(function(r){return r.id!==id;}); save(); toast('Deleted','ok'); renderView(); var k=numKey(id,'r'); if(k) syncWrite([{action:'delete', sheet:'RentRecords', keyCol:'ID', key:k}]); }, true); }; });
  // accounting
  $$('[data-acc-tab]',host).forEach(function(b){ b.onclick=function(){ STATE.filters.acc.tab=b.getAttribute('data-acc-tab'); renderView(); }; });
  var am=$('[data-acc-months]',host); if(am) am.onchange=function(){ STATE.filters.acc.months=+am.value; renderView(); };
  // cheques
  var ac=$('[data-add-cheque]',host); if(ac) ac.onclick=addCheque;
  function chq(id){ return DB.cheques.filter(function(x){return x.id===id;})[0]; }
  $$('[data-chq-edit]',host).forEach(function(b){ b.onclick=function(){ var c=chq(b.getAttribute('data-chq-edit')); if(c) editCheque(c); }; });
  $$('[data-chq-clear]',host).forEach(function(b){ b.onclick=function(){ var c=chq(b.getAttribute('data-chq-clear')); if(c) setChequeStatus(c,'Cleared'); }; });
  $$('[data-chq-bounce]',host).forEach(function(b){ b.onclick=function(){ var c=chq(b.getAttribute('data-chq-bounce')); if(c) setChequeStatus(c,'Bounced'); }; });
  // utilities
  var au=$('[data-add-util]',host); if(au) au.onclick=addUtility;
  function utl(id){ return DB.utilities.filter(function(x){return x.id===id;})[0]; }
  $$('[data-util-edit]',host).forEach(function(b){ b.onclick=function(){ var u=utl(b.getAttribute('data-util-edit')); if(u) editUtility(u); }; });
  $$('[data-util-paid]',host).forEach(function(b){ b.onclick=function(){ var u=utl(b.getAttribute('data-util-paid')); if(!u) return;
    u.status='Paid'; save(); toast('Marked paid','ok'); renderView();
    var k=numKey(u.id,'ut'); if(k) syncWrite([{action:'upsert', sheet:'Utilities', keyCol:'ID', key:k, row:{Status:'Paid'}}]); }; });
  // payables
  var asup=$('[data-add-supplier]',host); if(asup) asup.onclick=addSupplier;
  var ainv=$('[data-add-invoice]',host); if(ainv) ainv.onclick=addInvoice;
  function invf(id){ return DB.invoices.filter(function(x){return x.id===id;})[0]; }
  $$('[data-inv-edit]',host).forEach(function(b){ b.onclick=function(){ var i=invf(b.getAttribute('data-inv-edit')); if(i) editInvoice(i); }; });
  $$('[data-inv-pay]',host).forEach(function(b){ b.onclick=function(){ var i=invf(b.getAttribute('data-inv-pay')); if(i) payInvoice(i); }; });
  $$('[data-statement]',host).forEach(function(b){ b.onclick=function(){ openStatement(b.getAttribute('data-statement')); }; });
  $$('[data-receipt]',host).forEach(function(b){ b.onclick=function(){ openReceipt(b.getAttribute('data-receipt')); }; });
  // profit & loss
  var py=$('[data-pnl="year"]',host); if(py) py.onchange=function(){ STATE.filters.pnl.year=+py.value; renderView(); };
  var pc=$('[data-pnl-csv]',host); if(pc) pc.onclick=exportPnlCSV;
  var pp=$('[data-print]',host); if(pp) pp.onclick=function(){ window.print(); };
  // finance
  var fy=$('[data-fin="year"]',host); if(fy) fy.onchange=function(){ STATE.filters.fin.year=+fy.value; renderView(); };
  $$('[data-add-tx]',host).forEach(function(b){ b.onclick=function(){ addTransaction(b.getAttribute('data-add-tx')); }; });
  $$('[data-del-tx]',host).forEach(function(b){ b.onclick=function(){ var id=b.getAttribute('data-del-tx'); confirmDialog('Delete this transaction?', function(){ var t=DB.transactions.filter(function(x){return x.id===id;})[0]; if(t) adjustAccount(t.account, t.type==='income'?-t.amount:t.amount); DB.transactions=DB.transactions.filter(function(x){return x.id!==id;}); save(); toast('Deleted','ok'); renderView(); var k=numKey(id,'tx'); if(k) syncWrite([{action:'delete', sheet:'Transactions', keyCol:'ID', key:k}]); }, true); }; });
  var ea=$('[data-edit-accts]',host); if(ea) ea.onclick=editAccounts;
  var arc=$('[data-add-recur]',host); if(arc) arc.onclick=addRecurring;
  $$('[data-del-recur]',host).forEach(function(b){ b.onclick=function(){ var id=b.getAttribute('data-del-recur'); DB.recurringExpenses=DB.recurringExpenses.filter(function(x){return x.id!==id;}); save(); renderView(); var k=numKey(id,'re'); if(k) syncWrite([{action:'delete', sheet:'RecurringExpenses', keyCol:'ID', key:k}]); }; });
  // debts
  var ad=$('[data-add-debt]',host); if(ad) ad.onclick=addDebt;
  $$('[data-debt-pay]',host).forEach(function(b){ b.onclick=function(){ var d=DB.debts.filter(function(x){return x.id===b.getAttribute('data-debt-pay');})[0]; if(d) payDebt(d); }; });
  $$('[data-debt-edit]',host).forEach(function(b){ b.onclick=function(){ var d=DB.debts.filter(function(x){return x.id===b.getAttribute('data-debt-edit');})[0]; if(d) editDebt(d); }; });
  // tasks
  var at=$('[data-add-task]',host); if(at) at.onclick=addTask;
  $$('[data-task-toggle]',host).forEach(function(c){ c.onchange=function(){ var t=DB.tasks.filter(function(x){return x.id===c.getAttribute('data-task-toggle');})[0]; if(t){ t.done=c.checked; save(); renderView(); var k=numKey(t.id,'t'); if(k) syncWrite([{action:'upsert', sheet:'pending actions', keyCol:'Id', key:k, row:{ IsCompleted: t.done?1:0 }}]); } }; });
  $$('[data-task-del]',host).forEach(function(b){ b.onclick=function(){ var id=b.getAttribute('data-task-del'); DB.tasks=DB.tasks.filter(function(x){return x.id!==id;}); save(); toast('Deleted','ok'); renderView(); var k=numKey(id,'t'); if(k) syncWrite([{action:'delete', sheet:'pending actions', keyCol:'Id', key:k}]); }; });
  // settings
  var sn=$('[data-sync-now]',host); if(sn) sn.onclick=function(){ syncFromSheet({}); };
  var ss=$('[data-save-source]',host); if(ss) ss.onclick=function(){
    var raw=$('#sheetIdInput',host).value; var newId=window.SARE_SHEETS?window.SARE_SHEETS.extractId(raw):raw.trim();
    DB.meta.sheetId=newId; DB.meta.autoSync=$('#autoSyncChk',host).checked;
    var wu=$('#writeUrlInput',host); if(wu) DB.meta.writeUrl=wu.value.trim();
    var wsx=$('#writeSecretInput',host); if(wsx) DB.meta.writeSecret=wsx.value.trim();
    save();
    toast('Settings saved'+(DB.meta.writeUrl?' · two-way sync on':''),'ok'); renderView();
  };
  var tw=$('[data-test-write]',host); if(tw) tw.onclick=function(){
    var url=($('#writeUrlInput',host)||{}).value; url=url?url.trim():DB.meta.writeUrl;
    var sec=($('#writeSecretInput',host)||{}).value; sec=sec?sec.trim():DB.meta.writeSecret;
    if(!url){ toast('Paste the Web App URL first','err'); return; }
    toast('Testing…');
    window.SARE_SHEETS.ping(url, sec).then(function(r){ toast(r&&r.ok?'Connected to Google Sheet ✓':'Failed'+(r&&r.error?': '+r.error:' — check URL/secret'), r&&r.ok?'ok':'err'); })
      .catch(function(){ toast('Could not reach the script URL','err'); });
  };
  var inb=$('[data-install]',host); if(inb) inb.onclick=doInstall;
  var cub=$('[data-check-update]',host); if(cub) cub.onclick=checkForUpdate;
  var cpw=$('[data-change-pw]',host); if(cpw) cpw.onclick=changeMyPassword;
  var lkb=$('[data-lock]',host); if(lkb) lkb.onclick=lockApp;
  var als=$('#autoLockSel',host); if(als) als.onchange=function(){ DB.meta.autoLockMin=+als.value; save(); resetLockTimer(); toast('Auto-lock updated','ok'); };
  var bk=$('[data-backup]',host); if(bk) bk.onclick=doBackup;
  var rs=$('[data-restore]',host); if(rs) rs.onclick=function(){ $('#restoreFile').click(); };
  var rf=$('#restoreFile',host); if(rf) rf.onchange=doRestore;
  var xc=$('[data-export-csv]',host); if(xc) xc.onclick=exportCSV;
  var au=$('[data-add-user]',host); if(au) au.onclick=addUser;
  $$('[data-user-edit]',host).forEach(function(b){ b.onclick=function(){ editUser(b.getAttribute('data-user-edit')); }; });
  $$('[data-user-del]',host).forEach(function(b){ b.onclick=function(){ var un=b.getAttribute('data-user-del'); confirmDialog('Remove user "'+un+'"?', function(){ DB.users=DB.users.filter(function(u){return u.username!==un;}); save(); renderView(); }, true); }; });
  var rsd=$('[data-reseed]',host); if(rsd) rsd.onclick=function(){ confirmDialog('Reset to the original imported data? Your current changes will be lost.', function(){ DB=defaultData(); save(); toast('Reset done','ok'); renderView(); }, true); };
  var wp=$('[data-wipe]',host); if(wp) wp.onclick=function(){ confirmDialog('Erase ALL data permanently? Download a backup first!', function(){ localStorage.removeItem(STORE_KEY); DB=defaultData(); DB.properties=[];DB.rentRecords=[];DB.debts=[];DB.tasks=[];DB.transactions=[]; save(); toast('All data erased','err'); renderView(); }, true); };
}

/* ---------- Settings actions ---------- */
function editAccounts(){
  var all=(DB.accounts.company||[]).map(function(a){return {a:a,g:'company'};}).concat((DB.accounts.personnel||[]).map(function(a){return {a:a,g:'personnel'};}));
  var fields=[]; all.forEach(function(x,i){ fields.push({name:'b'+i,label:x.a.name+' ('+x.g+')',type:'number',value:x.a.balance,full:true}); });
  if(!fields.length){ toast('No accounts to edit'); return; }
  formModal('Adjust Account Balances', fields, function(data){ all.forEach(function(x,i){ x.a.balance=+data['b'+i]||0; }); save(); closeModal(); toast('Balances updated','ok'); renderView();
    var writes=all.map(function(x){ return {action:'upsert', sheet:(x.g==='company'?'CompanyAccounts':'PersonnelAccounts'), keyCol:'ID', key:String(x.a.id).replace(/^(c|pa)/,''), row:{ CurrentBalance:x.a.balance }}; });
    if(writes.length) syncWrite(writes);
  });
}
function addRecurring(){ formModal('Add Recurring Expense', [
  {name:'name',label:'Name',required:true,full:true},{name:'amount',label:'Amount (AED)',type:'number',required:true},
  {name:'frequency',label:'Frequency',type:'select',value:'Monthly',options:['Monthly','Yearly','Weekly']},
  {name:'accountType',label:'Account',type:'select',value:'Personnel',options:['Personnel','Company']}
], function(data){ var e={id:uid('re'),name:data.name,amount:+data.amount||0,frequency:data.frequency,accountType:data.accountType}; DB.recurringExpenses.push(e); save(); closeModal(); toast('Added','ok'); renderView();
  syncWrite([{action:'append', sheet:'RecurringExpenses', idCol:'ID', row:{ AccountName:e.name, Amount:e.amount, Frequency:e.frequency, AccountType:e.accountType }}], {appended:{obj:e, prefix:'re'}}); }); }
function addTask(){ formModal('Add Task', [
  {name:'description',label:'Description',type:'textarea',required:true,full:true},
  {name:'dueDate',label:'Due Date',type:'date',value:'',full:true}
], function(data){ var t={id:uid('t'),description:data.description,dueDate:data.dueDate,done:false,createdAt:new Date().toISOString()}; DB.tasks.push(t); save(); closeModal(); toast('Task added','ok'); renderView();
  syncWrite([{action:'append', sheet:'pending actions', idCol:'Id', row:{ Description:t.description, DueDate:toSheetDate(t.dueDate), IsCompleted:0, CreatedAt:t.createdAt }}], {appended:{obj:t, prefix:'t'}}); }); }
function addUser(){ formModal('Add User', [
  {name:'username',label:'Username',required:true},{name:'password',label:'Password',type:'password',required:true},
  {name:'role',label:'Role',type:'select',value:'agent',options:[{value:'admin',label:'Admin (full access)'},{value:'agent',label:'Agent (properties)'},{value:'accountant',label:'Accountant (finance)'}]}
], function(data){ if(DB.users.filter(function(u){return u.username===data.username;})[0]){ toast('Username exists','err'); return; }
  sha256(data.password).then(function(h){ DB.users.push({username:data.username,pass:h,role:data.role}); save(); closeModal(); toast('User added','ok'); renderView(); }); }); }
function editUser(un){ var u=DB.users.filter(function(x){return x.username===un;})[0]; if(!u)return;
  formModal('Edit User · '+un, [
    {name:'password',label:'New Password (leave blank to keep current)',type:'password',value:'',full:true},
    {name:'role',label:'Role',type:'select',value:u.role,options:[{value:'admin',label:'Admin'},{value:'agent',label:'Agent'},{value:'accountant',label:'Accountant'}]}
  ], function(data){ u.role=data.role; var done=function(){ save(); closeModal(); toast('Saved','ok'); renderView(); };
    if(data.password){ sha256(data.password).then(function(h){ u.pass=h; delete u.password; done(); }); } else done(); }); }
function changeMyPassword(){ var u=DB.users.filter(function(x){return x.username===STATE.user.username;})[0]; if(!u){ toast('User not found','err'); return; }
  formModal('Change My Password', [{name:'password',label:'New Password',type:'password',required:true,full:true}],
    function(data){ sha256(data.password).then(function(h){ u.pass=h; delete u.password; save(); closeModal(); toast('Password changed ✓','ok'); }); }, {submitText:'Update'}); }

/* ---------- Backup / Restore / Export ---------- */
function download(filename, text, mime){
  var blob=new Blob([text],{type:mime||'text/plain'}); var url=URL.createObjectURL(blob);
  var a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click();
  setTimeout(function(){ a.remove(); URL.revokeObjectURL(url); },100);
}
function doBackup(){ download('sabir-amin-backup-'+todayISO()+'.json', JSON.stringify(DB,null,1), 'application/json'); toast('Backup downloaded','ok'); }
function pickAndRestore(){ var inp=document.createElement('input'); inp.type='file'; inp.accept='application/json,.json'; inp.style.display='none'; document.body.appendChild(inp); inp.onchange=function(e){ doRestore(e); inp.remove(); }; inp.click(); }
function doRestore(e){ var file=e.target.files[0]; if(!file)return; var r=new FileReader();
  r.onload=function(){ try{ var data=JSON.parse(r.result); if(!data.properties) throw 0; confirmDialog('Restore this backup? It will replace all current data.', function(){ DB=data; save(); toast('Data restored','ok'); renderView(); }); }catch(err){ toast('Invalid backup file','err'); } };
  r.readAsText(file); e.target.value='';
}
function csvRow(arr){ return arr.map(function(v){ v=String(v==null?'':v); return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v; }).join(',')+'\n'; }
function exportCSV(){
  var out='SABIR AMIN REAL ESTATE — Export '+todayISO()+'\n\nPROPERTIES\n';
  out+=csvRow(['Unit','Type','Owner','OwnerContact','Tenant','TenantContact','OwnerRent','TenantRent','Profit','ContractFrom','ContractTo','Security']);
  DB.properties.forEach(function(p){ out+=csvRow([p.unit,p.type,p.ownerName,p.ownerContact,p.tenantName,p.tenantContact,p.ownerRent,p.tenantRent,p.monthlyProfit,fmtDate(p.contractFrom),fmtDate(p.contractTo),p.security]); });
  out+='\nRENT PAYMENTS\n'+csvRow(['Date','Unit','Month','Year','Amount','Profit']);
  DB.rentRecords.forEach(function(r){ out+=csvRow([fmtDate(r.date),r.unit,r.month,r.year,r.amount,recordProfit(r)]); });
  out+='\nDEBTS\n'+csvRow(['Person','Type','Amount','Paid','Balance','Status','DueDate','Reason']);
  DB.debts.forEach(function(d){ out+=csvRow([d.person,d.type,d.amount,d.paid,d.balance,d.status,fmtDate(d.dueDate),d.reason]); });
  download('sabir-amin-export-'+todayISO()+'.csv', out, 'text/csv');
  toast('CSV exported','ok');
}

/* ---------- Google Sheet live sync ---------- */
var syncing=false;
function setSyncUI(on){
  var b=$('#syncBtn'), ic=$('#syncIcon'), lb=$('#syncLabel');
  if(b){ b.disabled=on; b.title = on?'Syncing…':('Sync from Google Sheet'+(DB.meta.lastSync?' · last '+fmtDateTime(DB.meta.lastSync):'')); }
  if(lb) lb.textContent = on?'Syncing…':'Sync';
  if(ic) ic.style.animation = on?'spin 1s linear infinite':'';
}
function fmtDateTime(v){ var d=parseDate(v); if(!d)return '—'; return fmtDate(v)+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
async function syncFromSheet(opts){
  opts=opts||{};
  var id=(DB.meta&&DB.meta.sheetId)||'';
  if(!id){ if(!opts.silent) toast('No Google Sheet is configured (Settings → Google Sheet Sync)','err'); return false; }
  if(!window.SARE_SHEETS){ toast('Sync module not loaded','err'); return false; }
  if(syncing) return false;
  syncing=true; setSyncUI(true);
  if(opts.render!==false && !DB.properties.length) renderView(); // show "syncing" welcome state
  try{
    var data=await window.SARE_SHEETS.fetchAll(id);
    DB.properties=data.properties;
    DB.rentRecords=data.rentRecords;
    DB.debts=data.debts;
    DB.tasks=data.tasks;
    DB.transactions=data.transactions;
    DB.recurringExpenses=data.recurringExpenses;
    DB.accounts=data.accounts;
    DB.studios=data.studios;
    if(data.cheques)   DB.cheques=data.cheques;
    if(data.utilities) DB.utilities=data.utilities;
    if(data.suppliers) DB.suppliers=data.suppliers;
    if(data.invoices)  DB.invoices=data.invoices;
    DB.meta.tabsReady=data.tabsReady||[];
    DB.meta.lastSync=new Date().toISOString();
    save();
    syncing=false; setSyncUI(false);
    if(!opts.silent) toast('Synced '+data.properties.length+' units, '+data.rentRecords.length+' payments','ok');
    if(opts.render!==false) renderView();
    return true;
  }catch(e){
    syncing=false; setSyncUI(false);
    toast('Sync failed — '+(e.message||'check the sheet is shared "anyone with link"'),'err');
    if(opts.render!==false) renderView();
    return false;
  }
}

/* ---------- Two-way write-back to the sheet ---------- */
function writeEnabled(){ return !!(DB.meta && DB.meta.writeUrl && window.SARE_SHEETS && window.SARE_SHEETS.push); }
function toSheetDate(v){ var d=parseDate(v); if(!d) return v||''; return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
/* Fire a write to the sheet. opts.appended = {obj, prefix} patches the local id with the sheet's new id. */
function syncWrite(writes, opts){
  opts=opts||{};
  if(!writeEnabled()){
    if(!DB.meta.__warnedNoWrite){ DB.meta.__warnedNoWrite=true; }
    return; // write-back not set up; local-only
  }
  window.SARE_SHEETS.push(DB.meta.writeUrl, DB.meta.writeSecret||'', writes).then(function(res){
    if(res && res.ok){
      toast('Google Sheet updated ✓','ok');
      if(opts.appended && res.results){
        var ap=res.results.filter(function(x){return x && x.appended;})[0];
        if(ap && ap.id!=null && ap.id!=='' && opts.appended.obj && opts.appended.prefix){
          opts.appended.obj.id=opts.appended.prefix+ap.id; save();
        }
      }
    } else {
      toast('Saved locally — sheet not updated'+(res&&res.error?': '+res.error:''),'err');
    }
  }).catch(function(){ toast('Saved locally — could not reach the sheet','err'); });
}
function debtRow(d, forAppend){
  var row={ Type:d.type, Person:d.person, Amount:d.amount, Date:toSheetDate(d.date), DueDate:toSheetDate(d.dueDate),
    Reason:d.reason, PaidAmount:d.paid, Balance:d.balance, Status:d.status, LastPayment:toSheetDate(d.lastPayment), History:d.history };
  if(!forAppend) row.ID=String(d.id).replace(/^d/,'');
  return row;
}
function propRow(p, forAppend){
  var row={ Flat:p.type, OwnerName:p.ownerName, OwnerContact:p.ownerContact, TenantName:p.tenantName, TenantContact:p.tenantContact,
    Location:p.unit, OwnerRent:p.ownerRent, TenantRent:p.tenantRent, AskingRent:(p.askingRent||''), SecurityCheque:p.security,
    TContractFrom:toSheetDate(p.contractFrom), TContractTo:toSheetDate(p.contractTo), Property:p.ownership,
    OwnerContract:toSheetDate(p.ownerContract), Maintenance:p.maintenance, Coordinates:p.coordinates, GoogleMap:p.mapLink,
    ReadyToMove:p.readyToMove?'Yes':'No', DriveFolderLink:p.driveLink, Profit:p.monthlyProfit };
  if(!forAppend) row.S_No=String(p.id).replace(/^p/,'');
  return row;
}
function numKey(id, prefix){ var n=String(id).replace(new RegExp('^'+prefix),''); return /^\d+$/.test(n)?n:''; }

/* ============================================================
   AUTH + SHELL
   ============================================================ */
async function sha256(str){
  try{ var b=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(str)));
    return Array.prototype.map.call(new Uint8Array(b), function(x){return x.toString(16).padStart(2,'0');}).join(''); }
  catch(e){ return 'plain:'+String(str); }
}
async function login(username, password){
  var h=await sha256(password);
  var u=DB.users.filter(function(x){
    if(String(x.username).toLowerCase()!==String(username).toLowerCase()) return false;
    if(x.pass) return x.pass===h;
    if(x.password!=null) return String(x.password)===String(password);
    return false;
  })[0];
  if(!u) return false;
  var wasDefault=false;
  if(!u.pass){ // upgrade legacy plaintext to a hash, drop the plaintext
    if(u.password!=null){ wasDefault=(['123','1234','12345'].indexOf(String(u.password))>=0); }
    u.pass=h; delete u.password; save();
  }
  STATE.user={username:u.username, role:u.role};
  try{ sessionStorage.setItem(SESSION_KEY, JSON.stringify(STATE.user)); }catch(e){}
  showApp();
  if(wasDefault) setTimeout(function(){ toast('You are using a default password — change it in Settings for security','err'); }, 1400);
  return true;
}
function logout(){ try{ sessionStorage.removeItem(SESSION_KEY); }catch(e){} STATE.user=null; stopAutoLock(); $('#app').classList.add('hide'); $('#login').classList.remove('hide'); var lp=$('#lPass'); if(lp) lp.value=''; var er=$('#lErr'); if(er) er.classList.add('hide'); }
function lockApp(){ try{ sessionStorage.removeItem(SESSION_KEY); }catch(e){} STATE.user=null; stopAutoLock(); $('#app').classList.add('hide'); $('#login').classList.remove('hide'); var lp=$('#lPass'); if(lp) lp.value=''; toast('App locked'); }

/* auto-lock on inactivity */
var lockTimer=null;
function autoLockMinutes(){ var m=DB.meta&&DB.meta.autoLockMin; return (m===undefined?15:+m); }
function resetLockTimer(){ if(!STATE.user){ return; } if(lockTimer) clearTimeout(lockTimer); var mins=autoLockMinutes(); if(!mins) return; lockTimer=setTimeout(lockApp, mins*60000); }
function stopAutoLock(){ if(lockTimer){ clearTimeout(lockTimer); lockTimer=null; } }

function showApp(){
  $('#login').classList.add('hide'); $('#app').classList.remove('hide');
  var now=new Date();
  $('#datePill').innerHTML=icon('clock')+now.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
  var sb=$('#syncBtn'); if(sb){ sb.onclick=function(){ syncFromSheet({}); }; setSyncUI(false); }
  refreshInstallUI(); resetLockTimer();
  navigate(STATE.view||'dashboard');
  if(DB.meta && DB.meta.autoSync && DB.meta.sheetId) syncFromSheet({silent:true});
}
function openDrawer(){ $('#sidebar').classList.add('open'); $('#scrim').classList.add('show'); }
function closeDrawer(){ $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('show'); }

/* ---------- PWA install & update ---------- */
var deferredInstall=null, swReg=null, installDismissed=false;
function canInstall(){ return !!(deferredInstall && !installDismissed); }
function refreshInstallUI(){ var bar=$('#installBar'); if(bar) bar.classList.toggle('hide', !canInstall()); }
function doInstall(){
  if(deferredInstall){ deferredInstall.prompt(); deferredInstall.userChoice.then(function(c){ if(c&&c.outcome==='accepted') toast('Installing…','ok'); deferredInstall=null; refreshInstallUI(); }); }
  else { toast('On iPhone/iPad: tap the Share button, then “Add to Home Screen”.'); }
}
function showUpdateBar(){ var b=$('#updateBar'); if(b) b.classList.remove('hide'); }
function setupPWA(){
  window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); deferredInstall=e; refreshInstallUI(); });
  window.addEventListener('appinstalled', function(){ deferredInstall=null; installDismissed=true; refreshInstallUI(); toast('App installed ✓','ok'); });
  var ib=$('#installBtn'); if(ib) ib.onclick=doInstall;
  var idm=$('#installDismiss'); if(idm) idm.onclick=function(){ installDismissed=true; refreshInstallUI(); };
  var ub=$('#updateBtn'); if(ub) ub.onclick=function(){ if(swReg&&swReg.waiting) swReg.waiting.postMessage({type:'SKIP_WAITING'}); else location.reload(); };
  if('serviceWorker' in navigator && location.protocol.indexOf('http')===0){
    navigator.serviceWorker.register('sw.js').then(function(reg){
      swReg=reg;
      if(reg.waiting && navigator.serviceWorker.controller) showUpdateBar();
      reg.addEventListener('updatefound', function(){ var nw=reg.installing; if(!nw) return; nw.addEventListener('statechange', function(){ if(nw.state==='installed' && navigator.serviceWorker.controller) showUpdateBar(); }); });
      setInterval(function(){ reg.update().catch(function(){}); }, 3600000);
      document.addEventListener('visibilitychange', function(){ if(!document.hidden && swReg) swReg.update().catch(function(){}); });
    }).catch(function(){});
    var reloaded=false;
    navigator.serviceWorker.addEventListener('controllerchange', function(){ if(reloaded) return; reloaded=true; location.reload(); });
  }
}
function checkForUpdate(){ if(swReg){ toast('Checking for updates…'); swReg.update().then(function(){ setTimeout(function(){ if(!(swReg&&swReg.waiting)) toast('You are on the latest version','ok'); },1500); }).catch(function(){ toast('Update check failed','err'); }); } else toast('Updates available once installed online'); }

function init(){
  load();
  try{ var s=sessionStorage.getItem(SESSION_KEY); if(s){ var u=JSON.parse(s); if(DB.users.filter(function(x){return x.username===u.username;})[0]) STATE.user=u; } }catch(e){}

  $('#loginForm').addEventListener('submit', function(e){ e.preventDefault();
    var btn=this.querySelector('button[type=submit]'); if(btn) btn.disabled=true;
    login($('#lUser').value.trim(), $('#lPass').value.trim()).then(function(ok){
      if(btn) btn.disabled=false;
      if(!ok){ var er=$('#lErr'); er.textContent='Invalid username or password'; er.classList.remove('hide'); }
    });
  });
  $('#nav').addEventListener('click', function(e){ var it=e.target.closest('[data-nav]'); if(it) navigate(it.getAttribute('data-nav')); });
  $('#mobileNav').addEventListener('click', function(e){ var it=e.target.closest('[data-nav]'); if(it) navigate(it.getAttribute('data-nav')); });
  $('#hamburger').addEventListener('click', openDrawer);
  $('#scrim').addEventListener('click', closeDrawer);
  var gs=$('#globalSearch'); var st;
  gs.addEventListener('input', function(){ clearTimeout(st); st=setTimeout(function(){ STATE.search=gs.value.trim();
    if(['properties','tenants','documents'].indexOf(STATE.view)<0) navigate('properties'); else renderView(); }, 200); });

  ['click','keydown','touchstart'].forEach(function(ev){ document.addEventListener(ev, resetLockTimer, {passive:true}); });
  setupPWA();
  if(STATE.user) showApp();
}
document.addEventListener('DOMContentLoaded', init);
})();

/* ============================================================
   SABIR AMIN REAL ESTATE — Property Management App
   Vanilla JS, no build step. Data persists in localStorage.
   ============================================================ */
(function () {
'use strict';

/* ---------- Constants ---------- */
var APP_VERSION = '1.4.0';
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
    users: s.users || [{username:'admin',password:'123',role:'admin'}]
  }));
}
function load(){
  try{ var raw = localStorage.getItem(STORE_KEY); if(raw){ DB = JSON.parse(raw); migrateMeta(); return; } }catch(e){}
  DB = defaultData(); migrateMeta(); save();
}
function migrateMeta(){
  DB.meta = DB.meta || {};
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
    documents:viewDocuments, rent:viewRent, pnl:viewPnl, finance:viewFinance, debts:viewDebts, tasks:viewTasks, settings:viewSettings})[STATE.view];
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

/* ---------- RENT ---------- */
function rentDueDay(p){ var d=parseDate(p.contractFrom); return d?d.getDate():1; }
function rentDueDate(p, month, year){ var day=rentDueDay(p); var dim=new Date(year, month, 0).getDate(); return new Date(year, month-1, Math.min(day, dim)); }
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
  if(!shown.length) html+=emptyState(f.roll==='unpaid'?'Everyone has paid for '+MONTHS[f.month]+' 🎉':'No units to show');
  else html+='<div class="table-wrap" style="border:none"><table><thead><tr><th>Unit</th><th>Tenant</th><th class="num">Rent</th><th>Rent due</th><th class="num">Paid</th><th>Status</th><th></th></tr></thead><tbody>'+
    shown.map(function(x){ var p=x.p, r=x.r; var due=rentDueDate(p,f.month,f.year); var od=daysUntil(due); var overdue=!r && od<0; var tc=phoneLinks(p.tenantContact);
      var status = r ? '<span class="chip green">Paid '+fmtDate(r.date)+'</span>'
        : overdue ? '<span class="chip red">Overdue '+Math.abs(od)+'d</span>'
        : '<span class="chip gold">Due '+due.getDate()+' '+MONTHS[f.month]+'</span>';
      return '<tr'+(overdue?' style="background:#fdf1f0"':'')+'><td><span class="u-code">'+esc(p.unit)+'</span></td>'+
        '<td><b style="color:var(--ink)">'+esc(p.tenantName)+'</b>'+(tc?'<div class="text-muted" style="font-size:11px">'+tc.display+'</div>':'')+'</td>'+
        '<td class="num">'+money(p.tenantRent)+'</td>'+
        '<td>'+due.getDate()+' '+MONTHS[f.month]+' '+f.year+'</td>'+
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
    '<div class="table-wrap" style="border:none"><table><thead><tr><th>Date</th><th>Unit</th><th>Period</th><th class="num">Amount</th><th class="num">Profit</th>'+(STATE.user.role!=='accountant'?'<th></th>':'')+'</tr></thead><tbody>'+
    hist.map(function(r){ return '<tr><td>'+fmtDate(r.date)+'</td><td><span class="u-code">'+esc(r.unit)+'</span></td><td>'+MONTHS[r.month]+' '+r.year+'</td>'+
      '<td class="num pos">'+money(r.amount)+'</td><td class="num '+(recordProfit(r)<0?'neg':'')+'">'+money(recordProfit(r))+'</td>'+
      (STATE.user.role!=='accountant'?'<td class="right"><button class="btn sm ghost" data-del-rent="'+esc(r.id)+'" style="color:var(--red)">'+icon('trash')+'</button></td>':'')+'</tr>';
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
    {name:'date',label:'Payment Date',type:'date',value:todayISO(),required:true},
    {name:'month',label:'Month',type:'select',value:f.month,options:MONTHS.slice(1).map(function(mn,i){return {value:i+1,label:mn};})},
    {name:'year',label:'Year',type:'number',value:f.year}
  ], function(data){
    var prop=getProp(data.unit);
    var rec={ id:uid('r'), unit:data.unit, amount:+data.amount||0, date:data.date, month:+data.month, year:+data.year,
      maintenance:+data.maintenance||0, ownership:prop?prop.ownership:'Personnel' };
    rec.profit=(rec.amount)-(prop?Number(prop.ownerRent)||0:0)-(rec.maintenance);
    DB.rentRecords.push(rec); save(); closeModal(); toast('Payment recorded','ok'); renderView();
    syncWrite([{action:'append', sheet:'RentRecords', idCol:'ID', row:{ StudioId:rec.unit, PaymentDate:toSheetDate(rec.date),
      Amount:rec.amount, Ownership:rec.ownership, Month:rec.month, Year:rec.year, Maintenance:rec.maintenance, Profit:rec.profit }}], {appended:{obj:rec, prefix:'r'}});
  }, {submitText:'Save Payment'});
  // Auto-load the expected rent from the Table when the unit changes
  var sel=ov.querySelector('[name="unit"]'), amt=ov.querySelector('[name="amount"]'), mnt=ov.querySelector('[name="maintenance"]');
  var lbl=amt.closest('.field').querySelector('label');
  function fill(){ var pr=getProp(sel.value); if(pr){ amt.value=pr.tenantRent||''; if(mnt) mnt.value=pr.maintenance||0; if(lbl) lbl.innerHTML='Amount Received (AED) * <span style="color:var(--muted);font-weight:600">· expected '+money(pr.tenantRent||0)+'</span>'; } }
  sel.addEventListener('change', fill); fill();
}

/* ---------- WhatsApp reminders ---------- */
function waOpen(contact, msg){ var pl=phoneLinks(contact); if(!pl){ toast('No contact number saved for this tenant','err'); return; } window.open(pl.wa+'?text='+encodeURIComponent(msg),'_blank'); }
function remindRent(unit){ var p=getProp(unit); if(!p) return; var f=STATE.filters.rent||{month:curMonth(),year:curYear()};
  var msg='Dear '+(p.tenantName||'Tenant')+', gentle reminder: your rent of '+money(p.tenantRent||0)+' for '+MONTHS[f.month]+' '+f.year+' (unit '+p.unit+') is due. Kindly arrange the payment. Thank you — '+(DB.meta.company||'Sabir Amin Real Estate')+'.';
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
    var opex=tx.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+(Number(t.amount)||0);},0);
    var otherInc=tx.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+(Number(t.amount)||0);},0);
    var gross=collected-ownerCost-maint;
    out.push({mo:mo,count:rr.length,collected:collected,ownerCost:ownerCost,maint:maint,gross:gross,opex:opex,otherInc:otherInc,net:gross+otherInc-opex});
  }
  return out;
}
function pnlTotals(months){
  return months.reduce(function(a,m){
    a.collected+=m.collected; a.ownerCost+=m.ownerCost; a.maint+=m.maint;
    a.gross+=m.gross; a.opex+=m.opex; a.otherInc+=m.otherInc; a.net+=m.net; a.count+=m.count; return a;
  }, {collected:0,ownerCost:0,maint:0,gross:0,opex:0,otherInc:0,net:0,count:0});
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
    line('Operating expenses', T.opex, {neg:true})+
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
  $$('[data-remind-contract]',host).forEach(function(b){ b.onclick=function(){ remindContract(b.getAttribute('data-remind-contract')); }; });
  $$('[data-del-rent]',host).forEach(function(b){ b.onclick=function(){ var id=b.getAttribute('data-del-rent'); confirmDialog('Delete this payment record?', function(){ DB.rentRecords=DB.rentRecords.filter(function(r){return r.id!==id;}); save(); toast('Deleted','ok'); renderView(); var k=numKey(id,'r'); if(k) syncWrite([{action:'delete', sheet:'RentRecords', keyCol:'ID', key:k}]); }, true); }; });
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

/**
 * SABIR AMIN REAL ESTATE — Google Sheet write-back connector
 * ----------------------------------------------------------
 * This lets the web app SAVE changes back into this Google Sheet
 * (debt payments, rent, edits, new units, tasks, etc.).
 *
 * SETUP (once):
 *   1. Open your Google Sheet.
 *   2. Menu:  Extensions  ->  Apps Script.
 *   3. Delete anything there and paste ALL of this file. Save.
 *   4. Click  Deploy  ->  New deployment.
 *        - Type: Web app
 *        - Description: SARE sync
 *        - Execute as:  Me
 *        - Who has access:  Anyone
 *      Click Deploy, allow the permissions it asks for.
 *   5. Copy the "Web app URL" (ends with /exec).
 *   6. In the app:  Settings -> Two-way sync -> paste the URL -> Save -> Test.
 *
 * Keep the SECRET below and the one in the app the same.
 */
var SECRET = 'sabir-sync-2026';

/* ============================================================
   DAILY MORNING REPORT  (rent due + contracts expiring) via WhatsApp/email
   ------------------------------------------------------------
   ONE-TIME SETUP:
   1) WhatsApp (free, via CallMeBot):
        - On your phone, save this contact number: +34 621 331 709
          (if it doesn't work, get the current number from
           callmebot.com/blog/free-api-whatsapp-messages/)
        - Send it a WhatsApp message:  I allow callmebot to send me messages to chat
        - You'll receive an "apikey". Put your number + apikey below.
   2) Fill OWNER_PHONE (your number, international, digits only) and CALLMEBOT_APIKEY.
   3) (Optional) also/instead get an email: set SEND_EMAIL = true and OWNER_EMAIL.
   4) In the Apps Script editor choose the function "createDailyTrigger" and click Run
      once (approve permissions). That schedules the report ~7 AM daily.
   5) To preview the message now: select "testDigest" and Run, then View → Logs.
   ============================================================ */
var OWNER_PHONE      = '971582779984';   // your WhatsApp number, intl, digits only (no +)
var CALLMEBOT_APIKEY = '';               // paste the API key CallMeBot sends you
var SEND_WHATSAPP    = true;
var SEND_EMAIL       = false;
var OWNER_EMAIL      = '';               // e.g. info@sabirrealestate.com
var EXPIRY_DAYS      = 30;               // flag contracts expiring within N days
var ESCALATE_DAYS    = 7;                // rent later than this is reported as URGENT

function createDailyTrigger(){
  ScriptApp.getProjectTriggers().forEach(function(t){ if(t.getHandlerFunction()==='dailyDigest') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('dailyDigest').timeBased().atHour(7).nearMinute(0).everyDays(1).create();
  return 'Scheduled: daily report around 7 AM.';
}
function dailyDigest(){
  var msg = buildDigest();
  // CallMeBot sends via a URL, so keep the message within a safe length
  if (msg.length > 3200) msg = msg.substring(0, 3200) + '\n… (list truncated — open the app for the full picture)';
  if (SEND_WHATSAPP && OWNER_PHONE && CALLMEBOT_APIKEY){
    var url='https://api.callmebot.com/whatsapp.php?phone='+encodeURIComponent(OWNER_PHONE)+'&text='+encodeURIComponent(msg)+'&apikey='+encodeURIComponent(CALLMEBOT_APIKEY);
    try{ UrlFetchApp.fetch(url, {muteHttpExceptions:true}); }catch(e){}
  }
  if (SEND_EMAIL && OWNER_EMAIL){ try{ MailApp.sendEmail(OWNER_EMAIL, 'Daily Property Report', msg); }catch(e){} }
  return msg;
}
function testDigest(){ var m=buildDigest(); Logger.log(m); return m; }

function buildDigest(){
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  var now=new Date(), M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var month=now.getMonth()+1, year=now.getFullYear();
  var prevM = month===1?12:month-1, prevY = month===1?year-1:year;
  var table=_readTab(ss,'Table'), rents=_readTab(ss,'RentRecords');

  // key = unit|month|year  ->  paid
  var paid={};
  rents.forEach(function(r){ paid[String(r.StudioId).trim().toLowerCase()+'|'+_num(r.Month)+'|'+_num(r.Year)]=true; });

  var urgent=[], pending=[], carried=[], expiring=[];
  var totalDue=0, urgentAmt=0, carriedAmt=0;

  table.forEach(function(p){
    var unit=String(p.Location||'').trim(); if(!unit) return;
    var tenant=String(p.TenantName||'').trim(); if(!tenant) return;
    var rent=_num(p.TenantRent);
    var phone=String(p.TenantContact||'').replace(/[^0-9]/g,'');
    var dd=_dueDay(p.TContractFrom);

    // ---- this month ----
    if(!paid[unit.toLowerCase()+'|'+month+'|'+year]){
      totalDue+=rent;
      var dim=new Date(year,month,0).getDate();
      var due=new Date(year, month-1, Math.min(dd,dim));
      var days=Math.round((_strip(now)-_strip(due))/86400000);
      if(days>ESCALATE_DAYS){
        urgentAmt+=rent;
        urgent.push({days:days, line:'‼️ '+unit+' — '+tenant+'\n   AED '+_fmtNum(rent)+' · '+days+' DAYS LATE (due '+dd+' '+M[month-1]+')'+(phone?'\n   📞 '+phone:'')});
      } else if(days>=0){
        pending.push({days:days, line:'• '+unit+' — '+tenant+' — AED '+_fmtNum(rent)+' · '+(days===0?'due today':days+'d late')});
      } else {
        pending.push({days:days, line:'• '+unit+' — '+tenant+' — AED '+_fmtNum(rent)+' · due '+dd+' '+M[month-1]});
      }
    }
    // ---- previous month still unpaid ----
    if(!paid[unit.toLowerCase()+'|'+prevM+'|'+prevY]){
      carriedAmt+=rent;
      carried.push('🔴 '+unit+' — '+tenant+' — AED '+_fmtNum(rent)+' ('+M[prevM-1]+' '+prevY+' unpaid)');
    }
    // ---- expiring contracts ----
    var to=_parseDate(p.TContractTo);
    if(to){ var dl=Math.round((_strip(to)-_strip(now))/86400000);
      if(dl>=0 && dl<=EXPIRY_DAYS) expiring.push({dl:dl, line:'• '+unit+' — '+tenant+' — ends '+_fmtD(to)+' ('+dl+'d)'}); }
  });

  urgent.sort(function(a,b){return b.days-a.days;});
  pending.sort(function(a,b){return b.days-a.days;});
  expiring.sort(function(a,b){return a.dl-b.dl;});

  var s='🏢 SABIR AMIN REAL ESTATE\nDaily report — '+_fmtD(now)+'\n';
  s+='────────────────────\n';
  s+='Outstanding this month: AED '+_fmtNum(totalDue)+'\n';
  if(urgent.length) s+='Urgent (>'+ESCALATE_DAYS+'d late): '+urgent.length+' · AED '+_fmtNum(urgentAmt)+'\n';
  if(carried.length) s+='Carried over from '+M[prevM-1]+': '+carried.length+' · AED '+_fmtNum(carriedAmt)+'\n';

  if(urgent.length){
    s+='\n🚨 URGENT — CHASE TODAY ('+M[month-1]+' '+year+')\n'+urgent.map(function(x){return x.line;}).join('\n');
  }
  if(carried.length){
    s+='\n\n⏮️ STILL UNPAID FROM '+M[prevM-1].toUpperCase()+' '+prevY+'\n'+carried.join('\n');
  }
  s+='\n\n💰 REST OF '+M[month-1].toUpperCase()+' '+year+'\n';
  s+= pending.length ? pending.map(function(x){return x.line;}).join('\n')
    : (urgent.length? 'Nothing else outstanding.' : 'All collected ✅');

  s+='\n\n📅 CONTRACTS EXPIRING (≤'+EXPIRY_DAYS+' days)\n';
  s+= expiring.length ? expiring.map(function(x){return x.line;}).join('\n') : 'None';
  return s;
}
function _readTab(ss,name){ var sh=ss.getSheetByName(name); if(!sh) return []; var v=sh.getDataRange().getValues(); if(!v.length) return []; var h=v[0].map(function(x){return String(x).trim();}); var out=[]; for(var i=1;i<v.length;i++){ var o={}; for(var c=0;c<h.length;c++){ if(h[c]) o[h[c]]=v[i][c]; } out.push(o); } return out; }
function _num(v){ var n=parseFloat(String(v).replace(/[^0-9.\-]/g,'')); return isNaN(n)?0:n; }
function _fmtNum(n){ return Math.round(n).toLocaleString('en-US'); }
function _parseDate(v){ if(v instanceof Date) return v; var s=String(v||'').trim(); if(!s) return null; var m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/); if(m){ var y=+m[3]; if(y<100)y+=2000; return new Date(y,+m[2]-1,+m[1]); } var d=new Date(s); return isNaN(d)?null:d; }
function _strip(d){ return new Date(d.getFullYear(),d.getMonth(),d.getDate()); }
function _dueDay(v){ var d=_parseDate(v); return d?d.getDate():1; }
function _fmtD(d){ var M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return String(d.getDate()).padStart(2,'0')+'-'+M[d.getMonth()]+'-'+String(d.getFullYear()).slice(2); }

function doGet(e) {
  return json({ ok: true, msg: 'SARE sync endpoint is live' });
}

function doPost(e) {
  var out = { ok: false };
  try {
    var req = JSON.parse(e.postData.contents);
    if (SECRET && String(req.secret) !== String(SECRET)) throw new Error('Unauthorized (bad secret)');
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var writes = req.writes || [];
    if (req.action === 'ping') return json({ ok: true, msg: 'pong' });
    var results = [];
    for (var i = 0; i < writes.length; i++) results.push(handle(ss, writes[i]));
    out.ok = true;
    out.results = results;
  } catch (err) {
    out.error = String(err && err.message ? err.message : err);
  }
  return json(out);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function handle(ss, w) {
  if (w.action === 'ping') return { ok: true };
  var sh = ss.getSheetByName(w.sheet);
  if (!sh) throw new Error('Sheet tab not found: ' + w.sheet);
  var values = sh.getDataRange().getValues();
  var headers = values[0].map(function (h) { return String(h).trim(); });
  function col(name) { return headers.indexOf(name); }

  if (w.action === 'append' || w.action === 'upsert') {
    var found = -1;
    if (w.action === 'upsert' && w.keyCol && w.key !== undefined && w.key !== null && w.key !== '') {
      var ki = col(w.keyCol);
      if (ki >= 0) {
        for (var r = 1; r < values.length; r++) {
          if (String(values[r][ki]) === String(w.key)) { found = r; break; }
        }
      }
    }
    if (found >= 0) {
      var rowVals = values[found].slice();
      Object.keys(w.row || {}).forEach(function (k) {
        var ci = col(k); if (ci >= 0) rowVals[ci] = w.row[k];
      });
      sh.getRange(found + 1, 1, 1, rowVals.length).setValues([rowVals]);
      return { sheet: w.sheet, updated: found + 1, key: w.key };
    } else {
      var newRow = headers.map(function (h) { return (w.row && w.row[h] != null) ? w.row[h] : ''; });
      var newId = '';
      if (w.idCol) {
        var ci2 = col(w.idCol);
        if (ci2 >= 0 && (!w.row || w.row[w.idCol] == null || w.row[w.idCol] === '')) {
          var mx = 0;
          for (var r2 = 1; r2 < values.length; r2++) {
            var v = parseFloat(values[r2][ci2]); if (!isNaN(v) && v > mx) mx = v;
          }
          newId = mx + 1; newRow[ci2] = newId;
        }
      }
      sh.appendRow(newRow);
      return { sheet: w.sheet, appended: true, id: newId };
    }
  }

  if (w.action === 'delete') {
    var di = col(w.keyCol);
    var deleted = 0;
    if (di >= 0) {
      for (var r3 = values.length - 1; r3 >= 1; r3--) {
        if (String(values[r3][di]) === String(w.key)) { sh.deleteRow(r3 + 1); deleted++; }
      }
    }
    return { sheet: w.sheet, deleted: deleted, key: w.key };
  }

  throw new Error('Unknown action: ' + w.action);
}

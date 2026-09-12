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

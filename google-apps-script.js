// ============================================
// Google Apps Script — RSVP Backend
// ============================================
// SETUP:
// 1. Open your Google Sheet
// 2. Go to Extensions → Apps Script
// 3. Delete any existing code and paste this entire file
// 4. Click Deploy → New Deployment
// 5. Type: Web App
// 6. Execute as: Me
// 7. Who has access: Anyone
// 8. Click Deploy and copy the URL
// 9. Paste that URL into js/rsvp.js where it says GOOGLE_SCRIPT_URL
// ============================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Auto-create headers on first submission
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Full Name',
        'Email',
        'Phone',
        'Guests',
        'Guest Names',
        'Attending',
        'Events',
        'Dietary',
        'Meal Preference',
        'Shuttle',
        'Kids',
        'Kids Names',
        // Fun questions
        'Q: How Met',
        'Q: I Love You First',
        'Q: David Food',
        'Q: Shriya Sunday',
        'Q: Better Cook',
        'Q: Honeymoon Guess',
        // Final
        'Song Request',
        'Marriage Advice',
        'Side',
        'Message'
      ]);
    }

    // Handle events array → comma-separated string
    var events = data.events;
    if (Array.isArray(events)) {
      events = events.join(', ');
    }

    sheet.appendRow([
      new Date().toLocaleString(),
      data.fullName || '',
      data.email || '',
      data.phone || '',
      data.guests || '',
      data.guestNames || '',
      data.attending || '',
      events || '',
      data.dietary || '',
      data.mealPref || '',
      data.shuttle || '',
      data.kids || '',
      data.kidsNames || '',
      data.q_howMet || '',
      data.q_iLoveYou || '',
      data.q_davidFood || '',
      data.q_shriyaSunday || '',
      data.q_cook || '',
      data.q_honeymoon || '',
      data.songRequest || '',
      data.advice || '',
      data.side || '',
      data.message || ''
    ]);

    // Send email notification (optional — update the email address)
    try {
      MailApp.sendEmail({
        to: 'YOUR_EMAIL@gmail.com',  // <-- Change this to your email
        subject: 'New RSVP: ' + (data.fullName || 'Unknown'),
        body: 'New RSVP received!\n\n' +
              'Name: ' + (data.fullName || '') + '\n' +
              'Attending: ' + (data.attending || '') + '\n' +
              'Guests: ' + (data.guests || '') + '\n' +
              'Events: ' + (events || '') + '\n\n' +
              'Check your spreadsheet for full details.'
      });
    } catch (mailErr) {
      // Email notification is optional — don't fail the RSVP
    }

    // Update dashboard after each submission
    updateDashboard();

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// API: GET requests with action parameter
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'status';
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  try {
    if (action === 'status') {
      return jsonResponse({ status: 'RSVP backend is running', rows: sheet.getLastRow() });
    }

    if (action === 'read') {
      var data = sheet.getDataRange().getValues();
      return jsonResponse({ result: 'success', data: data });
    }

    if (action === 'delete') {
      var row = parseInt(e.parameter.row);
      if (!row || row < 2) return jsonResponse({ result: 'error', error: 'Invalid row (must be >= 2)' });
      sheet.deleteRow(row);
      return jsonResponse({ result: 'success', deleted: row });
    }

    if (action === 'update') {
      var row = parseInt(e.parameter.row);
      var col = parseInt(e.parameter.col);
      var value = e.parameter.value || '';
      if (!row || !col) return jsonResponse({ result: 'error', error: 'row and col required' });
      sheet.getRange(row, col).setValue(value);
      return jsonResponse({ result: 'success', updated: { row: row, col: col, value: value } });
    }

    if (action === 'clear') {
      var row = parseInt(e.parameter.row);
      if (!row || row < 2) return jsonResponse({ result: 'error', error: 'Invalid row' });
      var lastCol = sheet.getLastColumn();
      sheet.getRange(row, 1, 1, lastCol).clearContent();
      return jsonResponse({ result: 'success', cleared: row });
    }

    if (action === 'dashboard') {
      updateDashboard();
      return jsonResponse({ result: 'success', message: 'Dashboard updated' });
    }

    return jsonResponse({ result: 'error', error: 'Unknown action: ' + action });

  } catch (err) {
    return jsonResponse({ result: 'error', error: err.toString() });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// Dashboard — auto-updated summary sheet
// ============================================
function updateDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var responses = ss.getSheetByName('Sheet1') || ss.getSheets()[0];
  var data = responses.getDataRange().getValues();

  // Get or create Dashboard sheet
  var dash = ss.getSheetByName('Dashboard');
  if (!dash) {
    dash = ss.insertSheet('Dashboard');
  }
  dash.clear();

  // Skip header row
  var rows = data.slice(1);
  var total = rows.length;

  // Counts
  var attending = rows.filter(function(r) { return r[6] === 'yes'; }).length;
  var declined = rows.filter(function(r) { return r[6] === 'no'; }).length;
  var totalGuests = rows.reduce(function(sum, r) { return sum + (parseInt(r[4]) || 0); }, 0);

  // Meal counts
  var veg = rows.filter(function(r) { return r[9] === 'veg'; }).length;
  var nonveg = rows.filter(function(r) { return r[9] === 'nonveg'; }).length;
  var vegan = rows.filter(function(r) { return r[9] === 'vegan'; }).length;

  // Shuttle counts
  var shuttleYes = rows.filter(function(r) { return r[10] === 'yes'; }).length;
  var shuttleNo = rows.filter(function(r) { return r[10] === 'no'; }).length;
  var shuttleMaybe = rows.filter(function(r) { return r[10] === 'maybe'; }).length;

  // Kids
  var kidsYes = rows.filter(function(r) { return r[11] === 'yes'; }).length;

  // Side counts
  var bride = rows.filter(function(r) { return r[21] === 'bride'; }).length;
  var groom = rows.filter(function(r) { return r[21] === 'groom'; }).length;
  var both = rows.filter(function(r) { return r[21] === 'both'; }).length;

  // Event counts
  var events = { mehendi: 0, sangeet: 0, haldi: 0, ceremony: 0, reception: 0 };
  rows.forEach(function(r) {
    var ev = (r[7] || '').toString().toLowerCase();
    if (ev.indexOf('mehendi') !== -1) events.mehendi++;
    if (ev.indexOf('sangeet') !== -1) events.sangeet++;
    if (ev.indexOf('haldi') !== -1) events.haldi++;
    if (ev.indexOf('ceremony') !== -1) events.ceremony++;
    if (ev.indexOf('reception') !== -1) events.reception++;
  });

  // Song requests
  var songs = rows.filter(function(r) { return r[19] && r[19].toString().trim(); })
    .map(function(r) { return r[1] + ': ' + r[19]; });

  // Marriage advice
  var advice = rows.filter(function(r) { return r[20] && r[20].toString().trim(); })
    .map(function(r) { return r[1] + ': ' + r[20]; });

  // Write dashboard
  var output = [
    ['DAVID & SHRIYA WEDDING — RSVP DASHBOARD', ''],
    ['Last Updated', new Date().toLocaleString()],
    ['', ''],
    ['HEADCOUNT', ''],
    ['Total RSVPs', total],
    ['Attending', attending],
    ['Declined', declined],
    ['Total Guest Count', totalGuests],
    ['', ''],
    ['EVENTS', ''],
    ['Mehendi', events.mehendi],
    ['Sangeet', events.sangeet],
    ['Haldi', events.haldi],
    ['Ceremony', events.ceremony],
    ['Reception', events.reception],
    ['', ''],
    ['MEALS', ''],
    ['Vegetarian', veg],
    ['Non-Vegetarian', nonveg],
    ['Vegan', vegan],
    ['', ''],
    ['LOGISTICS', ''],
    ['Shuttle — Yes', shuttleYes],
    ['Shuttle — No', shuttleNo],
    ['Shuttle — Maybe', shuttleMaybe],
    ['Bringing Kids', kidsYes],
    ['', ''],
    ['SIDES', ''],
    ["Bride's Side", bride],
    ["Groom's Side", groom],
    ['Both', both],
    ['', '']
  ];

  // Add song requests
  output.push(['SONG REQUESTS', '']);
  if (songs.length === 0) {
    output.push(['(none yet)', '']);
  } else {
    songs.forEach(function(s) { output.push(['', s]); });
  }
  output.push(['', '']);

  // Add marriage advice
  output.push(['MARRIAGE ADVICE', '']);
  if (advice.length === 0) {
    output.push(['(none yet)', '']);
  } else {
    advice.forEach(function(a) { output.push(['', a]); });
  }

  dash.getRange(1, 1, output.length, 2).setValues(output);

  // Formatting
  dash.setColumnWidth(1, 220);
  dash.setColumnWidth(2, 400);

  // Title
  dash.getRange('A1').setFontSize(14).setFontWeight('bold');
  dash.getRange('A2:B2').setFontColor('#888888').setFontSize(9);

  // Section headers
  var sections = ['HEADCOUNT', 'EVENTS', 'MEALS', 'LOGISTICS', 'SIDES', 'SONG REQUESTS', 'MARRIAGE ADVICE'];
  for (var i = 0; i < output.length; i++) {
    if (sections.indexOf(output[i][0]) !== -1) {
      var row = i + 1;
      dash.getRange(row, 1, 1, 2)
        .setFontWeight('bold')
        .setFontSize(11)
        .setBackground('#f5f0e8')
        .setBorder(false, false, true, false, false, false, '#d4c5a9', SpreadsheetApp.BorderStyle.SOLID);
    }
  }

  // Number column right-aligned
  for (var i = 0; i < output.length; i++) {
    if (typeof output[i][1] === 'number') {
      dash.getRange(i + 1, 2).setHorizontalAlignment('center').setFontWeight('bold');
    }
  }
}

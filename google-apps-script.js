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

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Allow GET requests for testing
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'RSVP backend is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

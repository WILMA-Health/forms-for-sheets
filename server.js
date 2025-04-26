require('dotenv').config(); 
const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require('cors');



// Initialize the app
const app = express();
const port = process.env.PORT || 3000;



// Use CORS middleware to allow cross-origin requests
app.use(cors());  // This enables CORS for all routes, you can also configure it further if needed



// Middleware to parse incoming JSON
app.use(bodyParser.json());



// Google Sheets API Setup
const sheets = google.sheets('v4');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];



// Retrieve credentials from environment variables
const private_key = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');  // Replace escaped newlines
const client_email = process.env.GOOGLE_CLIENT_EMAIL;



// Create an OAuth2 client using the service account credentials
const auth = new google.auth.JWT(
  client_email,
  null,
  private_key,
  SCOPES
);



const spreadsheetId = '1OxYuAO2fUti_l6PMpJ3lFovq1hdOSyhUcJhS1UnBnaQ'; // Replace with your Google Sheets ID



// API route to handle form submission
app.post('/submit-form', async (req, res) => {
  try {

    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId,
      auth: auth,
    });
    
    // Get the first sheet's name from the response
    const sheetName = spreadsheetInfo.data.sheets[0].properties.title;
    console.log('Sheet name:', sheetName);


    // No need for auth.getClient(), just use the `auth` client directly
    const formData = req.body;



    // Prepare data to insert into Google Sheets
    const values = [
      [
        formData.userType,
        formData.fullName,
        formData.email,
        formData.phone,
        formData.subject,
        formData.message,
      ],
    ];



    // Prepare the Google Sheets API request
    const request = {
      spreadsheetId,
      range: `'${sheetName}'!A2:F`,
      valueInputOption: 'RAW',
      resource: {
        values,
      },
      auth: auth,  // Use the auth client directly here
    };

 const response = await sheets.spreadsheets.get({
        spreadsheetId,
        auth: auth,  // Use the auth client directly here
        });




    // Insert data into Google Sheets
    const appendResponse = await sheets.spreadsheets.values.append(request);



    // Respond with success
    res.status(200).json({ status: 'success', message: 'Data submitted successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'There was an error processing the request.' });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
 
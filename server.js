const express = require('express');

const { google } = require('googleapis');

const bodyParser = require('body-parser');

const fs = require('fs');
 
const app = express();

const port = process.env.PORT || 3000;
 
// Parse incoming requests as JSON

app.use(bodyParser.json());
 
// Initialize the Google Sheets API client

const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const KEYFILE = './wilma-416212-5fff7dc2814b.json'; // Replace with your service account JSON key path
 
// Load the service account credentials

const auth = new google.auth.GoogleAuth({

  keyFile: KEYFILE,

  scopes: SCOPES,

});
 
const spreadsheetId = '1OxYuAO2fUti_l6PMpJ3lFovq1hdOSyhUcJhS1UnBnaQ'; // Replace with your Google Sheet ID
 
// API endpoint to receive form data and add it to Google Sheets

app.post('/submit-form', async (req, res) => {

  try {

    const authClient = await auth.getClient();
 
    // Get form data from the request body

    const formData = req.body;
 
    // Prepare data to insert into Google Sheets

    const values = [

      [

        formData.fullName,

        formData.email,

        formData.subject,

        formData.message,

      ],

    ];
 
    const request = {

      spreadsheetId,

      range: 'Sheet1!A:D', // Adjust this range based on your Google Sheet

      valueInputOption: 'RAW',

      resource: {

        values,

      },

      auth: authClient,

    };
 
    // Append data to the Google Sheets document

    const response = await sheets.spreadsheets.values.append(request);
 
    // Respond back to the client

    res.status(200).json({ status: 'success', message: 'Data submitted successfully!' });

  } catch (error) {

    console.error('Error:', error);

    res.status(500).json({ status: 'error', message: 'There was an error processing the request.' });

  }

});
 
// Start the server

app.listen(port, () => {

  console.log(`Server is running on port ${port}`);

});

 
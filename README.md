# Google Spreadsheet API Helper

Google Spreadsheet API Helper is a Node.js package that provides a helper for simplifies the process of accessing, retrieving and updating data from Gsheet using the Gsheet API.

# Prerequesite

- Create OAuth 2.0 Google (click here)[https://support.google.com/workspacemigrate/answer/9222992?hl=en]
- Invite **iam account** to the spreadsheet you want to access

## Installation

To install the package, you can use npm:

```bash
npm install gsheet-api-helper
```

## The Basic
```js
import GoogleSheetHelper from 'GoogleSheetHelper';

const gsheet = new GoogleSheetHelper(<googleApisIss>, <googleApisPrivateKey>);
```

## Get Data From Source
```js
const response = gsheet.get(<sheetId>, <sheetName>, <range>);

console.log(response) // <-- see the response

console.log(response.values) // <-- get the values
```
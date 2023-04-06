// Define API endpoints
const endpoint = 'https://api.exchangerate.host/latest?base=USD';
const convertURL = 'https://api.exchangerate.host/convert';
const timeseriesURL = 'https://api.exchangerate.host/timeseries';

// Get references to HTML elements
const form = document.querySelector('form');
const dateInput = document.getElementById('date-input');
const ratesDisplay = document.getElementById('rates-display');

// Define API endpoints
const endpoint = 'https://api.exchangerate.host/latest?base=USD';
const convertURL = 'https://api.exchangerate.host/convert';
const timeseriesURL = 'https://api.exchangerate.host/timeseries';

// Get references to HTML elements
const form = document.querySelector('form');
const dateInput = document.getElementById('date-input');
const ratesDisplay = document.getElementById('rates-display');

// Fetch latest exchange rates and display them in a dropdown menu
fetch(endpoint)
    .then(response => response.json())
    .then(data => {
        // Get a reference to the currency dropdown menu
        const currencySelect = document.querySelector('#currency');
        // Loop through the exchange rates and add them as options to the dropdown
        for (const [currency, rate] of Object.entries(data.rates)) {
            const option = document.createElement('option');
            option.value = currency;
            option.text = currency;
            currencySelect.appendChild(option);
        }
        // Update the exchange rate display when the user selects a currency
        currencySelect.addEventListener('change', () => {
            const selectedCurrency = currencySelect.value;
            const selectedRate = data.rates[selectedCurrency];
            const rateDiv = document.querySelector('#rate');
            rateDiv.textContent = `1 USD = ${selectedRate.toFixed(4)} ${selectedCurrency}`;
        });
    })
    .catch(error => console.error(error));

// Convert currencies
function convert() {
  // Get the amount, source currency, and target currency from the user
  const amount = document.getElementById("amount").value;
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  // Construct the API URL with the user's input
  const queryURL = `${convertURL}?from=${from}&to=${to}&amount=${amount}`;
  // Fetch the conversion rate from the API and display the result
  fetch(queryURL)
    .then(response => response.json())
    .then(data => {
      const result = data.result;
      document.getElementById("result").innerHTML = `${amount} ${from} = ${result} ${to}`;
    })
    .catch(error => console.error(error));
}

/ Get historical exchange rates for a specific date
form.addEventListener('submit', e => {
  e.preventDefault();
  // Get the selected date from the date picker
  const date = dateInput.value;
  // Construct the API URL with the selected date
  fetch(`https://api.exchangerate.host/${date}`)
    .then(response => response.json())
    .then(data => {
      const rates = data.rates;
      // Create an HTML list of exchange rates for the selected date
      let ratesHTML = '<ul>';
      for (const currency in rates) {
        ratesHTML += `<li>${currency}: ${rates[currency]}</li>`;
      }
      ratesHTML += '</ul>';
      // Display the exchange rates in the HTML element
      ratesDisplay.innerHTML = `<h2>Exchange Rates for ${data.date}</h2>${ratesHTML}`;
    })
    .catch(error => console.error(error));
});

// Get time-series exchange rate data
function getRates() {
  // Get the start date and end date from the user
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const maxDays = 366;
  // Check that the start date is before the end date
  if (startDate >= endDate) {
    alert('Please select a start date before the end date.');
    return;
  }

  // Check that the time frame is no more than 366
 // Calculate the number of days between the start and end dates
 const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
 if (days > maxDays) {
   alert(`Please select a time frame of no more than ${maxDays} days.`);
   return;
 }

 // Construct the API URL with the selected start and end dates
 const apiUrl = `${timeseriesURL}?start_date=${startDate}&end_date=${endDate}&base=USD`;
 
 // Fetch data from the API endpoint
 fetch(apiUrl)
   .then(response => response.json())
   .then(data => {
     const rates = data.rates;
     let html = '<table><tr><th>Date</th><th>Rate</th></tr>';
     
     // Loop through each date and display the rate for that date
     for (const date in rates) {
       const rate = rates[date]['EUR'];
       html += `<tr><td>${date}</td><td>${rate}</td></tr>`;
     }
     
     html += '</table>';
     document.getElementById('results').innerHTML = html;
   })
   .catch(error => {
     console.error(error);
     alert('An error occurred while fetching the data.');
   });
}



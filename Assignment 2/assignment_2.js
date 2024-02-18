document.getElementById('stock-search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    var tickerSymbol = document.getElementById('search').value; // Get the ticker symbol from the form

    fetch(`api/v1/quote?ticker=${tickerSymbol}`)
        .then(response => response.json())
        .then(data => {
            if (Object.keys(data).length === 0) { // If the API call returns no data
                document.getElementById('comment').textContent = 'No record has been found';
            } else {
                // Display the results in the web page
                // This will depend on the structure of the data and how you want to display it
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
window.tabContents = {
    'stockProfile': "",
    'stockSummaryInfo': "",
    'highCharts': "",
    'stockLatestNews': ""
};
function getStockData(event) {
    event.preventDefault();
    var stock = document.getElementById('stockSearch').value;
    stock = stock.toUpperCase();

    return fetchCompanyProfile(stock).then(function(companyProfile){
        if (companyProfile) {
            console.log('Company Profile: ' + JSON.stringify(companyProfile));
            displayStockData(companyProfile);
            var stockSummaryPromise = fetchStockSummary(stock);
            var chartsPromise = fetchStockCharts(stock);
            var latestNewsPromise = fetchLatestNews(stock);

            Promise.all([stockSummaryPromise, chartsPromise, latestNewsPromise]).then(function(results) {
                console.log('Stock Summary: ' + JSON.stringify(results[0]));
                console.log('Stock Charts: ' + JSON.stringify(results[1]));
                console.log('Latest News: ' + JSON.stringify(results[2]));

                window.stockData = {
                    companyProfile: companyProfile,
                    stockSummary: results[0],
                    charts: results[1],
                    latestNews: results[2]
                };
                displayStockSummary();
                displayStockCharts();
                displayLatestNews();
            });

            return {
                companyProfile: companyProfile,
            };
        } else {
            return null;
        }
    });
}

function fetchCompanyProfile(stock) {
    return fetch('/api/stock?symbol=' + stock)
        .then(response => {
            console.log('Response: ' + response.status);
            if (response.status === 500 ) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.log(data.error);
                var errorContainer = document.getElementById('errorContainer');
                errorContainer.style.display = 'block';
                var profileContainer = document.getElementById('profileContainer');
                profileContainer.style.display = 'none';
                return null;
            } else {
                //console.log('Data: ' + JSON.stringify(data)); // JSON.stringify(data) will convert the data object to a string
                var errorContainer = document.getElementById('errorContainer');
                errorContainer.style.display = 'none';
                var profileContainer = document.getElementById('profileContainer');
                profileContainer.style.display = 'block';
                return data;
            }
        });
}

function fetchStockSummary(stock) {
    return fetch('/api/stock/summary?symbol=' + stock)
        .then(response => {
            console.log('Response: ' + response.status);
            if (response.status === 500 ) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => { 
            return data;
        });
}

function fetchStockCharts(stock) {
    return fetch('/api/stock/charts?symbol=' + stock)
        .then(response => {
            console.log('Response: ' + response.status);
            if (response.status === 500 ) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
                return data;
            }
        );
}

function fetchLatestNews(stock) {
    return fetch('/api/stock/news?symbol=' + stock)
        .then(response => {
            console.log('Response: ' + response.status);
            if (response.status === 500 ) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data;
        });
}

function displayStockData(stockData) {
    var tablinks = document.getElementsByClassName("profileInfo");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    tablinks[0].className += " active";
    var stockProfile = document.getElementById('stockProfile');
    stockProfile.innerHTML = `
    <div class="stockInfo">
        <div class="stockImage">
            <img class="stockImage" src="${stockData.logo}" alt="Stock Image">
        </div>
        <table class="stockTable">
            <tr>
                <td class="stockTable">Company Name</td>
                <td class="stockTable">${stockData.name}</td>
            </tr>
            <tr>
                <td class="stockTable">Stock Ticker Symbol</td>
                <td class="stockTable">${stockData.ticker}</td>
            </tr>
            <tr>
                <td class="stockTable">Stock Exchange Code</td>
                <td class="stockTable">${stockData.exchange}</td>
            </tr>
            <tr>
                <td class="stockTable">Company IPO Date</td>
                <td class="stockTable">${stockData.ipo}</td>
            </tr>
            <tr>
                <td class="stockTable">Category</td>
                <td class="stockTable">${stockData.finnhubIndustry}</td>
            </tr>
        </table>
    </div>`;
    tabContents['stockProfile'] = stockProfile.innerHTML;
}

function displayStockSummary() {
    console.log('Inside Stock Summary: ' + JSON.stringify(stockData.stockSummary));
    var stockSummary = document.getElementById('stockSummaryInfo');
    var timestamp = stockData.stockSummary.t;
    var date = new Date(timestamp * 1000);
    // Format the date
    var day = date.getDate();
    var month = date.toLocaleString('default', { month: 'long' }); // get the month name
    var year = date.getFullYear();

    var formattedDate = day + ' ' + month + ', ' + year;

    var arrowForChange = stockData.stockSummary.d > 0 ? 'static/img/GreenArrowUp.png' : 'static/img/RedArrowDown.png';
    var arrowForChangePercent = stockData.stockSummary.dp > 0 ? 'static/img/GreenArrowUp.png' : 'static/img/RedArrowDown.png';
    stockSummary.innerHTML = `
    <div class="stockInfo">
        <table class="stockTable">
            <tr>
                <td class="stockTable">Stock Ticker Symbol</td>
                <td class="stockTable">${stockData.companyProfile.name}</td>
            </tr>
            <tr>
                <td class="stockTable">Trading Day</td>
                <td class="stockTable">${formattedDate}</td>
            </tr>
            <tr>
                <td class="stockTable">Previous Closing Price</td>
                <td class="stockTable">${stockData.stockSummary.pc}</td>
            </tr>
            <tr>
                <td class="stockTable">Opening Price</td>
                <td class="stockTable">${stockData.stockSummary.o}</td>
            </tr>
            <tr>
                <td class="stockTable">High Price</td>
                <td class="stockTable">${stockData.stockSummary.h}</td>
            </tr>
            <tr>
                <td class="stockTable">Low Price</td>
                <td class="stockTable">${stockData.stockSummary.l}</td>
            </tr>
            <tr>
                <td class="stockTable">Change</td>
                <td class="stockTable">${stockData.stockSummary.d} <img class="arrow" src="${arrowForChange}" alt="Down"></td>
            </tr>
            <tr>
                <td class="stockTable">Change Percent</td>
                <td class="stockTable">${stockData.stockSummary.dp} <img class="arrow" src="${arrowForChangePercent}" alt="Up"></td>
            </tr>
        </table>    
    </div>
    <div class="stockRecommend">
        <table class="sellBuy">
            <tr>
                <td style="color: #ff0000" >Strong<br>Sell</td>
                <td style="background-color: #ff0000">4</td>
                <td style="background-color: #a54848">4</td>
                <td style="background-color: #6a8037;">20</td>
                <td style="background-color: #36c054;">15</td>
                <td style="background-color: #00ff26;">7</td>
                <td style="color: #00ff26;">Strong<br>Buy</td>
            </tr>
        </table>
    </div>
    <div style="text-align: center">Recommendation Trends</div>`;
    tabContents['stockSummaryInfo'] = stockSummary.innerHTML;
}

// function displayStockCharts(charts) {}

function displayLatestNews(latestNews) {
    var stockLatestNews = document.getElementById('stockLatestNews');
    var news = stockData.latestNews.slice(0,5);
    var html = '';
    html = `
    <div class=\"newsInfo\"> 
        <table class=\"newsTable\">`;
        for (var i = 0; i < news.length; i++) {
            var newsItem = news[i];
            var timestamp = newsItem.datetime;
            var date = new Date(timestamp * 1000);
            // Format the date
            var day = date.getDate();
            var month = date.toLocaleString('default', { month: 'long' }); // get the month name
            var year = date.getFullYear();
            var formattedDate = day + ' ' + month + ', ' + year;
            html += `
            <tr class="newsRow"> 
                <td class="newsImgCol"><img class="newsImage" src="${newsItem.image}"></td>
                <td class="newsContent">
                    <p class="newsTitle">${newsItem.headline}</p>
                    <p class="newsDate">${formattedDate}</p>
                    <p class="linkPost"><a href="${newsItem.url}">See Original Post</a></p>
                </td>
            </tr>`;
        }
        html += `
        </table>    
    </div>`;
    stockLatestNews.innerHTML = html;
    tabContents['stockLatestNews'] = stockLatestNews.innerHTML;
}

function openTab(evt, tabName) {

    // Get all elements with class="tabcontent" and hide them
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tab" and remove the class "active"
    var tablinks = document.getElementsByClassName("profileInfo");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Set the innerHTML of the current tab to its content, show it, and add an "active" class to the button that opened the tab
    var currentTab = document.getElementById(tabName);
    currentTab.innerHTML = tabContents[tabName];
    currentTab.style.display = "block";
    evt.currentTarget.className += " active";
}
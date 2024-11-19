window.onload = function() {
    var stockSearch = document.getElementById('stockSearch');
    stockSearch.value = '';
    var errorContainer = document.getElementById('errorContainer');
    errorContainer.style.display = 'none';
    var profileContainer = document.getElementById('profileContainer');
    profileContainer.style.display = 'none';
};
window.tabContents = {
    'stockProfile': "",
    'stockSummaryInfo': "",
    'highStockChart': "",
    'stockLatestNews': ""
};
function getStockData(event) {
    event.preventDefault();
    var stock = document.getElementById('stockSearch').value;
    stock = stock.toUpperCase();

    return fetchCompanyProfile(stock).then(function(companyProfile){
        if (companyProfile) {
            displayStockData(companyProfile);
            var stockSummaryPromise = fetchStockSummary(stock);
            var stockRecommendationPromise = fetchStockRecommendation(stock);
            var chartsPromise = fetchStockCharts(stock);
            var latestNewsPromise = fetchLatestNews(stock);

            Promise.all([stockSummaryPromise, stockRecommendationPromise, chartsPromise, latestNewsPromise]).then(function(results) {

                window.stockData = {
                    companyProfile: companyProfile,
                    stockSummary: results[0],
                    stockRecommendation: results[1],
                    charts: results[2],
                    latestNews: results[3]
                };
                displayStockSummary();
                displayStockCharts();
                displayLatestNews();
            });

            return {
                companyProfile: companyProfile
            };
        } else {
            return null;
        }
    });
}

function fetchCompanyProfile(stock) {
    return fetch('/api/stock?symbol=' + stock)
        .then(response => {
            if (response.status === 500 ) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                var errorContainer = document.getElementById('errorContainer');
                errorContainer.style.display = 'block';
                var profileContainer = document.getElementById('profileContainer');
                profileContainer.style.display = 'none';
                return null;
            } else {
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
            if (response.status === 500 ) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => { 
            return data;
        });
}

function fetchStockRecommendation(stock) {
    return fetch('/api/stock/recommendation?symbol=' + stock)
        .then(response => {
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

    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

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
    var companyProfile = document.getElementById('stockProfile');
    companyProfile.style.display = "block";
}

function displayStockSummary() {
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
                <td style="background-color: #ff0000">${stockData.stockRecommendation[0].strongSell}</td>
                <td style="background-color: #a54848">${stockData.stockRecommendation[0].sell}</td>
                <td style="background-color: #6a8037;">${stockData.stockRecommendation[0].hold}</td>
                <td style="background-color: #36c054;">${stockData.stockRecommendation[0].buy}</td>
                <td style="background-color: #00ff26;">${stockData.stockRecommendation[0].strongBuy}</td>
                <td style="color: #00ff26;">Strong<br>Buy</td>
            </tr>
        </table>
    </div>
    <div style="text-align: center" class="recommendation">Recommendation Trends</div>`;
    tabContents['stockSummaryInfo'] = stockSummary.innerHTML;
}

async function displayStockCharts() {
    var container = document.getElementById('highStockChart');
    var data = stockData.charts.results.map(obj => [obj.t, obj.c, obj.v]);
    const stockPriceArea = [],
    volume = [],
    dataLength = stockData.charts.results.length
    var date = new Date();
    var date = date.getFullYear() + '-' + 
                    String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(date.getDate()).padStart(2, '0');
    var maximumVol = Math.max(...data.map(obj => obj[2]));
    for (let i = 0; i < dataLength; i += 1) {
        stockPriceArea.push([
            data[i][0],
            data[i][1]
        ]);

        volume.push([
            data[i][0], // the date
            data[i][2] // the volume
        ]);
    }

    // create the chart
    Highcharts.stockChart(container, {

        rangeSelector: {
            inputEnabled: false,
            buttons: [{
                type: 'day',
                count: 7,
                text: '7d',
                enabled: true
            }, {
                type: 'day',
                count: 15,
                text: '15d',
                enabled: true
            }, {
                type: 'month',
                count: 1,
                text: '1m',
                enabled: true
            }, {
                type: 'month',
                count: 3,
                text: '3m',
                enabled: true
            }, {
                type: 'month',
                count: 6,
                text: '6m',
                enabled: true
            }]
        },

        title: {
            text: 'Stock Price ' + stockData.companyProfile.ticker + ' ' + date,
        },

        subtitle: {
            text: '<a href="https://polygon.io/" target="__ ">Source: Polygon.io</a>',
            useHTML: true
        },

        navigator: {
            series: {
                accessibility: {
                    exposeAsGroupOnly: true
                }
            }
        },

        xAxis: {
            type: 'datetime'
        },

        plotOptions: {
            series: {
                pointWidth: 4,
                pointPlacement: 'on'
            }
        },

        yAxis: [{
            labels: {
                format: '{value}'
            },
            title: {
                text: 'Stock Price'
            },
            opposite: false,
        }, {
            title: {
                text: 'Volume',
            },
            opposite: true,
            min: 0,
            max: 2*maximumVol
        }],

        series: [{
            name: 'Stock Price',
            type: 'area',
            data: stockPriceArea,
            yAxis: 0,
            threshold: null,
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
            tooltip: {
                valueDecimals: 2
            }
        }, {
            name: 'Volume',
            data: volume,
            type: 'column',
            yAxis: 1,
            color: 'black',
        }]
    });
} 

function displayLatestNews() {
    var stockLatestNews = document.getElementById('stockLatestNews');
    //var news = stockData.latestNews.slice(0,5);
    var news = [];
    var item = stockData.latestNews.length > 5 ? 5 : stockData.latestNews.length;
    var counter = 0;
    while (item > 0) {
        if (stockData.latestNews[counter].headline !== "" && stockData.latestNews[counter].image !== "" && stockData.latestNews[counter].url !== "" && stockData.latestNews[counter].datetime !== "") {
            news.push(stockData.latestNews[counter]);
            item--;
        }
        counter++;
    }
    var html = '';
    html = `
    <div class=\"newsInfo\"> 
        <table class=\"newsTable\">`;
        for (var i = 0; i < news.length; i++) {
            var newsItem = news[i];
            var timestamp = newsItem.datetime;
            var date = new Date(timestamp * 1000);
            // Format the date
            var day = String(date.getDate()).padStart(2, '0');
            var month = date.toLocaleString('default', { month: 'long' }); // get the month name
            var year = date.getFullYear();
            var formattedDate = day + ' ' + month + ', ' + year;
            html += `
            <tr class="newsRow"> 
                <td class="newsImgCol"><img class="newsImage" src="${newsItem.image}"></td>
                <td class="newsContent">
                    <p class="newsTitle">${newsItem.headline}</p>
                    <p class="newsDate">${formattedDate}</p>
                    <p class="linkPost"><a href="${newsItem.url}" target="__ ">See Original Post</a></p>
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
    if (tabName === 'highStockChart') {
        displayStockCharts();
    }
}

function remove(event) {
    event.preventDefault();
    var errorContainer = document.getElementById('errorContainer');
    errorContainer.style.display = 'none';
    var profileContainer = document.getElementById('profileContainer');
    profileContainer.style.display = 'none';
    var stockProfile = document.getElementById('stockProfile');
    stockProfile.innerHTML = '';
    var stockSummary = document.getElementById('stockSummaryInfo');
    stockSummary.innerHTML = '';
    var highStockChart = document.getElementById('highStockChart');
    highStockChart.innerHTML = '';
    var stockLatestNews = document.getElementById('stockLatestNews');
    stockLatestNews.innerHTML = '';
    var stockSearch = document.getElementById('stockSearch');
    stockSearch.value = '';
}
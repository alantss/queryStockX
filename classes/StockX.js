const request = require('request');

exports.getProductHandle = function getProductHandle(searchQuery) {
    var options = {
        uri: 'https://xw7sbct9v6-dsn.algolia.net/1/indexes/products/query',
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/x-www-form-urlencoded',
            origin: 'https://stockx.com',
            referer: 'https://stockx.com/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
        },
        qs: {
            'x-algolia-agent': 'Algolia for vanilla JavaScript 3.32.1',
            'x-algolia-application-id': 'XW7SBCT9V6',
            'x-algolia-api-key': '6bfb5abee4dcd8cea8f0ca1ca085c2b3'
        },
        json: {
            params: `query=${searchQuery}&facets=*&filters=`
        }
    }

    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (body.hits.length == 0) {
                reject('No products matching query found!');
            } else {
                resolve(body.hits[0].url)
            }
        });
    });
}

exports.parseProductData = function parseProductData(productHandle, productSize) {
    var options = {
        uri: `https://stockx.com/api/products/${productHandle}`,
        method: 'GET',
        headers: {
            accept: '*/*',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            appos: 'web',
            appversion: '0.1',
            'jwt-authorization': false,
            referer: `https://stockx.com/${productHandle}`,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest'
        },
        qs: {
            includes: 'market,360',
            currency: 'USD'
        }
    }

    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            var jsonData = JSON.parse(body);
            var productData = jsonData.Product;

            // Non-size specific query response.
            if (productSize == "N/A") {
                resolve({
                    'attachments': [{
                        'color': '#3fae2a',
                        'title': productData.shoe,
                        'title_link': `https://stockx.com/${productData.urlKey}`,
                        'thumb_url': productData.media.thumbUrl,
                        'fields': [{
                                'title': 'Retail Price',
                                'value': `$${productData.retailPrice}`,
                                'short': true
                            },
                            {
                                'title': '# Sales (72 Hrs)',
                                'value': productData.market.salesLast72Hours,
                                'short': true
                            },
                            {
                                'title': 'Last Sale | Size',
                                'value': `$${productData.market.lastSale} | US ${productData.market.lastSaleSize}`,
                                'short': true
                            },
                            {
                                'title': 'Highest Bid | Size',
                                'value': `$${productData.market.highestBid} | US ${productData.market.highestBidSize}`,
                                'short': true
                            },
                            {
                                'title': 'Avg. DS Price',
                                'value': `$${productData.market.averageDeadstockPrice}`,
                                'short': true
                            }
                        ],
                        'footer_icon': 'https://stockx-assets.imgix.net/logo/favicon.ico',
                        'footer': 'StockX Check | Dollar values are in USD.'
                    }]
                });
            }

            // Size specific query response.
            for (var uuid in productData.children) {
                if (productData.children[uuid].shoeSize == productSize) {
                    var sizeData = productData.children[uuid];
                    resolve({
                        'attachments': [{
                            'color': '#3fae2a',
                            'title': `${productData.shoe} | SPECIFIC: US ${sizeData.shoeSize}`,
                            'title_link': `https://stockx.com/${productData.urlKey}`,
                            'thumb_url': productData.media.thumbUrl,
                            'fields': [{
                                    'title': 'Retail Price',
                                    'value': `$${productData.retailPrice}`,
                                    'short': true
                                },
                                {
                                    'title': 'Avg. DS Price',
                                    'value': `$${sizeData.market.averageDeadstockPrice}`,
                                    'short': true
                                },
                                {
                                    'title': '# Sales (72 Hrs)',
                                    'value': `${sizeData.market.salesLast72Hours}`,
                                    'short': true
                                },
                                {
                                    'title': 'Ask : Bid Ratio',
                                    'value': `${sizeData.market.numberOfAsks} : ${sizeData.market.numberOfBids}`,
                                    'short': true
                                },
                                {
                                    'title': 'Last Sale',
                                    'value': `$${sizeData.market.lastSale}`,
                                    'short': true
                                },
                                {
                                    'title': 'Highest Bid',
                                    'value': `$${sizeData.market.averageDeadstockPrice}`,
                                    'short': true
                                }
                            ],
                            'footer_icon': 'https://stockx-assets.imgix.net/logo/favicon.ico',
                            'footer': 'StockX Check | Dollar values are in USD.'
                        }]
                    });
                }
            }

            reject("Unable to parse item! Clothing items are hit and miss at the moment OR size may not exist.")
        });
    });
}
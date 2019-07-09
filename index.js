const StockX = require('./classes/StockX.js');

function parseQuery(event) {
    if (event.text.includes('size')) {
        return {
            'text': event.text.split('size')[0].trim(),
            'size': event.text.split('size')[1].trim()
        }
    } else {
        return {
            'text': event.text.trim(),
            'size': 'N/A'
        }
    }
};

// AWS Lambda entry point.
exports.handler = async (event, context) => {
    var queryData = parseQuery(event);
    var productHandle = await StockX.getProductHandle(queryData.text);
    var slackPayload = await StockX.parseProductData(productHandle, queryData.size);
    return slackPayload;
};
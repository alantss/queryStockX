# queryStockX
Query StockX for a particular item all from within the comfort of Slack using slash commands.

## Description
After a Slack slash command has been created and setup for the given workspace, members of the workspace are able to query the StockX platform for a particular item all from within the comfort of Slack. This project utilises services such as **AWS Lambda** and **AWS API Gateway** in order to provide a serverless implementation of a RESTful API.

## Usage
Members of the workspace are able to query for general information of the product or can request size specific information relating to sales, bids and asks.

**Non-Size Specific Query**
>/price yeezy boost 350

**Size Specific Query**
>/price yeezy boost 350 size 10

## What I Learnt?
- Creating RESTful APIs using AWS API Gateway.
- Working with AWS Lambda for serverless query handling.
- Asynchronous code execution with NodeJS.

# Azure-Log-Analytics-Node-Function
Azure Function written in node.js for Azure Log Analytics

This Function uses the Log Analytics Data Collector rest API:

https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-data-collector-api

## Installation
1. Create a new Azure Function of type "HttpTrigger-JavaScript" and paste the code from index.js in this repository into the index.js in the Function, overwriting everything that is in the default Function template.

### Dependencies
None, request and crypto are default node.js libraries.

## Execution
Make a POST to the Azure Function URL with a body that follows this signature:

```
{
"type":"<Log-Type>",
"credentials":{
  "workspaceId":"xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "sharedKey":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
},
"logEntry": <JSON object or array of JSON objects>
}
```

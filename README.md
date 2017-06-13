# Azure-Log-Analytics-Node-Function
Azure Function written in node.js for Azure Log Analytics

This Function uses the Log Analytics Data Collector rest API:

https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-data-collector-api

## Installation
1. Create a new Azure Function of type "HttpTrigger-JavaScript" and paste the code from index.js in this repository into the index.js in the Function, overwriting everything that is in the default Function template.

2. Replace the workspaceId and sharedKey variables at the top with values from your Azure Log Analytics instance

## Execution
The Function expects a body that looks like this:

```
{
  "type": "<insert log type here>",
  "log-entry: { <JSON object that you want to write to the Azure Log Analysis service> }
}
```

Optionally you can include a "time-generated" property if you'd like the Log Analysis Service to use a set time instead of the time that is auto-generated on their server.

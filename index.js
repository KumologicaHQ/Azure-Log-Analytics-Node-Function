module.exports = function (context, req) {

    context.log('Azure Log Analysis Data Collector Function received a request');

    // required node.js libraries
    var request = require('request');
    var crypto = require('crypto');

    // Azure Log Analysis credentials
    // var workspaceId = 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    // var sharedKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

    var workspaceId = req.body.credentials.workspaceId;
    var sharedKey = req.body.credentials.sharedKey;

    var apiVersion = '2016-04-01';
    var processingDate = new Date().toUTCString();

    var body = JSON.stringify(req.body.logEntry);

    context.log('Body is ' + body);

    var contentLength = Buffer.byteLength(body, 'utf8');

    var stringToSign = 'POST\n' + contentLength + '\napplication/json\nx-ms-date:' + processingDate + '\n/api/logs';
    var signature = crypto.createHmac('sha256', new Buffer(sharedKey, 'base64')).update(stringToSign, 'utf-8').digest('base64');
    var authorization = 'SharedKey ' + workspaceId + ':' + signature;

    var headers = {
        "content-type": "application/json", 
        "Authorization": authorization,
        "Log-Type": req.body.type,
        "x-ms-date": processingDate
    };

    context.log( 'Request Headers: ' + JSON.stringify(headers) );

    var url = 'https://' + workspaceId + '.ods.opinsights.azure.com/api/logs?api-version=' + apiVersion;

    request.post({url: url, headers: headers, body: body}, function (error, response, body) {
        
        context.log('error:', error); 
        context.log('statusCode:', response && response.statusCode); 
        context.log('body:', body);

        context.res = { 'status': response.statusCode, 'body': body }
        context.done();

    });


};

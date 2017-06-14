module.exports = function (context, req) {

    context.log('Azure Log Analysis Data Collector Function received a request');

    // required node.js libraries
    var https = require('https');
    var crypto = require('crypto');

    // Azure Log Analysis credentials
    var workspaceId = 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    var sharedKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

    var apiVersion = '2016-04-01';
    var processingDate = new Date().toUTCString();

    // *****************************************************
    // step one - build authorization signature

    var contentLength = Buffer.byteLength(req.body['log-entry'], 'utf8');

    var authorization = 'POST\n' + contentLength + '\napplication/json\nx-ms-date:' + processingDate + '\n/api/logs';

    // encode string using Base64(HMAC-SHA256(UTF8(StringToSign)))
    authorization = crypto.createHmac('sha256', new Buffer(sharedKey, 'base64')).update(authorization, 'utf-8').digest('base64');
    authorization = 'SharedKey ' + workspaceId + ':' + authorization;
    
    // *****************************************************
    // step two - build request headers

    var headers = {
        "content-type": "application/json", 
        "Accept": "application/json",
        "x-ms-date": processingDate,
        "Authorization": authorization
    };

    // add Log-Type and (optionally) Time-Generated
    if( req.body.type != undefined ) {
        headers['Log-Type'] = req.body.type;
    } else {
        headers['Log-Type'] = 'No Type';
    }

    if( req.body.time != undefined ) {
        headers['time-generated-field'] = req.body['time-generated'];
    }

    // *****************************************************
    // step three - send request

    var options = {
        "hostname": workspaceId + '.ods.opinsights.azure.com',
        "path": '/api/logs?api-version=' + apiVersion,
        "port": 443,
        "method": 'POST',
        "headers": headers,
        "body": req.body['log-entry']
    };

    context.log('Request Options:\n' + JSON.stringify(options, null, 2));

    var req = https.request(options, (res) => {
    
        context.log('Reponse Status Code:', res.statusCode);

        res.on('data', (data) => {
            context.res = { status: res.statusCode, body: data }
            context.done();
        });

    });

    req.on('error', (err) => {
        context.log('https error: ' + err);
        context.res = { status: 500, body: data }
        context.done();
    });
    req.end();    

};

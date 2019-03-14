var config = require('./config');
var AWS = require('aws-sdk');
var os = require('os');
var util = require('util');

var port_num = [80,53,3389]
var port_result = new Array(0);

var childProcess = require('child_process');
for (var i = 0;i < port_num.length; i++){
    port_result[i] = childProcess.spawn(config.zabbix_get, ['-s', '127.0.0.1', '-k', 'net.tcp.listen[' + port_num[i] + ']' ]);
}

var date = new Date();
var cloudwatch = new AWS.CloudWatch({
  accessKeyId: config.accesskey,
  secretAccessKey: config.secretkey,
  region: 'ap-northeast-1'
});

var getDivision = function(unit) {
  var division = 1;

  if (unit == "Bytes/Second") {
    division = 1;
  } else if (unit == "Kilobytes/Second" || unit == "Kilobytes") {
    division = 1024;
  } else if (unit == "Megabytes/Second" || unit == "Megabytes") {
    division = 1048576;
  } else if (unit == "Gigabytes/Second" || unit == "Gigabytes") {
    division = 1073741824;
  }

  return division;
}

var putCloudWatch = function(resultPerf, label, unit) {

  var division = getDivision(unit);

  resultPerf.stdout.on('data', function(data) {
    if (data) {

      var value = Math.floor(data.toString('utf8').replace(/\r?\n/g, "") / division * 100) / 100;
      if (!isFinite(value)) {
        console.log("[" + date.toISOString() + "] an error occured: " + label + " " + value);
      }

      var cloudwatchParams = {
        MetricData: [{
          MetricName: label,
          Dimensions: [{
            Name: 'Hostname',
            Value: os.hostname()
          },
          {
            Name: 'Domain',
            Value: config.domain
          }],
          Unit: unit,
          Value: value
        }, ],
        Namespace: 'Windows System'
      };

      cloudwatch.putMetricData(cloudwatchParams, function(err, data) {
        if (err) {
          console.log("[" + date.toISOString() + "]" + err, err.stack); // an error occurred
        } else {
          console.log(data); // successful response
        }
      });
    }
  });

  resultPerf.stderr.on('data', function(data) {
    var value = data.toString('utf8').replace(/\r?\n/g, "");
    if (data) {
      console.error("[" + date.toISOString() + "] an error occured: " + label + " " + value);
    }
  });

}

var outputPerf = function(resultPerf, label, unit) {
  var division = getDivision(unit);
  resultPerf.stdout.on('data', function(data) {
    if (data) {
      var value = Math.floor(data.toString('utf8').replace(/\r?\n/g, "") / division * 100) / 100;
      console.log(label + ": " + value + " " + unit);
    }
  });

  resultPerf.stderr.on('data', function(data) {
    if (data) {
      var value = data.toString('utf8').replace(/\r?\n/g, "");
      console.error("[" + date.toISOString() + "] an error occured: " + label + " " + value);
    }
  });

}

if (process.argv.length > 2 && process.argv[2] == "debug") {
    for (var i = 0;i < port_num.length; i++){
        outputPerf(port_result[i], 'port num='+port_num[i], 'Count');
    }
} else {
    for (var i = 0;i < port_num.length; i++){
        putCloudWatch(port_result[i], 'port num='+port_num[i], 'Count');
    }
}

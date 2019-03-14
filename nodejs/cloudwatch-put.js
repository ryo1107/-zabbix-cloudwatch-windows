var perfDiskRead = "\\LogicalDisk(C:)\\Disk Read Bytes/sec";
var perfDiskWrite = "\\LogicalDisk(C:)\\Disk Write Bytes/sec";
var perfNetworkReceive = "\\Network Interface(*)\\Bytes Received/sec";
var perfNetworkSent = "\\Network Interface(*)\\Bytes Sent/sec";
var vmMemorySize = "vm.memory.size[available]";
var systemSwapSize = "system.swap.size[,used]";
var cpuUsage = "system.cpu.util[,system,avg5]";
var vfsFsSize = "vfs.fs.size[C:,pused]";
var agentPing = "agent.ping";

var config = require('./config');
var AWS = require('aws-sdk');
var os = require('os');
var util = require('util');

var childProcess = require('child_process');
var resultDiskRead = childProcess.spawn(config.zabbix_get, ['-s', '127.0.0.1', '-k', 'perf_counter[' + perfDiskRead + ']']);
var resultDiskWrite = childProcess.spawn(config.zabbix_get, ['-s', '127.0.0.1', '-k', 'perf_counter[' + perfDiskWrite + ']']);
var resultNetworkReceive = childProcess.spawn(config.zabbix_get, ['-s', '127.0.0.1', '-k', 'perf_counter[' + perfNetworkReceive + ']']);
var resultNetworkSent = childProcess.spawn(config.zabbix_get, ['-s', '127.0.0.1', '-k', 'perf_counter[' + perfNetworkSent + ']']);
var resultAvailableMemory = childProcess.spawn(config.zabbix_get, ['-s', '127.0.0.1', '-k', vmMemorySize]);
var resultSwapSize = childProcess.spawn(config.zabbix_get, ['-s', '127.0.0.1', '-k', systemSwapSize]);
var resultCpuUsage = childProcess.spawn(config.zabbix_get, ['-s', '127.0.0.1', '-k', cpuUsage]);
var resultDiskUsage = childProcess.spawn(config.zabbix_get, ['-s', '127.0.0.1', '-k', vfsFsSize]);
var resultAgentPing = childProcess.spawn(config.zabbix_get, ['-s', '127.0.0.1', '-k', agentPing]);

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
  outputPerf(resultDiskRead, 'DiskRead', 'Kilobytes/Second');
  outputPerf(resultDiskWrite, 'DiskWrite', 'Kilobytes/Second');
  outputPerf(resultNetworkReceive, 'NetworkReceive', 'Kilobytes/Second');
  outputPerf(resultNetworkSent, 'NetworkSent', 'Kilobytes/Second');
  outputPerf(resultAvailableMemory, 'AvailableMemory', 'Megabytes');
  outputPerf(resultSwapSize, 'SwapSize', 'Megabytes');
  outputPerf(resultCpuUsage, 'CPUUtilization', 'Percent');
  outputPerf(resultDiskUsage, 'DiskUsage', 'Percent');
  outputPerf(resultAgentPing, 'AgentPing', 'Count');
} else {
  putCloudWatch(resultDiskRead, 'DiskRead', 'Kilobytes/Second');
  putCloudWatch(resultDiskWrite, 'DiskWrite', 'Kilobytes/Second');
  putCloudWatch(resultNetworkReceive, 'NetworkReceive', 'Kilobytes/Second');
  putCloudWatch(resultNetworkSent, 'NetworkSent', 'Kilobytes/Second');
  putCloudWatch(resultAvailableMemory, 'AvailableMemory', 'Megabytes');
  putCloudWatch(resultSwapSize, 'SwapSize', 'Megabytes');
  putCloudWatch(resultCpuUsage, 'CPUUtilization', 'Percent');
  putCloudWatch(resultDiskUsage, 'DiskUsage', 'Percent');
  putCloudWatch(resultAgentPing, 'AgentPing', 'Count');
}

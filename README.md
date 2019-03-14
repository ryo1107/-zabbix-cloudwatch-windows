# setup

```
cd C:\
git clone https://aimluck-develop@bitbucket.org/aimluck-develop/aimluck-cloudwatch-windows-port.git
```

## zabbix_agent

download latest zabbix_agent from http://www.zabbix.com/jp/download.php

```
unzip to C:\aimluck-cloudwatch-windows-port\zabbix_agent
```

copy template\conf to zabbix_agent

### install zabbix agent service

```
run C:\aimluck-cloudwatch-windows-port\zabbix_agent\batch\install_zabbix_agent_service.bat
```

* if you use Windows_x86, edit install_zabbix_agent_service.bat, uninstall_zabbix_agent_service.bat
* if you use Windows 2008 R2 or later, you needs administrator role to execute batch

```
set AGENT="C:\aimluck-cloudwatch-windows-port\zabbix_agent\bin\win64\zabbix_agentd.exe"
Ť
set AGENT="C:\aimluck-cloudwatch-windows-port\zabbix_agent\bin\win32\zabbix_agentd.exe"
```

### start zabbix agent

```
run C:\aimluck-cloudwatch-windows-port\zabbix_agent\batch\start_zabbix_agent_service.bat
```

please settings auto start in Service and Applications

## nodejs

get nodejs from official or http://nodejs.org/dist/

* if you can't execute msi , unlock network application blocks

copy config.js.sample to config.js

edit config.js

```
accesskey: ___accesskey____, 
secretkey: ___secretkey____,
zabbix_get: "C:\\aimluck-cloudwatch-windows-port\\zabbix_agent\\bin\\win64\\zabbix_get.exe";
```

install modules

```
cd C:\aimluck-cloudwatch-windows-port\nodejs
npm install aws-sdk
```

### test

run test

```
node C:\aimluck-cloudwatch-windows-port\nodejs\cloudwatch-put.js debug
```

check display data 

plot test

```
node C:\aimluck-cloudwatch-windows-port\nodejs\cloudwatch-put.js >> C:\aimluck-cloudwatch-windows\nodejs\cloudwatch-put.log 2>&1
```

```
* if network sent and receive value is 0, please type [ typeperf -qx "\Network Interface" ] in cmd.
  choose a "Network Interface" in the display, ex: Intel[R] PRO_1000 MT Desktop Adapter.
  and edit cloudwatch-put.js
  ---
  Network Interface(*)
  Ť
  Network Interface(Intel[R] PRO_1000 MT Desktop Adapter)
  ---

  more debug
  typeperf "\Network Interface(*)\Bytes Received/sec"
  typeperf "\Network Interface(*)\Bytes Sent/sec"
```

check cloudwatch

## register scheduler

run per 5 miniute

start menu > accessory > system tool > task
add scheduled task

```
schedule_type: daily
start_time: any
duration: per one day
detail > 
  start day: today
  end day: none
  repeat: on >
    duration: 5 minute
    duration_term: 24 hour
```

C:\aimluck-cloudwatch-windows-port\nodejs\cloudwatch-put.vbs
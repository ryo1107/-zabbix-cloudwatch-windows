# setup

```
cd C:\
git clone https://github.com/ryo1107/zabbix-cloudwatch-windows.git
```

## zabbix_agent

download latest zabbix_agent from http://www.zabbix.com/jp/download.php

```
unzip to C:\zabbix-cloudwatch-windows\zabbix_agent
```

copy template\conf to zabbix_agent

### install zabbix agent service

```
run C:\zabbix-cloudwatch-windows\zabbix_agent\batch\install_zabbix_agent_service.bat
```

* if you use Windows_x86, edit install_zabbix_agent_service.bat, uninstall_zabbix_agent_service.bat
* if you use Windows 2008 R2 or later, you needs administrator role to execute batch

```
set AGENT="C:\zabbix-cloudwatch-windows\zabbix_agent\bin\win64\zabbix_agentd.exe"

set AGENT="C:\aimluck-cloudwatch-windows\zabbix_agent\bin\win32\zabbix_agentd.exe"
```

### start zabbix agent

```
run C:\zabbix-cloudwatch-windows\zabbix_agent\batch\start_zabbix_agent_service.bat
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
zabbix_get: "C:\\zabbix-cloudwatch-windows\\zabbix_agent\\bin\\win64\\zabbix_get.exe";
```

install modules

```
cd C:\zabbix-cloudwatch-windows\nodejs
npm install aws-sdk
```

### test cloudwatch-put.js

run test

```
node C:\zabbix-cloudwatch-windows\nodejs\cloudwatch-put.js debug
```

check display data 

plot test

```
node C:\zabbix-cloudwatch-windows\nodejs\cloudwatch-put.js >> C:\zabbix-cloudwatch-windows\nodejs\cloudwatch-put.log 2>&1
```

check cloudwatch

### test cloudwatch-server.js

Please change port_num if necessary

run test

```
node C:\zabbix-cloudwatch-windows\nodejs\cloudwatch-server.js debug
```

check display data 

```
port num=80: 0 Count
port num=53: 0 Count
port num=3389: 1 Count
```

plot test

```
node C:\zabbix-cloudwatch-windows\nodejs\cloudwatch-server.js >> C:\zabbix-cloudwatch-windows\nodejs\cloudwatch-server.log 2>&1
```

check cloudwatch

## register scheduler

run per 5 miniute

start menu > accessory > system tool > task
add scheduled task

C:\zabbix-cloudwatch-windows-port\nodejs\cloudwatch-put.vbs

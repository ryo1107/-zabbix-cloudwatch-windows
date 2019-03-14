@echo off

rem
rem run nodejs
rem

node C:\zabbix-cloudwatch-windows\nodejs\cloudwatch-put.js >> C:\zabbix-cloudwatch-windows\nodejs\cloudwatch-put.log 2>&1
node C:\zabbix-cloudwatch-windows\nodejs\cloudwatch-server.js >> C:\zabbix-cloudwatch-windows\nodejs\cloudwatch-server.log 2>&1
@echo off

rem
rem install zabbix agent serice
rem

rem �ݒ�
set CONF="C:\zabbix-cloudwatch-windows\zabbix_agent\conf\zabbix_agentd.win.conf"
set AGENT="C:\zabbix-cloudwatch-windows\zabbix_agent\bin\win64\zabbix_agentd.exe"

%AGENT% -c %CONF% -i
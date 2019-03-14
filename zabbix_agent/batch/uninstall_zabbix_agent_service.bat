@echo off

rem
rem uninstall zabbix agent service
rem

rem �ݒ�
set CONF="C:\zabbix-cloudwatch-windows\zabbix_agent\conf\zabbix_agentd.win.conf"
set AGENT="C:\zabbix-cloudwatch-windows\zabbix_agent\bin\win64\zabbix_agentd.exe"

%AGENT% -c %CONF% -d
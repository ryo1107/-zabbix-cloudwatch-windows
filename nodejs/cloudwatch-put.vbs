Dim oShell
Set oShell = WScript.CreateObject ("WSCript.shell")
oShell.run "C:\zabbix-cloudwatch-windows\nodejs\cloudwatch-put.bat",0
Set oShell = Nothing

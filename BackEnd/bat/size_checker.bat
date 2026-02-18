@echo off
:a
cd C:\inetpub\wwwroot\cesium\Reveron\cesium_project\Reveron-Insights-v1.0\BackEnd\
php -f C:\inetpub\wwwroot\cesium\Reveron\cesium_project\Reveron-Insights-v1.0\BackEnd\size_checker.php
TIMEOUT 150
cd "C:\inetpub\wwwroot\cesium\Reveron\cesium_project\Reveron-Insights-v1.0\BackEnd\bat"
IF EXIST "size_checker.init3.txt" ( goto :a )

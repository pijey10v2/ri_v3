@echo off
:a
cd C:\inetpub\wwwroot\cesium\Reveron\cesium_project\Reveron-Insights-v1.0\BackEnd\
php -f C:\inetpub\wwwroot\cesium\Reveron\cesium_project\Reveron-Insights-v1.0\BackEnd\temp_cleaner.php
TIMEOUT 600
cd "C:\inetpub\wwwroot\cesium\Reveron\cesium_project\Reveron-Insights-v1.0\BackEnd\bat"
IF EXIST "doc_cleaner.int3.txt" ( goto :a )

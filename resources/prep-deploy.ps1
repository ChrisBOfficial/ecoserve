Set-Location ..\
Copy-Item .\src\server.js -Destination .\
Compress-Archive -Path .\dist, .\server.js, .\package.json, .\.env -DestinationPath .\invasive-species.zip

if($?) {
    Remove-Item .\server.js
}

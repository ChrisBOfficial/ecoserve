Set-Location ..\
Copy-Item .\src\server.js -Destination .\ 
Copy-Item .\src\assets\projects.json -Destination .\
Compress-Archive -Path .\dist, .\server.js, .\package.json, .\.env, .\projects.json -DestinationPath .\invasive-species.zip

if($?) {
    Remove-Item .\server.js
    Remove-Item .\projects.json
}

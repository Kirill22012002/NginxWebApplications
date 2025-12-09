# 1 step
`
.\make_folders.bat
`

# 2 step
`
.\build_images.bat
`

# 3 step
`
.\load_images.bat
`

# 4 step 
`
docker compose up -d
`


## For create cert
# 1
`
winget install ShiningLight.OpenSSL.Light
`

# 2
`
$env:Path = "C:\Program Files\OpenSSL-Win64\bin;$env:Path"
`

# 3
`
openssl req -x509 -nodes -newkey rsa:2048 `
  -keyout domain.key `
  -out domain.crt `
  -days 365 `
  -subj "/C=US/ST=NA/L=NA/O=Local/OU=Dev/CN=localhost"
`

# 4
`
openssl pkcs12 -export -out domain.pfx -inkey domain.key -in domain.crt
`

# 5 - password
`
123edcxzse4
`

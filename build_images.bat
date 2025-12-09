
set current_dir=%~dp0
echo cd: %CD%
echo current dir: %current_dir%

SET ERRORLEVEL=0

rem pushd %current_dir%

pushd .\src\NginxWebApplications\Web1\
dotnet restore Web1.csproj --os linux --arch x64
dotnet publish Web1.csproj --os linux --arch x64 /t:PublishContainer -p:ContainerArchiveOutputPath=.\images\web1-image.tar.gz -p:ContainerUser=root
rem  remove old image if exists
rem cp -f .\images\web1-image.tar.gz ..\..\..\..\images\
xcopy /s /Y /i ".\images\web1-image.tar.gz" "..\..\..\images\"
popd
if not ERRORLEVEL 0 goto build_error

pushd .\src\NginxWebApplications\Web2\
dotnet restore Web2.csproj --os linux --arch x64
dotnet publish Web2.csproj --os linux --arch x64 /t:PublishContainer -p:ContainerArchiveOutputPath=.\images\web2-image.tar.gz -p:ContainerUser=root
rem  remove old image if exists
rem cp -f .\images\web2-image.tar.gz ..\..\..\..\images\
xcopy /s /Y /i ".\images\web2-image.tar.gz" "..\..\..\images\"
popd
if not ERRORLEVEL 0 goto build_error

:build_complete
REM COLOR F
echo build complete
exit \B

:build_error
echo build error: %ERRORLEVEL%
set ERRORLEVEL=1
exit \B 1
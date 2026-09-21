@echo off
chcp 65001 >nul
echo ========================================================
echo   SINCRONIZANDO REPOSITORIO CON PROTELEM-EPEC
echo ========================================================
echo.
git push -u protelem main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] No se pudo sincronizar. Verifica que el repositorio exista en PROTELEM-EPEC y que tengas permisos.
    pause
    exit /b %ERRORLEVEL%
)

git push protelem --tags
echo.
echo [EXITO] Repositorio transferido y sincronizado con PROTELEM-EPEC/encuesta-cier-epec!
echo ========================================================
pause

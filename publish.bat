@echo off
chcp 65001 >nul
echo ==============================================================================
echo        PUBLICACION Y DESPLIEGUE: ENCUESTA CIER EPEC (2025-2026)
echo ==============================================================================
echo.
git add .
git commit -m "update: mejoras y publicaciones en dashboard CIER"
echo.
echo [1/2] Desplegando en GitHub Pages (protelemepec-coder)...
git push coder main
echo.
echo [2/2] Sincronizando con PROTELEM-EPEC...
git push protelem main
echo.
echo ==============================================================================
echo   DESPLIEGUE COMPLETADO EXITOSAMENTE!
echo   Dashboard en Vivo: https://protelemepec-coder.github.io/encuesta-cier-epec/
echo ==============================================================================
pause

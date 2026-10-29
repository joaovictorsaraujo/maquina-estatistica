@echo off
REM ============================================================================
REM  Inicializador da Interface Web — Máquina Estatística (IFES Serra)
REM ============================================================================
chcp 65001 >nul
title Servidor Web - Máquina Estatística

echo ============================================================
echo   Iniciando Servidor Web e Interface Visual...
echo   Endereço: http://127.0.0.1:8000
echo ============================================================
echo.

REM Inicia o navegador padrão automaticamente após 2 segundos
start "" "http://127.0.0.1:8000"

python "%~dp0executar.py" --web --port 8000
pause

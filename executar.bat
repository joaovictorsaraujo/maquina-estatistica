@echo off
REM ============================================================================
REM  Script de Inicialização — Máquina Estatística (IFES Campus Serra)
REM ============================================================================
chcp 65001 >nul
title Máquina Estatística - IFES Serra

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Python não foi encontrado no PATH do sistema.
    echo Por favor, instale o Python 3.10+ ou verifique as variáveis de ambiente.
    pause
    exit /b 1
)

python "%~dp0executar.py" %*
if %errorlevel% neq 0 (
    echo.
    echo [AVISO] A execução retornou código de erro %errorlevel%.
    pause
)

@echo off
REM ============================================================================
REM  Inicializador da Interface Web -- Maquina Estatistica (IFES Serra)
REM  Funciona em qualquer computador Windows com apenas 1 clique!
REM ============================================================================
chcp 65001 >nul
title Servidor Web - Maquina Estatistica

setlocal

set "PY_CMD="

REM 1. Verifica se o ambiente virtual local existe e funciona
if exist "%~dp0.venv\Scripts\python.exe" (
    "%~dp0.venv\Scripts\python.exe" -c "import sys" >nul 2>nul
    if not errorlevel 1 set "PY_CMD=%~dp0.venv\Scripts\python.exe"
)

REM 2. Se nao temos .venv, verifica se o Python do sistema ja tem as dependencias prontas
if "%PY_CMD%"=="" (
    python -c "import fastapi, uvicorn, matplotlib, pandas, numpy, pytest, scipy" >nul 2>nul
    if not errorlevel 1 set "PY_CMD=python"
)

if "%PY_CMD%"=="" (
    py -3 -c "import fastapi, uvicorn, matplotlib, pandas, numpy, pytest, scipy" >nul 2>nul
    if not errorlevel 1 set "PY_CMD=py -3"
)

REM 3. Se ainda nao encontrou, procura qualquer executavel Python disponivel no sistema
if "%PY_CMD%"=="" (
    python -c "import sys" >nul 2>nul
    if not errorlevel 1 set "PY_CMD=python"
)

if "%PY_CMD%"=="" (
    py -3 -c "import sys" >nul 2>nul
    if not errorlevel 1 set "PY_CMD=py -3"
)

if "%PY_CMD%"=="" (
    python3 -c "import sys" >nul 2>nul
    if not errorlevel 1 set "PY_CMD=python3"
)

if "%PY_CMD%"=="" (
    for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python3*") do (
        if exist "%%D\python.exe" (
            "%%D\python.exe" -c "import sys" >nul 2>nul
            if not errorlevel 1 set "PY_CMD=%%D\python.exe"
        )
    )
)

if "%PY_CMD%"=="" (
    for /d %%D in ("C:\Program Files\Python3*") do (
        if exist "%%D\python.exe" (
            "%%D\python.exe" -c "import sys" >nul 2>nul
            if not errorlevel 1 set "PY_CMD=%%D\python.exe"
        )
    )
)

if "%PY_CMD%"=="" (
    echo.
    echo ============================================================
    echo   [ERRO] Python nao foi encontrado neste computador!
    echo ============================================================
    echo   Para executar este projeto, e necessario ter o Python 3.10+
    echo   instalado. Baixe gratuitamente em:
    echo   https://www.python.org/downloads/
    echo.
    echo   * Lembrete: Marque a opcao "Add python.exe to PATH"
    echo     durante a instalacao.
    echo ============================================================
    echo.
    pause
    exit /b 1
)

REM 4. Se o Python escolhido nao tem as dependencias e nao estamos em .venv, configura o .venv
%PY_CMD% -c "import fastapi, uvicorn, matplotlib, pandas, numpy, pytest, scipy" >nul 2>nul
if errorlevel 1 (
    if not exist "%~dp0.venv\Scripts\python.exe" (
        echo [INFO] Configurando ambiente virtual e dependencias pela primeira vez...
        %PY_CMD% -m venv "%~dp0.venv" >nul 2>nul
        if exist "%~dp0.venv\Scripts\python.exe" (
            set "PY_CMD=%~dp0.venv\Scripts\python.exe"
        )
    )
)

echo ============================================================
echo   Iniciando Servidor Web e Interface Visual...
echo   Endereco: http://127.0.0.1:8000
echo   O navegador sera aberto automaticamente quando pronto.
echo ============================================================
echo.

%PY_CMD% "%~dp0executar.py" --web --port 8000
if errorlevel 1 (
    echo.
    echo [AVISO] O servidor foi encerrado.
    pause
)

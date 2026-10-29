@echo off
chcp 65001 >nul
title Publicar Projeto no GitHub - Maquina Estatistica

setlocal
set "PY_CMD="

if exist "%~dp0.venv\Scripts\python.exe" set "PY_CMD=%~dp0.venv\Scripts\python.exe"
if "%PY_CMD%"=="" py -3 -c "import sys" >nul 2>nul && set "PY_CMD=py -3"
if "%PY_CMD%"=="" python -c "import sys" >nul 2>nul && set "PY_CMD=python"
if "%PY_CMD%"=="" for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python3*") do if exist "%%D\python.exe" set "PY_CMD=%%D\python.exe"

if "%PY_CMD%"=="" (
    echo [ERRO] Python nao foi encontrado no sistema.
    pause
    exit /b 1
)

%PY_CMD% "%~dp0subir_github.py"
pause

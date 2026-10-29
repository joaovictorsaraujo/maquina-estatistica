@echo off
chcp 65001 >nul
title Publicar Projeto no GitHub - Máquina Estatística
python "%~dp0subir_github.py"
pause

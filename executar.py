#!/usr/bin/env python3
"""
Script de Entrada Principal — Máquina Estatística.
Permite executar o projeto diretamente a partir da raiz:
    python executar.py
    python executar.py --web
    python executar.py --demo
    python executar.py --run-all
    python executar.py --test

Inclui auto-verificação de ambiente para garantir execução
imediata em qualquer computador sem comandos manuais prévios.
"""

import os
from pathlib import Path
import subprocess
import sys

DIR_RAIZ = Path(__file__).resolve().parent
DIR_SRC = DIR_RAIZ / "src"
ARQ_REQUIREMENTS = DIR_RAIZ / "requirements.txt"

DEPENDENCIAS_CRITICAS = [
    ("fastapi", "fastapi>=0.110.0"),
    ("uvicorn", "uvicorn>=0.28.0"),
    ("matplotlib", "matplotlib>=3.8.0"),
    ("pandas", "pandas>=2.1.0"),
    ("numpy", "numpy>=1.26.0"),
    ("pytest", "pytest>=8.0.0"),
    ("scipy", "scipy>=1.12.0"),
]


def garantir_dependencias() -> None:
    """
    Verifica se todas as dependências estão disponíveis no Python atual.
    Caso contrário, executa o pip automaticamente a partir do requirements.txt.
    """
    faltantes = []
    for modulo, pacote in DEPENDENCIAS_CRITICAS:
        try:
            __import__(modulo)
        except ImportError:
            faltantes.append(pacote)

    if faltantes:
        print("\n" + "=" * 68)
        print("  [AUTO-SETUP] MÁQUINA ESTATÍSTICA — INSTALAÇÃO DE DEPENDÊNCIAS")
        print("=" * 68)
        print(f" Detectados módulos necessários ausentes: {', '.join(faltantes)}")
        print(" Instalando automaticamente via pip... Aguarde um momento.\n")
        try:
            cmd = [sys.executable, "-m", "pip", "install", "-r", str(ARQ_REQUIREMENTS)]
            subprocess.check_call(cmd)
            print("\n[OK] Dependências instaladas com sucesso! Iniciando aplicação...\n")
        except Exception as e:
            print(f"\n[AVISO] Não foi possível instalar pacotes automaticamente: {e}")
            print(f"Comando manual sugerido: {sys.executable} -m pip install -r requirements.txt\n")


# 1. Garante que as dependências estejam instaladas antes de importar os módulos
garantir_dependencias()

# 2. Adiciona a pasta src ao sys.path para importação limpa dos módulos
if str(DIR_SRC) not in sys.path:
    sys.path.insert(0, str(DIR_SRC))

from maquina_estatistica.cli import main

if __name__ == "__main__":
    main()

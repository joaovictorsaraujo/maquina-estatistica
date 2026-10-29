#!/usr/bin/env python3
"""
Script de Entrada Principal — Máquina Estatística.
Permite executar o projeto diretamente a partir da raiz:
    python executar.py
    python executar.py --demo
    python executar.py --run-all
    python executar.py --test
"""

import os
from pathlib import Path
import sys

# Adiciona a pasta src ao sys.path para importação limpa dos módulos
dir_raiz = Path(__file__).resolve().parent
dir_src = dir_raiz / "src"
if str(dir_src) not in sys.path:
    sys.path.insert(0, str(dir_src))

from maquina_estatistica.cli import main

if __name__ == "__main__":
    main()

#!/usr/bin/env bash
# ==============================================================================
#  Menu de Linha de Comando -- Maquina Estatistica (IFES Serra)
#  Compativel com Linux e macOS
# ==============================================================================

set -e

DIR_PROJETO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR_PROJETO"

if command -v python3 &>/dev/null; then
    SYS_PY="python3"
elif command -v python &>/dev/null; then
    SYS_PY="python"
else
    echo "[ERRO] Python 3 nao foi encontrado no sistema."
    exit 1
fi

if [ ! -d ".venv" ]; then
    echo "[INFO] Criando ambiente virtual isolado (.venv)..."
    "$SYS_PY" -m venv .venv
fi

source .venv/bin/activate

python executar.py "$@"

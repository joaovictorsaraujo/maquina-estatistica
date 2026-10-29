#!/usr/bin/env bash
# ==============================================================================
#  Inicializador da Interface Web -- Maquina Estatistica (IFES Serra)
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
    echo "============================================================"
    echo " [ERRO] Python 3 nao foi encontrado no sistema."
    echo " Por favor, instale o Python 3.10 ou superior."
    echo "============================================================"
    exit 1
fi

if [ ! -d ".venv" ]; then
    echo "[INFO] Criando ambiente virtual isolado (.venv)..."
    "$SYS_PY" -m venv .venv
fi

source .venv/bin/activate

echo "============================================================"
echo "  Iniciando Servidor Web e Interface Visual..."
echo "  Endereco: http://127.0.0.1:8000"
echo "============================================================"
echo ""

if command -v xdg-open &>/dev/null; then
    xdg-open "http://127.0.0.1:8000" &>/dev/null &
elif command -v open &>/dev/null; then
    open "http://127.0.0.1:8000" &>/dev/null &
fi

python executar.py --web --port 8000

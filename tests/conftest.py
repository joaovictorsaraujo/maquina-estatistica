"""
Configuração do pytest — inclui src no sys.path para importações absolutas.
"""

from pathlib import Path
import sys

raiz = Path(__file__).resolve().parent.parent
src = raiz / "src"
if str(src) not in sys.path:
    sys.path.insert(0, str(src))

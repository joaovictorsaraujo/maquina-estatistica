"""
Módulo de Configuração e Constantes do Modelo.

Define símbolos, regras da máquina, tabelas de pagamentos,
parâmetros dos experimentos e constantes teóricas de referência.
"""

from pathlib import Path
from typing import Dict, Tuple

# Aviso institucional obrigatório
AVISO_LEGAL = "Simulador acadêmico — somente créditos fictícios"

# Definição dos símbolos e rolos circulares
SIMBOLOS: Tuple[str, ...] = ("A", "B", "C", "D", "E")
NUM_SIMBOLOS = len(SIMBOLOS)  # 5
NUM_ROLOS = 3
TAMANHO_JANELA = 3  # Linhas: 0=Topo, 1=Centro, 2=Base

# Custo da aposta por rodada
CUSTO_APOSTA = 1.0

# Tabela de Pagamentos Base (Prêmio bruto P)
# Apenas triplas centrais idênticas são premiadas.
PAGAMENTOS_BASE: Dict[str, float] = {
    "A-A-A": 5.0,
    "B-B-B": 10.0,
    "C-C-C": 15.0,
    "D-D-D": 25.0,
    "E-E-E": 50.0,
}

# Tabela de Pagamentos com acréscimo de 10% (Experimento 5)
PAGAMENTOS_AUMENTADOS_10: Dict[str, float] = {
    "A-A-A": 5.5,
    "B-B-B": 11.0,
    "C-C-C": 16.5,
    "D-D-D": 27.5,
    "E-E-E": 55.0,
}

# 6 Categorias de lucro líquido no modelo base (X = P - 1)
# X in {-1, 4, 9, 14, 24, 49}
CATEGORIAS_LUCRO_BASE: Tuple[int, ...] = (-1, 4, 9, 14, 24, 49)

# Valores Teóricos de Referência - Modelo Base
TOTAL_COMBINACOES_CENTRAIS = NUM_SIMBOLOS ** NUM_ROLOS  # 5^3 = 125
TOTAL_COMBINACOES_PREMIADAS = 5
PROBABILIDADE_TEORICA_PREMIO = TOTAL_COMBINACOES_PREMIADAS / TOTAL_COMBINACOES_CENTRAIS  # 5/125 = 0.04 (4%)
PROBABILIDADE_TEORICA_SEM_PREMIO = (TOTAL_COMBINACOES_CENTRAIS - TOTAL_COMBINACOES_PREMIADAS) / TOTAL_COMBINACOES_CENTRAIS  # 120/125 = 0.96 (96%)
PROBABILIDADE_TEORICA_POR_TRIPLA = 1.0 / TOTAL_COMBINACOES_CENTRAIS  # 1/125 = 0.008 (0.8%)

# Esperança matemática e RTP no modelo base
# E[P] = (5 + 10 + 15 + 25 + 50) / 125 = 105 / 125 = 0.84
ESPERANCA_PREMIO_BASE = sum(PAGAMENTOS_BASE.values()) / TOTAL_COMBINACOES_CENTRAIS  # 0.84
ESPERANCA_LUCRO_BASE = ESPERANCA_PREMIO_BASE - CUSTO_APOSTA  # -0.16
RTP_TEORICO_BASE = (ESPERANCA_PREMIO_BASE / CUSTO_APOSTA) * 100.0  # 84.0%
VANTAGEM_CASA_BASE = 100.0 - RTP_TEORICO_BASE  # 16.0%

# Esperança matemática e RTP no modelo aumentado (+10%)
ESPERANCA_PREMIO_AUMENTADO = sum(PAGAMENTOS_AUMENTADOS_10.values()) / TOTAL_COMBINACOES_CENTRAIS  # 0.924
ESPERANCA_LUCRO_AUMENTADO = ESPERANCA_PREMIO_AUMENTADO - CUSTO_APOSTA  # -0.076
RTP_TEORICO_AUMENTADO = (ESPERANCA_PREMIO_AUMENTADO / CUSTO_APOSTA) * 100.0  # 92.4%
VANTAGEM_CASA_AUMENTADO = 100.0 - RTP_TEORICO_AUMENTADO  # 7.6%

# Parâmetros padrão dos Experimentos
SEED_E1 = 2026
RODADAS_E1 = 10_000

SEEDS_E2 = (10, 2026, 123456)
RODADAS_E2 = 10_000
PONTOS_E2 = (100, 1_000, 10_000)

SEED_E3 = 42
PARTICIPANTES_E3 = 100
SALDO_INICIAL_E3 = 100.0
MAX_RODADAS_E3 = 500

PARES_E4 = 9_999

# Diretórios padrão do projeto
DIR_PROJETO = Path(__file__).resolve().parent.parent.parent
DIR_RESULTADOS = DIR_PROJETO / "resultados"
DIR_TABELAS = DIR_RESULTADOS / "tabelas"
DIR_GRAFICOS = DIR_RESULTADOS / "graficos"
DIR_RELATORIOS = DIR_RESULTADOS / "relatorios"
DIR_DOCS = DIR_PROJETO / "docs"


def garantir_diretorios() -> None:
    """Garante a existência de todos os diretórios de saída."""
    for d in (DIR_RESULTADOS, DIR_TABELAS, DIR_GRAFICOS, DIR_RELATORIOS, DIR_DOCS):
        d.mkdir(parents=True, exist_ok=True)

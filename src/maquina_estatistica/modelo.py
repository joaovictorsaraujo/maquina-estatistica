"""
Módulo do Modelo Matemático da Máquina de Rolos.

Implementa a representação dos rolos circulares, montagem do tabuleiro 3x3,
avaliação estrita da linha central e cálculo de prêmios e lucro líquido.
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

from maquina_estatistica.config import (
    CUSTO_APOSTA,
    NUM_ROLOS,
    NUM_SIMBOLOS,
    PAGAMENTOS_BASE,
    SIMBOLOS,
)


@dataclass(frozen=True)
class ResultadoRodada:
    """Registro imutável dos dados completos de uma rodada."""

    indice: int
    paradas: Tuple[int, int, int]
    tabuleiro: Tuple[Tuple[str, str, str], Tuple[str, str, str], Tuple[str, str, str]]
    linha_central: Tuple[str, str, str]
    combinacao_central: str
    premio: float
    lucro: float
    premiado: bool
    explicacao_regra: str


def montar_coluna(k: int) -> Tuple[str, str, str]:
    """
    Monta a coluna visível (3 posições) a partir da parada K sorteada no rolo circular.

    Conforme especificação:
    - Topo: R[K]
    - Centro: R[(K + 1) mod 5]
    - Base: R[(K + 2) mod 5]

    Exemplo: K=4 -> (E, A, B)
    """
    if not (0 <= k < NUM_SIMBOLOS):
        raise ValueError(f"Parada K={k} inválida. Deve estar entre 0 e {NUM_SIMBOLOS - 1}.")

    topo = SIMBOLOS[k]
    centro = SIMBOLOS[(k + 1) % NUM_SIMBOLOS]
    base = SIMBOLOS[(k + 2) % NUM_SIMBOLOS]
    return (topo, centro, base)


def montar_tabuleiro(
    paradas: Tuple[int, int, int]
) -> Tuple[Tuple[str, str, str], Tuple[str, str, str], Tuple[str, str, str]]:
    """
    Constrói a matriz 3x3 do tabuleiro a partir das paradas dos 3 rolos independentes.

    Retorna tupla de 3 linhas (topo, centro, base), cada linha com 3 símbolos.
    """
    if len(paradas) != NUM_ROLOS:
        raise ValueError(f"Devem ser fornecidas exatamente {NUM_ROLOS} paradas.")

    colunas = [montar_coluna(k) for k in paradas]

    linha_topo = (colunas[0][0], colunas[1][0], colunas[2][0])
    linha_centro = (colunas[0][1], colunas[1][1], colunas[2][1])
    linha_base = (colunas[0][2], colunas[1][2], colunas[2][2])

    return (linha_topo, linha_centro, linha_base)


def extrair_linha_central(paradas: Tuple[int, int, int]) -> Tuple[str, str, str]:
    """Extrai diretamente a linha central dos 3 rolos."""
    return tuple(SIMBOLOS[(k + 1) % NUM_SIMBOLOS] for k in paradas)  # type: ignore


def avaliar_linha_central(
    linha_central: Tuple[str, str, str],
    pagamentos: Optional[Dict[str, float]] = None,
    custo_aposta: float = CUSTO_APOSTA,
) -> Tuple[float, float, bool, str, str]:
    """
    Avalia a linha central da rodada contra a tabela de pagamentos.

    Regra estrita:
    - Apenas a linha central determina pagamento.
    - Apenas três símbolos idênticos pagam prêmio.
    - Qualquer outra combinação paga prêmio 0.0 e resulta em lucro -custo_aposta.

    Retorna:
    (premio, lucro, premiado, combinacao_str, explicacao_regra)
    """
    if pagamentos is None:
        pagamentos = PAGAMENTOS_BASE

    combinacao = f"{linha_central[0]}-{linha_central[1]}-{linha_central[2]}"

    if combinacao in pagamentos:
        premio = float(pagamentos[combinacao])
        lucro = premio - custo_aposta
        premiado = True
        explicacao = (
            f"Combinação premiada {combinacao}! "
            f"Prêmio bruto: {premio:.2f} créditos. Lucro líquido: {lucro:+.2f} créditos."
        )
    else:
        premio = 0.0
        lucro = -float(custo_aposta)
        premiado = False
        explicacao = (
            f"Combinação {combinacao} não premiada. "
            f"Prêmio bruto: 0.00 créditos. Lucro líquido: {lucro:+.2f} créditos (perda da aposta)."
        )

    return (premio, lucro, premiado, combinacao, explicacao)


def criar_resultado_rodada(
    indice: int,
    paradas: Tuple[int, int, int],
    pagamentos: Optional[Dict[str, float]] = None,
    custo_aposta: float = CUSTO_APOSTA,
) -> ResultadoRodada:
    """Cria o objeto completo ResultadoRodada a partir do índice e das paradas."""
    tabuleiro = montar_tabuleiro(paradas)
    linha_central = tabuleiro[1]
    premio, lucro, premiado, combinacao, explicacao = avaliar_linha_central(
        linha_central, pagamentos=pagamentos, custo_aposta=custo_aposta
    )

    return ResultadoRodada(
        indice=indice,
        paradas=paradas,
        tabuleiro=tabuleiro,
        linha_central=linha_central,
        combinacao_central=combinacao,
        premio=premio,
        lucro=lucro,
        premiado=premiado,
        explicacao_regra=explicacao,
    )

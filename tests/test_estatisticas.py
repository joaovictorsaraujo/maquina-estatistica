"""
Testes Unitários das Funções Estatísticas (estatisticas.py).
Valida fórmulas, somas de probabilidades/frequências, divisor N-1 no desvio-padrão,
taxas condicionais e comparações econômicas.
"""

import math
import statistics
import pytest

from maquina_estatistica.config import (
    ESPERANCA_LUCRO_AUMENTADO,
    ESPERANCA_LUCRO_BASE,
    RTP_TEORICO_AUMENTADO,
    RTP_TEORICO_BASE,
)
from maquina_estatistica.estatisticas import (
    calcular_comparacao_e5,
    calcular_estatisticas_e1,
    calcular_estatisticas_e3,
    calcular_medias_acumuladas,
    calcular_probabilidades_condicionais_e4,
    resumir_medias_pontos_e2,
)
from maquina_estatistica.modelo import ResultadoRodada, criar_resultado_rodada
from maquina_estatistica.simulacao import ResultadoSessao


def test_t05_estatisticas_e1_contagens_e_divisor_amostral():
    """
    T05: As contagens das 6 categorias devem somar N e as frequências relativas somar 1.0.
    O desvio-padrão deve usar o divisor N - 1.
    """
    # Criamos um conjunto controlado de 10 rodadas
    # Paradas:
    # 0,0,0 -> B-B-B (P=10, X=9)
    # 4,4,4 -> A-A-A (P=5, X=4)
    # 8 rodadas com perda (K=(0,1,2) -> centro (B, C, D) -> P=0, X=-1)
    registros = []
    registros.append(criar_resultado_rodada(indice=1, paradas=(0, 0, 0)))  # X = 9
    registros.append(criar_resultado_rodada(indice=2, paradas=(4, 4, 4)))  # X = 4
    for i in range(3, 11):
        registros.append(criar_resultado_rodada(indice=i, paradas=(0, 1, 2)))  # X = -1

    stats = calcular_estatisticas_e1(registros)

    assert stats["n_rodadas"] == 10
    assert stats["soma_contagens"] == 10
    assert stats["soma_freq_relativas"] == pytest.approx(1.0)

    # Lucro médio manual: (9 + 4 + 8*(-1)) / 10 = (13 - 8) / 10 = 5 / 10 = 0.5
    assert stats["lucro_medio_observado"] == pytest.approx(0.5)

    # Desvio-padrão amostral manual com N - 1 = 9
    lucros = [9.0, 4.0] + [-1.0] * 8
    dp_esperado = statistics.stdev(lucros)
    assert stats["desvio_padrao_amostral"] == pytest.approx(dp_esperado)

    # RTP observado manual: (10 + 5 + 0) / (10 * 1.0) * 100 = 150%
    assert stats["rtp_observado"] == pytest.approx(150.0)

    # Proporção de prêmios: 2 vitórias em 10 = 20%
    # Note a diferença crucial: Proporção de vitórias é 20%, mas RTP é 150%!
    assert stats["proporcao_premiada_observada"] == pytest.approx(0.20)


def test_t06_medias_acumuladas_e2():
    """T06: Valida cálculo do vetor de médias acumuladas e extração de pontos."""
    vetor_lucros = [1.0, 3.0, 5.0, 7.0]
    # Medias: [1.0, 2.0, 3.0, 4.0]
    medias = calcular_medias_acumuladas(vetor_lucros)
    assert medias == [1.0, 2.0, 3.0, 4.0]

    resumo = resumir_medias_pontos_e2(medias, pontos=(1, 3, 4))
    assert resumo[1] == 1.0
    assert resumo[3] == 3.0
    assert resumo[4] == 4.0


def test_t07_estatisticas_e3_categorias_somam_100():
    """T07: Ganhos + Empates + Perdas = 100% dos participantes. Esgotamentos <= Perdas."""
    sessoes = [
        ResultadoSessao(1, 100.0, 120.0, 500, False, "ganho"),
        ResultadoSessao(2, 100.0, 100.0, 500, False, "empate"),
        ResultadoSessao(3, 100.0, 45.0, 500, False, "perda"),
        ResultadoSessao(4, 100.0, 0.0, 250, True, "perda"),
    ]
    stats = calcular_estatisticas_e3(sessoes)

    assert stats["num_participantes"] == 4
    assert stats["ganhos_contagem"] == 1
    assert stats["empates_contagem"] == 1
    assert stats["perdas_contagem"] == 2
    assert stats["soma_proporcoes"] == pytest.approx(1.0)
    assert stats["esgotamentos_contagem"] == 1
    assert stats["esgotamentos_contagem"] <= stats["perdas_contagem"]


def test_t08_probabilidade_condicional_e4_e_divisao_zero():
    """T08: Contagem de pares consecutivos e proteção contra divisão por zero."""
    # Cenário com rodadas alternadas
    # R1: ganho, R2: perda, R3: perda, R4: ganho
    r1 = criar_resultado_rodada(1, paradas=(0, 0, 0))  # premiado
    r2 = criar_resultado_rodada(2, paradas=(0, 1, 2))  # sem premio
    r3 = criar_resultado_rodada(3, paradas=(0, 1, 2))  # sem premio
    r4 = criar_resultado_rodada(4, paradas=(0, 0, 0))  # premiado

    stats = calcular_probabilidades_condicionais_e4([r1, r2, r3, r4])
    # Total de pares: 4 - 1 = 3 pares: (r1, r2), (r2, r3), (r3, r4)
    assert stats["total_pares"] == 3

    # Pares após prêmio: apenas (r1, r2) -> total=1, r2 teve premio? Não -> premios=0 -> prop=0.0
    assert stats["apos_premio"]["total_pares"] == 1
    assert stats["apos_premio"]["premios_seguintes"] == 0
    assert stats["apos_premio"]["proporcao_observada"] == 0.0

    # Pares após sem prêmio: (r2, r3) e (r3, r4) -> total=2
    # r3 teve prêmio? Não. r4 teve prêmio? Sim! -> premios=1 -> prop = 1/2 = 0.5
    assert stats["apos_sem_premio"]["total_pares"] == 2
    assert stats["apos_sem_premio"]["premios_seguintes"] == 1
    assert stats["apos_sem_premio"]["proporcao_observada"] == pytest.approx(0.5)

    # Teste de caso-limite: NENHUM prêmio em todas as rodadas
    registros_sem_premio = [criar_resultado_rodada(i, paradas=(0, 1, 2)) for i in range(1, 10)]
    stats_sem = calcular_probabilidades_condicionais_e4(registros_sem_premio)
    assert stats_sem["apos_premio"]["total_pares"] == 0
    assert stats_sem["apos_premio"]["status"] == "não estimável"
    assert stats_sem["apos_premio"]["proporcao_observada"] is None  # Não levantou divisão por zero!


def test_t09_comparacao_e5_regras_teoricas():
    """T09: Valida valores teóricos de RTP e lucro esperado para Tabela Base e +10%."""
    # 1. Tabela Base: E[P]=0.84, E[X]=-0.16, RTP=84%
    assert ESPERANCA_LUCRO_BASE == pytest.approx(-0.16)
    assert RTP_TEORICO_BASE == pytest.approx(84.0)

    # 2. Tabela +10%: E[P]=0.924, E[X]=-0.076, RTP=92.4%
    assert ESPERANCA_LUCRO_AUMENTADO == pytest.approx(-0.076)
    assert RTP_TEORICO_AUMENTADO == pytest.approx(92.4)

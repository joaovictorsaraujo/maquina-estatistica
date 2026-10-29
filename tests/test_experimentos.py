"""
Testes de Integração dos Experimentos (experimentos.py).
Valida a execução ponta a ponta dos cinco experimentos e a preservação do reuso de sequências.
"""

import pytest

from maquina_estatistica.config import (
    PARES_E4,
    PARTICIPANTES_E3,
    PONTOS_E2,
    RODADAS_E1,
    RODADAS_E2,
    SEED_E1,
    SEED_E3,
    SEEDS_E2,
)
from maquina_estatistica.experimentos import (
    executar_experimento_1,
    executar_experimento_2,
    executar_experimento_3,
    executar_experimento_4,
    executar_experimento_5,
    executar_todos_experimentos,
)


def test_execucao_integrada_experimento_1():
    """Valida a execução completa do Experimento 1 com parâmetros oficiais."""
    regs, stats = executar_experimento_1(seed=SEED_E1, n_rodadas=RODADAS_E1)

    assert len(regs) == 10_000
    assert stats["n_rodadas"] == 10_000
    assert stats["soma_contagens"] == 10_000
    assert stats["soma_freq_relativas"] == pytest.approx(1.0, rel=1e-5)
    assert stats["seed"] == 2026

    # O lucro médio observado em 10.000 rodadas deve estar razoavelmente próximo da esperança -0.16
    assert -0.50 < stats["lucro_medio_observado"] < 0.20
    assert stats["desvio_padrao_amostral"] > 0.0


def test_execucao_integrada_experimento_2_e_reuso():
    """Valida o Experimento 2, reuso de sequência do E1 e teste de reprodutibilidade."""
    regs_e1, _ = executar_experimento_1(seed=SEED_E1, n_rodadas=RODADAS_E1)
    stats_e2 = executar_experimento_2(registros_2026=regs_e1, seeds=SEEDS_E2, n_rodadas=RODADAS_E2)

    # Verifica se a tabela 3x3 contém exatamente as 3 sementes e 3 pontos
    tabela = stats_e2["tabela_3x3"]
    assert set(tabela.keys()) == {10, 2026, 123456}
    for s in SEEDS_E2:
        assert set(tabela[s].keys()) == {100, 1000, 10000}

    # Verifica se a linha de 2026 usou de fato os registros do E1
    lucro_100_e1 = sum(r.lucro for r in regs_e1[:100]) / 100
    assert tabela[2026][100] == pytest.approx(lucro_100_e1)

    # Reprodutibilidade confirmada
    assert stats_e2["reprodutibilidade_confirmada"] is True
    assert len(stats_e2["comparacao_10_primeiros"]) == 10
    for item in stats_e2["comparacao_10_primeiros"]:
        assert item["coincidem"] is True


def test_execucao_integrada_experimento_3():
    """Valida o Experimento 3 com 100 participantes e semente 42 única."""
    sessoes, stats = executar_experimento_3(seed=SEED_E3, num_participantes=PARTICIPANTES_E3)

    assert len(sessoes) == 100
    assert stats["num_participantes"] == 100
    assert stats["ganhos_contagem"] + stats["empates_contagem"] + stats["perdas_contagem"] == 100
    assert stats["soma_proporcoes"] == pytest.approx(1.0)
    assert stats["esgotamentos_contagem"] <= stats["perdas_contagem"]

    # Cada participante deve ter executado no máximo 500 rodadas
    for s in sessoes:
        assert 1 <= s.rodadas_executadas <= 500
        if s.esgotamento:
            assert s.saldo_final < 1.0


def test_execucao_integrada_experimento_4():
    """Valida o Experimento 4 com 9.999 pares consecutivos reutilizados do E1."""
    regs_e1, _ = executar_experimento_1(seed=SEED_E1, n_rodadas=RODADAS_E1)
    stats_e4 = executar_experimento_4(registros_2026=regs_e1)

    assert stats_e4["total_pares"] == PARES_E4 == 9_999
    pares_prem = stats_e4["apos_premio"]["total_pares"]
    pares_sem = stats_e4["apos_sem_premio"]["total_pares"]
    assert pares_prem + pares_sem == 9_999

    assert stats_e4["apos_premio"]["status"] == "estimável"
    assert stats_e4["apos_sem_premio"]["status"] == "estimável"


def test_execucao_integrada_experimento_5():
    """Valida o Experimento 5 comparando tabelas base e +10% sobre mesmos registros."""
    regs_e1, _ = executar_experimento_1(seed=SEED_E1, n_rodadas=RODADAS_E1)
    stats_e5 = executar_experimento_5(registros_2026=regs_e1)

    base = stats_e5["base"]
    aum = stats_e5["aumentada_10"]

    # Mesma frequência de vitórias observada nas duas tabelas
    assert base["freq_premio_observada"] == pytest.approx(aum["freq_premio_observada"])

    # Prêmio médio observado e RTP da tabela aumentada devem ser estritamente maiores
    assert aum["premio_medio_observado"] > base["premio_medio_observado"]
    assert aum["rtp_observado"] > base["rtp_observado"]
    assert aum["lucro_medio_observado"] > base["lucro_medio_observado"]

    # Valores teóricos exatos conferidos
    assert base["rtp_teorico"] == pytest.approx(84.0)
    assert aum["rtp_teorico"] == pytest.approx(92.4)
    assert base["lucro_medio_teorico"] == pytest.approx(-0.16)
    assert aum["lucro_medio_teorico"] == pytest.approx(-0.076)

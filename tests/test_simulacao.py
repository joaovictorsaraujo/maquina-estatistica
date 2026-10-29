"""
Testes Unitários do Módulo de Simulação (simulacao.py).
Valida determinismo do gerador, reprodutibilidade de sementes, regras de saldo e critérios de parada.
"""

import pytest

from maquina_estatistica.config import CUSTO_APOSTA, MAX_RODADAS_E3, SALDO_INICIAL_E3
from maquina_estatistica.simulacao import (
    criar_gerador,
    executar_rodada,
    simular_experimento3_participantes,
    simular_sequencia,
    simular_sessao_participante,
    sortear_paradas,
)


def test_t04_reprodutibilidade_semente():
    """T04: A mesma semente e ambiente devem produzir exatamente a mesma sequência."""
    rng1 = criar_gerador(2026)
    rng2 = criar_gerador(2026)

    seq1 = simular_sequencia(n_rodadas=20, rng=rng1)
    seq2 = simular_sequencia(n_rodadas=20, rng=rng2)

    for r1, r2 in zip(seq1, seq2):
        assert r1.paradas == r2.paradas
        assert r1.linha_central == r2.linha_central
        assert r1.premio == r2.premio
        assert r1.lucro == r2.lucro


def test_paradas_no_intervalo_valido():
    """Valida se todas as paradas sorteadas estão estritamente no conjunto {0, 1, 2, 3, 4}."""
    rng = criar_gerador(123)
    for _ in range(500):
        paradas = sortear_paradas(rng)
        assert len(paradas) == 3
        for k in paradas:
            assert 0 <= k <= 4


def test_t10_limite_de_parada_e_saldo():
    """
    T10: Sessão encerra ao atingir 500 rodadas ou quando o saldo cai abaixo de 1 crédito.
    NÃO deve executar rodadas adicionais após o encerramento.
    """
    rng = criar_gerador(42)

    # Teste de participante individual
    sessao = simular_sessao_participante(
        id_participante=1,
        rng=rng,
        saldo_inicial=100.0,
        max_rodadas=500,
    )

    assert sessao.rodadas_executadas <= 500
    if sessao.esgotamento:
        assert sessao.saldo_final < 1.0
        assert sessao.classificacao == "perda"
    else:
        assert sessao.saldo_final >= 1.0
        assert sessao.rodadas_executadas == 500

    # Verifica integridade do histórico
    assert len(sessao.historico_saldos) == sessao.rodadas_executadas + 1
    assert sessao.historico_saldos[0] == 100.0
    assert sessao.historico_saldos[-1] == pytest.approx(sessao.saldo_final)


def test_sessao_com_saldo_baixo_para_imediatamente():
    """Valida que um participante com saldo insuficiente para apostar para sem jogar."""
    rng = criar_gerador(999)
    # Participante iniciando com saldo 0.5 (< 1.0)
    sessao = simular_sessao_participante(
        id_participante=99,
        rng=rng,
        saldo_inicial=0.5,
        custo_aposta=1.0,
        max_rodadas=500,
    )
    assert sessao.rodadas_executadas == 0
    assert sessao.esgotamento is True
    assert sessao.saldo_final == 0.5
    assert sessao.classificacao == "perda"


def test_sessao_100_participantes_seed_42_continua():
    """Valida que simular_experimento3_participantes executa exatamente 100 participantes."""
    rng = criar_gerador(42)
    sessoes = simular_experimento3_participantes(rng=rng, num_participantes=100)
    assert len(sessoes) == 100
    for i, s in enumerate(sessoes, start=1):
        assert s.id_participante == i

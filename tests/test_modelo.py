"""
Testes Unitários do Modelo Matemático (modelo.py).
Valida paradas, janelas circulares mod 5, tabuleiro 3x3, avaliação da linha central e pagamentos.
"""

import itertools
import pytest

from maquina_estatistica.config import (
    CUSTO_APOSTA,
    ESPERANCA_LUCRO_BASE,
    ESPERANCA_PREMIO_BASE,
    PAGAMENTOS_BASE,
    PROBABILIDADE_TEORICA_PREMIO,
    RTP_TEORICO_BASE,
    SIMBOLOS,
    TOTAL_COMBINACOES_CENTRAIS,
)
from maquina_estatistica.modelo import (
    avaliar_linha_central,
    criar_resultado_rodada,
    extrair_linha_central,
    montar_coluna,
    montar_tabuleiro,
)


def test_t01_janela_circular_k4():
    """T01: Para K=4, a janela circular deve ser E-A-B (mod 5)."""
    coluna = montar_coluna(4)
    assert coluna == ("E", "A", "B")


def test_todas_as_paradas_janela_circular():
    """Valida as janelas circulares para todas as paradas possíveis K em {0, 1, 2, 3, 4}."""
    esperados = {
        0: ("A", "B", "C"),
        1: ("B", "C", "D"),
        2: ("C", "D", "E"),
        3: ("D", "E", "A"),
        4: ("E", "A", "B"),
    }
    for k, esperado in esperados.items():
        assert montar_coluna(k) == esperado


def test_parada_invalida_lanca_excecao():
    """Paradas fora de 0..4 devem levantar ValueError."""
    with pytest.raises(ValueError):
        montar_coluna(-1)
    with pytest.raises(ValueError):
        montar_coluna(5)


def test_t02_pagamentos_e_t03_lucro_liquido():
    """
    T02 e T03:
    Valida pagamentos brutos P e lucro líquido X = P - 1 para todas as combinações premiadas
    e para combinações perdedoras.
    """
    casos = [
        (("A", "A", "A"), 5.0, 4.0, True),
        (("B", "B", "B"), 10.0, 9.0, True),
        (("C", "C", "C"), 15.0, 14.0, True),
        (("D", "D", "D"), 25.0, 24.0, True),
        (("E", "E", "E"), 50.0, 49.0, True),
        (("A", "B", "A"), 0.0, -1.0, False),
        (("B", "C", "D"), 0.0, -1.0, False),
        (("E", "E", "A"), 0.0, -1.0, False),
    ]

    for linha, premio_esp, lucro_esp, prem_esp in casos:
        premio, lucro, premiado, comb, explicacao = avaliar_linha_central(linha)
        assert premio == pytest.approx(premio_esp)
        assert lucro == pytest.approx(lucro_esp)
        assert premiado == prem_esp
        assert f"{linha[0]}-{linha[1]}-{linha[2]}" == comb


def test_somente_linha_central_determina_premio():
    """
    Valida que símbolos iguais na linha superior ou inferior NÃO geram pagamento.
    Apenas a linha central é avaliada.
    """
    # Paradas: K1=0, K2=0, K3=0
    # Rolo 1: (A, B, C)
    # Rolo 2: (A, B, C)
    # Rolo 3: (A, B, C)
    # Linha topo: A-A-A (iguais!), Linha centro: B-B-B (iguais!), Linha base: C-C-C
    # Aqui o centro é B-B-B -> paga 10.0 (não paga pelos A-A-A do topo nem C-C-C da base)
    r1 = criar_resultado_rodada(indice=1, paradas=(0, 0, 0))
    assert r1.tabuleiro[0] == ("A", "A", "A")
    assert r1.tabuleiro[1] == ("B", "B", "B")
    assert r1.tabuleiro[2] == ("C", "C", "C")
    assert r1.premio == 10.0  # Paga apenas pela linha central B-B-B!

    # Agora um caso onde a linha do topo é idêntica A-A-A mas o centro é misto B-C-D
    # K1=0 -> (A, B, C); K2=4 -> topo é E, centro é A;
    # Montemos um tabuleiro com topo A-A-A: K=(0, 0, 0) daria isso.
    # Mas se K1=0 (topo A, centro B), K2=3 (topo D, centro E), K3=0 (topo A, centro B):
    # Linha central: (B, E, B) -> Não é tripla!
    r2 = criar_resultado_rodada(indice=2, paradas=(0, 3, 0))
    assert r2.tabuleiro[1] == ("B", "E", "B")
    assert r2.premio == 0.0
    assert r2.lucro == -1.0
    assert not r2.premiado


def test_espaco_amostral_completo_125_triplas():
    """
    Valida exaustivamente todas as 5^3 = 125 combinações possíveis da linha central:
    - Exatamente 5 triplas premiadas.
    - Exatamente 120 triplas sem prêmio.
    - Probabilidade teórica de prêmio = 4%.
    - E[P] teórico = 0.84 créditos.
    - E[X] teórico = -0.16 créditos.
    - RTP teórico = 84%.
    """
    todas_triplas = list(itertools.product(SIMBOLOS, repeat=3))
    assert len(todas_triplas) == TOTAL_COMBINACOES_CENTRAIS == 125

    cont_premiadas = 0
    soma_premios = 0.0

    for tripla in todas_triplas:
        premio, lucro, premiado, _, _ = avaliar_linha_central(tripla)
        if premiado:
            cont_premiadas += 1
            assert premio in PAGAMENTOS_BASE.values()
            assert lucro == premio - CUSTO_APOSTA
        else:
            assert premio == 0.0
            assert lucro == -CUSTO_APOSTA
        soma_premios += premio

    assert cont_premiadas == 5
    prob_premio = cont_premiadas / 125
    assert prob_premio == pytest.approx(PROBABILIDADE_TEORICA_PREMIO)

    esperanca_p = soma_premios / 125
    assert esperanca_p == pytest.approx(ESPERANCA_PREMIO_BASE)

    esperanca_x = esperanca_p - CUSTO_APOSTA
    assert esperanca_x == pytest.approx(ESPERANCA_LUCRO_BASE)

    rtp = (esperanca_p / CUSTO_APOSTA) * 100.0
    assert rtp == pytest.approx(RTP_TEORICO_BASE)

"""
Módulo de Funções Estatísticas.

Fornece cálculos rigorosos de probabilidades teóricas, frequências observadas,
médias acumuladas, desvio-padrão amostral (com divisor N-1), proporções,
probabilidades condicionais e intervalos de confiança.
"""

from collections import Counter
import math
import statistics
from typing import Any, Dict, List, Optional, Tuple

from maquina_estatistica.config import (
    CATEGORIAS_LUCRO_BASE,
    CUSTO_APOSTA,
    ESPERANCA_LUCRO_AUMENTADO,
    ESPERANCA_LUCRO_BASE,
    ESPERANCA_PREMIO_AUMENTADO,
    ESPERANCA_PREMIO_BASE,
    PAGAMENTOS_AUMENTADOS_10,
    PAGAMENTOS_BASE,
    PROBABILIDADE_TEORICA_POR_TRIPLA,
    PROBABILIDADE_TEORICA_PREMIO,
    PROBABILIDADE_TEORICA_SEM_PREMIO,
    RTP_TEORICO_AUMENTADO,
    RTP_TEORICO_BASE,
    TOTAL_COMBINACOES_CENTRAIS,
)
from maquina_estatistica.modelo import ResultadoRodada
from maquina_estatistica.simulacao import ResultadoSessao


# ==============================================================================
# Estatísticas do Experimento 1
# ==============================================================================

def calcular_estatisticas_e1(registros: List[ResultadoRodada]) -> Dict[str, Any]:
    """
    Calcula as estatísticas descritivas completas para o Experimento 1:
    - Contagens e frequências relativas nas 6 categorias de lucro.
    - Lucro médio amostral.
    - RTP observado (em %).
    - Proporção observada de rodadas premiadas.
    - Desvio-padrão amostral do lucro com divisor N - 1.
    - Intervalo de confiança de 95% para o lucro médio (extra).
    """
    n = len(registros)
    if n < 2:
        raise ValueError("São necessários pelo menos 2 registros para calcular estatísticas com s (N-1).")

    lucros = [r.lucro for r in registros]
    premios = [r.premio for r in registros]
    premiados = [r.premiado for r in registros]

    # Contagens das 6 categorias de lucro base: -1, 4, 9, 14, 24, 49
    contagem_lucros = Counter(int(round(x)) for x in lucros)
    categorias = sorted(CATEGORIAS_LUCRO_BASE)

    tabela_categorias = []
    soma_contagens = 0
    soma_freq_relativas = 0.0

    for x_val in categorias:
        cont = contagem_lucros.get(x_val, 0)
        freq_rel = cont / n
        soma_contagens += cont
        soma_freq_relativas += freq_rel

        # Probabilidade teórica correspondente
        if x_val == -1:
            prob_teo = PROBABILIDADE_TEORICA_SEM_PREMIO  # 120/125 = 0.96
            premio_bruto = 0.0
            combinacao = "Outras (120 triplas)"
        else:
            prob_teo = PROBABILIDADE_TEORICA_POR_TRIPLA  # 1/125 = 0.008
            premio_bruto = float(x_val + 1)
            # Nome do símbolo associado
            simb = {4: "A-A-A", 9: "B-B-B", 14: "C-C-C", 24: "D-D-D", 49: "E-E-E"}.get(x_val, "")
            combinacao = f"{simb} ({x_val:+d})"

        tabela_categorias.append({
            "lucro_x": x_val,
            "premio_p": premio_bruto,
            "combinacao": combinacao,
            "prob_teorica": prob_teo,
            "contagem": cont,
            "freq_relativa": freq_rel,
            "diferenca_abs": abs(freq_rel - prob_teo),
        })

    lucro_medio = sum(lucros) / n
    # RTP observado = (Soma dos prêmios / Total apostado) * 100%
    # Como a aposta é 1 crédito por rodada, total apostado = N * 1.0
    rtp_observado = (sum(premios) / (n * CUSTO_APOSTA)) * 100.0
    proporcao_premios = sum(1 for p in premiados if p) / n

    # Desvio-padrão amostral do lucro com divisor N - 1
    desvio_padrao_lucro = statistics.stdev(lucros)

    # Intervalo de confiança 95% para a média: x_bar +/- z * (s / sqrt(n))
    # Para n = 10.000, z ≈ 1.95996
    erro_padrao = desvio_padrao_lucro / math.sqrt(n)
    ic_95_inf = lucro_medio - 1.95996 * erro_padrao
    ic_95_sup = lucro_medio + 1.95996 * erro_padrao

    return {
        "n_rodadas": n,
        "soma_contagens": soma_contagens,
        "soma_freq_relativas": soma_freq_relativas,
        "tabela_categorias": tabela_categorias,
        "lucro_medio_observado": lucro_medio,
        "lucro_medio_teorico": ESPERANCA_LUCRO_BASE,
        "rtp_observado": rtp_observado,
        "rtp_teorico": RTP_TEORICO_BASE,
        "proporcao_premiada_observada": proporcao_premios,
        "proporcao_premiada_teorica": PROBABILIDADE_TEORICA_PREMIO,
        "desvio_padrao_amostral": desvio_padrao_lucro,
        "erro_padrao": erro_padrao,
        "ic_95_lucro": (ic_95_inf, ic_95_sup),
    }


# ==============================================================================
# Estatísticas do Experimento 2
# ==============================================================================

def calcular_medias_acumuladas(lucros: List[float]) -> List[float]:
    """
    Calcula o vetor completo da trajetória de médias acumuladas:
    M_k = (1/k) * sum_{i=1}^k X_i para k = 1, ..., len(lucros).
    """
    acumulado = 0.0
    medias: List[float] = []
    for i, x in enumerate(lucros, start=1):
        acumulado += x
        medias.append(acumulado / i)
    return medias


def resumir_medias_pontos_e2(
    medias_acumuladas: List[float], pontos: Tuple[int, ...] = (100, 1000, 10000)
) -> Dict[int, float]:
    """Extrai os valores das médias acumuladas nos pontos especificados."""
    resumo = {}
    for p in pontos:
        if 1 <= p <= len(medias_acumuladas):
            resumo[p] = medias_acumuladas[p - 1]
        else:
            raise ValueError(f"Ponto {p} fora do intervalo [1, {len(medias_acumuladas)}].")
    return resumo


# ==============================================================================
# Estatísticas do Experimento 3
# ==============================================================================

def calcular_estatisticas_e3(sessoes: List[ResultadoSessao]) -> Dict[str, Any]:
    """
    Calcula as estatísticas consolidadas das sessões do Experimento 3:
    - Proporções de ganho (Bf > 100), empate (Bf = 100) e perda (Bf < 100).
    - Proporção de esgotamento (Bf < 1).
    - Média, mediana e desvio-padrão dos saldos finais.
    - Média e mediana do número de rodadas jogadas.
    """
    num_participantes = len(sessoes)
    if num_participantes == 0:
        raise ValueError("Lista de sessões vazia.")

    saldos_finais = [s.saldo_final for s in sessoes]
    rodadas_jogadas = [s.rodadas_executadas for s in sessoes]

    ganhos = sum(1 for s in sessoes if s.classificacao == "ganho")
    empates = sum(1 for s in sessoes if s.classificacao == "empate")
    perdas = sum(1 for s in sessoes if s.classificacao == "perda")
    esgotamentos = sum(1 for s in sessoes if s.esgotamento)

    prop_ganho = ganhos / num_participantes
    prop_empate = empates / num_participantes
    prop_perda = perdas / num_participantes
    prop_esgotamento = esgotamentos / num_participantes

    media_saldo = statistics.mean(saldos_finais)
    mediana_saldo = statistics.median(saldos_finais)
    dp_saldo = statistics.stdev(saldos_finais) if num_participantes > 1 else 0.0

    media_rodadas = statistics.mean(rodadas_jogadas)
    mediana_rodadas = statistics.median(rodadas_jogadas)

    return {
        "num_participantes": num_participantes,
        "ganhos_contagem": ganhos,
        "ganhos_proporcao": prop_ganho,
        "empates_contagem": empates,
        "empates_proporcao": prop_empate,
        "perdas_contagem": perdas,
        "perdas_proporcao": prop_perda,
        "soma_proporcoes": prop_ganho + prop_empate + prop_perda,
        "esgotamentos_contagem": esgotamentos,
        "esgotamentos_proporcao": prop_esgotamento,
        "saldo_final_min": min(saldos_finais),
        "saldo_final_max": max(saldos_finais),
        "saldo_final_media": media_saldo,
        "saldo_final_mediana": mediana_saldo,
        "saldo_final_desvio_padrao": dp_saldo,
        "rodadas_media": media_rodadas,
        "rodadas_mediana": mediana_rodadas,
    }


# ==============================================================================
# Estatísticas do Experimento 4
# ==============================================================================

def calcular_probabilidades_condicionais_e4(
    registros: List[ResultadoRodada]
) -> Dict[str, Any]:
    """
    Calcula as probabilidades condicionais para pares consecutivos de rodadas:
    - Pares analisados: (R_1, R_2), (R_2, R_3), ..., (R_{N-1}, R_N). Total = N - 1 pares.
    - Condição: primeira rodada premiada (P_i > 0) vs não premiada (P_i == 0).
    - Evento: segunda rodada premiada (P_{i+1} > 0).

    Trata adequadamente denominadores zero caso algum grupo não tenha ocorrências.
    """
    n = len(registros)
    if n < 2:
        raise ValueError("São necessários pelo menos 2 registros para avaliar pares consecutivos.")

    total_pares = n - 1

    # Grupo após prêmio: G_i = {P_i > 0}
    pares_apos_premio = 0
    premios_apos_premio = 0

    # Grupo após sem prêmio: G_i^c = {P_i == 0}
    pares_apos_sem_premio = 0
    premios_apos_sem_premio = 0

    for i in range(total_pares):
        r_atual = registros[i]
        r_seguinte = registros[i + 1]

        seg_premiado = r_seguinte.premiado

        if r_atual.premiado:
            pares_apos_premio += 1
            if seg_premiado:
                premios_apos_premio += 1
        else:
            pares_apos_sem_premio += 1
            if seg_premiado:
                premios_apos_sem_premio += 1

    # Cálculo seguro das proporções com tratamento de divisão por zero
    if pares_apos_premio > 0:
        prop_apos_premio: Optional[float] = premios_apos_premio / pares_apos_premio
        status_apos_premio = "estimável"
    else:
        prop_apos_premio = None
        status_apos_premio = "não estimável"

    if pares_apos_sem_premio > 0:
        prop_apos_sem_premio: Optional[float] = premios_apos_sem_premio / pares_apos_sem_premio
        status_apos_sem_premio = "estimável"
    else:
        prop_apos_sem_premio = None
        status_apos_sem_premio = "não estimável"

    return {
        "total_pares": total_pares,
        "referencia_teorica": PROBABILIDADE_TEORICA_PREMIO,  # 0.04 (4%)
        "apos_premio": {
            "condicao": "Após rodada premiada (P > 0)",
            "total_pares": pares_apos_premio,
            "premios_seguintes": premios_apos_premio,
            "proporcao_observada": prop_apos_premio,
            "status": status_apos_premio,
            "prob_teorica": PROBABILIDADE_TEORICA_PREMIO,
        },
        "apos_sem_premio": {
            "condicao": "Após rodada sem prêmio (P = 0)",
            "total_pares": pares_apos_sem_premio,
            "premios_seguintes": premios_apos_sem_premio,
            "proporcao_observada": prop_apos_sem_premio,
            "status": status_apos_sem_premio,
            "prob_teorica": PROBABILIDADE_TEORICA_PREMIO,
        },
    }


# ==============================================================================
# Estatísticas do Experimento 5
# ==============================================================================

def calcular_comparacao_e5(
    registros_base: List[ResultadoRodada],
) -> Dict[str, Any]:
    """
    Compara a Tabela Base com a Tabela Aumentada (+10%) sobre a MESMA sequência
    de 10.000 resultados do Experimento 1 (sem sortear nova sequência).
    """
    n = len(registros_base)
    if n == 0:
        raise ValueError("Lista de registros vazia.")

    # 1. Indicadores da Tabela Base
    premios_base = [r.premio for r in registros_base]
    lucros_base = [r.lucro for r in registros_base]
    premiados_base = [r.premiado for r in registros_base]

    premio_medio_base_obs = sum(premios_base) / n
    lucro_medio_base_obs = sum(lucros_base) / n
    rtp_base_obs = (sum(premios_base) / (n * CUSTO_APOSTA)) * 100.0
    freq_premio_base_obs = sum(1 for p in premiados_base if p) / n

    # 2. Indicadores da Tabela Aumentada (+10%) sobre os mesmos sorteios
    premios_aum: List[float] = []
    lucros_aum: List[float] = []
    premiados_aum: List[bool] = []

    for r in registros_base:
        comb = r.combinacao_central
        if comb in PAGAMENTOS_AUMENTADOS_10:
            p = float(PAGAMENTOS_AUMENTADOS_10[comb])
            x = p - CUSTO_APOSTA
            prem = True
        else:
            p = 0.0
            x = -float(CUSTO_APOSTA)
            prem = False

        premios_aum.append(p)
        lucros_aum.append(x)
        premiados_aum.append(prem)

    premio_medio_aum_obs = sum(premios_aum) / n
    lucro_medio_aum_obs = sum(lucros_aum) / n
    rtp_aum_obs = (sum(premios_aum) / (n * CUSTO_APOSTA)) * 100.0
    freq_premio_aum_obs = sum(1 for p in premiados_aum if p) / n

    return {
        "n_rodadas": n,
        "base": {
            "nome_tabela": "Tabela Base",
            "prob_premio_teorica": PROBABILIDADE_TEORICA_PREMIO,
            "freq_premio_observada": freq_premio_base_obs,
            "premio_medio_teorico": ESPERANCA_PREMIO_BASE,
            "premio_medio_observado": premio_medio_base_obs,
            "lucro_medio_teorico": ESPERANCA_LUCRO_BASE,
            "lucro_medio_observado": lucro_medio_base_obs,
            "rtp_teorico": RTP_TEORICO_BASE,
            "rtp_observado": rtp_base_obs,
        },
        "aumentada_10": {
            "nome_tabela": "Tabela +10%",
            "prob_premio_teorica": PROBABILIDADE_TEORICA_PREMIO,
            "freq_premio_observada": freq_premio_aum_obs,
            "premio_medio_teorico": ESPERANCA_PREMIO_AUMENTADO,
            "premio_medio_observado": premio_medio_aum_obs,
            "lucro_medio_teorico": ESPERANCA_LUCRO_AUMENTADO,
            "lucro_medio_observado": lucro_medio_aum_obs,
            "rtp_teorico": RTP_TEORICO_AUMENTADO,
            "rtp_observado": rtp_aum_obs,
        },
    }

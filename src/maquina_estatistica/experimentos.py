"""
Módulo de Orquestração dos Cinco Experimentos Obrigatórios.

Garante o controle estrito dos parâmetros, o reuso das sequências
(E1 fornece a sequência comum para E2, E4 e E5) e a reprodutibilidade dos resultados.
"""

from typing import Any, Dict, List, Optional, Tuple

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
from maquina_estatistica.estatisticas import (
    calcular_comparacao_e5,
    calcular_estatisticas_e1,
    calcular_estatisticas_e3,
    calcular_medias_acumuladas,
    calcular_probabilidades_condicionais_e4,
    resumir_medias_pontos_e2,
)
from maquina_estatistica.modelo import ResultadoRodada
from maquina_estatistica.simulacao import (
    ResultadoSessao,
    criar_gerador,
    simular_experimento3_participantes,
    simular_sequencia,
)


def executar_experimento_1(
    seed: int = SEED_E1,
    n_rodadas: int = RODADAS_E1,
) -> Tuple[List[ResultadoRodada], Dict[str, Any]]:
    """
    Executa o Experimento 1:
    - 10.000 rodadas com semente 2026.
    - Classificação nas 6 categorias de lucro.
    - Contagens, frequências relativas, média, RTP, proporção de prêmios e s (N-1).
    - Retorna a lista de rodadas (para reuso) e o dicionário de estatísticas.
    """
    rng = criar_gerador(seed)
    registros = simular_sequencia(n_rodadas=n_rodadas, rng=rng)
    stats = calcular_estatisticas_e1(registros)
    stats["seed"] = seed
    return registros, stats


def executar_experimento_2(
    registros_2026: List[ResultadoRodada],
    seeds: Tuple[int, ...] = SEEDS_E2,
    n_rodadas: int = RODADAS_E2,
    pontos: Tuple[int, ...] = PONTOS_E2,
) -> Dict[str, Any]:
    """
    Executa o Experimento 2:
    - 3 sequências de 10.000 rodadas com sementes 10, 2026 e 123456.
    - REUTILIZA a sequência de seed 2026 gerada no Experimento 1.
    - Calcula as médias acumuladas nas posições 100, 1.000 e 10.000.
    - Realiza o teste de verificação de reprodutibilidade da semente 2026 (10 primeiros resultados).
    """
    trajetorias_medias: Dict[int, List[float]] = {}
    tabela_3x3: Dict[int, Dict[int, float]] = {}

    for s in seeds:
        if s == SEED_E1:
            # Reutilização obrigatória da sequência do Experimento 1
            lucros = [r.lucro for r in registros_2026]
        else:
            # Geração independente para as outras sementes
            rng = criar_gerador(s)
            regs = simular_sequencia(n_rodadas=n_rodadas, rng=rng)
            lucros = [r.lucro for r in regs]

        medias_acum = calcular_medias_acumuladas(lucros)
        trajetorias_medias[s] = medias_acum
        tabela_3x3[s] = resumir_medias_pontos_e2(medias_acum, pontos=pontos)

    # Verificação de reprodutibilidade:
    # Gerar novamente com seed 2026 e comparar os 10 primeiros resultados
    rng_check = criar_gerador(SEED_E1)
    regs_check = simular_sequencia(n_rodadas=10, rng=rng_check)

    primeiros_originais = [r.combinacao_central for r in registros_2026[:10]]
    primeiros_repeticao = [r.combinacao_central for r in regs_check]
    reproduziu = (primeiros_originais == primeiros_repeticao)

    comparacao_10 = []
    for idx, (orig, rep) in enumerate(zip(registros_2026[:10], regs_check), start=1):
        comparacao_10.append({
            "rodada": idx,
            "original_paradas": orig.paradas,
            "original_comb": orig.combinacao_central,
            "repeticao_paradas": rep.paradas,
            "repeticao_comb": rep.combinacao_central,
            "coincidem": (orig.paradas == rep.paradas and orig.combinacao_central == rep.combinacao_central),
        })

    return {
        "seeds": seeds,
        "n_rodadas": n_rodadas,
        "pontos_verificacao": pontos,
        "tabela_3x3": tabela_3x3,
        "trajetorias_medias": trajetorias_medias,
        "reprodutibilidade_confirmada": reproduziu,
        "comparacao_10_primeiros": comparacao_10,
    }


def executar_experimento_3(
    seed: int = SEED_E3,
    num_participantes: int = PARTICIPANTES_E3,
) -> Tuple[List[ResultadoSessao], Dict[str, Any]]:
    """
    Executa o Experimento 3:
    - 100 participantes virtuais com saldo inicial de 100 créditos.
    - Semente 42 inicializada uma única vez no início e mantida contínua.
    - Parada ao atingir 500 rodadas ou quando saldo < 1.
    - Retorna a lista das 100 sessões e o resumo estatístico.
    """
    rng = criar_gerador(seed)
    sessoes = simular_experimento3_participantes(
        rng=rng,
        num_participantes=num_participantes,
    )
    stats = calcular_estatisticas_e3(sessoes)
    stats["seed"] = seed
    return sessoes, stats


def executar_experimento_4(
    registros_2026: List[ResultadoRodada],
) -> Dict[str, Any]:
    """
    Executa o Experimento 4:
    - REUTILIZA os 10.000 resultados do Experimento 1.
    - Avalia os 9.999 pares consecutivos.
    - Condição: Primeira rodada premiada vs sem prêmio.
    - Mede a chance de prêmio na rodada imediatamente seguinte.
    """
    stats = calcular_probabilidades_condicionais_e4(registros_2026)
    return stats


def executar_experimento_5(
    registros_2026: List[ResultadoRodada],
) -> Dict[str, Any]:
    """
    Executa o Experimento 5:
    - REUTILIZA os mesmos 10.000 resultados do Experimento 1.
    - Compara a Tabela Base com a Tabela +10% sem sortear nova sequência.
    - Avalia probabilidade, prêmio médio, lucro médio e RTP.
    """
    stats = calcular_comparacao_e5(registros_2026)
    return stats


def executar_todos_experimentos() -> Dict[str, Any]:
    """
    Executa a suíte completa dos 5 experimentos de forma integrada e encadeada,
    respeitando todas as regras de reuso de sequências.
    """
    # 1. Experimento 1 (gera a sequência mestra seed 2026)
    regs_e1, stats_e1 = executar_experimento_1()

    # 2. Experimento 2 (reutiliza regs_e1 para seed 2026)
    stats_e2 = executar_experimento_2(registros_2026=regs_e1)

    # 3. Experimento 3 (seed 42 única, 100 participantes)
    sessoes_e3, stats_e3 = executar_experimento_3()

    # 4. Experimento 4 (reutiliza regs_e1)
    stats_e4 = executar_experimento_4(registros_2026=regs_e1)

    # 5. Experimento 5 (reutiliza regs_e1)
    stats_e5 = executar_experimento_5(registros_2026=regs_e1)

    return {
        "e1_registros": regs_e1,
        "e1_stats": stats_e1,
        "e2_stats": stats_e2,
        "e3_sessoes": sessoes_e3,
        "e3_stats": stats_e3,
        "e4_stats": stats_e4,
        "e5_stats": stats_e5,
    }

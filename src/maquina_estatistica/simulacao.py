"""
Módulo de Simulação e Controle Pseudoaleatório.

Administra o gerador random.Random com controle estrito de sementes,
execução de rodadas individuais, sequências de N rodadas e sessões de apostas
com saldo limitado e critério de parada.
"""

from dataclasses import dataclass, field
import random
from typing import Dict, List, Optional, Tuple

from maquina_estatistica.config import (
    CUSTO_APOSTA,
    MAX_RODADAS_E3,
    NUM_ROLOS,
    NUM_SIMBOLOS,
    PAGAMENTOS_BASE,
    PARTICIPANTES_E3,
    SALDO_INICIAL_E3,
    SEED_E3,
)
from maquina_estatistica.modelo import ResultadoRodada, criar_resultado_rodada


def criar_gerador(seed: Optional[int] = None) -> random.Random:
    """
    Cria uma instância explícita de random.Random com a semente indicada.
    Garante controle determinístico e isolamento do estado aleatório.
    """
    return random.Random(seed)


def sortear_paradas(rng: random.Random) -> Tuple[int, int, int]:
    """
    Sorteia independentemente as 3 paradas K uniformes em {0, 1, 2, 3, 4}.
    Cada posição tem probabilidade estrita de 1/5 = 0.20.
    """
    p1 = rng.randrange(NUM_SIMBOLOS)
    p2 = rng.randrange(NUM_SIMBOLOS)
    p3 = rng.randrange(NUM_SIMBOLOS)
    return (p1, p2, p3)


def executar_rodada(
    indice: int,
    rng: random.Random,
    pagamentos: Optional[Dict[str, float]] = None,
    custo_aposta: float = CUSTO_APOSTA,
) -> ResultadoRodada:
    """Executa uma única rodada usando o gerador pseudoaleatório fornecido."""
    paradas = sortear_paradas(rng)
    return criar_resultado_rodada(
        indice=indice,
        paradas=paradas,
        pagamentos=pagamentos,
        custo_aposta=custo_aposta,
    )


def simular_sequencia(
    n_rodadas: int,
    rng: random.Random,
    pagamentos: Optional[Dict[str, float]] = None,
    custo_aposta: float = CUSTO_APOSTA,
) -> List[ResultadoRodada]:
    """
    Simula uma sequência de N rodadas consecutivas utilizando o mesmo gerador,
    sem reinicialização da semente dentro do laço.
    """
    if n_rodadas <= 0:
        raise ValueError("O número de rodadas deve ser positivo.")

    registros: List[ResultadoRodada] = []
    for i in range(1, n_rodadas + 1):
        reg = executar_rodada(
            indice=i,
            rng=rng,
            pagamentos=pagamentos,
            custo_aposta=custo_aposta,
        )
        registros.append(reg)
    return registros


@dataclass
class ResultadoSessao:
    """Registro dos dados consolidados de uma sessão com saldo limitado."""

    id_participante: int
    saldo_inicial: float
    saldo_final: float
    rodadas_executadas: int
    esgotamento: bool  # True se saldo ficou < custo_aposta
    classificacao: str  # 'ganho', 'empate', 'perda'
    historico_saldos: List[float] = field(default_factory=list)


def simular_sessao_participante(
    id_participante: int,
    rng: random.Random,
    saldo_inicial: float = SALDO_INICIAL_E3,
    custo_aposta: float = CUSTO_APOSTA,
    max_rodadas: int = MAX_RODADAS_E3,
    pagamentos: Optional[Dict[str, float]] = None,
    gravar_trajetoria: bool = True,
) -> ResultadoSessao:
    """
    Simula uma sessão completa para um participante virtual.

    Regras obrigatórias:
    - Inicia com saldo_inicial (100).
    - A cada rodada, deduz a aposta e soma o prêmio bruto (saldo += lucro).
    - Encerra quando saldo < custo_aposta (esgotamento) OU atinge max_rodadas (500).
    - Não gera rodada adicional após encerramento.
    """
    saldo = float(saldo_inicial)
    historico: List[float] = [saldo] if gravar_trajetoria else []
    rodadas = 0
    esgotou = False

    while rodadas < max_rodadas:
        if saldo < custo_aposta:
            esgotou = True
            break

        rodadas += 1
        reg = executar_rodada(
            indice=rodadas,
            rng=rng,
            pagamentos=pagamentos,
            custo_aposta=custo_aposta,
        )
        saldo += reg.lucro
        if gravar_trajetoria:
            historico.append(saldo)

        if saldo < custo_aposta:
            esgotou = True
            break

    # Classificação
    if saldo > saldo_inicial:
        classificacao = "ganho"
    elif esgotou or saldo < saldo_inicial:
        classificacao = "perda"
    else:
        classificacao = "empate"

    return ResultadoSessao(
        id_participante=id_participante,
        saldo_inicial=saldo_inicial,
        saldo_final=saldo,
        rodadas_executadas=rodadas,
        esgotamento=esgotou,
        classificacao=classificacao,
        historico_saldos=historico,
    )


def simular_experimento3_participantes(
    rng: random.Random,
    num_participantes: int = PARTICIPANTES_E3,
    saldo_inicial: float = SALDO_INICIAL_E3,
    custo_aposta: float = CUSTO_APOSTA,
    max_rodadas: int = MAX_RODADAS_E3,
    pagamentos: Optional[Dict[str, float]] = None,
) -> List[ResultadoSessao]:
    """
    Executa o Experimento 3:
    100 participantes simulados sequencialmente com um único RNG mantido contínuo.
    """
    sessoes: List[ResultadoSessao] = []
    for pid in range(1, num_participantes + 1):
        # Gravamos histórico completo para todos os participantes para possibilitar análises
        sessao = simular_sessao_participante(
            id_participante=pid,
            rng=rng,
            saldo_inicial=saldo_inicial,
            custo_aposta=custo_aposta,
            max_rodadas=max_rodadas,
            pagamentos=pagamentos,
            gravar_trajetoria=True,
        )
        sessoes.append(sessao)
    return sessoes

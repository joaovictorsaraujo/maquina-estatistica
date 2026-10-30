"""
Módulo de Exportação de Resultados e Metadados Experimentais.

Gera os arquivos CSV para tabelas e métricas com nomenclatura estável,
mantém precisão numérica e cria manifestos de metadados para garantir
rastreabilidade e reprodutibilidade científica.
"""

from datetime import datetime
import json
from pathlib import Path
import platform
import sys
from typing import Any, Dict, List, Optional

import pandas as pd

from maquina_estatistica.config import (
    DIR_PROJETO,
    DIR_RELATORIOS,
    DIR_RESULTADOS,
    DIR_TABELAS,
    garantir_diretorios,
)
from maquina_estatistica.modelo import ResultadoRodada
from maquina_estatistica.simulacao import ResultadoSessao


def exportar_e1(stats_e1: Dict[str, Any], diretorio: Optional[Path] = None) -> Dict[str, Path]:
    """Exporta tabelas CSV para o Experimento 1."""
    alvo = diretorio or DIR_TABELAS
    alvo.mkdir(parents=True, exist_ok=True)
    caminhos: Dict[str, Path] = {}

    # 1. Tabela de 6 categorias
    df_cat = pd.DataFrame(stats_e1["tabela_categorias"])
    caminho_cat = alvo / "e1_frequencias.csv"
    df_cat.to_csv(caminho_cat, index=False, encoding="utf-8")
    caminhos["frequencias"] = caminho_cat

    # 2. Resumo de métricas
    resumo = [
        {"metrica": "Total de rodadas (N)", "valor": stats_e1["n_rodadas"]},
        {"metrica": "Semente utilizada", "valor": stats_e1.get("seed", 2026)},
        {"metrica": "Soma das contagens", "valor": stats_e1["soma_contagens"]},
        {"metrica": "Soma das frequências relativas", "valor": f"{stats_e1['soma_freq_relativas']:.6f}"},
        {"metrica": "Lucro médio observado (créditos)", "valor": f"{stats_e1['lucro_medio_observado']:.6f}"},
        {"metrica": "Lucro médio teórico E[X] (créditos)", "valor": f"{stats_e1['lucro_medio_teorico']:.6f}"},
        {"metrica": "RTP observado (%)", "valor": f"{stats_e1['rtp_observado']:.2f}%"},
        {"metrica": "RTP teórico (%)", "valor": f"{stats_e1['rtp_teorico']:.2f}%"},
        {"metrica": "Proporção premiada observada", "valor": f"{stats_e1['proporcao_premiada_observada'] * 100:.2f}%"},
        {"metrica": "Probabilidade teórica de prêmio", "valor": f"{stats_e1['proporcao_premiada_teorica'] * 100:.2f}%"},
        {"metrica": "Desvio-padrão amostral s (divisor N-1)", "valor": f"{stats_e1['desvio_padrao_amostral']:.6f}"},
        {"metrica": "Erro-padrão da média", "valor": f"{stats_e1['erro_padrao']:.6f}"},
        {"metrica": "IC 95% Lucro Médio (Limite Inferior)", "valor": f"{stats_e1['ic_95_lucro'][0]:.6f}"},
        {"metrica": "IC 95% Lucro Médio (Limite Superior)", "valor": f"{stats_e1['ic_95_lucro'][1]:.6f}"},
    ]
    df_res = pd.DataFrame(resumo)
    caminho_res = alvo / "e1_metricas_resumo.csv"
    df_res.to_csv(caminho_res, index=False, encoding="utf-8")
    caminhos["resumo"] = caminho_res

    return caminhos


def exportar_e2(stats_e2: Dict[str, Any]) -> Dict[str, Path]:
    """Exporta tabela 3x3 e relatório de reprodutibilidade para o Experimento 2."""
    garantir_diretorios()
    caminhos: Dict[str, Path] = {}

    # 1. Tabela 3x3 de Médias Acumuladas
    linhas = []
    tabela_3x3 = stats_e2["tabela_3x3"]
    for s, pontos_dict in tabela_3x3.items():
        for ponto, media in pontos_dict.items():
            linhas.append({
                "seed": s,
                "rodadas_acumuladas": ponto,
                "media_acumulada_lucro": media,
            })
    df_3x3 = pd.DataFrame(linhas)
    caminho_3x3 = DIR_TABELAS / "e2_medias_acumuladas.csv"
    df_3x3.to_csv(caminho_3x3, index=False, encoding="utf-8")
    caminhos["medias_acumuladas"] = caminho_3x3

    # 2. Verificação de Reprodutibilidade (10 primeiros resultados da Seed 2026)
    df_10 = pd.DataFrame(stats_e2["comparacao_10_primeiros"])
    caminho_10 = DIR_TABELAS / "e2_reprodutibilidade_10_primeiros.csv"
    df_10.to_csv(caminho_10, index=False, encoding="utf-8")
    caminhos["reprodutibilidade"] = caminho_10

    return caminhos


def exportar_e3(
    sessoes: List[ResultadoSessao],
    stats_e3: Dict[str, Any],
    max_rodadas_grafico: int = 500,
) -> Dict[str, Path]:
    """Exporta resultados individuais das 100 sessões e trajetórias para o Experimento 3."""
    garantir_diretorios()
    caminhos: Dict[str, Path] = {}

    # 1. Sessões individuais dos 100 participantes
    dados_sessoes = [
        {
            "id_participante": s.id_participante,
            "saldo_inicial": s.saldo_inicial,
            "saldo_final": s.saldo_final,
            "rodadas_executadas": s.rodadas_executadas,
            "esgotamento": s.esgotamento,
            "classificacao": s.classificacao,
        }
        for s in sessoes
    ]
    df_sess = pd.DataFrame(dados_sessoes)
    caminho_sess = DIR_TABELAS / "e3_sessoes.csv"
    df_sess.to_csv(caminho_sess, index=False, encoding="utf-8")
    caminhos["sessoes"] = caminho_sess

    # 2. Resumo estatístico
    resumo = [
        {"metrica": "Total de participantes", "valor": stats_e3["num_participantes"]},
        {"metrica": "Semente utilizada", "valor": stats_e3.get("seed", 42)},
        {"metrica": "Participantes com Ganho (B_f > 100)", "valor": f"{stats_e3['ganhos_contagem']} ({stats_e3['ganhos_proporcao'] * 100:.1f}%)"},
        {"metrica": "Participantes com Empate (B_f = 100)", "valor": f"{stats_e3['empates_contagem']} ({stats_e3['empates_proporcao'] * 100:.1f}%)"},
        {"metrica": "Participantes com Perda (B_f < 100)", "valor": f"{stats_e3['perdas_contagem']} ({stats_e3['perdas_proporcao'] * 100:.1f}%)"},
        {"metrica": "Soma das proporções (G+E+P)", "valor": f"{stats_e3['soma_proporcoes'] * 100:.1f}%"},
        {"metrica": "Taxa de Esgotamento (saldo < 1)", "valor": f"{stats_e3['esgotamentos_contagem']} ({stats_e3['esgotamentos_proporcao'] * 100:.1f}%)"},
        {"metrica": "Saldo final mínimo (créditos)", "valor": f"{stats_e3['saldo_final_min']:.2f}"},
        {"metrica": "Saldo final máximo (créditos)", "valor": f"{stats_e3['saldo_final_max']:.2f}"},
        {"metrica": "Saldo final médio (créditos)", "valor": f"{stats_e3['saldo_final_media']:.2f}"},
        {"metrica": "Saldo final mediano (créditos)", "valor": f"{stats_e3['saldo_final_mediana']:.2f}"},
        {"metrica": "Saldo final desvio-padrão (créditos)", "valor": f"{stats_e3['saldo_final_desvio_padrao']:.2f}"},
        {"metrica": "Média de rodadas jogadas", "valor": f"{stats_e3['rodadas_media']:.1f}"},
        {"metrica": "Mediana de rodadas jogadas", "valor": f"{stats_e3['rodadas_mediana']:.1f}"},
    ]
    df_res = pd.DataFrame(resumo)
    caminho_res = DIR_TABELAS / "e3_resumo_estatistico.csv"
    df_res.to_csv(caminho_res, index=False, encoding="utf-8")
    caminhos["resumo"] = caminho_res

    # 3. Trajetórias dos 5 primeiros participantes para o gráfico
    linhas_traj = []
    for s in sessoes[:5]:
        hist = list(s.historico_saldos)
        while len(hist) <= max_rodadas_grafico:
            hist.append(s.saldo_final)
        for r_num, sald in enumerate(hist):
            linhas_traj.append({
                "id_participante": s.id_participante,
                "rodada": r_num,
                "saldo": sald,
            })
    df_traj = pd.DataFrame(linhas_traj)
    caminho_traj = DIR_TABELAS / "e3_trajetorias.csv"
    df_traj.to_csv(caminho_traj, index=False, encoding="utf-8")
    caminhos["trajetorias"] = caminho_traj

    return caminhos


def exportar_e4(stats_e4: Dict[str, Any]) -> Dict[str, Path]:
    """Exporta a tabela de probabilidades condicionais do Experimento 4."""
    garantir_diretorios()
    caminhos: Dict[str, Path] = {}

    g_prem = stats_e4["apos_premio"]
    g_sem = stats_e4["apos_sem_premio"]

    linhas = [
        {
            "condicao_anterior": g_prem["condicao"],
            "total_pares": g_prem["total_pares"],
            "premios_seguintes": g_prem["premios_seguintes"],
            "proporcao_observada": (
                f"{g_prem['proporcao_observada'] * 100:.2f}%"
                if g_prem["proporcao_observada"] is not None
                else "não estimável"
            ),
            "referencia_teorica": f"{g_prem['prob_teorica'] * 100:.2f}%",
            "status": g_prem["status"],
        },
        {
            "condicao_anterior": g_sem["condicao"],
            "total_pares": g_sem["total_pares"],
            "premios_seguintes": g_sem["premios_seguintes"],
            "proporcao_observada": (
                f"{g_sem['proporcao_observada'] * 100:.2f}%"
                if g_sem["proporcao_observada"] is not None
                else "não estimável"
            ),
            "referencia_teorica": f"{g_sem['prob_teorica'] * 100:.2f}%",
            "status": g_sem["status"],
        },
    ]
    df_e4 = pd.DataFrame(linhas)
    caminho_e4 = DIR_TABELAS / "e4_condicional.csv"
    df_e4.to_csv(caminho_e4, index=False, encoding="utf-8")
    caminhos["condicional"] = caminho_e4

    return caminhos


def exportar_e5(stats_e5: Dict[str, Any]) -> Dict[str, Path]:
    """Exporta a tabela comparativa entre Tabela Base e Tabela +10% do Experimento 5."""
    garantir_diretorios()
    caminhos: Dict[str, Path] = {}

    b = stats_e5["base"]
    a = stats_e5["aumentada_10"]

    linhas = [
        {
            "tabela": b["nome_tabela"],
            "prob_premio_teorica": f"{b['prob_premio_teorica'] * 100:.2f}%",
            "freq_premio_observada": f"{b['freq_premio_observada'] * 100:.2f}%",
            "premio_medio_teorico": f"{b['premio_medio_teorico']:.4f}",
            "premio_medio_observado": f"{b['premio_medio_observado']:.4f}",
            "lucro_medio_teorico": f"{b['lucro_medio_teorico']:.4f}",
            "lucro_medio_observado": f"{b['lucro_medio_observado']:.4f}",
            "rtp_teorico": f"{b['rtp_teorico']:.2f}%",
            "rtp_observado": f"{b['rtp_observado']:.2f}%",
        },
        {
            "tabela": a["nome_tabela"],
            "prob_premio_teorica": f"{a['prob_premio_teorica'] * 100:.2f}%",
            "freq_premio_observada": f"{a['freq_premio_observada'] * 100:.2f}%",
            "premio_medio_teorico": f"{a['premio_medio_teorico']:.4f}",
            "premio_medio_observado": f"{a['premio_medio_observado']:.4f}",
            "lucro_medio_teorico": f"{a['lucro_medio_teorico']:.4f}",
            "lucro_medio_observado": f"{a['lucro_medio_observado']:.4f}",
            "rtp_teorico": f"{a['rtp_teorico']:.2f}%",
            "rtp_observado": f"{a['rtp_observado']:.2f}%",
        },
    ]
    df_e5 = pd.DataFrame(linhas)
    caminho_e5 = DIR_TABELAS / "e5_comparacao.csv"
    df_e5.to_csv(caminho_e5, index=False, encoding="utf-8")
    caminhos["comparacao"] = caminho_e5

    return caminhos


def exportar_manifesto_metadados(
    dados_extras: Optional[Dict[str, Any]] = None,
    caminho_saida: Optional[Path] = None,
) -> Path:
    """Gera manifesto formal em JSON registrando o ambiente, sementes e parâmetros."""
    garantir_diretorios()
    manifesto = {
        "projeto": "Máquina Estatística — Trabalho I (IFES Serra)",
        "disciplina": "Probabilidade e Estatística I",
        "timestamp_execucao": datetime.now().isoformat(),
        "ambiente": {
            "python_version": sys.version,
            "plataforma": platform.platform(),
            "sistema_operacional": platform.system(),
            "arquitetura": platform.machine(),
            "gerador_pseudoaleatorio": "Python random.Random (Mersenne Twister MT19937)",
        },
        "parametros_experimentais": {
            "E1": {"rodadas": 10000, "seed": 2026, "custo_aposta": 1.0},
            "E2": {"seeds": [10, 2026, 123456], "rodadas": 10000, "pontos": [100, 1000, 10000]},
            "E3": {"participantes": 100, "saldo_inicial": 100.0, "max_rodadas": 500, "seed": 42},
            "E4": {"pares_analisados": 9999, "seed_origem": 2026},
            "E5": {"rodadas": 10000, "seed_origem": 2026, "acrescimo_tabela": 0.10},
        },
        "extras": dados_extras or {},
    }
    caminho = caminho_saida or (DIR_RESULTADOS / "manifesto_execucao.json")
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(manifesto, f, indent=2, ensure_ascii=False)
    return caminho


def exportar_relatorio_sintese(
    stats_e1: Dict[str, Any],
    stats_e2: Dict[str, Any],
    stats_e3: Dict[str, Any],
    stats_e4: Dict[str, Any],
    stats_e5: Dict[str, Any],
) -> Path:
    """
    Gera um relatório sintético e estruturado em Markdown,
    reunindo todos os resultados para alimentar diretamente o relatório de 6 a 10 páginas.
    """
    garantir_diretorios()
    caminho = DIR_RELATORIOS / "sintese_experimentos.md"

    linhas = [
        "# Síntese dos Resultados dos Cinco Experimentos — Máquina Estatística",
        f"**Data da Execução:** {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}",
        "**Ambiente:** Python " + sys.version.split()[0] + f" ({platform.system()})",
        "**Aviso Legal:** *Simulador acadêmico — somente créditos fictícios*",
        "",
        "---",
        "## 1. Experimento 1: As frequências acompanham as probabilidades?",
        f"- **Rodadas:** {stats_e1['n_rodadas']:,} | **Semente:** {stats_e1.get('seed', 2026)}",
        f"- **Soma das contagens:** {stats_e1['soma_contagens']} (esperado: 10.000)",
        f"- **Soma das freq. relativas:** {stats_e1['soma_freq_relativas']:.6f} (esperado: 1.000000)",
        f"- **Lucro médio observado:** {stats_e1['lucro_medio_observado']:+.4f} créditos (Teórico: {stats_e1['lucro_medio_teorico']:+.4f})",
        f"- **RTP observado:** {stats_e1['rtp_observado']:.2f}% (Teórico: {stats_e1['rtp_teorico']:.2f}%)",
        f"- **Proporção de vitórias:** {stats_e1['proporcao_premiada_observada'] * 100:.2f}% (Teórico: {stats_e1['proporcao_premiada_teorica'] * 100:.2f}%)",
        f"- **Desvio-padrão amostral (s com N-1):** {stats_e1['desvio_padrao_amostral']:.4f} créditos",
        f"- **Intervalo de Confiança 95% Lucro Médio:** [{stats_e1['ic_95_lucro'][0]:.4f}, {stats_e1['ic_95_lucro'][1]:.4f}]",
        "",
        "| Categoria (X) | Prêmio (P) | Combinação | Prob. Teórica | Contagem Obs. | Freq. Relativa | Diferença Abs. |",
        "|---|---|---|---|---|---|---|",
    ]

    for c in stats_e1["tabela_categorias"]:
        linhas.append(
            f"| {c['lucro_x']:+d} | {c['premio_p']:.1f} | {c['combinacao']} | {c['prob_teorica'] * 100:.2f}% | "
            f"{c['contagem']} | {c['freq_relativa'] * 100:.2f}% | {c['diferenca_abs'] * 100:.4f}% |"
        )

    linhas.extend([
        "",
        "---",
        "## 2. Experimento 2: O que muda quando aumentamos a amostra?",
        "- **Médias Acumuladas por Semente e Tamanho de Amostra:**",
        "",
        "| Semente | N = 100 | N = 1.000 | N = 10.000 |",
        "|---|---|---|---|",
    ])

    for s, pts in stats_e2["tabela_3x3"].items():
        linhas.append(f"| Seed {s} | {pts[100]:+.4f} | {pts[1000]:+.4f} | {pts[10000]:+.4f} |")

    linhas.extend([
        "",
        f"- **Verificação de Reprodutibilidade (Seed 2026):** "
        f"{'SUCESSO (10 primeiros resultados idênticos)' if stats_e2['reprodutibilidade_confirmada'] else 'FALHA'}",
        "",
        "---",
        "## 3. Experimento 3: O que acontece com um saldo limitado?",
        f"- **Participantes Virtuais:** {stats_e3['num_participantes']} | **Saldo Inicial:** 100 créditos | **Limite:** 500 rodadas | **Seed:** 42",
        f"- **Ganhos (B_f > 100):** {stats_e3['ganhos_contagem']} ({stats_e3['ganhos_proporcao'] * 100:.1f}%)",
        f"- **Empates (B_f = 100):** {stats_e3['empates_contagem']} ({stats_e3['empates_proporcao'] * 100:.1f}%)",
        f"- **Perdas (B_f < 100):** {stats_e3['perdas_contagem']} ({stats_e3['perdas_proporcao'] * 100:.1f}%)",
        f"- **Soma das Categorias:** {stats_e3['soma_proporcoes'] * 100:.1f}%",
        f"- **Taxa de Esgotamento (saldo < 1):** {stats_e3['esgotamentos_contagem']} ({stats_e3['esgotamentos_proporcao'] * 100:.1f}%)",
        f"- **Saldo Final:** Média = {stats_e3['saldo_final_media']:.2f} | Mediana = {stats_e3['saldo_final_mediana']:.2f} | Min = {stats_e3['saldo_final_min']:.2f} | Max = {stats_e3['saldo_final_max']:.2f}",
        f"- **Rodadas Executadas:** Média = {stats_e3['rodadas_media']:.1f} | Mediana = {stats_e3['rodadas_mediana']:.1f}",
        "",
        "---",
        "## 4. Experimento 4: Depois de perder, aumenta a chance de ganhar?",
        f"- **Pares Consecutivos Analisados:** {stats_e4['total_pares']:,} (reutilização das 10.000 rodadas do E1)",
        f"- **Referência Teórica de Independência:** 4.00% em qualquer condição",
        "",
        "| Condição na Rodada Atual | Total de Pares | Prêmios na Rodada Seguinte | Proporção Observada | Referência Teórica |",
        "|---|---|---|---|---|",
    ])

    gp = stats_e4["apos_premio"]
    gs = stats_e4["apos_sem_premio"]
    linhas.append(
        f"| {gp['condicao']} | {gp['total_pares']:,} | {gp['premios_seguintes']} | "
        f"{gp['proporcao_observada'] * 100:.2f}% | {gp['prob_teorica'] * 100:.2f}% |"
    )
    linhas.append(
        f"| {gs['condicao']} | {gs['total_pares']:,} | {gs['premios_seguintes']} | "
        f"{gs['proporcao_observada'] * 100:.2f}% | {gs['prob_teorica'] * 100:.2f}% |"
    )

    linhas.extend([
        "",
        "---",
        "## 5. Experimento 5: Prêmios maiores tornam o jogo favorável?",
        "- **Comparação Base vs Aumentada (+10%) sobre os mesmos 10.000 resultados:**",
        "",
        "| Indicador | Tabela Base (Teoria) | Tabela Base (Observado) | Tabela +10% (Teoria) | Tabela +10% (Observado) |",
        "|---|---|---|---|---|",
    ])

    b = stats_e5["base"]
    a = stats_e5["aumentada_10"]
    linhas.append(f"| Chance de Prêmio | {b['prob_premio_teorica'] * 100:.2f}% | {b['freq_premio_observada'] * 100:.2f}% | {a['prob_premio_teorica'] * 100:.2f}% | {a['freq_premio_observada'] * 100:.2f}% |")
    linhas.append(f"| Prêmio Médio Bruto | {b['premio_medio_teorico']:.4f} | {b['premio_medio_observado']:.4f} | {a['premio_medio_teorico']:.4f} | {a['premio_medio_observado']:.4f} |")
    linhas.append(f"| Lucro Líquido Médio | {b['lucro_medio_teorico']:+.4f} | {b['lucro_medio_observado']:+.4f} | {a['lucro_medio_teorico']:+.4f} | {a['lucro_medio_observado']:+.4f} |")
    linhas.append(f"| RTP (%) | {b['rtp_teorico']:.2f}% | {b['rtp_observado']:.2f}% | {a['rtp_teorico']:.2f}% | {a['rtp_observado']:.2f}% |")

    linhas.extend([
        "",
        "---",
        "### Conclusão Matemática Chave:",
        "- Embora o aumento de 10% eleve o RTP de 84,0% para 92,4% e reduza o prejuízo esperado por rodada de -0,16 para -0,076 créditos, a esperança matemática continua estritamente negativa.",
        "- A probabilidade de obter prêmio permanece inalterada em 4,00%, demonstrando que prêmios maiores não aumentam a frequência de vitórias nem eliminam a vantagem estatística da casa.",
    ])

    with open(caminho, "w", encoding="utf-8") as f:
        f.write("\n".join(linhas) + "\n")

    return caminho

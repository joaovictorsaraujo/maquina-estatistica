"""
Módulo de Geração e Exportação de Gráficos.

Utiliza matplotlib com backend 'Agg' para exportação não interativa e confiável.
Atende a todos os critérios de acessibilidade visual: eixos nomeados, unidades
explícitas, legendas, estilos de linhas distintos (sem depender apenas de cor) e
definição de DPI adequada para relatórios acadêmicos.
"""

from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import matplotlib
matplotlib.use("Agg")  # Garante execução sem interface gráfica (headless)
import matplotlib.pyplot as plt
import numpy as np

from maquina_estatistica.config import (
    DIR_GRAFICOS,
    ESPERANCA_LUCRO_BASE,
    garantir_diretorios,
)
from maquina_estatistica.simulacao import ResultadoSessao


def configurar_estilo_grafico() -> None:
    """Aplica padrões tipográficos e visuais limpos aos gráficos."""
    plt.rcParams.update({
        "font.family": "sans-serif",
        "font.size": 10,
        "axes.titlesize": 12,
        "axes.titleweight": "bold",
        "axes.labelsize": 10,
        "axes.labelweight": "bold",
        "legend.fontsize": 9,
        "figure.titlesize": 13,
        "grid.linestyle": "--",
        "grid.alpha": 0.5,
    })


def gerar_grafico_e1(
    tabela_categorias: List[Dict[str, Any]],
    caminho_saida: Optional[Path] = None,
    dpi: int = 300,
) -> Path:
    """
    Gera o gráfico de barras comparativo do Experimento 1:
    Probabilidade Teórica vs Frequência Observada (N = 10.000, seed 2026).
    """
    configurar_estilo_grafico()
    garantir_diretorios()

    if caminho_saida is None:
        caminho_saida = DIR_GRAFICOS / "e1_teoria_vs_observado.png"

    rotulos = [f"X={item['lucro_x']}\n({item['combinacao']})" for item in tabela_categorias]
    probs_teo = [item["prob_teorica"] * 100.0 for item in tabela_categorias]
    freqs_obs = [item["freq_relativa"] * 100.0 for item in tabela_categorias]

    x = np.arange(len(rotulos))
    largura = 0.35

    fig, ax = plt.subplots(figsize=(10, 5.5), constrained_layout=True)

    # Barras teóricas com preenchimento sólido e borda
    rects1 = ax.bar(
        x - largura / 2,
        probs_teo,
        largura,
        label="Teoria (Probabilidade %)",
        color="#2b5c8f",
        edgecolor="#1d3557",
        hatch="",
    )
    # Barras observadas com hachura diagonal para distinguir sem depender só de cor
    rects2 = ax.bar(
        x + largura / 2,
        freqs_obs,
        largura,
        label="Observado (Frequência Relativa %)",
        color="#e76f51",
        edgecolor="#b23b23",
        hatch="//",
    )

    ax.set_ylabel("Proporção (%)")
    ax.set_xlabel("Categoria de Lucro Líquido X (créditos)")
    ax.set_title("Experimento 1 — Comparação: Distribuição Teórica vs Frequências Observadas (N=10.000, Seed=2026)")
    ax.set_xticks(x)
    ax.set_xticklabels(rotulos, rotation=15, ha="right", fontsize=8.5)
    ax.legend(frameon=True, loc="upper right")
    ax.grid(axis="y", linestyle="--", alpha=0.5)

    # Anotações dos valores percentuais no topo das barras
    def autolabel(rects):
        for rect in rects:
            height = rect.get_height()
            texto = f"{height:.2f}%" if height < 10 else f"{height:.1f}%"
            ax.annotate(
                texto,
                xy=(rect.get_x() + rect.get_width() / 2, height),
                xytext=(0, 3),
                textcoords="offset points",
                ha="center",
                va="bottom",
                fontsize=7.5,
            )

    autolabel(rects1)
    autolabel(rects2)

    fig.savefig(caminho_saida, dpi=dpi)
    plt.close(fig)
    return caminho_saida


def gerar_grafico_e2(
    trajetorias_medias: Dict[int, List[float]],
    caminho_saida: Optional[Path] = None,
    dpi: int = 300,
) -> Path:
    """
    Gera o gráfico das trajetórias de médias acumuladas do Experimento 2:
    Mostra a evolução das médias acumuladas para as sementes 10, 2026 e 123456,
    com linha de referência teórica em E[X] = -0.16.
    """
    configurar_estilo_grafico()
    garantir_diretorios()

    if caminho_saida is None:
        caminho_saida = DIR_GRAFICOS / "e2_medias_acumuladas.png"

    fig, ax = plt.subplots(figsize=(10, 5.5), constrained_layout=True)

    # Estilos diferentes por semente (acessibilidade visual)
    estilos = {
        10: {"cor": "#2a9d8f", "linestyle": "-", "label": "Seed 10"},
        2026: {"cor": "#e63946", "linestyle": "--", "label": "Seed 2026 (Reutilizada E1)"},
        123456: {"cor": "#457b9d", "linestyle": "-.", "label": "Seed 123456"},
    }

    # Linha de referência teórica em -0.16
    ax.axhline(
        y=ESPERANCA_LUCRO_BASE,
        color="#1d3557",
        linestyle=":",
        linewidth=2.0,
        label=f"Esperança Teórica E[X] = {ESPERANCA_LUCRO_BASE:+.2f} créditos",
        zorder=5,
    )

    for s, serie in trajetorias_medias.items():
        n_pts = len(serie)
        x_vals = range(1, n_pts + 1)
        cfg = estilos.get(s, {"cor": "black", "linestyle": "-", "label": f"Seed {s}"})
        ax.plot(
            x_vals,
            serie,
            color=cfg["cor"],
            linestyle=cfg["linestyle"],
            linewidth=1.4,
            label=cfg["label"],
            alpha=0.9,
        )

    ax.set_title("Experimento 2 — Médias Acumuladas do Lucro Líquido e Lei dos Grandes Números")
    ax.set_xlabel("Número de Rodadas Acumuladas (N)")
    ax.set_ylabel("Lucro Líquido Médio Acumulado (créditos por rodada)")
    ax.set_xlim(1, 10000)
    ax.grid(True, linestyle="--", alpha=0.5)
    ax.legend(frameon=True, loc="lower right")

    fig.savefig(caminho_saida, dpi=dpi)
    plt.close(fig)
    return caminho_saida


def gerar_grafico_e3(
    sessoes: List[ResultadoSessao],
    num_exibidos: int = 5,
    max_rodadas: int = 500,
    caminho_saida: Optional[Path] = None,
    dpi: int = 300,
) -> Path:
    """
    Gera o gráfico das trajetórias de saldo dos primeiros participantes do Experimento 3.
    Conforme especificado:
    - Exibe os 5 primeiros participantes na ordem em que foram simulados (sem escolha por resultado).
    - Quando uma sessão termina antes de 500 rodadas, mantém o saldo constante até 500 para visualização uniforme.
    """
    configurar_estilo_grafico()
    garantir_diretorios()

    if caminho_saida is None:
        caminho_saida = DIR_GRAFICOS / "e3_saldos.png"

    fig, ax = plt.subplots(figsize=(10, 5.5), constrained_layout=True)

    # Linha de saldo inicial (100)
    ax.axhline(
        y=100.0,
        color="#4a4e69",
        linestyle=":",
        linewidth=1.5,
        label="Saldo Inicial (100 créditos)",
    )
    # Linha de esgotamento (< 1 crédito)
    ax.axhline(
        y=1.0,
        color="#d90429",
        linestyle="--",
        linewidth=1.2,
        label="Limite de Parada / Esgotamento (< 1 crédito)",
    )

    cores = ["#1d3557", "#e76f51", "#2a9d8f", "#f4a261", "#6a4c93"]
    estilos_linha = ["-", "--", "-.", ":", "-"]
    marcadores = ["o", "s", "^", "D", "v"]

    selecionados = sessoes[:num_exibidos]

    for idx, sessao in enumerate(selecionados):
        hist = list(sessao.historico_saldos)
        # Se a sessão encerrou antes das max_rodadas, estendemos o saldo final constante
        while len(hist) <= max_rodadas:
            hist.append(sessao.saldo_final)

        x_vals = range(len(hist))
        status_txt = f"{sessao.classificacao.upper()} (R={sessao.rodadas_executadas}, B_f={sessao.saldo_final:.1f})"
        lbl = f"Participante {sessao.id_participante}: {status_txt}"

        ax.plot(
            x_vals,
            hist,
            color=cores[idx % len(cores)],
            linestyle=estilos_linha[idx % len(estilos_linha)],
            linewidth=1.6,
            label=lbl,
            alpha=0.9,
        )

    ax.set_title("Experimento 3 — Trajetórias de Saldo dos 5 Primeiros Participantes (Seed 42)")
    ax.set_xlabel("Rodada da Sessão")
    ax.set_ylabel("Saldo de Créditos (Fictícios)")
    ax.set_xlim(0, max_rodadas)
    ax.grid(True, linestyle="--", alpha=0.5)
    ax.legend(frameon=True, loc="upper right", fontsize=8.5)

    fig.savefig(caminho_saida, dpi=dpi)
    plt.close(fig)
    return caminho_saida


def gerar_grafico_e5(
    stats_e5: Dict[str, Any],
    caminho_saida: Optional[Path] = None,
    dpi: int = 300,
) -> Path:
    """
    Gera gráfico comparativo do Experimento 5:
    Compara RTP e Lucro Médio entre Tabela Base e Tabela +10% (Teoria vs Observado).
    """
    configurar_estilo_grafico()
    garantir_diretorios()

    if caminho_saida is None:
        caminho_saida = DIR_GRAFICOS / "e5_comparacao_tabelas.png"

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.8), constrained_layout=True)

    base = stats_e5["base"]
    aum = stats_e5["aumentada_10"]

    # 1. Gráfico de RTP (%)
    categorias = ["Tabela Base", "Tabela +10%"]
    rtp_teo = [base["rtp_teorico"], aum["rtp_teorico"]]
    rtp_obs = [base["rtp_observado"], aum["rtp_observado"]]

    x = np.arange(len(categorias))
    largura = 0.35

    ax1.bar(x - largura / 2, rtp_teo, largura, label="RTP Teórico", color="#2a9d8f")
    ax1.bar(x + largura / 2, rtp_obs, largura, label="RTP Observado", color="#e76f51", hatch="//")
    ax1.axhline(100.0, color="#d90429", linestyle="--", label="Ponto de Equilíbrio (100%)")
    ax1.set_ylabel("RTP (%)")
    ax1.set_title("Comparação de RTP (Return to Player)")
    ax1.set_xticks(x)
    ax1.set_xticklabels(categorias)
    ax1.set_ylim(0, 115)
    ax1.legend(loc="lower right")
    ax1.grid(axis="y", linestyle="--", alpha=0.5)

    # 2. Gráfico de Lucro Líquido Médio (créditos)
    lucro_teo = [base["lucro_medio_teorico"], aum["lucro_medio_teorico"]]
    lucro_obs = [base["lucro_medio_observado"], aum["lucro_medio_observado"]]

    ax2.bar(x - largura / 2, lucro_teo, largura, label="E[X] Teórico", color="#264653")
    ax2.bar(x + largura / 2, lucro_obs, largura, label="Lucro Médio Obs.", color="#f4a261", hatch="\\\\")
    ax2.axhline(0.0, color="black", linestyle="-", linewidth=1.0)
    ax2.set_ylabel("Lucro Médio por Rodada (créditos)")
    ax2.set_title("Comparação do Lucro Líquido Esperado")
    ax2.set_xticks(x)
    ax2.set_xticklabels(categorias)
    ax2.legend(loc="lower right")
    ax2.grid(axis="y", linestyle="--", alpha=0.5)

    fig.suptitle("Experimento 5 — Efeito do Acréscimo de +10% nos Pagamentos (Mesmas 10.000 Rodadas)", fontsize=12, fontweight="bold")
    fig.savefig(caminho_saida, dpi=dpi)
    plt.close(fig)
    return caminho_saida

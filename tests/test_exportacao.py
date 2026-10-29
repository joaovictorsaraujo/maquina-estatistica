"""
Testes Unitários de Exportação de Dados e Metadados (exportacao.py).
Valida integridade estrutural dos CSVs gerados, manifestos JSON e relatórios de síntese.
"""

import json
from pathlib import Path
import pandas as pd
import pytest

from maquina_estatistica.config import DIR_TABELAS
from maquina_estatistica.experimentos import (
    executar_experimento_1,
    executar_experimento_2,
    executar_experimento_3,
    executar_experimento_4,
    executar_experimento_5,
)
from maquina_estatistica.exportacao import (
    exportar_e1,
    exportar_e2,
    exportar_e3,
    exportar_e4,
    exportar_e5,
    exportar_manifesto_metadados,
    exportar_relatorio_sintese,
)


def test_exportacao_e1():
    """Valida a exportação dos arquivos CSV do Experimento 1."""
    regs, stats = executar_experimento_1(seed=2026, n_rodadas=100)
    caminhos = exportar_e1(stats)

    assert "frequencias" in caminhos
    assert "resumo" in caminhos

    df_freq = pd.read_csv(caminhos["frequencias"])
    assert len(df_freq) == 6
    assert set(df_freq["lucro_x"]) == {-1, 4, 9, 14, 24, 49}
    assert "prob_teorica" in df_freq.columns
    assert "contagem" in df_freq.columns
    assert "freq_relativa" in df_freq.columns

    df_res = pd.read_csv(caminhos["resumo"])
    assert len(df_res) > 5


def test_exportacao_manifesto_json():
    """Valida a geração e sintaxe do arquivo de metadados JSON."""
    caminho = exportar_manifesto_metadados({"teste": True})
    assert caminho.exists()

    with open(caminho, "r", encoding="utf-8") as f:
        dados = json.load(f)

    assert "ambiente" in dados
    assert "parametros_experimentais" in dados
    assert dados["extras"]["teste"] is True
    assert "Mersenne Twister" in dados["ambiente"]["gerador_pseudoaleatorio"]

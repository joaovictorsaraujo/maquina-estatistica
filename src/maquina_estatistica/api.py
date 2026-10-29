"""
Módulo de API REST (FastAPI).

Disponibiliza os endpoints para integração com o frontend web interativo,
mantendo o Python como fonte estrita da verdade matemática e estatística.
"""

from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from maquina_estatistica.config import (
    AVISO_LEGAL,
    CUSTO_APOSTA,
    DIR_GRAFICOS,
    DIR_PROJETO,
    DIR_RELATORIOS,
    DIR_RESULTADOS,
    DIR_TABELAS,
    ESPERANCA_LUCRO_AUMENTADO,
    ESPERANCA_LUCRO_BASE,
    ESPERANCA_PREMIO_AUMENTADO,
    ESPERANCA_PREMIO_BASE,
    PAGAMENTOS_AUMENTADOS_10,
    PAGAMENTOS_BASE,
    PROBABILIDADE_TEORICA_PREMIO,
    RTP_TEORICO_AUMENTADO,
    RTP_TEORICO_BASE,
    SIMBOLOS,
    TOTAL_COMBINACOES_CENTRAIS,
    garantir_diretorios,
)
from maquina_estatistica.experimentos import (
    executar_experimento_1,
    executar_experimento_2,
    executar_experimento_3,
    executar_experimento_4,
    executar_experimento_5,
    executar_todos_experimentos,
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
from maquina_estatistica.graficos import (
    gerar_grafico_e1,
    gerar_grafico_e2,
    gerar_grafico_e3,
    gerar_grafico_e5,
)
from maquina_estatistica.modelo import ResultadoRodada
from maquina_estatistica.simulacao import criar_gerador, executar_rodada

app = FastAPI(
    title="Máquina Estatística — API",
    description="Backend oficial para o simulador acadêmico de Probabilidade e Estatística I (IFES Serra)",
    version="1.0.0",
)

# Habilita CORS para desenvolvimento local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache em memória para os resultados compartilhados da semente 2026
_CACHE_E1_REGS: Optional[List[ResultadoRodada]] = None
_CACHE_E1_STATS: Optional[Dict[str, Any]] = None


class RodadaRequest(BaseModel):
    seed: Optional[int] = Field(None, description="Semente inteira opcional para reprodução")


class RodadaResponse(BaseModel):
    indice: int
    paradas: List[int]
    tabuleiro: List[List[str]]
    linha_central: List[str]
    combinacao_central: str
    premio: float
    lucro: float
    premiado: bool
    explicacao_regra: str
    aviso: str = AVISO_LEGAL


@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "maquina-estatistica", "aviso": AVISO_LEGAL}


@app.get("/api/config")
def obter_configuracoes():
    """Retorna constantes, regras e parâmetros teóricos de referência."""
    return {
        "aviso_legal": AVISO_LEGAL,
        "simbolos": list(SIMBOLOS),
        "custo_aposta": CUSTO_APOSTA,
        "pagamentos_base": PAGAMENTOS_BASE,
        "pagamentos_aumentados_10": PAGAMENTOS_AUMENTADOS_10,
        "teoria": {
            "total_combinacoes": TOTAL_COMBINACOES_CENTRAIS,
            "prob_premio": PROBABILIDADE_TEORICA_PREMIO,
            "esperanca_premio_base": ESPERANCA_PREMIO_BASE,
            "esperanca_lucro_base": ESPERANCA_LUCRO_BASE,
            "rtp_base": RTP_TEORICO_BASE,
            "esperanca_premio_aumentado": ESPERANCA_PREMIO_AUMENTADO,
            "esperanca_lucro_aumentado": ESPERANCA_LUCRO_AUMENTADO,
            "rtp_aumentado": RTP_TEORICO_AUMENTADO,
        },
    }


@app.post("/api/rodada", response_model=RodadaResponse)
def sortear_rodada_endpoint(req: RodadaRequest = RodadaRequest()):
    """Sorteia uma rodada individual com ou sem semente determinística."""
    rng = criar_gerador(req.seed)
    r = executar_rodada(indice=1, rng=rng)
    return RodadaResponse(
        indice=r.indice,
        paradas=list(r.paradas),
        tabuleiro=[list(linha) for linha in r.tabuleiro],
        linha_central=list(r.linha_central),
        combinacao_central=r.combinacao_central,
        premio=r.premio,
        lucro=r.lucro,
        premiado=r.premiado,
        explicacao_regra=r.explicacao_regra,
        aviso=AVISO_LEGAL,
    )


@app.post("/api/experimentos/e1")
def executar_e1_endpoint():
    """Executa ou recupera o Experimento 1 (10.000 rodadas, seed 2026)."""
    global _CACHE_E1_REGS, _CACHE_E1_STATS
    if _CACHE_E1_REGS is None or _CACHE_E1_STATS is None:
        _CACHE_E1_REGS, _CACHE_E1_STATS = executar_experimento_1()
    return _CACHE_E1_STATS


@app.post("/api/experimentos/e2")
def executar_e2_endpoint():
    """Executa o Experimento 2 (seeds 10, 2026, 123456) com reuso do E1."""
    global _CACHE_E1_REGS
    if _CACHE_E1_REGS is None:
        _CACHE_E1_REGS, _CACHE_E1_STATS = executar_experimento_1()

    stats_e2 = executar_experimento_2(registros_2026=_CACHE_E1_REGS)

    # Subamostra para o frontend não sobrecarregar com 30.000 pontos em JSON
    # Amostramos a cada 20 rodadas para renderização suave nos gráficos
    series_amostradas = {}
    for s, serie in stats_e2["trajetorias_medias"].items():
        passo = 25
        pontos = []
        for i in range(0, len(serie), passo):
            pontos.append({"rodada": i + 1, "media": round(serie[i], 4)})
        # Garante último ponto
        if len(serie) % passo != 0:
            pontos.append({"rodada": len(serie), "media": round(serie[-1], 4)})
        series_amostradas[str(s)] = pontos

    return {
        "tabela_3x3": stats_e2["tabela_3x3"],
        "reprodutibilidade_confirmada": stats_e2["reprodutibilidade_confirmada"],
        "comparacao_10_primeiros": stats_e2["comparacao_10_primeiros"],
        "series_grafico": series_amostradas,
        "referencia_teorica": ESPERANCA_LUCRO_BASE,
    }


@app.post("/api/experimentos/e3")
def executar_e3_endpoint():
    """Executa o Experimento 3 (100 participantes, saldo 100, seed 42)."""
    sessoes, stats = executar_experimento_3()

    # Formatar trajetórias dos 5 primeiros para gráfico
    trajetorias_grafico = []
    for s in sessoes[:5]:
        hist = list(s.historico_saldos)
        # estender até 500 se parou antes
        while len(hist) <= 500:
            hist.append(s.saldo_final)
        passo = 2
        pontos = [{"rodada": r, "saldo": hist[r]} for r in range(0, len(hist), passo)]
        trajetorias_grafico.append({
            "id_participante": s.id_participante,
            "saldo_final": s.saldo_final,
            "rodadas": s.rodadas_executadas,
            "esgotou": s.esgotamento,
            "classificacao": s.classificacao,
            "pontos": pontos,
        })

    return {
        "estatisticas": stats,
        "trajetorias_5_primeiros": trajetorias_grafico,
    }


@app.post("/api/experimentos/e4")
def executar_e4_endpoint():
    """Executa o Experimento 4 (9.999 pares consecutivos reutilizados do E1)."""
    global _CACHE_E1_REGS
    if _CACHE_E1_REGS is None:
        _CACHE_E1_REGS, _ = executar_experimento_1()

    return executar_experimento_4(registros_2026=_CACHE_E1_REGS)


@app.post("/api/experimentos/e5")
def executar_e5_endpoint():
    """Executa o Experimento 5 (Comparação de Tabelas Base vs +10%)."""
    global _CACHE_E1_REGS
    if _CACHE_E1_REGS is None:
        _CACHE_E1_REGS, _ = executar_experimento_1()

    return executar_experimento_5(registros_2026=_CACHE_E1_REGS)


@app.post("/api/experimentos/executar-todos")
def executar_todos_endpoint():
    """Executa todos os 5 experimentos e regenera todos os arquivos físicos (CSV e PNG)."""
    global _CACHE_E1_REGS, _CACHE_E1_STATS
    res = executar_todos_experimentos()
    _CACHE_E1_REGS = res["e1_registros"]
    _CACHE_E1_STATS = res["e1_stats"]

    # Exportar arquivos
    exportar_e1(res["e1_stats"])
    exportar_e2(res["e2_stats"])
    exportar_e3(res["e3_sessoes"], res["e3_stats"])
    exportar_e4(res["e4_stats"])
    exportar_e5(res["e5_stats"])

    gerar_grafico_e1(res["e1_stats"]["tabela_categorias"])
    gerar_grafico_e2(res["e2_stats"]["trajetorias_medias"])
    gerar_grafico_e3(res["e3_sessoes"])
    gerar_grafico_e5(res["e5_stats"])

    exportar_manifesto_metadados()
    exportar_relatorio_sintese(
        res["e1_stats"], res["e2_stats"], res["e3_stats"], res["e4_stats"], res["e5_stats"]
    )

    return {"status": "sucesso", "mensagem": "Todos os experimentos foram executados e os arquivos foram atualizados."}


@app.get("/api/resultados/arquivos")
def listar_arquivos_gerados():
    """Lista todos os arquivos CSV e PNG disponíveis para download ou visualização."""
    garantir_diretorios()
    tabelas = [
        {"nome": f.name, "tamanho_kb": round(f.stat().st_size / 1024, 1), "tipo": "csv"}
        for f in sorted(DIR_TABELAS.glob("*.csv"))
    ]
    graficos = [
        {"nome": f.name, "tamanho_kb": round(f.stat().st_size / 1024, 1), "tipo": "png"}
        for f in sorted(DIR_GRAFICOS.glob("*.png"))
    ]
    return {"tabelas": tabelas, "graficos": graficos}


@app.get("/api/resultados/download/{tipo}/{arquivo}")
def baixar_arquivo(tipo: str, arquivo: str):
    """Serve um arquivo específico para download ou visualização direta."""
    if tipo == "csv":
        caminho = DIR_TABELAS / arquivo
        media_type = "text/csv"
    elif tipo == "png":
        caminho = DIR_GRAFICOS / arquivo
        media_type = "image/png"
    else:
        raise HTTPException(status_code=400, detail="Tipo inválido. Use 'csv' ou 'png'.")

    if not caminho.exists() or not caminho.is_file():
        raise HTTPException(status_code=404, detail="Arquivo não encontrado.")

    return FileResponse(caminho, media_type=media_type, filename=arquivo)


# Montagem estática para servir o frontend construído (se existir dist/)
dir_dist_frontend = DIR_PROJETO / "frontend" / "dist"
if dir_dist_frontend.exists():
    app.mount("/", StaticFiles(directory=str(dir_dist_frontend), html=True), name="frontend")

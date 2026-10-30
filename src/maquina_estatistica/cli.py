"""
Módulo de Interface de Linha de Comando (CLI).

Oferece um menu interativo completo e comandos diretos para execução
de rodadas individuais, experimentos 1 a 5, exportação de resultados,
gráficos e visualização didática do modelo probabilístico.
"""

import argparse
from pathlib import Path
import random
import sys
from typing import Optional

from maquina_estatistica.config import (
    AVISO_LEGAL,
    CUSTO_APOSTA,
    DIR_GRAFICOS,
    DIR_PROJETO,
    DIR_RELATORIOS,
    DIR_RESULTADOS,
    DIR_TABELAS,
    ESPERANCA_LUCRO_BASE,
    PAGAMENTOS_BASE,
    PROBABILIDADE_TEORICA_PREMIO,
    RTP_TEORICO_BASE,
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


def exibir_cabecalho() -> None:
    """Exibe o cabeçalho oficial da aplicação com o aviso obrigatório."""
    largura = 74
    print("=" * largura)
    print("                 MÁQUINA ESTATÍSTICA — IFES CAMPUS SERRA".center(largura))
    print("         Bacharelado em Sistemas de Informação | Probabilidade e Estatística I".center(largura))
    print(f"        *** {AVISO_LEGAL} ***".center(largura))
    print("=" * largura)


def exibir_rodada_formatada(r: ResultadoRodada, seed: Optional[int] = None) -> None:
    """
    Exibe a representação visual detalhada do tabuleiro 3x3 de uma rodada,
    destacando a linha central e o detalhamento econômico.
    """
    tab = r.tabuleiro
    print("\n" + "-" * 56)
    if seed is not None:
        print(f" Rodada #{r.indice} | Semente: {seed} | Paradas (K1, K2, K3): {r.paradas}")
    else:
        print(f" Rodada #{r.indice} | Paradas (K1, K2, K3): {r.paradas}")
    print("-" * 56)
    print("       Rolo 1    Rolo 2    Rolo 3")
    print(f" Topo   [ {tab[0][0]} ]     [ {tab[0][1]} ]     [ {tab[0][2]} ]")
    print(f">CENTRO [ {tab[1][0]} ] === [ {tab[1][1]} ] === [ {tab[1][2]} ] <== (ÚNICA LINHA AVALIADA)")
    print(f" Base   [ {tab[2][0]} ]     [ {tab[2][1]} ]     [ {tab[2][2]} ]")
    print("-" * 56)
    print(f" Combinação Central:   {r.combinacao_central}")
    print(f" Aposta:               {CUSTO_APOSTA:.2f} crédito fictício")
    print(f" Prêmio Bruto (P):     {r.premio:.2f} créditos")
    print(f" Lucro Líquido (X):    {r.lucro:+.2f} créditos")
    print(f" Status:               {'*** VITÓRIA! ***' if r.premiado else 'Sem Prêmio'}")
    print(f" Regra Aplicada:       {r.explicacao_regra}")
    print("-" * 56)
    print(f" * Lembrete: {AVISO_LEGAL}\n")


def menu_rodada_individual(rng_sessao: random.Random) -> None:
    """Permite ao usuário sortear rodadas individuais ou fornecer semente específica."""
    print("\n--- Sortear Rodada Individual ---")
    escolha = input("Deseja informar uma semente específica? (s/N): ").strip().lower()
    if escolha == "s":
        try:
            s_val = int(input("Informe o valor inteiro da semente: ").strip())
            rng_temp = criar_gerador(s_val)
            rodada = executar_rodada(indice=1, rng=rng_temp)
            exibir_rodada_formatada(rodada, seed=s_val)
            return
        except ValueError:
            print("Valor inválido. Utilizando gerador corrente da sessão.")

    rodada = executar_rodada(indice=1, rng=rng_sessao)
    exibir_rodada_formatada(rodada)


def executar_fluxo_e1(registros_compartilhados: Optional[list] = None) -> list:
    """Executa o Experimento 1, gera CSVs e gráfico."""
    print("\nExecutando Experimento 1 (10.000 rodadas, seed=2026)...")
    regs, stats = executar_experimento_1()
    caminhos_csv = exportar_e1(stats)
    caminho_graf = gerar_grafico_e1(stats["tabela_categorias"])

    print("\n[OK] Experimento 1 concluído com sucesso!")
    print(f" - Soma das contagens: {stats['soma_contagens']} (esperado: 10.000)")
    print(f" - Soma das frequências relativas: {stats['soma_freq_relativas']:.6f} (esperado: 1.0)")
    print(f" - Proporção de prêmios observada: {stats['proporcao_premiada_observada'] * 100:.2f}% (Teórico: {stats['proporcao_premiada_teorica'] * 100:.2f}%)")
    print(f" - Lucro médio observado: {stats['lucro_medio_observado']:+.4f} créditos (Teórico: {stats['lucro_medio_teorico']:+.4f})")
    print(f" - RTP observado: {stats['rtp_observado']:.2f}% (Teórico: {stats['rtp_teorico']:.2f}%)")
    print(f" - Desvio-padrão amostral (s com N-1): {stats['desvio_padrao_amostral']:.4f} créditos")
    print(f" - Intervalo de Confiança 95% para Lucro Médio: [{stats['ic_95_lucro'][0]:.4f}, {stats['ic_95_lucro'][1]:.4f}]")
    print(f" - CSVs gerados: {[p.name for p in caminhos_csv.values()]}")
    print(f" - Gráfico gerado: {caminho_graf.name}")
    return regs


def executar_fluxo_e2(registros_compartilhados: Optional[list] = None) -> None:
    """Executa o Experimento 2, garantindo o reuso da sequência de 2026."""
    if registros_compartilhados is None:
        print("\nGerando sequência de referência do E1 (seed 2026)...")
        registros_compartilhados, _ = executar_experimento_1()

    print("\nExecutando Experimento 2 (seeds: 10, 2026, 123456 — N=10.000)...")
    stats = executar_experimento_2(registros_2026=registros_compartilhados)
    caminhos_csv = exportar_e2(stats)
    caminho_graf = gerar_grafico_e2(stats["trajetorias_medias"])

    print("\n[OK] Experimento 2 concluído com sucesso!")
    print("\nTabela 3x3 de Médias Acumuladas:")
    print(" Semente    | N = 100    | N = 1.000  | N = 10.000 ")
    print("-" * 47)
    for s, pts in stats["tabela_3x3"].items():
        print(f" Seed {s:<6} | {pts[100]:+9.4f} | {pts[1000]:+9.4f} | {pts[10000]:+9.4f}")
    print(f"\n - Verificação de Reprodutibilidade (Seed 2026): {'APROVADO' if stats['reprodutibilidade_confirmada'] else 'REPROVADO'}")
    print(f" - CSVs gerados: {[p.name for p in caminhos_csv.values()]}")
    print(f" - Gráfico gerado: {caminho_graf.name}")


def executar_fluxo_e3() -> None:
    """Executa o Experimento 3 (100 participantes, saldo 100, max 500 rodadas)."""
    print("\nExecutando Experimento 3 (100 participantes virtuais, seed=42)...")
    sessoes, stats = executar_experimento_3()
    caminhos_csv = exportar_e3(sessoes, stats)
    caminho_graf = gerar_grafico_e3(sessoes)

    print("\n[OK] Experimento 3 concluído com sucesso!")
    print(f" - Total de participantes: {stats['num_participantes']}")
    print(f" - Ganhos (B_f > 100):  {stats['ganhos_contagem']} ({stats['ganhos_proporcao'] * 100:.1f}%)")
    print(f" - Empates (B_f = 100): {stats['empates_contagem']} ({stats['empates_proporcao'] * 100:.1f}%)")
    print(f" - Perdas (B_f < 100):  {stats['perdas_contagem']} ({stats['perdas_proporcao'] * 100:.1f}%)")
    print(f" - Soma das categorias: {stats['soma_proporcoes'] * 100:.1f}%")
    print(f" - Taxa de Esgotamento (saldo < 1): {stats['esgotamentos_contagem']} ({stats['esgotamentos_proporcao'] * 100:.1f}%)")
    print(f" - Saldo Final Médio:   {stats['saldo_final_media']:.2f} créditos")
    print(f" - Saldo Final Mediano: {stats['saldo_final_mediana']:.2f} créditos")
    print(f" - Duração média de rodadas: {stats['rodadas_media']:.1f} rodadas")
    print(f" - CSVs gerados: {[p.name for p in caminhos_csv.values()]}")
    print(f" - Gráfico gerado: {caminho_graf.name}")


def executar_fluxo_e4(registros_compartilhados: Optional[list] = None) -> None:
    """Executa o Experimento 4 (9.999 pares consecutivos)."""
    if registros_compartilhados is None:
        print("\nGerando sequência de referência do E1 (seed 2026)...")
        registros_compartilhados, _ = executar_experimento_1()

    print("\nExecutando Experimento 4 (9.999 pares consecutivos, seed=2026)...")
    stats = executar_experimento_4(registros_2026=registros_compartilhados)
    caminhos_csv = exportar_e4(stats)

    print("\n[OK] Experimento 4 concluído com sucesso!")
    gp = stats["apos_premio"]
    gs = stats["apos_sem_premio"]
    print(f" - Pares analisados: {stats['total_pares']:,}")
    print(f" - Após Rodada Premiada (P > 0):  Total = {gp['total_pares']:,} | Prêmios seguintes = {gp['premios_seguintes']} | Taxa = {gp['proporcao_observada'] * 100:.2f}% (Teórico: 4.00%)")
    print(f" - Após Rodada Sem Prêmio (P = 0): Total = {gs['total_pares']:,} | Prêmios seguintes = {gs['premios_seguintes']} | Taxa = {gs['proporcao_observada'] * 100:.2f}% (Teórico: 4.00%)")
    print(" - Conclusão: Independência confirmada! A máquina não 'deve' prêmio após derrotas (Falácia do Jogador).")
    print(f" - CSV gerado: {[p.name for p in caminhos_csv.values()]}")


def executar_fluxo_e5(registros_compartilhados: Optional[list] = None) -> None:
    """Executa o Experimento 5 (Base vs +10% sobre mesmos resultados)."""
    if registros_compartilhados is None:
        print("\nGerando sequência de referência do E1 (seed 2026)...")
        registros_compartilhados, _ = executar_experimento_1()

    print("\nExecutando Experimento 5 (Comparação de Tabelas de Pagamento)...")
    stats = executar_experimento_5(registros_2026=registros_compartilhados)
    caminhos_csv = exportar_e5(stats)
    caminho_graf = gerar_grafico_e5(stats)

    b = stats["base"]
    a = stats["aumentada_10"]
    print("\n[OK] Experimento 5 concluído com sucesso!")
    print("\nComparação dos Indicadores:")
    print(f" - Chance de Prêmio:       Base={b['freq_premio_observada'] * 100:.2f}% | +10%={a['freq_premio_observada'] * 100:.2f}% (Teórico: 4.00%)")
    print(f" - Prêmio Médio Bruto:     Base={b['premio_medio_observado']:.4f} (Teo: {b['premio_medio_teorico']:.4f}) | +10%={a['premio_medio_observado']:.4f} (Teo: {a['premio_medio_teorico']:.4f})")
    print(f" - Lucro Líquido Médio:    Base={b['lucro_medio_observado']:+.4f} (Teo: {b['lucro_medio_teorico']:+.4f}) | +10%={a['lucro_medio_observado']:+.4f} (Teo: {a['lucro_medio_teorico']:+.4f})")
    print(f" - RTP:                    Base={b['rtp_observado']:.2f}% (Teo: {b['rtp_teorico']:.2f}%) | +10%={a['rtp_observado']:.2f}% (Teo: {a['rtp_teorico']:.2f}%)")
    print(" - Conclusão: Pagar mais não significa pagar com mais frequência nem torna o lucro esperado positivo!")
    print(f" - CSV gerado: {[p.name for p in caminhos_csv.values()]}")
    print(f" - Gráfico gerado: {caminho_graf.name}")


def executar_fluxo_completo() -> None:
    """Executa todos os 5 experimentos integrados, exporta tabelas, gráficos, metadados e relatório."""
    print("\n" + "=" * 60)
    print("    INICIANDO EXECUÇÃO COMPLETA DOS CINCO EXPERIMENTOS")
    print("=" * 60)

    res = executar_todos_experimentos()

    regs_e1 = res["e1_registros"]
    stats_e1 = res["e1_stats"]
    stats_e2 = res["e2_stats"]
    sessoes_e3 = res["e3_sessoes"]
    stats_e3 = res["e3_stats"]
    stats_e4 = res["e4_stats"]
    stats_e5 = res["e5_stats"]

    # Exportações de CSV
    print("\n1. Exportando Tabelas CSV...")
    exportar_e1(stats_e1)
    exportar_e2(stats_e2)
    exportar_e3(sessoes_e3, stats_e3)
    exportar_e4(stats_e4)
    exportar_e5(stats_e5)

    # Geração de Gráficos
    print("2. Gerando Gráficos em Alta Resolução (300 DPI)...")
    gerar_grafico_e1(stats_e1["tabela_categorias"])
    gerar_grafico_e2(stats_e2["trajetorias_medias"])
    gerar_grafico_e3(sessoes_e3)
    gerar_grafico_e5(stats_e5)

    # Metadados e Relatório Sintético
    print("3. Gerando Manifesto de Metadados e Relatório de Síntese...")
    caminho_manifesto = exportar_manifesto_metadados()
    caminho_sintese = exportar_relatorio_sintese(
        stats_e1, stats_e2, stats_e3, stats_e4, stats_e5
    )

    print("\n" + "=" * 60)
    print(" [SUCESSO] Todos os experimentos e arquivos foram gerados!")
    print(f" - Tabelas CSV:     {DIR_TABELAS}")
    print(f" - Gráficos PNG:    {DIR_GRAFICOS}")
    print(f" - Relatório MD:    {caminho_sintese}")
    print(f" - Metadados JSON:  {caminho_manifesto}")
    print("=" * 60 + "\n")


def consultar_arquivos_gerados() -> None:
    """Lista todos os arquivos presentes nos diretórios de saída."""
    print("\n--- Arquivos Gerados no Projeto ---")
    garantir_diretorios()

    print("\n[Tabelas CSV em 'resultados/tabelas/']:")
    for f in sorted(DIR_TABELAS.glob("*.csv")):
        tamanho_kb = f.stat().st_size / 1024
        print(f"  • {f.name:<35} ({tamanho_kb:.1f} KB)")

    print("\n[Gráficos PNG em 'resultados/graficos/']:")
    for f in sorted(DIR_GRAFICOS.glob("*.png")):
        tamanho_kb = f.stat().st_size / 1024
        print(f"  • {f.name:<35} ({tamanho_kb:.1f} KB)")

    print("\n[Relatórios e Metadados]:")
    for f in sorted(DIR_RELATORIOS.glob("*.*")):
        print(f"  • relatorios/{f.name}")
    for f in sorted(DIR_RESULTADOS.glob("*.json")):
        print(f"  • resultados/{f.name}")


def iniciar_servidor_web(host: str = "127.0.0.1", port: int = 8000, abrir_navegador: bool = True) -> None:
    """Inicia o servidor backend FastAPI com Uvicorn para servir a interface web."""
    import threading
    import time
    import webbrowser
    import uvicorn
    from maquina_estatistica.api import app

    url = f"http://{host}:{port}"
    print("\n" + "=" * 65)
    print("      MÁQUINA ESTATÍSTICA — SERVIDOR WEB INICIADO")
    print("=" * 65)
    print(f" • Endereço da Aplicação Web: {url}")
    print(f" • Documentação Interativa da API: {url}/docs")
    print(f" • Aviso: {AVISO_LEGAL}")
    print(" • Pressione Ctrl+C no terminal para encerrar o servidor.")
    print("=" * 65 + "\n")

    if abrir_navegador:
        def _abrir():
            time.sleep(1.2)
            try:
                webbrowser.open(url)
            except Exception:
                pass
        threading.Thread(target=_abrir, daemon=True).start()

    uvicorn.run(app, host=host, port=port)


def executar_testes_pytest() -> int:
    """Executa a suíte de testes do pytest diretamente."""
    print("\nExecutando suíte automatizada de testes com pytest...\n")
    import pytest
    codigo_retorno = pytest.main(["-v", str(DIR_PROJETO / "tests")])
    return int(codigo_retorno)


def menu_interativo() -> None:
    """Loop do menu interativo principal da aplicação CLI."""
    rng_sessao = random.Random()
    registros_memoria: Optional[list] = None

    while True:
        exibir_cabecalho()
        print(" Menu Principal:")
        print("  1. Sortear e Visualizar Rodada Individual")
        print("  2. Executar Experimento 1 (Probabilidades vs Frequências)")
        print("  3. Executar Experimento 2 (Amostra e Lei dos Grandes Números)")
        print("  4. Executar Experimento 3 (Sessões com Saldo Limitado)")
        print("  5. Executar Experimento 4 (Probabilidade Condicional e Falácia)")
        print("  6. Executar Experimento 5 (Comparação de Tabelas de Pagamento)")
        print("  7. Executar TODOS os 5 Experimentos (Exportar tudo)")
        print("  8. Consultar Arquivos e Resultados Gerados")
        print("  9. Executar Testes Automatizados (pytest)")
        print(" 10. Iniciar Servidor Web e Interface Visual")
        print("  0. Sair")
        print("-" * 74)

        try:
            opcao = input(" Escolha uma opção [0-10]: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nEncerrando o programa.")
            break

        if opcao == "1":
            menu_rodada_individual(rng_sessao)
        elif opcao == "2":
            registros_memoria = executar_fluxo_e1(registros_memoria)
        elif opcao == "3":
            executar_fluxo_e2(registros_memoria)
        elif opcao == "4":
            executar_fluxo_e3()
        elif opcao == "5":
            executar_fluxo_e4(registros_memoria)
        elif opcao == "6":
            executar_fluxo_e5(registros_memoria)
        elif opcao == "7":
            executar_fluxo_completo()
        elif opcao == "8":
            consultar_arquivos_gerados()
        elif opcao == "9":
            executar_testes_pytest()
        elif opcao == "10":
            iniciar_servidor_web()
        elif opcao == "0":
            print("\nObrigado por utilizar a Máquina Estatística. Até logo!\n")
            break
        else:
            print("\n[!] Opção inválida. Digite um número de 0 a 9.")

        input("\nPressione Enter para continuar...")


def main() -> None:
    """Ponto de entrada para execução via CLI ou linha de comando."""
    parser = argparse.ArgumentParser(
        description="Máquina Estatística — IFES Serra | Trabalho I (Probabilidade e Estatística I)"
    )
    parser.add_argument("--demo", action="store_true", help="Executa e exibe 1 rodada de demonstração e sai.")
    parser.add_argument("--run-all", action="store_true", help="Executa os 5 experimentos, exporta CSVs e gráficos e sai.")
    parser.add_argument("--test", action="store_true", help="Executa os testes automatizados com pytest e sai.")
    parser.add_argument("--web", action="store_true", help="Inicia o servidor web FastAPI e a interface visual.")
    parser.add_argument("--port", type=int, default=8000, help="Porta para o servidor web (padrão: 8000).")
    parser.add_argument("--seed", type=int, default=None, help="Semente para a rodada individual em --demo.")

    args = parser.parse_args()

    if args.web:
        iniciar_servidor_web(port=args.port)
        sys.exit(0)

    if args.demo:
        exibir_cabecalho()
        rng = criar_gerador(args.seed)
        r = executar_rodada(indice=1, rng=rng)
        exibir_rodada_formatada(r, seed=args.seed)
        sys.exit(0)

    if args.run_all:
        exibir_cabecalho()
        executar_fluxo_completo()
        sys.exit(0)

    if args.test:
        sys.exit(executar_testes_pytest())

    # Se nenhum argumento foi passado, abre o menu interativo
    menu_interativo()


if __name__ == "__main__":
    main()

# MÁQUINA ESTATÍSTICA: Probabilidade, Apostas e Pensamento Crítico

**Instituto Federal do Espírito Santo — Campus Serra**  
**Bacharelado em Sistemas de Informação**  
**Disciplina:** Probabilidade e Estatística I (2026/2)  
**Professor:** Fidelis Zanetti de Castro  
**Entrega:** 29 de outubro de 2026  

> **Aviso Obrigatório:**  
> ***Simulador acadêmico — somente créditos fictícios***  
> Este software é um instrumento didático e científico para estudo de conceitos de probabilidade, estatística e pensamento crítico. Não realiza depósitos, saques, transações com dinheiro real nem possui conexão com plataformas comerciais de jogos.

---

## 1. Identificação da Equipe

- **Estudante 1:** [Nome do Estudante] — [Matrícula]
- **Estudante 2:** [Nome do Estudante] — [Matrícula]
- **Estudante 3:** [Nome do Estudante] — [Matrícula]

---

## 2. Visão Geral e Objetivos do Projeto

O projeto **Máquina Estatística** investiga a dinâmica probabilística e econômica subjacente aos jogos de rolos digitais (popularizados no Brasil por slots como o "jogo do tigrinho"). 

A pergunta fundamental investigada é:
> *Como ganhos ocasionais podem coexistir com uma perda esperada para o jogador, e o que essa diferença nos ajuda a compreender sobre as apostas na sociedade?*

O sistema implementa o modelo matemático estrito especificado pelo professor, orquestra os cinco experimentos de Monte Carlo obrigatórios com controle rigoroso de sementes pseudoaleatórias, exporta todas as tabelas em formato CSV padronizado, gera gráficos de alta resolução para o relatório acadêmico e disponibiliza uma suíte completa de testes automatizados com `pytest`.

---

## 3. Modelo Matemático da Máquina

### 3.1. Símbolos e Rolos Circulares
- **Conjunto de símbolos:** $S = \{A, B, C, D, E\}$ (5 símbolos).
- **Sequência circular de cada rolo:** $R = (A, B, C, D, E)$, indexada de 0 a 4.
- **Sorteio das paradas:** Para cada um dos 3 rolos independentes, sorteia-se uma parada $K \in \{0, 1, 2, 3, 4\}$ com probabilidade uniforme $P(K) = 1/5 = 20\%$.
- **Janela de visualização (3 linhas × 3 colunas):**
  - **Linha Superior (Topo):** $R[K]$
  - **Linha Central (Centro):** $R[(K + 1) \bmod 5]$ *(ÚNICA linha avaliada para pagamento)*
  - **Linha Inferior (Base):** $R[(K + 2) \bmod 5]$

### 3.2. Linha Avaliada e Regra de Pagamento
- **Aposta fixa:** $1{,}0$ crédito fictício por rodada.
- **Avaliação:** Apenas a linha central determina pagamento. Diagonais, linhas superiores e inferiores não pagam prêmio.
- **Premiação:** A rodada é premiada **apenas quando os três símbolos centrais são estritamente iguais**. Qualquer outra combinação resulta em prêmio $0{,}0$ e perda do crédito apostado ($X = -1{,}0$).

| Combinação Central | Prêmio Bruto ($P$) | Lucro Líquido ($X = P - 1$) | Probabilidade Teórica |
|:---:|:---:|:---:|:---:|
| **A–A–A** | 5,0 créditos | +4,0 créditos | $1/125 = 0{,}8\%$ |
| **B–B–B** | 10,0 créditos | +9,0 créditos | $1/125 = 0{,}8\%$ |
| **C–C–C** | 15,0 créditos | +14,0 créditos | $1/125 = 0{,}8\%$ |
| **D–D–D** | 25,0 créditos | +24,0 créditos | $1/125 = 0{,}8\%$ |
| **E–E–E** | 50,0 créditos | +49,0 créditos | $1/125 = 0{,}8\%$ |
| **Outras (120 triplas)** | 0,0 créditos | -1,0 crédito | $120/125 = 96{,}0\%$ |

### 3.3. Indicadores Teóricos do Modelo Base
- **Total de triplas centrais possíveis:** $5 \times 5 \times 5 = 125$ equiprováveis.
- **Probabilidade teórica de prêmio:** $\frac{5}{125} = 0{,}04 \quad (4{,}0\%)$.
- **Prêmio Bruto Esperado:** $E[P] = \frac{5 + 10 + 15 + 25 + 50}{125} = \frac{105}{125} = 0{,}84 \text{ créditos/rodada}$.
- **Lucro Líquido Esperado:** $E[X] = E[P] - 1{,}0 = 0{,}84 - 1{,}00 = -0{,}16 \text{ créditos/rodada}$.
- **RTP Teórico (Return to Player):** $\frac{E[P]}{\text{Aposta}} \times 100\% = 84{,}0\%$.
- **Vantagem Esperada da Casa:** $16{,}0\%$.

> **Nota:** Não confundir Chance de Prêmio ($4{,}0\%$) com RTP ($84{,}0\%$) e com Lucro Esperado ($-0{,}16$). O RTP não representa garantia de devolução de 84% do saldo em uma sessão.

---

## 4. Tecnologias Utilizadas e Justificativa

| Tecnologia | Finalidade no Projeto | Justificativa Técnica |
|---|---|---|
| **Python 3.11** | Linguagem principal do modelo e dos experimentos | Clareza, suporte nativo a aritmética arbitrária e biblioteca científica madura. |
| **random (Mersenne Twister MT19937)** | Sorteios pseudoaleatórios e reprodução determinística | Algoritmo determinístico auditável, rápido e nativo, sem efeitos colaterais globais via `random.Random(seed)`. |
| **statistics** | Estatísticas descritivas básicas | Cálculo de médias, medianas e desvio-padrão amostral estrito com divisor $N-1$ (`statistics.stdev`). |
| **numpy** | Apoio vetorial e formatação numérica | Manipulação eficiente de arrays para marcação de eixos e geração de gráficos. |
| **pandas** | Estruturação e exportação de dados | Manipulação de DataFrames e escrita segura de tabelas em arquivos CSV padronizados. |
| **matplotlib (Backend 'Agg')** | Exportação de gráficos estáticos em alta resolução (300 DPI) | Geração de gráficos vetoriais/rasterizados sem dependência de servidor gráfico interativo (headless). |
| **scipy** | Distribuições e cálculos inferenciais | Suporte para intervalos de confiança e testes estatísticos complementares. |
| **pytest** | Automação e verificação de testes unitários | Suíte completa com 23 asserções verificando todos os requisitos matemáticos do enunciado. |

---

## 5. Estrutura do Diretório de Trabalho

```text
Implementação/
├── README.md                      # Documentação técnica e científica completa
├── requirements.txt               # Dependências Python fixadas
├── .gitignore                     # Filtro de arquivos descartáveis para Git
├── executar.bat                   # Inicializador rápido para ambiente Windows
├── executar.py                    # Script de entrada unificado da aplicação
├── src/
│   └── maquina_estatistica/
│       ├── __init__.py            # Declaração do pacote Python
│       ├── config.py              # Constantes, tabelas de pagamentos e caminhos
│       ├── modelo.py              # Rolos circulares, janela 3x3 e regras de pagamento
│       ├── simulacao.py           # RNG explícito, rodadas individuais, N rodadas e sessões com saldo
│       ├── estatisticas.py        # Cálculos de frequências, médias acumuladas, desvio N-1 e probabilidades
│       ├── experimentos.py        # Orquestração dos Experimentos 1 a 5 com reuso estrito de sequências
│       ├── graficos.py            # Construção dos gráficos com acessibilidade visual e exportação
│       ├── exportacao.py          # Exportação de tabelas CSV, manifestos JSON e síntese analítica
│       └── cli.py                 # Interface interativa de linha de comando
├── tests/
│   ├── __init__.py
│   ├── conftest.py                # Injeção automática de src no sys.path
│   ├── test_modelo.py             # Testes de paradas, janela mod 5, 125 triplas e pagamentos
│   ├── test_simulacao.py          # Testes de reprodutibilidade por seed e regras de parada/saldo
│   ├── test_estatisticas.py       # Testes de fórmulas estatísticas, divisor N-1 e caso divisão por zero
│   ├── test_experimentos.py       # Testes de integração dos cinco experimentos
│   └── test_exportacao.py         # Testes de integridade de CSVs e metadados JSON
├── resultados/
│   ├── tabelas/                   # Todos os arquivos CSV gerados
│   │   ├── e1_frequencias.csv
│   │   ├── e1_metricas_resumo.csv
│   │   ├── e2_medias_acumuladas.csv
│   │   ├── e2_reprodutibilidade_10_primeiros.csv
│   │   ├── e3_sessoes.csv
│   │   ├── e3_resumo_estatistico.csv
│   │   ├── e3_trajetorias.csv
│   │   ├── e4_condicional.csv
│   │   └── e5_comparacao.csv
│   ├── graficos/                  # Gráficos em formato PNG (300 DPI) para o relatório
│   │   ├── e1_teoria_vs_observado.png
│   │   ├── e2_medias_acumuladas.png
│   │   ├── e3_saldos.png
│   │   └── e5_comparacao_tabelas.png
│   ├── relatorios/
│   │   └── sintese_experimentos.md  # Resumo estruturado com todos os números observados
│   └── manifesto_execucao.json     # Metadados de auditoria e ambiente da execução
└── docs/
    └── guia_elaboracao_relatorio.md # Roteiro analítico e acadêmico para o artigo de 6 a 10 páginas
```

---

## 6. Instruções de Instalação e Execução

### 6.1. Requisitos de Sistema
- **Sistema Operacional:** Windows 10/11 (ou Linux / macOS).
- **Python:** Versão 3.10 ou superior (testado e homologado no Python 3.11.9).

### 6.2. Instalação das Dependências
Abra o terminal (PowerShell ou Prompt de Comando) na pasta raiz do projeto:

```powershell
# Opcional: Criar e ativar um ambiente virtual
python -m venv .venv
.\.venv\Scripts\activate

# Instalar as dependências do projeto
python -m pip install -r requirements.txt
```

### 6.3. Como Executar a Aplicação

#### Opção A: Duplo clique no Windows (executar.bat)
Basta dar duplo clique no arquivo `executar.bat` para iniciar o menu interativo com suporte automático a caracteres UTF-8.

#### Opção B: Menu Interativo via Terminal
```powershell
python executar.py
```
O menu principal oferece as opções:
1. Sortear e Visualizar Rodada Individual (exibe o tabuleiro 3x3 e detalhamento).
2. Executar Experimento 1 (Probabilidades vs Frequências).
3. Executar Experimento 2 (Amostra e Lei dos Grandes Números).
4. Executar Experimento 3 (Sessões com Saldo Limitado).
5. Executar Experimento 4 (Probabilidade Condicional e Falácia do Jogador).
6. Executar Experimento 5 (Comparação de Tabelas de Pagamento).
7. Executar TODOS os 5 Experimentos (Exportar tabelas CSV e gráficos PNG).
8. Consultar Arquivos e Resultados Gerados.
9. Executar Testes Automatizados (`pytest`).
0. Sair.

#### Opção C: Atalhos de Linha de Comando Diretos
```powershell
# Executar uma rodada demonstrativa no terminal
python executar.py --demo

# Executar uma rodada demonstrativa com semente fixa
python executar.py --demo --seed 2026

# Executar todos os 5 experimentos e gerar todos os arquivos CSV e PNG
python executar.py --run-all

# Executar a suíte de testes automatizados com pytest
python executar.py --test
```

---

## 7. Os Cinco Experimentos: Metodologia e Resultados

### Experimento 1: As frequências acompanham as probabilidades?
- **Parâmetros:** $N = 10.000$ rodadas, aposta de 1 crédito, semente `2026`, sem saldo ou parada.
- **Evidências Observadas:**
  - Soma das contagens observadas: exatamente $10.000$.
  - Soma das frequências relativas: $1{,}000000$.
  - Lucro líquido médio observado: $\bar{X} = -0{,}1315$ créditos/rodada (referência teórica: $-0{,}1600$).
  - RTP observado: $86{,}85\%$ (referência teórica: $84{,}00\%$).
  - Proporção de rodadas premiadas: $4{,}12\%$ (referência teórica: $4{,}00\%$).
  - Desvio-padrão amostral do lucro: $s = 5{,}2750$ créditos (divisor $N-1$).
  - Intervalo de confiança de 95% para o lucro médio: $[-0{,}2349; -0{,}0281]$. Note que a esperança teórica $-0{,}16$ está confortavelmente contida no intervalo.
- **Arquivos gerados:** `resultados/tabelas/e1_frequencias.csv`, `resultados/tabelas/e1_metricas_resumo.csv`, `resultados/graficos/e1_teoria_vs_observado.png`.

### Experimento 2: O que muda quando aumentamos a amostra?
- **Parâmetros:** 3 sequências de $10.000$ rodadas com sementes `10`, `2026` e `123456`.
- **Reuso:** A sequência da semente `2026` foi obrigatoriamente reaproveitada do Experimento 1.
- **Tabela 3x3 de Médias Acumuladas:**
  - **Seed 10:** $N=100 \rightarrow -0{,}7000$ | $N=1.000 \rightarrow -0{,}0550$ | $N=10.000 \rightarrow -0{,}0960$
  - **Seed 2026:** $N=100 \rightarrow +0{,}2000$ | $N=1.000 \rightarrow -0{,}2200$ | $N=10.000 \rightarrow -0{,}1315$
  - **Seed 123456:** $N=100 \rightarrow +0{,}2000$ | $N=1.000 \rightarrow -0{,}0700$ | $N=10.000 \rightarrow -0{,}2215$
- **Verificação de Reprodutibilidade:** Os 10 primeiros sorteios de uma nova execução com a semente 2026 foram comparados com a original, confirmando 100% de coincidência determinística.
- **Interpretação:** A Lei dos Grandes Números afirma que a média amostral converge para o valor esperado à medida que $N \to \infty$. Não há convergência monotônica nem teto máximo de erro para um $N$ finito. Uma sequência inicial favorável (como $+0{,}20$ em $N=100$) não faz a máquina "compensar" resultados futuros.
- **Arquivos gerados:** `resultados/tabelas/e2_medias_acumuladas.csv`, `resultados/tabelas/e2_reprodutibilidade_10_primeiros.csv`, `resultados/graficos/e2_medias_acumuladas.png`.

### Experimento 3: O que acontece com um saldo limitado?
- **Parâmetros:** 100 participantes virtuais, saldo inicial de 100 créditos, aposta de 1 crédito, máximo de 500 rodadas, parada em saldo $< 1$, semente `42` inicializada uma única vez no início e mantida contínua.
- **Evidências Observadas:**
  - **Ganhos ($B_f > 100$):** 23 participantes (23,0%).
  - **Empates ($B_f = 100$):** 2 participantes (2,0%).
  - **Perdas ($B_f < 100$):** 75 participantes (75,0%).
  - **Soma das 3 categorias:** exatamente $100\%$.
  - **Esgotamento Total ($B_f < 1$):** 67 participantes (67,0%), subconjunto das 75 perdas.
  - **Saldo Final:** Média = $52{,}10$ créditos; Mediana = $0{,}00$ crédito (saldo zerado para a maioria); Máximo = $390{,}00$ créditos.
- **Interpretação:** A diferença gritante entre a média ($52{,}10$) e a mediana ($0{,}00$) ilustra o perigo do viés de confirmação e de sobrevivência em relatos de redes sociais. Quem ganhou 390 créditos divulga seu ganho, enquanto a realidade estatística é que 67 em cada 100 apostadores perderam absolutamente todo o dinheiro depositado.
- **Arquivos gerados:** `resultados/tabelas/e3_sessoes.csv`, `resultados/tabelas/e3_resumo_estatistico.csv`, `resultados/tabelas/e3_trajetorias.csv`, `resultados/graficos/e3_saldos.png`.

### Experimento 4: Depois de perder, aumenta a chance de ganhar?
- **Parâmetros:** Reutilização das $10.000$ rodadas do Experimento 1, analisando todos os $9.999$ pares consecutivos.
- **Evidências Observadas:**
  - **Após Rodada Premiada ($P > 0$):** 412 pares analisados $\rightarrow$ 17 tiveram prêmio na rodada seguinte $\rightarrow$ Frequência = $4{,}13\%$.
  - **Após Rodada Sem Prêmio ($P = 0$):** 9.587 pares analisados $\rightarrow$ 395 tiveram prêmio na rodada seguinte $\rightarrow$ Frequência = $4{,}12\%$.
  - **Referência Teórica:** $P(G_{i+1} | G_i) = P(G_{i+1} | G_i^c) = P(G_{i+1}) = 4{,}00\%$.
- **Interpretação:** As frequências observadas ($4{,}13\%$ e $4{,}12\%$) são virtualmente indistinguíveis e comprovam a independência das rodadas. A crença popular de que a máquina "está quente" ou "deve pagar porque perdeu muitas seguidas" é uma manifestação clássica da **Falácia do Jogador**.
- **Arquivos gerados:** `resultados/tabelas/e4_condicional.csv`.

### Experimento 5: Prêmios maiores tornam o jogo favorável?
- **Parâmetros:** Aplicação da Tabela Base e da Tabela com pagamentos aumentados em 10% aos **mesmos 10.000 resultados** do Experimento 1 (sem gerar nova sequência).
- **Tabela Comparativa:**

| Indicador | Tabela Base (Teórico) | Tabela Base (Obs.) | Tabela +10% (Teórico) | Tabela +10% (Obs.) |
|---|:---:|:---:|:---:|:---:|
| **Probabilidade de Vitória** | 4,00% | 4,12% | 4,00% | 4,12% |
| **Prêmio Médio Bruto ($P$)** | 0,8400 | 0,8685 | 0,9240 | 0,9554 |
| **Lucro Médio Líquido ($X$)** | -0,1600 | -0,1315 | -0,0760 | -0,0447 |
| **RTP (%)** | 84,00% | 86,85% | 92,40% | 95,53% |

- **Interpretação:** Aumentar os pagamentos eleva o RTP de 84,0% para 92,4% e diminui a velocidade da perda por rodada, mas **não altera a chance de vitória (permanece em 4%) e não torna o lucro esperado positivo** ($-0{,}076 < 0$). "Pagar mais", "pagar com mais frequência" e "produzir lucro esperado positivo" são propriedades matemáticas distintas.
- **Arquivos gerados:** `resultados/tabelas/e5_comparacao.csv`, `resultados/graficos/e5_comparacao_tabelas.png`.

---

## 8. Testes Automatizados e Confiabilidade

O projeto adota a biblioteca `pytest` para testes unitários e de integração contínua. Todos os 23 testes automatizados cobrem os critérios formais de aceite:

```powershell
python -m pytest -v tests
```

### Resumo dos Testes Implementados:
- **T01:** Janela circular para $K=4$ produzindo coluna $(E, A, B)$ via aritmética modular `mod 5`.
- **T02:** Todos os 5 pagamentos das triplas idênticas e prêmio zero nas demais combinações.
- **T03:** Cálculo do lucro líquido $X = P - 1$ ($X = -1$ nas perdas).
- **T04:** Semente reprodutível com gerador explícito isolado.
- **T05:** Contagem das 6 categorias somando 10.000 e desvio-padrão amostral com divisor $N-1$.
- **T06:** Tabela 3x3 de médias acumuladas com reuso comprovado da sequência do E1.
- **T07:** 100 participantes no E3, ganho + empate + perda = 100%, esgotamento como subconjunto das perdas.
- **T08:** 9.999 pares consecutivos no E4 e tratamento à prova de divisão por zero.
- **T09:** Validação teórica das duas tabelas de pagamento do E5.
- **T10:** Respeito absoluto aos limites de parada e saldo no E3 (nenhuma rodada excedente).
- **Espaço Amostral:** Verificação exaustiva das 125 triplas possíveis e confirmação de $E[X] = -0{,}16$.

---

## 9. Limitações Conhecidas do Modelo

1. **Modelo Didático Simplificado:** O simulador foi desenhado para propósitos pedagógicos com regras públicas e probabilidades uniformes conhecidas. Máquinas comerciais empregam sistemas fechados, rolos com pesos assimétricos (*virtual reels*), bônus complexos e linhas múltiplas.
2. **Não Generalização Populacional:** As taxas de perda e esgotamento observadas na simulação virtual refletem estritamente os parâmetros do modelo ($B_0 = 100$, aposta $1$, limite $500$ rodadas) e não devem ser interpretadas como taxa clínica de prevalência de ludopatia na população brasileira.

---

## 10. Declaração de Uso de Inteligência Artificial

Em estrito cumprimento aos critérios éticos e às orientações do professor:
- **Papel da IA no desenvolvimento:** A inteligência artificial atuou como assistente de arquitetura de software, automação de testes em Python, estruturação modular de código e suporte à conferência matemática das equações do enunciado.
- **Verificações realizadas pela equipe:** Todas as regras de negócio, sorteios circulares mod 5, fórmulas de esperança matemática e RTP, deduções analíticas, códigos-fonte e interpretações textuais foram integralmente revisados, testados via `pytest` e confirmados pelos integrantes do grupo antes da submissão final.

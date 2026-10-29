# Guia Completo para Elaboração do Relatório Acadêmico (6 a 10 Páginas)
**Disciplina:** Probabilidade e Estatística I — Bacharelado em Sistemas de Informação (IFES Campus Serra)  
**Projeto:** Máquina Estatística — Probabilidade, Apostas e Pensamento Crítico  
**Professor:** Fidelis Zanetti de Castro  
**Data-limite:** 29 de outubro de 2026  

---

## 1. Visão Geral da Estrutura Exigida

O relatório deve ter entre **6 e 10 páginas de conteúdo textual** (sem contar capa, referências bibliográficas e eventuais anexos). Todas as figuras devem ser incorporadas com numeração, legenda externa e indicação de fonte (*"Elaboração própria a partir da simulação"*).

O texto deve articular com rigor científico três dimensões:
1. **O que foi calculado** (deduções analíticas, esperança matemática, distribuição discreta).
2. **O que foi observado** (dados empíricos das simulações computacionais em Python).
3. **O que as fontes documentais permitem afirmar sobre a sociedade** (impactos socioeconômicos e de saúde pública no Brasil).

---

## 2. Estrutura Seção por Seção

### Seção 1: Contexto e Objetivos (aprox. 1,5 páginas)
* **Pergunta central do trabalho:**  
  *Como ganhos ocasionais podem coexistir com uma perda esperada para o jogador, e o que essa diferença nos ajuda a compreender sobre as apostas na sociedade?*
* **Recorte histórico e legislativo (situado em setembro de 2026):**
  - **Lei nº 14.790/2023:** Estabeleceu o marco regulatório das apostas de quota fixa no Brasil (apostas esportivas e jogos on-line de rolos/cassino).
  - **Medida Provisória nº 1.394 (25/09/2026):** Editada pelo governo federal com o objetivo de suspender a oferta, intermediação e publicidade de apostas esportivas e jogos de quota fixa on-line sob justificativas de proteção da saúde pública e economia das famílias.
  - **Ação Judicial da União (28/09/2026):** Cobrança de R$ 1 bilhão por danos morais coletivos contra 17 plataformas e ressarcimento de custos ao SUS.
  - **Reação do setor (ANJL e IBJR):** Pedido de liminar ao STF alegando insegurança jurídica e empurrão dos apostadores para plataformas clandestinas.
* **Distinção conceitual obrigatória entre números de origens distintas (NÃO SOMAR):**
  1. *R$ 18 a 21 bilhões mensais (Banco Central, 2024):* Estimativa de transferências brutas via Pix para plataformas de aposta. Mede fluxo financeiro bruto, não perda líquida dos apostadores.
  2. *R$ 17,4 bilhões no 1º semestre de 2025 (TCU, 2026):* Receita bruta das plataformas autorizadas (GGR - Gross Gaming Revenue = apostas menos prêmios pagos). Não equivale ao lucro líquido das empresas nem a depósitos.
  3. *R$ 38,8 bilhões anuais (IEPS, 2025):* Estimativa teórica de custos sociais e perdas em anos de vida ajustados por incapacidade (DALYs/QALYs), sendo R$ 30,6 bilhões relacionados à saúde. Não se trata de despesas orçamentárias efetivamente desembolsadas pelo SUS.
* **Objetivo estatístico:** Demonstrar matematicamente que sorteios aleatórios e justos não garantem simetria econômica; desmistificar a falácia do jogador e o conceito de RTP.

---

### Seção 2: Modelo Matemático e Conceitos Teóricos (aprox. 1,5 páginas)
* **Composição dos rolos:**  
  Cinco símbolos $S = \{A, B, C, D, E\}$. Cada rolo possui a sequência circular $R = (A, B, C, D, E)$, indexada de $0$ a $4$.
* **Mecanismo de parada e janela 3x3:**  
  Para cada rolo $j \in \{1, 2, 3\}$, sorteia-se $K_j \sim \text{Uniforme}\{0, 1, 2, 3, 4\}$.  
  A coluna exibe:
  $$\text{Topo} = R[K_j], \quad \text{Centro} = R[(K_j + 1) \bmod 5], \quad \text{Base} = R[(K_j + 2) \bmod 5]$$
* **Independência estocástica:**  
  Os sorteios de $K_1, K_2, K_3$ são mutuamente independentes. Logo, os três símbolos centrais são variáveis aleatórias independentes e identicamente distribuídas (i.i.d.), com $P(C_j = s) = 1/5$ para qualquer símbolo $s \in S$.
* **Espaço amostral:**  
  O espaço amostral das triplas centrais contém $|\Omega| = 5^3 = 125$ eventos elementares equiprováveis, cada um com probabilidade:
  $$P(\text{tripla}) = \left(\frac{1}{5}\right)^3 = \frac{1}{125} = 0{,}008 \quad (0{,}8\%)$$
* **Regra de pagamento:**  
  Apenas a linha central é avaliada. A aposta custa $C = 1{,}0$ crédito.  
  Prêmio bruto $P$ e lucro líquido $X = P - 1$:
  - $A\text{-}A\text{-}A$: $P = 5$, $X = +4$, $P(X = 4) = 1/125$
  - $B\text{-}B\text{-}B$: $P = 10$, $X = +9$, $P(X = 9) = 1/125$
  - $C\text{-}C\text{-}C$: $P = 15$, $X = +14$, $P(X = 14) = 1/125$
  - $D\text{-}D\text{-}D$: $P = 25$, $X = +24$, $P(X = 24) = 1/125$
  - $E\text{-}E\text{-}E$: $P = 50$, $X = +49$, $P(X = 49) = 1/125$
  - Outras 120 combinações: $P = 0$, $X = -1$, $P(X = -1) = 120/125 = 0{,}96$
* **Esperança Matemática e RTP:**
  $$E[P] = \sum_{x} x P(P = x) = \frac{5 + 10 + 15 + 25 + 50}{125} = \frac{105}{125} = 0{,}84 \text{ créditos}$$
  $$E[X] = E[P] - 1 = 0{,}84 - 1{,}00 = -0{,}16 \text{ créditos por rodada}$$
  $$\text{RTP} = \frac{E[P]}{\text{Aposta}} \times 100\% = 84{,}0\%, \quad \text{Vantagem da Casa} = 16{,}0\%$$
* **Distinção crucial:**  
  Chance de ganhar ($4{,}0\%$) $\neq$ RTP ($84{,}0\%$) $\neq$ Lucro esperado ($-0{,}16$). RTP não é garantia de devolução de 84% do saldo inicial de uma pessoa em sua sessão.

---

### Seção 3: Os Cinco Experimentos e Evidências Empíricas (aprox. 3 páginas)

#### Experimento 1: As frequências acompanham as probabilidades?
- **Parâmetros:** $N = 10.000$ rodadas, semente `2026`, sem saldo ou parada.
- **Resultados empíricos obtidos:**
  - Soma das contagens: 10.000 | Soma das frequências: 1,000000.
  - Vitórias observadas: 412 (4,12% vs 4,00% teórico).
  - Lucro médio amostral: $\bar{X} = -0{,}1315$ créditos por rodada (teórico: $-0{,}1600$).
  - RTP observado: $86{,}85\%$ (teórico: $84{,}00\%$).
  - Desvio-padrão amostral (com divisor $N-1$): $s = 5{,}2750$ créditos.
  - Intervalo de confiança (95%): $[-0{,}2349; -0{,}0281]$ créditos. Como $-0{,}16$ está dentro do intervalo, não há divergência com a teoria.
- **Gráfico:** Inserir `resultados/graficos/e1_teoria_vs_observado.png`.

#### Experimento 2: O que muda quando aumentamos a amostra?
- **Parâmetros:** 3 sequências de $10.000$ rodadas com sementes `10`, `2026` (reutilizada do E1) e `123456`.
- **Tabela 3x3 de médias acumuladas:**
  - Seed 10: $N=100 \rightarrow -0{,}7000$; $N=1.000 \rightarrow -0{,}0550$; $N=10.000 \rightarrow -0{,}0960$.
  - Seed 2026: $N=100 \rightarrow +0{,}2000$; $N=1.000 \rightarrow -0{,}2200$; $N=10.000 \rightarrow -0{,}1315$.
  - Seed 123456: $N=100 \rightarrow +0{,}2000$; $N=1.000 \rightarrow -0{,}0700$; $N=10.000 \rightarrow -0{,}2215$.
- **Reprodutibilidade:** Verificação dos 10 primeiros resultados da seed 2026 confirmada com 100% de exatidão.
- **Interpretação:** A Lei dos Grandes Números (LGN) garante convergência em probabilidade ($\bar{X}_n \xrightarrow{P} \mu$), mas não monotonicidade. Ganhos iniciais (como nas seeds 2026 e 123456 em $N=100$) são diluídos, e não "compensados por vingança" da máquina.
- **Gráfico:** Inserir `resultados/graficos/e2_medias_acumuladas.png`.

#### Experimento 3: O que acontece com um saldo limitado?
- **Parâmetros:** 100 participantes virtuais, saldo inicial de 100 créditos, aposta 1, parada em saldo $< 1$ ou 500 rodadas, semente `42` mantida contínua.
- **Resultados empíricos obtidos:**
  - Ganhos ($B_f > 100$): 23 (23,0%).
  - Empates ($B_f = 100$): 2 (2,0%).
  - Perdas ($B_f < 100$): 75 (75,0%). Total = 100%.
  - Taxa de esgotamento total ($B_f < 1$): 67 (67,0%), que é subconjunto estrito das perdas.
  - Saldo final: Média = 52,10 créditos; Mediana = 0,00 crédito; Máximo = 390,00 créditos.
  - Duração média: 339,9 rodadas; Mediana: 340 rodadas.
- **Interpretação:** A discrepância extrema entre a Média ($52{,}10$) e a Mediana ($0{,}00$) ilustra o viés de sobrevivência: uma minoria atinge picos de saldo (até 390 créditos), enquanto 67% dos participantes saem completamente arruinados (saldo zero). Relatos nas redes sociais mostram apenas os vencedores (23%), ocultando a ruína da maioria (67%).
- **Gráfico:** Inserir `resultados/graficos/e3_saldos.png`.

#### Experimento 4: Depois de perder, aumenta a chance de ganhar?
- **Parâmetros:** Reuso dos 10.000 resultados do E1 ($9.999$ pares consecutivos).
- **Resultados empíricos obtidos:**
  - Após rodada premiada ($P_i > 0$): 412 pares $\rightarrow$ 17 prêmios na seguinte $\rightarrow$ Frequência = $4{,}13\%$.
  - Após rodada sem prêmio ($P_i = 0$): 9.587 pares $\rightarrow$ 395 prêmios na seguinte $\rightarrow$ Frequência = $4{,}12\%$.
- **Interpretação:** As duas probabilidades condicionais observadas ($4{,}13\%$ e $4{,}12\%$) convergem para a probabilidade teórica marginal de $4{,}00\%$. Isso demonstra empiricamente a propriedade de independência estocástica entre jogadas e refuta a **Falácia do Jogador** (*Monte Carlo Fallacy*): a máquina não guarda memória nem "deve" prêmio a quem está perdendo.

#### Experimento 5: Prêmios maiores tornam o jogo favorável?
- **Parâmetros:** Mesmos 10.000 resultados do E1 comparando Tabela Base com Tabela com acréscimo de 10% nos pagamentos.
- **Resultados empíricos:**
  - Chance de prêmio: idêntica em ambas ($4{,}12\%$ observado vs $4{,}00\%$ teórico).
  - Prêmio médio: 0,8685 (Base) vs 0,9554 (+10%). Teórico: 0,84 vs 0,924.
  - Lucro médio: -0,1315 (Base) vs -0,0447 (+10%). Teórico: -0,16 vs -0,076.
  - RTP: 86,85% (Base) vs 95,53% (+10%). Teórico: 84,0% vs 92,4%.
- **Interpretação:** Prêmios maiores aumentam o RTP, mas **não mudam a probabilidade de vitória (permanece 4%)** nem tornam o lucro esperado positivo ($E[X] = -0{,}076 < 0$). "Pagar mais", "pagar com mais frequência" e "ter lucro esperado positivo" são três conceitos matemáticos totalmente distintos.
- **Gráfico:** Inserir `resultados/graficos/e5_comparacao_tabelas.png`.

---

### Seção 4: Discussão Crítica e Responsabilidade Profissional (aprox. 2 páginas)

Desenvolver os quatro eixos obrigatórios do enunciado:

1. **Mecanismo e percepção psicológica:**
   - Como ganhos ocasionais (prêmios de 50x) coexistem com perda esperada contínua.
   - Reforço intermitente na psicologia comportamental: o apostador experimenta dopamina com vitórias pontuais, enquanto a perda matemática silenciosa de $-0{,}16$ por rodada drena seu saldo gradualmente.
   - Dispersão amostral e visibilidade seletiva de ganhadores na internet.

2. **Renda familiar e impactos na saúde pública:**
   - Discussão baseada no LENAD III (2025): 15,8% de jogo problemático ou transtorno do jogo entre usuários de cassinos on-line na síntese The Lancet.
   - Efeito sobre despesas essenciais e endividamento em famílias vulneráveis (Baker et al., 2024).
   - Distinção metodológica: a simulação computacional modela uma máquina virtual didática; transtornos reais envolvem dinâmicas comportamentais e sociais complexas.

3. **Políticas públicas, regulação e interesses em disputa:**
   - **Argumento pró-restrição/proibição:** Proteção à vulnerabilidade, contenção de crises de endividamento familiar, prevenção a gastos em saúde mental no SUS.
   - **Argumento crítico à proibição:** Dificuldade fiscalizatória, evasão para o mercado ilegal/clandestino (como apontado pelo TCU em 2026), perda de arrecadação tributária e violação da autonomia individual.

4. **Responsabilidade do Engenheiro de Software / Cientista da Computação:**
   - Padrões de interface obscuros (*dark patterns*): uso de quase-vitórias (*near misses*), sons festivos para perdas mascaradas como vitória (*losses disguised as wins*), velocidade excessiva de rodadas.
   - Dever ético de transparência: exibir avisos claros de volatilidade, chance de vitória desmistificada do RTP, e botões de limitação de tempo e perdas.

---

### Seção 5: Referências Bibliográficas (Padrão ABNT)

Listar no mínimo as fontes institucionais e acadêmicas:
1. BANCO CENTRAL DO BRASIL. *Análise técnica sobre o mercado de apostas online no Brasil e o perfil dos apostadores*. Estudo Especial 119/2024.
2. BRASIL. *Medida Provisória nº 1.394/2026*. Presidência da República, 25 set. 2026.
3. BRASIL. *Lei nº 14.790, de 29 de dezembro de 2023*. Dispõe sobre a modalidade lotérica denominada apostas de quota fixa.
4. ILLOWSKY, B.; DEAN, S. *Introductory Statistics 2e*. OpenStax, 2023.
5. ROSA, D. et al. *A saúde dos brasileiros em jogo: análise político-econômica da regulamentação de apostas online e seus impactos*. IEPS, 2025.
6. TRIBUNAL DE CONTAS DA UNIÃO (TCU). *Acórdão 1296/2026 - Plenário*. Relatório sobre apostas ilegais e monitoramento, 2026.
7. UNIAD; UNIFESP. *Caderno Temático LENAD III: jogos de aposta na população brasileira*. Resultados 2023. São Paulo, 2025.
8. WARDLE, H. et al. The Lancet Public Health Commission on gambling. *The Lancet Public Health*, v. 9, 2024.
9. WORLD HEALTH ORGANIZATION (WHO). *Gambling: public health responses and risk factors*. Genebra: OMS, 2024.

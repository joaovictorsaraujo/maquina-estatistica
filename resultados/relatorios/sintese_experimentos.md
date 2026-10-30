# Síntese dos Resultados dos Cinco Experimentos — Máquina Estatística
**Data da Execução:** 30/10/2026 00:05:58
**Ambiente:** Python 3.12.3 (Linux)
**Aviso Legal:** *Simulador acadêmico — somente créditos fictícios*

---
## 1. Experimento 1: As frequências acompanham as probabilidades?
- **Rodadas:** 10,000 | **Semente:** 2026
- **Soma das contagens:** 10000 (esperado: 10.000)
- **Soma das freq. relativas:** 1.000000 (esperado: 1.000000)
- **Lucro médio observado:** -0.1315 créditos (Teórico: -0.1600)
- **RTP observado:** 86.85% (Teórico: 84.00%)
- **Proporção de vitórias:** 4.12% (Teórico: 4.00%)
- **Desvio-padrão amostral (s com N-1):** 5.2750 créditos
- **Intervalo de Confiança 95% Lucro Médio:** [-0.2349, -0.0281]

| Categoria (X) | Prêmio (P) | Combinação | Prob. Teórica | Contagem Obs. | Freq. Relativa | Diferença Abs. |
|---|---|---|---|---|---|---|
| -1 | 0.0 | Outras (120 triplas) | 96.00% | 9588 | 95.88% | 0.1200% |
| +4 | 5.0 | A-A-A (+4) | 0.80% | 77 | 0.77% | 0.0300% |
| +9 | 10.0 | B-B-B (+9) | 0.80% | 88 | 0.88% | 0.0800% |
| +14 | 15.0 | C-C-C (+14) | 0.80% | 78 | 0.78% | 0.0200% |
| +24 | 25.0 | D-D-D (+24) | 0.80% | 88 | 0.88% | 0.0800% |
| +49 | 50.0 | E-E-E (+49) | 0.80% | 81 | 0.81% | 0.0100% |

---
## 2. Experimento 2: O que muda quando aumentamos a amostra?
- **Médias Acumuladas por Semente e Tamanho de Amostra:**

| Semente | N = 100 | N = 1.000 | N = 10.000 |
|---|---|---|---|
| Seed 10 | -0.7000 | -0.0550 | -0.0960 |
| Seed 2026 | +0.2000 | -0.2200 | -0.1315 |
| Seed 123456 | +0.2000 | -0.0700 | -0.2215 |

- **Verificação de Reprodutibilidade (Seed 2026):** SUCESSO (10 primeiros resultados idênticos)

---
## 3. Experimento 3: O que acontece com um saldo limitado?
- **Participantes Virtuais:** 100 | **Saldo Inicial:** 100 créditos | **Limite:** 500 rodadas | **Seed:** 42
- **Ganhos (B_f > 100):** 23 (23.0%)
- **Empates (B_f = 100):** 2 (2.0%)
- **Perdas (B_f < 100):** 75 (75.0%)
- **Soma das Categorias:** 100.0%
- **Taxa de Esgotamento (saldo < 1):** 67 (67.0%)
- **Saldo Final:** Média = 52.10 | Mediana = 0.00 | Min = 0.00 | Max = 390.00
- **Rodadas Executadas:** Média = 339.9 | Mediana = 340.0

---
## 4. Experimento 4: Depois de perder, aumenta a chance de ganhar?
- **Pares Consecutivos Analisados:** 9,999 (reutilização das 10.000 rodadas do E1)
- **Referência Teórica de Independência:** 4.00% em qualquer condição

| Condição na Rodada Atual | Total de Pares | Prêmios na Rodada Seguinte | Proporção Observada | Referência Teórica |
|---|---|---|---|---|
| Após rodada premiada (P > 0) | 412 | 17 | 4.13% | 4.00% |
| Após rodada sem prêmio (P = 0) | 9,587 | 395 | 4.12% | 4.00% |

---
## 5. Experimento 5: Prêmios maiores tornam o jogo favorável?
- **Comparação Base vs Aumentada (+10%) sobre os mesmos 10.000 resultados:**

| Indicador | Tabela Base (Teoria) | Tabela Base (Observado) | Tabela +10% (Teoria) | Tabela +10% (Observado) |
|---|---|---|---|---|
| Chance de Prêmio | 4.00% | 4.12% | 4.00% | 4.12% |
| Prêmio Médio Bruto | 0.8400 | 0.8685 | 0.9240 | 0.9554 |
| Lucro Líquido Médio | -0.1600 | -0.1315 | -0.0760 | -0.0447 |
| RTP (%) | 84.00% | 86.85% | 92.40% | 95.53% |

---
### Conclusão Matemática Chave:
- Embora o aumento de 10% eleve o RTP de 84,0% para 92,4% e reduza o prejuízo esperado por rodada de -0,16 para -0,076 créditos, a esperança matemática continua estritamente negativa.
- A probabilidade de obter prêmio permanece inalterada em 4,00%, demonstrando que prêmios maiores não aumentam a frequência de vitórias nem eliminam a vantagem estatística da casa.

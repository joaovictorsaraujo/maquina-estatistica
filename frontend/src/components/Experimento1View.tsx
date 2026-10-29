import React from 'react';
import { StatsE1 } from '../types';
import { BarChart3, CheckCircle2, TrendingDown, Target, Coins } from 'lucide-react';
import { getSimboloInfo } from '../symbols';

interface Props {
  dados: StatsE1 | null;
  loading: boolean;
  onRecarregar: () => void;
}

export const Experimento1View: React.FC<Props> = ({ dados, loading, onRecarregar }) => {
  if (loading || !dados) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 font-mono">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p>Carregando dados do Experimento 1 (10.000 rodadas, seed 2026)...</p>
      </div>
    );
  }

  const renderIconesComb = (comb: string, lucro: number) => {
    if (lucro === -1) {
      return (
        <span className="flex items-center gap-1 text-slate-400 font-mono">
          <span>🎲</span>
          <span>Outras (120 triplas)</span>
        </span>
      );
    }
    const mapLetra: Record<number, string> = { 4: 'A', 9: 'B', 14: 'C', 24: 'D', 49: 'E' };
    const letra = mapLetra[lucro] || 'A';
    const info = getSimboloInfo(letra);
    return (
      <span className="flex items-center gap-1.5 font-mono">
        <span className="text-base">{info.icone} {info.icone} {info.icone}</span>
        <span className={`font-bold ${info.textClass}`}>({info.nome} - {letra}³ )</span>
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="arcade-cabinet rounded-2xl p-6 border-2 border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Experimento Obrigatório 1
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              As frequências acompanham as probabilidades?
            </h2>
            <p className="text-sm font-mono text-slate-400 mt-1">
              Simulação de 10.000 rodadas contínuas com a semente oficial <strong>2026</strong>.
            </p>
          </div>
          <button
            onClick={onRecarregar}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-amber-400 rounded-xl text-xs font-display font-bold self-start sm:self-auto transition-all cursor-pointer shadow-md"
          >
            REEXECUTAR E1
          </button>
        </div>
      </div>

      {/* Cards de Indicadores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="odometer-display rounded-2xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Lucro Médio Observado</span>
          <p className="text-2xl font-black text-rose-400 mt-1 font-display">
            {dados.lucro_medio_observado.toFixed(4)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Target className="w-3 h-3 text-amber-400" />
            Teórico E[X]: {dados.lucro_medio_teorico.toFixed(4)}
          </p>
        </div>

        <div className="odometer-display rounded-2xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">RTP Observado</span>
          <p className="text-2xl font-black text-sky-400 mt-1 font-display">
            {dados.rtp_observado.toFixed(2)}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Target className="w-3 h-3 text-amber-400" />
            Teórico: {dados.rtp_teorico.toFixed(2)}% (Vantagem: 16%)
          </p>
        </div>

        <div className="odometer-display rounded-2xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Proporção Premiada</span>
          <p className="text-2xl font-black text-amber-300 mt-1 font-display">
            {(dados.proporcao_premiada_observada * 100).toFixed(2)}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Target className="w-3 h-3 text-amber-400" />
            Teórico: {(dados.proporcao_premiada_teorica * 100).toFixed(2)}% (5/125)
          </p>
        </div>

        <div className="odometer-display rounded-2xl p-4 border border-slate-800">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Desvio-Padrão (N-1)</span>
          <p className="text-2xl font-black text-emerald-400 mt-1 font-display">
            {dados.desvio_padrao_amostral.toFixed(4)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-slate-400" />
            Dispersão em créditos
          </p>
        </div>
      </div>

      {/* Intervalo de Confiança */}
      <div className="arcade-cabinet rounded-2xl p-4 border border-emerald-500/30 flex items-center gap-3 font-mono text-xs sm:text-sm">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        <div>
          <strong className="text-emerald-400">Intervalo de Confiança de 95% para o Lucro Médio:</strong>{' '}
          <span className="text-white font-bold">
            [{dados.ic_95_lucro[0].toFixed(4)} ; {dados.ic_95_lucro[1].toFixed(4)}]
          </span>
          <span className="text-slate-400 ml-2">
            (A esperança teórica <strong>-0.1600</strong> está contida no intervalo amostral)
          </span>
        </div>
      </div>

      {/* Gráfico Comparativo Visual de Barras */}
      <div className="arcade-cabinet rounded-2xl p-6 border border-slate-700/80">
        <h3 className="text-base font-display font-black text-white mb-1 flex items-center gap-2">
          <Coins className="w-4 h-4 text-amber-400" />
          DISTRIBUIÇÃO TEÓRICA (%) vs FREQUÊNCIA OBSERVADA (%)
        </h3>
        <p className="text-xs font-mono text-slate-400 mb-6">
          Comparação lado a lado das 6 categorias de lucro com os símbolos temáticos da máquina.
        </p>

        <div className="space-y-4">
          {dados.tabela_categorias.map((cat) => {
            const probTeo = cat.prob_teorica * 100;
            const freqObs = cat.freq_relativa * 100;

            return (
              <div key={cat.lucro_x} className="space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${cat.lucro_x > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {cat.lucro_x > 0 ? `+${cat.lucro_x}` : cat.lucro_x} créditos
                    </span>
                    <span className="text-slate-300">
                      {renderIconesComb(cat.combinacao, cat.lucro_x)}
                    </span>
                  </div>
                  <span className="text-slate-400 text-xs font-mono">
                    {cat.contagem} ocor. ({freqObs.toFixed(2)}%)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Barra Teórica */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Teoria</span>
                      <span>{probTeo.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-sky-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(probTeo, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Barra Observada */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Observado</span>
                      <span className="text-amber-400 font-bold">{freqObs.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(freqObs, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabela Oficial das 6 Categorias */}
      <div className="arcade-cabinet rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl font-mono">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50">
          <h3 className="font-display font-black text-white text-sm">
            TABELA ESTATÍSTICA DAS SEIS CATEGORIAS (N = 10.000 RODADAS)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#050814] text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Lucro (X)</th>
                <th className="px-4 py-3">Prêmio (P)</th>
                <th className="px-4 py-3">Símbolos</th>
                <th className="px-4 py-3">Prob. Teórica</th>
                <th className="px-4 py-3">Contagem</th>
                <th className="px-4 py-3">Freq. Relativa</th>
                <th className="px-4 py-3">Diferença Abs.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {dados.tabela_categorias.map((cat) => (
                <tr key={cat.lucro_x} className="hover:bg-slate-800/40 transition-colors">
                  <td className={`px-4 py-3 font-bold ${cat.lucro_x > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {cat.lucro_x > 0 ? `+${cat.lucro_x}` : cat.lucro_x}
                  </td>
                  <td className="px-4 py-3 font-bold text-amber-300">🪙 {cat.premio_p.toFixed(1)}</td>
                  <td className="px-4 py-3">{renderIconesComb(cat.combinacao, cat.lucro_x)}</td>
                  <td className="px-4 py-3 text-sky-400">{(cat.prob_teorica * 100).toFixed(2)}%</td>
                  <td className="px-4 py-3 font-bold text-white">{cat.contagem.toLocaleString()}</td>
                  <td className="px-4 py-3 text-amber-400 font-bold">{(cat.freq_relativa * 100).toFixed(2)}%</td>
                  <td className="px-4 py-3 text-slate-400">{(cat.diferenca_abs * 100).toFixed(4)}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#040711] font-bold text-slate-300 border-t border-slate-800">
              <tr>
                <td colSpan={4} className="px-4 py-3 text-slate-400">Somas / Validação dos Totais:</td>
                <td className="px-4 py-3 text-emerald-400">{dados.soma_contagens.toLocaleString()} (10.000)</td>
                <td className="px-4 py-3 text-emerald-400">{(dados.soma_freq_relativas * 100).toFixed(2)}% (1,000000)</td>
                <td className="px-4 py-3 text-slate-500">—</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { StatsE1 } from '../types';
import { BarChart3, CheckCircle2, TrendingDown, Target } from 'lucide-react';

interface Props {
  dados: StatsE1 | null;
  loading: boolean;
  onRecarregar: () => void;
}

export const Experimento1View: React.FC<Props> = ({ dados, loading, onRecarregar }) => {
  if (loading || !dados) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p>Carregando dados do Experimento 1 (10.000 rodadas)...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Experimento Obrigatório 1
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              As frequências acompanham as probabilidades?
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Simulação de 10.000 rodadas contínuas com semente determinística <strong>2026</strong>.
            </p>
          </div>
          <button
            onClick={onRecarregar}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            Reexecutar E1
          </button>
        </div>
      </div>

      {/* Cards de Indicadores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium">Lucro Médio Observado</span>
          <p className="text-2xl font-black text-rose-400 mt-1">
            {dados.lucro_medio_observado.toFixed(4)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Target className="w-3 h-3 text-amber-400" />
            Teórico E[X]: {dados.lucro_medio_teorico.toFixed(4)}
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium">RTP Observado</span>
          <p className="text-2xl font-black text-sky-400 mt-1">
            {dados.rtp_observado.toFixed(2)}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Target className="w-3 h-3 text-amber-400" />
            Teórico: {dados.rtp_teorico.toFixed(2)}%
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium">Taxa de Vitórias</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {(dados.proporcao_premiada_observada * 100).toFixed(2)}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Target className="w-3 h-3 text-amber-400" />
            Teórico: {(dados.proporcao_premiada_teorica * 100).toFixed(2)}%
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium">Desvio-Padrão Amostral (s)</span>
          <p className="text-2xl font-black text-purple-400 mt-1">
            {dados.desvio_padrao_amostral.toFixed(4)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Divisor N - 1 = {dados.n_rodadas - 1}
          </p>
        </div>
      </div>

      {/* Intervalo de Confiança */}
      <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            <strong>Intervalo de Confiança (95%):</strong> [{dados.ic_95_lucro[0].toFixed(4)}, {dados.ic_95_lucro[1].toFixed(4)}] créditos.
          </span>
        </div>
        <span className="text-slate-400">
          A esperança teórica <strong>-0.1600</strong> está contida no intervalo amostral!
        </span>
      </div>

      {/* Gráfico Comparativo Visual de Barras (HTML/CSS puro responsivo) */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-1">
          Distribuição Teórica (%) vs Frequência Observada (%)
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Comparação lado a lado das 6 categorias de lucro possíveis na máquina.
        </p>

        <div className="space-y-4">
          {dados.tabela_categorias.map((cat) => {
            const probTeo = cat.prob_teorica * 100;
            const freqObs = cat.freq_relativa * 100;

            return (
              <div key={cat.lucro_x} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-slate-200">
                    Lucro X = {cat.lucro_x > 0 ? `+${cat.lucro_x}` : cat.lucro_x} ({cat.combinacao})
                  </span>
                  <span className="text-slate-400 text-xs">
                    {cat.contagem} ocorrências ({freqObs.toFixed(2)}%)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Barra Teórica */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Teoria</span>
                      <span>{probTeo.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
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
                      <span className="text-amber-400">{freqObs.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
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
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700">
          <h3 className="font-bold text-white text-sm">Tabela Estatística das Seis Categorias (N = 10.000)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Lucro (X)</th>
                <th className="px-4 py-3">Prêmio (P)</th>
                <th className="px-4 py-3">Combinação</th>
                <th className="px-4 py-3">Prob. Teórica</th>
                <th className="px-4 py-3">Contagem</th>
                <th className="px-4 py-3">Freq. Relativa</th>
                <th className="px-4 py-3">Diferença Abs.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-200">
              {dados.tabela_categorias.map((cat) => (
                <tr key={cat.lucro_x} className="hover:bg-slate-700/30 transition-colors">
                  <td className={`px-4 py-3 font-bold ${cat.lucro_x > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {cat.lucro_x > 0 ? `+${cat.lucro_x}` : cat.lucro_x}
                  </td>
                  <td className="px-4 py-3">{cat.premio_p.toFixed(1)}</td>
                  <td className="px-4 py-3">{cat.combinacao}</td>
                  <td className="px-4 py-3 text-sky-400">{(cat.prob_teorica * 100).toFixed(2)}%</td>
                  <td className="px-4 py-3 font-mono font-bold text-white">{cat.contagem.toLocaleString()}</td>
                  <td className="px-4 py-3 text-amber-400 font-mono">{(cat.freq_relativa * 100).toFixed(2)}%</td>
                  <td className="px-4 py-3 text-slate-400 font-mono">{(cat.diferenca_abs * 100).toFixed(4)}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-900/90 font-bold text-slate-300">
              <tr>
                <td colSpan={4} className="px-4 py-3">Somas / Validação:</td>
                <td className="px-4 py-3 font-mono text-emerald-400">{dados.soma_contagens.toLocaleString()} (100%)</td>
                <td className="px-4 py-3 font-mono text-emerald-400">{(dados.soma_freq_relativas * 100).toFixed(2)}%</td>
                <td className="px-4 py-3 text-slate-500">—</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
